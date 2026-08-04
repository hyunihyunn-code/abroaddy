-- ============================================================================
-- ABRODY (어브로디) — Supabase Postgres Schema  v1
-- 목업(어브로디_기능목업_v9_2.html)의 하드코딩 전역변수를 실제 테이블로 옮긴 버전.
--
-- 대응관계 (목업 변수 → 테이블):
--   P        → projects, project_cities, cash_topups
--   TX       → transactions
--   RECUR    → recurring_rules
--   BUDGETLOG→ budget_log
--   SETTLE   → settlements
--   ME       → user_payout_accounts
--   CUR      → currencies + fx_rates
--   CITIES   → cities
--   BASECATS/LONGCATS → categories (user_id IS NULL = 시스템 카테고리)
--   NORM     → 하드코딩 제거. peer_norms_daily (materialized view, 5인 이상만 노출)
--
-- 설계 원칙
--  1) 목업에는 유저 개념이 아예 없음(전역 딕셔너리 P 하나를 모두가 봄).
--     실제 DB에서는 모든 것이 auth.uid() 기준으로 격리됨 — 이게 가장 큰 구조 변화.
--  2) 금액은 "원본 통화로 저장 + 거래일 환율 스냅샷"으로 저장.
--     (목업은 항상 최신 고정환율로 실시간 환산 — PPT 로직 v2 문서 S8에서
--      이미 "거래일 환율 스냅샷"으로 결정된 사항과 목업 구현이 어긋나 있음)
--  3) 또래비교(NORM)는 하드코딩 표 대신, 실 거래 데이터에서 5인 이상 표본일 때만
--     집계해 노출하는 뷰로 대체. 개인 데이터는 절대 다른 유저에게 노출되지 않음.
-- ============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "pg_cron"; -- fx_rates 자동 갱신, peer_norms 리프레시용

-- ----------------------------------------------------------------------------
-- 0. profiles (auth.users 확장)
-- ----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 1. 참조 데이터 — currencies / fx_rates / cities
--    (CUR, CITIES 배열을 그대로 seed. 아래 seed 예시는 문서 하단 참고)
-- ----------------------------------------------------------------------------
create table public.currencies (
  code text primary key,           -- 'KRW','JPY','DKK' ...
  symbol text not null,
  name_ko text not null,
  decimals smallint not null default 0
);

-- 환율 이력 테이블. "현재 환율"이 아니라 스냅샷 이력이 쌓이는 구조.
create table public.fx_rates (
  currency_code text not null references public.currencies(code),
  krw_per_unit numeric not null,
  fetched_at timestamptz not null default now(),
  primary key (currency_code, fetched_at)
);
create index idx_fx_rates_latest on public.fx_rates (currency_code, fetched_at desc);

-- 최신 환율 조회용 뷰 (목업의 CUR[cur].r 를 대체)
create view public.fx_rates_latest as
select distinct on (currency_code) currency_code, krw_per_unit, fetched_at
from public.fx_rates
order by currency_code, fetched_at desc;

create table public.cities (
  id serial primary key,
  name_ko text not null,
  name_en text,
  country text not null,
  flag_emoji text,
  default_currency text references public.currencies(code),
  aliases text            -- 검색용 별칭 (CITY_ALIAS)
);
create index idx_cities_name_ko on public.cities using gin (to_tsvector('simple', name_ko || ' ' || coalesce(aliases,'')));

-- ----------------------------------------------------------------------------
-- 2. categories — BASECATS + LONGCATS(장기체류 전용) + 유저 커스텀
-- ----------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade, -- NULL = 시스템 기본 카테고리
  name text not null,
  icon text,
  is_pre boolean not null default false,        -- 사전예약(pre-booking) 성격 카테고리
  is_deposit boolean not null default false,     -- 보증금 특수처리 (예산/또래비교 제외)
  is_long_stay_only boolean not null default false, -- LONGCATS: 장기체류 목적에서만 노출
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

