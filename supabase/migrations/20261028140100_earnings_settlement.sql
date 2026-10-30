-- exact activation-anchored periods; transaction locks and unique ledger keys prevent repeat credits
-- no production settlement is invoked by this migration
begin;
create or replace function public.legend_site_settle(p_user uuid,p_force boolean)
returns bigint language plpgsql security definer set search_path=public as $$
declare inv public.legend_site_investments%rowtype; period_count integer; paid_count integer; period_value integer; paid_value bigint; investment_total bigint; total bigint:=0; cutoff timestamptz:=now();
begin
  perform pg_advisory_xact_lock(hashtextextended(p_user::text,0));
  -- p_force is retained for compatibility, not permission to pay suspended accounts
  perform 1 from public.legend_site_accounts where user_id=p_user and status='active' for update;
  if not found then return 0; end if;
  for inv in select * from public.legend_site_investments where user_id=p_user and status='active' order by id for update loop
    period_count:=public.legend_earning_periods(inv.started_at,inv.ends_at,cutoff);
    paid_count:=public.legend_earning_periods(inv.started_at,inv.ends_at,inv.last_paid_at);
    investment_total:=0;
    if period_count>paid_count then
      for period_value in paid_count+1..period_count loop
        insert into public.legend_site_ledger(user_id,kind,amount,description,investment_id,period_no,due_at,created_at)
        values(p_user,'income',inv.daily_income,inv.name||' · daily earning, day '||period_value,inv.id,period_value,inv.started_at+period_value*interval '24 hours',clock_timestamp())
        on conflict do nothing returning amount into paid_value;
        investment_total:=investment_total+coalesce(paid_value,0);
      end loop;
      update public.legend_site_investments set last_paid_at=inv.started_at+period_count*interval '24 hours',total_earned=total_earned+investment_total where id=inv.id;
      total:=total+investment_total;
    end if;
    if cutoff>=inv.ends_at then update public.legend_site_investments set status='expired' where id=inv.id; end if;
  end loop;
  if total>0 then update public.legend_site_accounts set balance=balance+total,cumulative_income=cumulative_income+total where user_id=p_user; end if;
  return total;
end;
$$;
create or replace function public.legend_site_settle(p_user uuid)
returns bigint language sql security definer set search_path=public as $$ select public.legend_site_settle(p_user,false); $$;
revoke all on function public.legend_site_settle(uuid,boolean) from public,anon,authenticated;
revoke all on function public.legend_site_settle(uuid) from public,anon,authenticated;
grant execute on function public.legend_site_settle(uuid,boolean) to service_role;
grant execute on function public.legend_site_settle(uuid) to service_role;
commit;
