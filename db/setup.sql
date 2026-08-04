-- ============================================================================
-- 어브로디 스키마 초기화 — 부분 생성 상태를 정리하고 처음부터 다시 만들 때 사용.
-- (어브로디가 만드는 객체만 삭제. Supabase의 auth/storage 등은 건드리지 않음)
-- ============================================================================
drop materialized view if exists public.peer_norms_daily cascade;
drop view if exists public.user_daily_local_spend cascade;
drop view if exists public.fx_rates_latest cascade;
drop function if exists public.fetch_peer_norms(int, text) cascade;
drop function if exists public.set_updated_at() cascade;
drop table if exists public.referrals cascade;
drop table if exists public.events cascade;
drop table if exists public.ocr_usage_log cascade;
drop table if exists public.user_credits cascade;
drop table if exists public.transactions cascade;
drop table if exists public.recurring_rules cascade;
drop table if exists public.settlements cascade;
drop table if exists public.budget_log cascade;
drop table if exists public.cash_topups cascade;
drop table if exists public.project_cities cascade;
drop table if exists public.projects cascade;
drop table if exists public.categories cascade;
drop table if exists public.cities cascade;
drop table if exists public.fx_rates cascade;
drop table if exists public.currencies cascade;
drop table if exists public.user_payout_accounts cascade;
drop table if exists public.profiles cascade;

-- ===== 스키마 =====

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
-- pg_cron: fx_rates 자동 갱신·peer_norms 리프레시용(스케줄러). 테스트에는 불필요하고
-- SQL 에디터에서 권한 에러가 날 수 있어 주석 처리. 나중에 대시보드 Database→Extensions에서 켜면 됨.
-- create extension if not exists "pg_cron";

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

-- ===== 참조데이터 시드 =====

-- 어브로디 참조데이터 seed (앱 CUR/CITIES에서 자동 생성) — 01_schema.sql 실행 후 실행
-- currencies
insert into public.currencies (code, symbol, name_ko, decimals) values
  ('KRW','₩','원',0),
  ('JPY','¥','엔',0),
  ('CNY','CN¥','위안',2),
  ('USD','$','달러',2),
  ('EUR','€','유로',2),
  ('GBP','£','파운드',2),
  ('CHF','Fr','스위스프랑',2),
  ('AUD','A$','호주달러',2),
  ('NZD','NZ$','뉴질랜드달러',2),
  ('CAD','C$','캐나다달러',2),
  ('SGD','S$','싱가포르달러',2),
  ('HKD','HK$','홍콩달러',2),
  ('TWD','NT$','대만달러',0),
  ('MOP','MOP$','마카오파타카',2),
  ('THB','฿','바트',2),
  ('VND','₫','동',0),
  ('PHP','₱','페소',2),
  ('IDR','Rp','루피아',0),
  ('MYR','RM','링깃',2),
  ('INR','₹','루피',2),
  ('NPR','Rs','네팔루피',2),
  ('LKR','Rs','스리랑카루피',2),
  ('PKR','₨','파키스탄루피',2),
  ('BDT','৳','타카',2),
  ('MMK','K','짯',0),
  ('KHR','៛','리엘',0),
  ('LAK','₭','킵',0),
  ('BND','B$','브루나이달러',2),
  ('MNT','₮','투그릭',0),
  ('DKK','kr','덴마크크로네',2),
  ('SEK','kr','스웨덴크로나',2),
  ('NOK','kr','노르웨이크로네',2),
  ('ISK','kr','아이슬란드크로나',0),
  ('CZK','Kč','코루나',2),
  ('PLN','zł','즈워티',2),
  ('HUF','Ft','포린트',0),
  ('RON','lei','레우',2),
  ('BGN','лв','레프',2),
  ('HRK','kn','쿠나',2),
  ('RSD','дин','디나르',0),
  ('TRY','₺','리라',2),
  ('RUB','₽','루블',2),
  ('UAH','₴','흐리우냐',2),
  ('ILS','₪','셰켈',2),
  ('AED','د.إ','디르함',2),
  ('SAR','﷼','리얄',2),
  ('QAR','﷼','카타르리얄',2),
  ('KWD','د.ك','쿠웨이트디나르',3),
  ('BHD','.د.ب','바레인디나르',3),
  ('OMR','﷼','오만리알',3),
  ('JOD','د.ا','요르단디나르',3),
  ('EGP','E£','이집트파운드',2),
  ('MAD','د.م.','디르함',2),
  ('TND','د.ت','튀니지디나르',3),
  ('ZAR','R','랜드',2),
  ('KES','KSh','실링',2),
  ('TZS','TSh','탄자니아실링',0),
  ('ETB','Br','비르',2),
  ('NGN','₦','나이라',0),
  ('GHS','₵','세디',2),
  ('MXN','Mex$','페소',2),
  ('BRL','R$','헤알',2),
  ('ARS','AR$','아르헨티나페소',2),
  ('CLP','CLP$','칠레페소',0),
  ('COP','COL$','콜롬비아페소',0),
  ('PEN','S/','솔',2),
  ('UYU','$U','우루과이페소',2),
  ('BOB','Bs','볼리비아노',2),
  ('CRC','₡','콜론',0),
  ('GTQ','Q','케찰',2),
  ('DOP','RD$','도미니카페소',2),
  ('CUP','₱','쿠바페소',2),
  ('JMD','J$','자메이카달러',2),
  ('FJD','FJ$','피지달러',2),
  ('KZT','₸','텡게',2),
  ('UZS','soʻm','숨',0),
  ('GEL','₾','라리',2),
  ('AZN','₼','마나트',2),
  ('AMD','֏','드람',0),
  ('MVR','Rf','루피아',2),
  ('MUR','Rs','모리셔스루피',2)
