-- D-1: 개인정보 수집·이용 동의 이력 저장 테이블 (추가만, 기존 데이터 안전)
-- Supabase → SQL Editor(프로젝트 yeqyjfmefihbzczbotul) → 붙여넣고 Run. 여러 번 실행해도 안전.

create table if not exists public.user_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  policy_version text not null default 'v1-draft',
  required_agreed boolean not null default false,
  marketing_agreed boolean not null default false,
  agreed_at timestamptz not null default now()
);

alter table public.user_consents enable row level security;

drop policy if exists "own consents" on public.user_consents;
create policy "own consents" on public.user_consents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 확인: select * from public.user_consents order by agreed_at desc limit 5;
