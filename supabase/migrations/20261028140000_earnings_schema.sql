-- additive earnings metadata, deduplication, and administrator-only scheduler receipts
-- existing wallet balances and ledger records are not modified
begin;
alter table public.legend_site_ledger add column if not exists investment_id uuid references public.legend_site_investments(id) on delete restrict;
alter table public.legend_site_ledger add column if not exists period_no integer;
alter table public.legend_site_ledger add column if not exists due_at timestamptz;
alter table public.legend_site_ledger add column if not exists referral_level integer;
create unique index if not exists legend_income_period_unique on public.legend_site_ledger(investment_id,period_no) where kind='income' and investment_id is not null;
create unique index if not exists legend_investment_referral_unique on public.legend_site_ledger(investment_id,user_id,referral_level) where kind='referral' and investment_id is not null;
create index if not exists legend_active_earnings_due_idx on public.legend_site_investments(user_id,last_paid_at) where status='active';
create table if not exists public.legend_earnings_runs (
  id uuid primary key default gen_random_uuid(), started_at timestamptz not null default now(),
  completed_at timestamptz not null default clock_timestamp(), accounts_processed integer not null,
  amount_credited bigint not null, remaining_accounts integer not null
);
alter table public.legend_earnings_runs enable row level security;
-- only authenticated administrators can read; browser roles cannot insert, update, or delete receipts
 do $$ begin
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='legend_earnings_runs' and policyname='authenticated_select_admin_earnings_runs') then
    create policy authenticated_select_admin_earnings_runs on public.legend_earnings_runs for select to authenticated using(public.is_legend_directory_admin());
  end if;
 end $$;
revoke all on public.legend_earnings_runs from anon,authenticated;
grant select on public.legend_earnings_runs to authenticated;
grant all on public.legend_earnings_runs to service_role;
create index if not exists legend_earnings_runs_recent_idx on public.legend_earnings_runs(completed_at desc);
create or replace function public.legend_earning_periods(p_started timestamptz,p_ends timestamptz,p_as_of timestamptz)
returns integer language sql immutable strict set search_path=public as $$
  select greatest(0,floor(extract(epoch from (least(p_ends,p_as_of)-p_started))/86400)::integer);
$$;
revoke all on function public.legend_earning_periods(timestamptz,timestamptz,timestamptz) from public,anon,authenticated;
grant execute on function public.legend_earning_periods(timestamptz,timestamptz,timestamptz) to service_role;
commit;