-- ----------------------------------------------------------------------------
-- 3. projects (여정→프로젝트로 개칭된 핵심 단위)
-- ----------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  purpose text not null,               -- PURPOSES: 여행/출장/교환학생·단기파견/어학연수/워킹홀리데이/해외인턴/해외봉사/한달살기
  -- ↑ enum 대신 text로: 목업이 하루 만에 v1→v2로 바뀌는 걸 봤을 때 enum ALTER 비용이 더 큼.
  --   유효값 검증은 앱 레이어 + 아래 check 제약으로.
  primary_currency text not null references public.currencies(code),
  start_date date not null,
  end_date date not null,
  budget_pre_krw numeric not null default 0,     -- 사전예약 봉투 (항공/숙박/비자/보험/학비 등)
  budget_local_krw numeric not null default 0,   -- 현지지출 봉투
  is_long_stay boolean not null default false,   -- isLong() 스냅샷: 생성 시 계산해서 저장
  status text not null default 'active' check (status in ('active','ended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);
create index idx_projects_user on public.projects(user_id);

-- 다국가 프로젝트 지원 (유럽 한 바퀴: 파리/로마/취리히)
create table public.project_cities (
  project_id uuid not null references public.projects(id) on delete cascade,
  city_id int not null references public.cities(id),
  currency text not null references public.currencies(code),
  sort_order int not null default 0,
  primary key (project_id, city_id)
);

-- 현금 환전 기록 (proj().cash)
create table public.cash_topups (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  amount numeric not null,
  currency text not null references public.currencies(code),
  topped_up_on date not null,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 4. settlements (더치페이 · 1:N 정산 — SETTLE)
--    transactions보다 먼저 정의 (transactions가 settlement_id를 FK로 가짐)
-- ----------------------------------------------------------------------------
create table public.settlements (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  code text not null unique,                      -- 공유 링크 코드
  split_count smallint not null check (split_count between 2 and 50),
  amount_per_person_krw numeric not null,
  message text,                                    -- 공유 문구 (수정 가능)
  status text not null default 'active' check (status in ('active','revoked')),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

-- ----------------------------------------------------------------------------
-- 5. recurring_rules (반복 고정지출 — RECUR)
-- ----------------------------------------------------------------------------
create table public.recurring_rules (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  merchant text not null,
  amount numeric not null,
  currency text not null references public.currencies(code),
  category_id uuid not null references public.categories(id),
  day_of_month smallint not null check (day_of_month between 1 and 31),
  payment_method text not null default 'card' check (payment_method in ('cash','card','account')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index idx_recurring_project on public.recurring_rules(project_id) where is_active;

-- ----------------------------------------------------------------------------
-- 6. transactions (가계부 내역 — TX)
-- ----------------------------------------------------------------------------
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  occurred_on date not null,
  occurred_at time,
  merchant text,
  amount numeric not null,
  currency text not null references public.currencies(code),

  -- 환율 스냅샷: 거래 시점 환율로 고정. 표시할 땐 항상 이 값을 씀 (fx_rates_latest 실시간 조회 금지).
  fx_rate_snapshot numeric not null,
  krw_amount_snapshot numeric not null,            -- amount * fx_rate_snapshot (트리거로 자동 계산해도 됨)

  category_id uuid references public.categories(id),
  is_pre boolean not null default false,           -- 카테고리 기본값에서 시작하되 건별로 토글 가능(pretog)
  payment_method text not null default 'card' check (payment_method in ('cash','card','account')),
  source text not null default 'manual' check (source in ('manual','receipt','card_capture')),
  keep_receipt boolean not null default false,     -- 영수증 이미지 보관 여부 (receipt만 가능)
  receipt_storage_path text,                       -- Supabase Storage 경로 (keep_receipt=true일 때)
  memo text,

  recurring_rule_id uuid references public.recurring_rules(id),
  status text not null default 'confirmed' check (status in ('pending','confirmed')),
  -- pending: 반복지출 규칙에서 자동 생성된 미확인 건. confirmed 전까지 또래비교 집계 제외.

  settlement_id uuid references public.settlements(id),
  split_count smallint,                             -- 정산에 묶였을 때 n

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_tx_project_date on public.transactions(project_id, occurred_on desc);
create index idx_tx_settlement on public.transactions(settlement_id) where settlement_id is not null;
create index idx_tx_recurring on public.transactions(recurring_rule_id) where recurring_rule_id is not null;

-- ----------------------------------------------------------------------------
-- 7. budget_log (예산 증액/감액 이력 — BUDGETLOG, 최초 설정도 레코드로 남김)
-- ----------------------------------------------------------------------------
create table public.budget_log (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  envelope text not null check (envelope in ('pre','local')),
  delta_krw numeric not null,                       -- 부호 있는 증감액 (최초 설정은 양수)
  memo text,
  logged_on date not null,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 8. user_payout_accounts (정산받을 계좌 — ME)
--    ⚠️ 민감정보. account_number는 반드시 암호화 저장(pgcrypto pgp_sym 또는 Supabase Vault).
--    여기서는 컬럼만 정의하고, 암복호화는 Edge Function에서 서버 키로 처리할 것.
-- ----------------------------------------------------------------------------
create table public.user_payout_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  bank_name text,
  account_number_encrypted bytea,      -- pgp_sym_encrypt() 결과. 평문 저장 금지.
  account_holder text,
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 9. OCR 사용량 · 크레딧 (가격모델: 무료 수동입력 무제한 / 이용권 20회 / 추가크레딧 20회)
-- ----------------------------------------------------------------------------
create table public.user_credits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free','ticket','addon')),
  ocr_credits_remaining int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.ocr_usage_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id),
  status text not null check (status in ('success','unreadable','empty','error')),
  rows_returned smallint default 0,
  gemini_latency_ms int,
  used_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 10. 또래비교 (NORM 하드코딩 제거) — 실 데이터 집계 + 5인 이상 표본만 노출
--     매일 새벽 pg_cron으로 refresh materialized view. (아래 09_fx_and_norm_refresh 참고)
-- ----------------------------------------------------------------------------

-- 1단계: 유저별·프로젝트별 "일평균 현지지출" (사전예약/보증금/미확인pending 제외)
create view public.user_daily_local_spend as
select
  p.id as project_id,
  pc.city_id,
  p.purpose,
  t.category_id,
  c.name as category_name,
  sum(t.krw_amount_snapshot) / greatest(1, (p.end_date - p.start_date + 1)) as krw_per_day
from public.transactions t
join public.projects p on p.id = t.project_id
join public.categories c on c.id = t.category_id
join public.project_cities pc on pc.project_id = p.id
where t.is_pre = false
  and coalesce(c.is_deposit, false) = false
  and t.status = 'confirmed'
group by p.id, pc.city_id, p.purpose, t.category_id, c.name;

-- 2단계: (도시 × 목적 × 카테고리)별 표본수·중앙값. 5인 미만이면 애초에 행 자체가 안 나오게 having 처리.
create materialized view public.peer_norms_daily as
select
  city_id,
  purpose,
  category_id,
  category_name,
  count(distinct project_id) as sample_size,
  percentile_cont(0.5) within group (order by krw_per_day) as krw_per_day_median
from public.user_daily_local_spend
group by city_id, purpose, category_id, category_name
having count(distinct project_id) >= 5;   -- F9: 표본 5명 이상일 때만 활성

create unique index idx_peer_norms_pk on public.peer_norms_daily(city_id, purpose, category_id);

-- ============================================================================
-- 11. Row Level Security — "내 것만 보인다"가 목업과 가장 다른 지점
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_cities enable row level security;
alter table public.cash_topups enable row level security;
alter table public.transactions enable row level security;
alter table public.recurring_rules enable row level security;
alter table public.budget_log enable row level security;
alter table public.settlements enable row level security;
alter table public.user_payout_accounts enable row level security;
alter table public.user_credits enable row level security;
alter table public.ocr_usage_log enable row level security;
alter table public.categories enable row level security;

create policy "own profile" on public.profiles
  for all using (id = auth.uid());

create policy "own projects" on public.projects
  for all using (user_id = auth.uid());

create policy "own project_cities" on public.project_cities
  for all using (project_id in (select id from public.projects where user_id = auth.uid()));

create policy "own cash_topups" on public.cash_topups
  for all using (project_id in (select id from public.projects where user_id = auth.uid()));

create policy "own transactions" on public.transactions
  for all using (project_id in (select id from public.projects where user_id = auth.uid()));

create policy "own recurring_rules" on public.recurring_rules
  for all using (project_id in (select id from public.projects where user_id = auth.uid()));

create policy "own budget_log" on public.budget_log
  for all using (project_id in (select id from public.projects where user_id = auth.uid()));

create policy "own settlements" on public.settlements
  for all using (project_id in (select id from public.projects where user_id = auth.uid()));

create policy "own payout account" on public.user_payout_accounts
  for all using (user_id = auth.uid());

create policy "own credits" on public.user_credits
  for select using (user_id = auth.uid());
  -- insert/update는 클라이언트가 아니라 service_role(Edge Function)에서만 — 크레딧 차감을
  -- 클라이언트가 스스로 조작 못 하게. update/insert 정책을 아예 만들지 않는 것도 방법.

create policy "own ocr_usage_log" on public.ocr_usage_log
  for select using (user_id = auth.uid());

create policy "read system + own categories" on public.categories
  for select using (user_id is null or user_id = auth.uid());
create policy "manage own categories" on public.categories
  for insert with check (user_id = auth.uid());
create policy "update own categories" on public.categories
  for update using (user_id = auth.uid());
create policy "delete own categories" on public.categories
  for delete using (user_id = auth.uid());

-- 참조 테이블(통화/도시/환율/또래비교)은 전 유저 공개 read-only.
alter table public.currencies enable row level security;
alter table public.cities enable row level security;
alter table public.fx_rates enable row level security;
create policy "public read currencies" on public.currencies for select using (true);
create policy "public read cities" on public.cities for select using (true);
create policy "public read fx_rates" on public.fx_rates for select using (true);
-- peer_norms_daily는 materialized view라 RLS 미지원 → 이걸 감싸는 SECURITY DEFINER 함수나
-- 별도 read-only 테이블로 노출하는 걸 권장 (아래 fetch_peer_norms 함수 참고).

create or replace function public.fetch_peer_norms(p_city_id int, p_purpose text)
returns setof public.peer_norms_daily
language sql security definer stable as $$
  select * from public.peer_norms_daily
  where city_id = p_city_id and purpose = p_purpose;
$$;

-- ============================================================================
-- 12. updated_at 자동 갱신 트리거 (공통)
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger trg_projects_updated before update on public.projects
  for each row execute function public.set_updated_at();
create trigger trg_tx_updated before update on public.transactions
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 13. Seed 예시 — 목업 CUR/CITIES/BASECATS/LONGCATS/PURPOSES를 그대로 옮기는 방식
--     (실제로는 JS 배열을 스크립트로 INSERT문 자동 생성 — 아래는 형태 예시)
-- ============================================================================
insert into public.currencies (code, symbol, name_ko, decimals) values
  ('KRW','₩','원',0), ('JPY','¥','엔',0), ('CNY','CN¥','위안',2),
  ('USD','$','달러',2), ('EUR','€','유로',2), ('DKK','kr','덴마크크로네',2)
  -- ... 목업 CUR 오브젝트 70여개 그대로 변환
on conflict (code) do nothing;

insert into public.categories (user_id, name, icon, is_pre, is_deposit, is_long_stay_only, sort_order) values
  (null,'식비','🍜',false,false,false,1),
  (null,'교통비','🚌',false,false,false,2),
  (null,'숙박','🏨',true,false,false,3),
  (null,'항공','✈️',true,false,false,4),
  (null,'티켓/입장권','🎫',true,false,false,5),
  (null,'통신비','📶',false,false,false,6),
  (null,'생활용품','🧺',false,false,false,7),
  (null,'월세','🏠',false,false,true,8),
  (null,'학비·프로그램비','🎓',true,false,true,9),
  (null,'비자·행정','📄',true,false,true,10),
  (null,'보험','🛡',true,false,true,11),
  (null,'교통패스','🎟',false,false,true,12),
  (null,'보증금','📦',false,true,true,13)
on conflict (user_id, name) do nothing;

-- ============================================================================
-- 14. referrals — "정산 링크 = 획득 채널" 가설 검증용
--     로직 v2 문서 S9: "정산은 소구점이 아니라 입구다" — 지금 스키마엔 이 유입 경로를
--     추적할 방법이 없었음(=settlements.code로 링크는 만들어지되, 그 링크로 들어와서
--     가입한 사람과 연결이 안 됨). 이걸 메꾸는 테이블.
-- ============================================================================
create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  settlement_id uuid not null references public.settlements(id) on delete cascade,
  referred_user_id uuid references auth.users(id),  -- 가입 완료 전엔 NULL (링크 클릭만 된 상태)
  clicked_at timestamptz not null default now(),
  signed_up_at timestamptz,                          -- 실제 가입 전환 시점. NULL이면 클릭만 하고 미가입
  first_project_id uuid references public.projects(id) -- 가입 후 첫 프로젝트까지 이어졌는지
);
create index idx_referrals_settlement on public.referrals(settlement_id);

alter table public.referrals enable row level security;
-- 정산을 만든 사람(획득 채널의 주체) 본인만 자기 정산건의 유입 현황을 볼 수 있음
create policy "own settlement referrals" on public.referrals
  for select using (
    settlement_id in (select id from public.settlements where created_by = auth.uid())
  );
-- insert는 클라이언트가 직접 하지 않음 — 정산 링크 클릭 시 서버(Edge Function)가 기록.
-- (클라이언트가 스스로 "나 이 링크로 들어왔어요"를 조작 가능하게 두면 안 되므로 별도 insert 정책 없음)

-- ============================================================================
-- 15. events — 온보딩·퍼널 이탈 추적 (가벼운 이벤트 로그)
--     projects는 "프로젝트가 실제로 생성된" 순간부터만 기록되므로,
--     그 이전 단계(목적 선택하고 이탈, 예산 입력하다 이탈 등)는 여기서 잡음.
-- ============================================================================
create table public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),   -- 로그인 전 이탈도 있을 수 있어 NULL 허용
  anon_session_id text,                      -- user_id가 NULL일 때 기기/세션 식별용
  event_name text not null,                  -- 'purpose_selected','budget_entered','project_created','scan_failed' 등
  project_id uuid references public.projects(id),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index idx_events_user_time on public.events(user_id, created_at desc);
create index idx_events_name_time on public.events(event_name, created_at desc);

alter table public.events enable row level security;
create policy "own events" on public.events
  for select using (user_id = auth.uid());
-- insert는 anon key로도 가능해야 로그인 전 이탈까지 잡히므로, service_role 또는
-- "본인 user_id로만 insert 가능" 정책을 별도로 열어줄 것. 집계/분석은 대시보드에서
-- service_role로 조회(RLS 우회)하는 게 일반적.
