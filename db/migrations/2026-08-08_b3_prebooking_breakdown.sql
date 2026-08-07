-- B-3: 사전예약 봉투를 항공/숙박/기타로 분리 저장
-- projects 테이블에 컬럼 3개 추가 (추가만, 기존 데이터 안전). 기존 프로젝트는 0으로 시작하고
-- budget_pre_krw(총액)는 그대로 유지 — 수정 화면에서 기존 총액을 '기타'로 넣어 유실 방지.
-- Supabase → SQL Editor(프로젝트 yeqyjfmefihbzczbotul) → 붙여넣고 Run. 여러 번 실행해도 안전.

alter table public.projects
  add column if not exists budget_pre_air_krw  numeric not null default 0,
  add column if not exists budget_pre_stay_krw numeric not null default 0,
  add column if not exists budget_pre_etc_krw  numeric not null default 0;

-- 확인: select column_name from information_schema.columns
--        where table_name='projects' and column_name like 'budget_pre_%';
--        → budget_pre_krw / budget_pre_air_krw / budget_pre_stay_krw / budget_pre_etc_krw
