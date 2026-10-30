-- move new referral rewards from recharge approval to actual investment activation
-- historical referral credits are not reversed; historical investments are not backfilled
begin;
create or replace function public.legend_credit_investment_referrals()
returns trigger language plpgsql security definer set search_path=public as $$
declare cfg jsonb; parent public.legend_site_accounts%rowtype; ref_id uuid; parent_id uuid; level_value integer; rate_value numeric; commission bigint; credited bigint; visited uuid[]:=array[new.user_id];
begin
  if new.status<>'active' then return new; end if;
  select config into cfg from public.legend_site_settings where id;
  if cfg is null then raise exception 'Website settings are unavailable'; end if;
  select referred_by into ref_id from public.legend_site_accounts where user_id=new.user_id;
  for level_value in 1..3 loop
    exit when ref_id is null or ref_id=any(visited);
    visited:=array_append(visited,ref_id);
    select * into parent from public.legend_site_accounts where user_id=ref_id for update;
    exit when not found;
    parent_id:=parent.referred_by;
    rate_value:=coalesce((cfg->>('referral'||level_value))::numeric,0);
    if rate_value<0 or rate_value>100 then raise exception 'Invalid referral commission rate'; end if;
    commission:=floor(new.price::numeric*rate_value/100)::bigint;
    if parent.status='active' and commission>0 then
      insert into public.legend_site_ledger(user_id,kind,amount,description,investment_id,referral_level,due_at,created_at)
      values(ref_id,'referral',commission,'Level '||level_value||' · '||rate_value||'% commission on '||new.name||' investment',new.id,level_value,new.started_at,clock_timestamp())
      on conflict do nothing returning amount into credited;
      if credited is not null then
        update public.legend_site_accounts set balance=balance+credited,cumulative_income=cumulative_income+credited where user_id=ref_id;
      end if;
    end if;
    ref_id:=parent_id;
  end loop;
  return new;
end;
$$;
revoke all on function public.legend_credit_investment_referrals() from public,anon,authenticated;
 do $$ begin
  if not exists(select 1 from pg_trigger where tgrelid='public.legend_site_investments'::regclass and tgname='legend_investment_referrals_after_insert') then
    create trigger legend_investment_referrals_after_insert after insert on public.legend_site_investments for each row execute function public.legend_credit_investment_referrals();
  end if;
 end $$;
-- preserve the existing command and remove only its validated recharge referral loop
 do $$
 declare definition text; old_block text; start_at integer; finish_at integer;
 begin
   select pg_get_functiondef('public.legend_site_command(uuid,text,boolean,text,jsonb,uuid,jsonb)'::regprocedure) into definition;
   start_at:=position('ref_id:=target.referred_by;' in definition);
   if start_at=0 and position('Referral rewards are issued only by the investment activation trigger.' in definition)>0 then return; end if;
   if start_at=0 then raise exception 'Expected legacy recharge commission block was not found'; end if;
   finish_at:=position('end loop;' in substring(definition from start_at));
   if finish_at=0 then raise exception 'Legacy commission block is incomplete'; end if;
   old_block:=substring(definition from start_at for finish_at+length('end loop;')-1);
   if position('commission on approved recharge' in old_block)=0 or position('ord.amount*rate/100' in old_block)=0 then raise exception 'Unexpected legacy commission implementation'; end if;
   definition:=replace(definition,old_block,'-- Referral rewards are issued only by the investment activation trigger.');
   if position('commission on approved recharge' in definition)>0 then raise exception 'A duplicate legacy referral path remains'; end if;
   execute definition;
 end;
 $$;
commit;
