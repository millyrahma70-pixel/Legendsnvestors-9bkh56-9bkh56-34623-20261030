-- service-only bounded scheduled payout job; never invoked by this migration
begin;
create or replace function public.legend_earnings_batch(p_limit integer default 100)
returns jsonb language plpgsql security definer set search_path=public as $$
declare account_id uuid; processed integer:=0; total bigint:=0; remaining integer; run_id uuid; started timestamptz:=now(); completed timestamptz;
begin
  if p_limit not between 1 and 100 then raise exception 'Batch limit must be between 1 and 100'; end if;
  if not pg_try_advisory_xact_lock(hashtextextended('legend_earnings_scheduler',0)) then return jsonb_build_object('busy',true); end if;
  for account_id in
    select distinct i.user_id from public.legend_site_investments i join public.legend_site_accounts a on a.user_id=i.user_id
    where a.status='active' and i.status='active' and (public.legend_earning_periods(i.started_at,i.ends_at,now())>public.legend_earning_periods(i.started_at,i.ends_at,i.last_paid_at) or i.ends_at<=now())
    order by i.user_id limit p_limit
  loop
    total:=total+public.legend_site_settle(account_id,false);
    processed:=processed+1;
  end loop;
  select count(distinct i.user_id)::integer into remaining from public.legend_site_investments i join public.legend_site_accounts a on a.user_id=i.user_id
  where a.status='active' and i.status='active' and (public.legend_earning_periods(i.started_at,i.ends_at,now())>public.legend_earning_periods(i.started_at,i.ends_at,i.last_paid_at) or i.ends_at<=now());
  completed:=clock_timestamp();
  insert into public.legend_earnings_runs(started_at,completed_at,accounts_processed,amount_credited,remaining_accounts) values(started,completed,processed,total,remaining) returning id into run_id;
  return jsonb_build_object('busy',false,'run_id',run_id,'accounts_processed',processed,'amount_credited',total,'remaining_accounts',remaining,'has_more',remaining>0,'completed_at',completed);
end;
$$;
revoke all on function public.legend_earnings_batch(integer) from public,anon,authenticated;
grant execute on function public.legend_earnings_batch(integer) to service_role;
commit;
