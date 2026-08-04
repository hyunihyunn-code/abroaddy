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