on conflict (code) do nothing;

-- cities (도시 테이블이 비어있을 때만 seed → 재실행 안전)
insert into public.cities (name_ko, name_en, country, flag_emoji, default_currency, aliases)
select v.* from (values
  ('도쿄','Tokyo','일본','🇯🇵','JPY','동경 Tokyo 東京'),
  ('오사카','Osaka','일본','🇯🇵','JPY','간사이 大阪'),
  ('교토','Kyoto','일본','🇯🇵','JPY','京都'),
  ('후쿠오카','Fukuoka','일본','🇯🇵','JPY','규슈'),
  ('삿포로','Sapporo','일본','🇯🇵','JPY','홋카이도'),
  ('오키나와','Okinawa','일본','🇯🇵','JPY','나하 Naha'),
  ('나고야','Nagoya','일본','🇯🇵','JPY',''),
  ('고베','Kobe','일본','🇯🇵','JPY',''),
  ('히로시마','Hiroshima','일본','🇯🇵','JPY',''),
  ('나라','Nara','일본','🇯🇵','JPY',''),
  ('요코하마','Yokohama','일본','🇯🇵','JPY',''),
  ('벳푸','Beppu','일본','🇯🇵','JPY',''),
  ('구마모토','Kumamoto','일본','🇯🇵','JPY',''),
  ('가고시마','Kagoshima','일본','🇯🇵','JPY',''),
  ('센다이','Sendai','일본','🇯🇵','JPY',''),
  ('가나자와','Kanazawa','일본','🇯🇵','JPY',''),
  ('나가사키','Nagasaki','일본','🇯🇵','JPY',''),
  ('다카마쓰','Takamatsu','일본','🇯🇵','JPY',''),
  ('상하이','Shanghai','중국','🇨🇳','CNY',''),
  ('베이징','Beijing','중국','🇨🇳','CNY',''),
  ('시안','Xian','중국','🇨🇳','CNY',''),
  ('청두','Chengdu','중국','🇨🇳','CNY',''),
  ('광저우','Guangzhou','중국','🇨🇳','CNY',''),
  ('선전','Shenzhen','중국','🇨🇳','CNY',''),
  ('항저우','Hangzhou','중국','🇨🇳','CNY',''),
  ('칭다오','Qingdao','중국','🇨🇳','CNY',''),
  ('하얼빈','Harbin','중국','🇨🇳','CNY',''),
  ('충칭','Chongqing','중국','🇨🇳','CNY',''),
  ('쿤밍','Kunming','중국','🇨🇳','CNY',''),
  ('구이린','Guilin','중국','🇨🇳','CNY',''),
  ('난징','Nanjing','중국','🇨🇳','CNY',''),
  ('톈진','Tianjin','중국','🇨🇳','CNY',''),
  ('다롄','Dalian','중국','🇨🇳','CNY',''),
  ('장자제','Zhangjiajie','중국','🇨🇳','CNY',''),
  ('리장','Lijiang','중국','🇨🇳','CNY',''),
  ('샤먼','Xiamen','중국','🇨🇳','CNY',''),
  ('싼야','Sanya','중국','🇨🇳','CNY',''),
  ('타이베이','Taipei','대만','🇹🇼','TWD','대북 타이페이'),
  ('가오슝','Kaohsiung','대만','🇹🇼','TWD',''),
  ('타이중','Taichung','대만','🇹🇼','TWD',''),
  ('타이난','Tainan','대만','🇹🇼','TWD',''),
  ('화롄','Hualien','대만','🇹🇼','TWD',''),
  ('홍콩','Hong Kong','홍콩','🇭🇰','HKD','HK'),
  ('마카오','Macau','마카오','🇲🇴','MOP',''),
  ('싱가포르','Singapore','싱가포르','🇸🇬','SGD','싱가폴'),
  ('방콕','Bangkok','태국','🇹🇭','THB','BKK'),
  ('치앙마이','Chiang Mai','태국','🇹🇭','THB',''),
  ('푸껫','Phuket','태국','🇹🇭','THB',''),
  ('파타야','Pattaya','태국','🇹🇭','THB',''),
  ('끄라비','Krabi','태국','🇹🇭','THB',''),
  ('코사무이','Koh Samui','태국','🇹🇭','THB',''),
  ('다낭','Da Nang','베트남','🇻🇳','VND',''),
  ('하노이','Hanoi','베트남','🇻🇳','VND',''),
  ('호치민','Ho Chi Minh','베트남','🇻🇳','VND','사이공 Saigon'),
  ('나트랑','Nha Trang','베트남','🇻🇳','VND',''),
  ('푸꾸옥','Phu Quoc','베트남','🇻🇳','VND',''),
  ('하롱','Ha Long','베트남','🇻🇳','VND',''),
  ('달랏','Da Lat','베트남','🇻🇳','VND',''),
  ('호이안','Hoi An','베트남','🇻🇳','VND',''),
  ('세부','Cebu','필리핀','🇵🇭','PHP','막탄 Mactan'),
  ('마닐라','Manila','필리핀','🇵🇭','PHP',''),
  ('보라카이','Boracay','필리핀','🇵🇭','PHP',''),
  ('팔라완','Palawan','필리핀','🇵🇭','PHP',''),
  ('클락','Clark','필리핀','🇵🇭','PHP',''),
  ('발리','Bali','인도네시아','🇮🇩','IDR','덴파사르 Denpasar'),
  ('자카르타','Jakarta','인도네시아','🇮🇩','IDR',''),
  ('롬복','Lombok','인도네시아','🇮🇩','IDR',''),
  ('족자카르타','Yogyakarta','인도네시아','🇮🇩','IDR',''),
  ('쿠알라룸푸르','Kuala Lumpur','말레이시아','🇲🇾','MYR','KL'),
  ('코타키나발루','Kota Kinabalu','말레이시아','🇲🇾','MYR',''),
  ('페낭','Penang','말레이시아','🇲🇾','MYR',''),
  ('랑카위','Langkawi','말레이시아','🇲🇾','MYR',''),
  ('말라카','Malacca','말레이시아','🇲🇾','MYR',''),
  ('프놈펜','Phnom Penh','캄보디아','🇰🇭','KHR',''),
  ('씨엠립','Siem Reap','캄보디아','🇰🇭','KHR',''),
  ('비엔티안','Vientiane','라오스','🇱🇦','LAK','라오스'),
  ('루앙프라방','Luang Prabang','라오스','🇱🇦','LAK',''),
  ('양곤','Yangon','미얀마','🇲🇲','MMK',''),
  ('바간','Bagan','미얀마','🇲🇲','MMK',''),
  ('반다르스리브가완','Bandar Seri Begawan','브루나이','🇧🇳','BND',''),
  ('델리','Delhi','인도','🇮🇳','INR','뉴델리 New Delhi'),
  ('뭄바이','Mumbai','인도','🇮🇳','INR','봄베이 Bombay'),
  ('벵갈루루','Bengaluru','인도','🇮🇳','INR',''),
  ('첸나이','Chennai','인도','🇮🇳','INR',''),
  ('콜카타','Kolkata','인도','🇮🇳','INR',''),
  ('자이푸르','Jaipur','인도','🇮🇳','INR',''),
  ('고아','Goa','인도','🇮🇳','INR',''),
  ('바라나시','Varanasi','인도','🇮🇳','INR',''),
  ('카트만두','Kathmandu','네팔','🇳🇵','NPR',''),
  ('포카라','Pokhara','네팔','🇳🇵','NPR',''),
  ('콜롬보','Colombo','스리랑카','🇱🇰','LKR',''),
  ('캔디','Kandy','스리랑카','🇱🇰','LKR',''),
  ('다카','Dhaka','방글라데시','🇧🇩','BDT',''),
  ('이슬라마바드','Islamabad','파키스탄','🇵🇰','PKR',''),
  ('라호르','Lahore','파키스탄','🇵🇰','PKR',''),
  ('말레','Male','몰디브','🇲🇻','MVR',''),
  ('알마티','Almaty','카자흐스탄','🇰🇿','KZT',''),
  ('아스타나','Astana','카자흐스탄','🇰🇿','KZT',''),
  ('타슈켄트','Tashkent','우즈베키스탄','🇺🇿','UZS',''),
  ('사마르칸트','Samarkand','우즈베키스탄','🇺🇿','UZS',''),
  ('울란바토르','Ulaanbaatar','몽골','🇲🇳','MNT',''),
  ('트빌리시','Tbilisi','조지아','🇬🇪','GEL',''),
  ('바쿠','Baku','아제르바이잔','🇦🇿','AZN',''),
  ('예레반','Yerevan','아르메니아','🇦🇲','AMD',''),
  ('두바이','Dubai','아랍에미리트','🇦🇪','AED','UAE 에미리트'),
  ('아부다비','Abu Dhabi','아랍에미리트','🇦🇪','AED',''),
  ('도하','Doha','카타르','🇶🇦','QAR',''),
  ('리야드','Riyadh','사우디아라비아','🇸🇦','SAR',''),
  ('제다','Jeddah','사우디아라비아','🇸🇦','SAR',''),
  ('무스카트','Muscat','오만','🇴🇲','OMR',''),
  ('마나마','Manama','바레인','🇧🇭','BHD',''),
  ('쿠웨이트시티','Kuwait City','쿠웨이트','🇰🇼','KWD',''),
  ('암만','Amman','요르단','🇯🇴','JOD',''),
  ('텔아비브','Tel Aviv','이스라엘','🇮🇱','ILS',''),
  ('예루살렘','Jerusalem','이스라엘','🇮🇱','ILS',''),
  ('이스탄불','Istanbul','튀르키예','🇹🇷','TRY','터키 튀르키예'),
  ('카파도키아','Cappadocia','튀르키예','🇹🇷','TRY','열기구'),
  ('안탈리아','Antalya','튀르키예','🇹🇷','TRY',''),
  ('이즈미르','Izmir','튀르키예','🇹🇷','TRY',''),
  ('런던','London','영국','🇬🇧','GBP',''),
  ('맨체스터','Manchester','영국','🇬🇧','GBP',''),
  ('에든버러','Edinburgh','영국','🇬🇧','GBP',''),
  ('리버풀','Liverpool','영국','🇬🇧','GBP',''),
  ('옥스퍼드','Oxford','영국','🇬🇧','GBP',''),
  ('케임브리지','Cambridge','영국','🇬🇧','GBP',''),
  ('브라이턴','Brighton','영국','🇬🇧','GBP',''),
  ('글래스고','Glasgow','영국','🇬🇧','GBP',''),
  ('바스','Bath','영국','🇬🇧','GBP',''),
  ('더블린','Dublin','아일랜드','🇮🇪','EUR',''),
  ('골웨이','Galway','아일랜드','🇮🇪','EUR',''),
  ('파리','Paris','프랑스','🇫🇷','EUR',''),
  ('니스','Nice','프랑스','🇫🇷','EUR',''),
  ('리옹','Lyon','프랑스','🇫🇷','EUR',''),
  ('마르세유','Marseille','프랑스','🇫🇷','EUR',''),
  ('보르도','Bordeaux','프랑스','🇫🇷','EUR',''),
  ('스트라스부르','Strasbourg','프랑스','🇫🇷','EUR',''),
  ('툴루즈','Toulouse','프랑스','🇫🇷','EUR',''),
  ('몽생미셸','Mont Saint-Michel','프랑스','🇫🇷','EUR',''),
  ('칸','Cannes','프랑스','🇫🇷','EUR',''),
  ('바르셀로나','Barcelona','스페인','🇪🇸','EUR','바르샤 Barca'),
  ('마드리드','Madrid','스페인','🇪🇸','EUR','스페인'),
  ('세비야','Seville','스페인','🇪🇸','EUR',''),
  ('그라나다','Granada','스페인','🇪🇸','EUR',''),
  ('발렌시아','Valencia','스페인','🇪🇸','EUR',''),
  ('말라가','Malaga','스페인','🇪🇸','EUR',''),
  ('빌바오','Bilbao','스페인','🇪🇸','EUR',''),
  ('산세바스티안','San Sebastian','스페인','🇪🇸','EUR',''),
  ('이비자','Ibiza','스페인','🇪🇸','EUR',''),
  ('마요르카','Mallorca','스페인','🇪🇸','EUR',''),
  ('톨레도','Toledo','스페인','🇪🇸','EUR',''),
  ('리스본','Lisbon','포르투갈','🇵🇹','EUR','리스보아 Lisboa'),
  ('포르투','Porto','포르투갈','🇵🇹','EUR',''),
  ('신트라','Sintra','포르투갈','🇵🇹','EUR',''),
  ('로마','Rome','이탈리아','🇮🇹','EUR',''),
  ('밀라노','Milan','이탈리아','🇮🇹','EUR',''),
  ('베네치아','Venice','이탈리아','🇮🇹','EUR','베니스 Venice'),
  ('피렌체','Florence','이탈리아','🇮🇹','EUR','플로렌스 Florence'),
  ('나폴리','Naples','이탈리아','🇮🇹','EUR','네이플스'),
  ('볼로냐','Bologna','이탈리아','🇮🇹','EUR',''),
  ('토리노','Turin','이탈리아','🇮🇹','EUR',''),
  ('팔레르모','Palermo','이탈리아','🇮🇹','EUR',''),
  ('아말피','Amalfi','이탈리아','🇮🇹','EUR',''),
  ('피사','Pisa','이탈리아','🇮🇹','EUR',''),
  ('베로나','Verona','이탈리아','🇮🇹','EUR',''),
  ('베를린','Berlin','독일','🇩🇪','EUR',''),
  ('뮌헨','Munich','독일','🇩🇪','EUR','바이에른 München'),
  ('프랑크푸르트','Frankfurt','독일','🇩🇪','EUR','프랑크'),
  ('함부르크','Hamburg','독일','🇩🇪','EUR',''),
  ('쾰른','Cologne','독일','🇩🇪','EUR','Koln'),
  ('드레스덴','Dresden','독일','🇩🇪','EUR',''),
  ('하이델베르크','Heidelberg','독일','🇩🇪','EUR',''),
  ('뒤셀도르프','Dusseldorf','독일','🇩🇪','EUR',''),
  ('슈투트가르트','Stuttgart','독일','🇩🇪','EUR',''),
  ('빈','Vienna','오스트리아','🇦🇹','EUR',''),
  ('잘츠부르크','Salzburg','오스트리아','🇦🇹','EUR',''),
  ('인스브루크','Innsbruck','오스트리아','🇦🇹','EUR',''),
  ('할슈타트','Hallstatt','오스트리아','🇦🇹','EUR',''),
  ('취리히','Zurich','스위스','🇨🇭','CHF','쮜리히'),
  ('인터라켄','Interlaken','스위스','🇨🇭','CHF',''),
  ('루체른','Lucerne','스위스','🇨🇭','CHF',''),
  ('제네바','Geneva','스위스','🇨🇭','CHF',''),
  ('베른','Bern','스위스','🇨🇭','CHF',''),
  ('체르마트','Zermatt','스위스','🇨🇭','CHF',''),
  ('암스테르담','Amsterdam','네덜란드','🇳🇱','EUR',''),
  ('로테르담','Rotterdam','네덜란드','🇳🇱','EUR',''),
  ('헤이그','The Hague','네덜란드','🇳🇱','EUR',''),
  ('위트레흐트','Utrecht','네덜란드','🇳🇱','EUR',''),
  ('브뤼셀','Brussels','벨기에','🇧🇪','EUR',''),
  ('브뤼헤','Bruges','벨기에','🇧🇪','EUR',''),
  ('앤트워프','Antwerp','벨기에','🇧🇪','EUR',''),
  ('겐트','Ghent','벨기에','🇧🇪','EUR',''),
  ('룩셈부르크','Luxembourg','룩셈부르크','🇱🇺','EUR',''),
  ('프라하','Prague','체코','🇨🇿','CZK','체코'),
  ('체스키크룸로프','Cesky Krumlov','체코','🇨🇿','CZK',''),
  ('브르노','Brno','체코','🇨🇿','CZK',''),
  ('바르샤바','Warsaw','폴란드','🇵🇱','PLN',''),
  ('크라쿠프','Krakow','폴란드','🇵🇱','PLN',''),
  ('브로츠와프','Wroclaw','폴란드','🇵🇱','PLN',''),
  ('그단스크','Gdansk','폴란드','🇵🇱','PLN',''),
  ('부다페스트','Budapest','헝가리','🇭🇺','HUF','헝가리'),
  ('자그레브','Zagreb','크로아티아','🇭🇷','EUR',''),
  ('두브로브니크','Dubrovnik','크로아티아','🇭🇷','EUR',''),
  ('스플리트','Split','크로아티아','🇭🇷','EUR',''),
  ('류블랴나','Ljubljana','슬로베니아','🇸🇮','EUR',''),
  ('브라티슬라바','Bratislava','슬로바키아','🇸🇰','EUR',''),
  ('부쿠레슈티','Bucharest','루마니아','🇷🇴','RON',''),
  ('소피아','Sofia','불가리아','🇧🇬','BGN',''),
  ('베오그라드','Belgrade','세르비아','🇷🇸','RSD',''),
  ('사라예보','Sarajevo','보스니아','🇧🇦','EUR',''),
  ('아테네','Athens','그리스','🇬🇷','EUR',''),
  ('산토리니','Santorini','그리스','🇬🇷','EUR','그리스 섬'),
  ('미코노스','Mykonos','그리스','🇬🇷','EUR',''),
  ('크레타','Crete','그리스','🇬🇷','EUR',''),
  ('발레타','Valletta','몰타','🇲🇹','EUR',''),
  ('니코시아','Nicosia','키프로스','🇨🇾','EUR',''),
  ('코펜하겐','Copenhagen','덴마크','🇩🇰','DKK','코펜하겐 덴마크'),
  ('오르후스','Aarhus','덴마크','🇩🇰','DKK',''),
  ('오덴세','Odense','덴마크','🇩🇰','DKK',''),
  ('스톡홀름','Stockholm','스웨덴','🇸🇪','SEK',''),
  ('예테보리','Gothenburg','스웨덴','🇸🇪','SEK',''),
  ('말뫼','Malmo','스웨덴','🇸🇪','SEK',''),
  ('웁살라','Uppsala','스웨덴','🇸🇪','SEK',''),
  ('오슬로','Oslo','노르웨이','🇳🇴','NOK',''),
  ('베르겐','Bergen','노르웨이','🇳🇴','NOK',''),
  ('트롬쇠','Tromso','노르웨이','🇳🇴','NOK','오로라'),
  ('헬싱키','Helsinki','핀란드','🇫🇮','EUR',''),
  ('로바니에미','Rovaniemi','핀란드','🇫🇮','EUR','산타마을 오로라'),
  ('투르쿠','Turku','핀란드','🇫🇮','EUR',''),
  ('레이캬비크','Reykjavik','아이슬란드','🇮🇸','ISK','아이슬란드 오로라'),
  ('탈린','Tallinn','에스토니아','🇪🇪','EUR',''),
  ('리가','Riga','라트비아','🇱🇻','EUR',''),
  ('빌뉴스','Vilnius','리투아니아','🇱🇹','EUR',''),
  ('모스크바','Moscow','러시아','🇷🇺','RUB',''),
  ('상트페테르부르크','Saint Petersburg','러시아','🇷🇺','RUB',''),
  ('블라디보스토크','Vladivostok','러시아','🇷🇺','RUB',''),
  ('이르쿠츠크','Irkutsk','러시아','🇷🇺','RUB',''),
  ('키이우','Kyiv','우크라이나','🇺🇦','UAH',''),
  ('뉴욕','New York','미국','🇺🇸','USD','NY NYC 맨해튼'),
  ('로스앤젤레스','Los Angeles','미국','🇺🇸','USD','LA 엘에이 캘리포니아 California'),
  ('샌프란시스코','San Francisco','미국','🇺🇸','USD','SF 캘리포니아 California 실리콘밸리'),
  ('샌디에이고','San Diego','미국','🇺🇸','USD','캘리포니아 California'),
  ('시애틀','Seattle','미국','🇺🇸','USD','워싱턴주'),
  ('시카고','Chicago','미국','🇺🇸','USD',''),
  ('보스턴','Boston','미국','🇺🇸','USD','매사추세츠'),
  ('워싱턴','Washington DC','미국','🇺🇸','USD','DC 수도'),
  ('라스베이거스','Las Vegas','미국','🇺🇸','USD','베가스 Vegas 네바다'),
  ('마이애미','Miami','미국','🇺🇸','USD','플로리다 Florida'),
  ('올랜도','Orlando','미국','🇺🇸','USD','플로리다 Florida 디즈니'),
  ('호놀룰루','Honolulu','미국','🇺🇸','USD','하와이 Hawaii 와이키키'),
  ('애틀랜타','Atlanta','미국','🇺🇸','USD',''),
  ('댈러스','Dallas','미국','🇺🇸','USD',''),
  ('휴스턴','Houston','미국','🇺🇸','USD',''),
  ('덴버','Denver','미국','🇺🇸','USD',''),
  ('오스틴','Austin','미국','🇺🇸','USD',''),
  ('필라델피아','Philadelphia','미국','🇺🇸','USD',''),
  ('포틀랜드','Portland','미국','🇺🇸','USD',''),
  ('뉴올리언스','New Orleans','미국','🇺🇸','USD',''),
  ('피닉스','Phoenix','미국','🇺🇸','USD',''),
  ('솔트레이크시티','Salt Lake City','미국','🇺🇸','USD',''),
  ('앵커리지','Anchorage','미국','🇺🇸','USD',''),
  ('새너제이','San Jose','미국','🇺🇸','USD','실리콘밸리 캘리포니아 California Silicon Valley'),
  ('어바인','Irvine','미국','🇺🇸','USD','캘리포니아 California'),
  ('괌','Guam','괌','🇬🇺','USD','Guam'),
  ('사이판','Saipan','사이판','🇲🇵','USD','북마리아나'),
  ('밴쿠버','Vancouver','캐나다','🇨🇦','CAD',''),
  ('토론토','Toronto','캐나다','🇨🇦','CAD',''),
  ('몬트리올','Montreal','캐나다','🇨🇦','CAD','퀘벡'),
  ('캘거리','Calgary','캐나다','🇨🇦','CAD',''),
  ('오타와','Ottawa','캐나다','🇨🇦','CAD',''),
  ('퀘벡시티','Quebec City','캐나다','🇨🇦','CAD',''),
  ('빅토리아','Victoria','캐나다','🇨🇦','CAD',''),
  ('밴프','Banff','캐나다','🇨🇦','CAD','로키 Rocky'),
  ('멕시코시티','Mexico City','멕시코','🇲🇽','MXN',''),
  ('칸쿤','Cancun','멕시코','🇲🇽','MXN',''),
  ('과달라하라','Guadalajara','멕시코','🇲🇽','MXN',''),
  ('툴룸','Tulum','멕시코','🇲🇽','MXN',''),
  ('아바나','Havana','쿠바','🇨🇺','CUP',''),
  ('산호세','San Jose','코스타리카','🇨🇷','CRC',''),
  ('안티구아','Antigua','과테말라','🇬🇹','GTQ',''),
  ('산토도밍고','Santo Domingo','도미니카공화국','🇩🇴','DOP',''),
  ('킹스턴','Kingston','자메이카','🇯🇲','JMD',''),
  ('상파울루','Sao Paulo','브라질','🇧🇷','BRL',''),
  ('리우데자네이루','Rio de Janeiro','브라질','🇧🇷','BRL',''),
  ('부에노스아이레스','Buenos Aires','아르헨티나','🇦🇷','ARS',''),
  ('산티아고','Santiago','칠레','🇨🇱','CLP',''),
  ('리마','Lima','페루','🇵🇪','PEN',''),
  ('쿠스코','Cusco','페루','🇵🇪','PEN','마추픽추 Machu Picchu'),
  ('보고타','Bogota','콜롬비아','🇨🇴','COP',''),
  ('메데인','Medellin','콜롬비아','🇨🇴','COP',''),
  ('몬테비데오','Montevideo','우루과이','🇺🇾','UYU',''),
  ('라파스','La Paz','볼리비아','🇧🇴','BOB',''),
  ('우유니','Uyuni','볼리비아','🇧🇴','BOB','소금사막'),
  ('시드니','Sydney','호주','🇦🇺','AUD','Sydney NSW'),
  ('멜버른','Melbourne','호주','🇦🇺','AUD','멜버른 빅토리아'),
  ('브리즈번','Brisbane','호주','🇦🇺','AUD',''),
  ('퍼스','Perth','호주','🇦🇺','AUD',''),
  ('골드코스트','Gold Coast','호주','🇦🇺','AUD',''),
  ('케언스','Cairns','호주','🇦🇺','AUD',''),
  ('애들레이드','Adelaide','호주','🇦🇺','AUD',''),
  ('캔버라','Canberra','호주','🇦🇺','AUD',''),
  ('호바트','Hobart','호주','🇦🇺','AUD',''),
  ('다윈','Darwin','호주','🇦🇺','AUD',''),
  ('오클랜드','Auckland','뉴질랜드','🇳🇿','NZD','북섬'),
  ('퀸스타운','Queenstown','뉴질랜드','🇳🇿','NZD','남섬'),
  ('크라이스트처치','Christchurch','뉴질랜드','🇳🇿','NZD',''),
  ('웰링턴','Wellington','뉴질랜드','🇳🇿','NZD',''),
  ('난디','Nadi','피지','🇫🇯','FJD',''),
  ('카이로','Cairo','이집트','🇪🇬','EGP',''),
  ('룩소르','Luxor','이집트','🇪🇬','EGP',''),
  ('마라케시','Marrakesh','모로코','🇲🇦','MAD',''),
  ('카사블랑카','Casablanca','모로코','🇲🇦','MAD',''),
  ('페스','Fes','모로코','🇲🇦','MAD',''),
  ('튀니스','Tunis','튀니지','🇹🇳','TND',''),
  ('케이프타운','Cape Town','남아프리카공화국','🇿🇦','ZAR',''),
  ('요하네스버그','Johannesburg','남아프리카공화국','🇿🇦','ZAR',''),
  ('나이로비','Nairobi','케냐','🇰🇪','KES',''),
  ('잔지바르','Zanzibar','탄자니아','🇹🇿','TZS','탄자니아 섬'),
  ('아디스아바바','Addis Ababa','에티오피아','🇪🇹','ETB',''),
  ('라고스','Lagos','나이지리아','🇳🇬','NGN',''),
  ('아크라','Accra','가나','🇬🇭','GHS',''),
  ('포트루이스','Port Louis','모리셔스','🇲🇺','MUR','')
) as v(name_ko,name_en,country,flag_emoji,default_currency,aliases)
where not exists (select 1 from public.cities);
