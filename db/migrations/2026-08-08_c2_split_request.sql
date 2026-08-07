-- C-2: 지출에 '1/N 정산 대상' 체크 저장 (추가만, 기존 데이터 안전)
-- Supabase → SQL Editor(프로젝트 yeqyjfmefihbzczbotul) → 붙여넣고 Run. 여러 번 실행해도 안전.

alter table public.transactions
  add column if not exists split_request boolean not null default false;

-- 확인: select column_name from information_schema.columns
--        where table_name='transactions' and column_name='split_request';
