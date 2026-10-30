import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SiteAccountControls from '@/components/features/SiteAccountControls';
import { money } from '@/lib/siteApi';
import type { SiteSnapshot } from '@/types/site';
import type { SiteActionProps } from '@/types/siteActions';
interface Props extends SiteActionProps { data:SiteSnapshot }
export default function SiteAdminAccounts({data,run,busy}:Props) {
  const [params,setParams]=useSearchParams();
  const [selected,setSelected]=useState<string>();
  const page=Number(params.get('page')||0);
  const account=data.accounts.find(a=>a.user_id===selected);
  const update=(key:string,value:string)=>{setParams(current=>{current.set(key,value);if(key==='search')current.set('page','0');return current;},{replace:true});};
  return <div className="grid gap-6 xl:grid-cols-[1fr_1fr]"><section className="space-y-4"><h2 className="text-xl font-semibold">Verified accounts ({data.accountCount})</h2><div className="space-y-2"><Label htmlFor="account-search" className="text-base">Search by phone or email</Label><Input id="account-search" value={params.get('search')||''} onChange={e=>update('search',e.target.value)} className="min-h-12 bg-card rounded-xl text-base"/></div><div className="space-y-3">{data.accounts.map(a=><button key={a.user_id} onClick={()=>setSelected(a.user_id)} className={`w-full rounded-2xl border bg-card p-4 text-left transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-primary ${selected===a.user_id?'border-primary':'border-border'}`}><div className="flex justify-between gap-3"><h3 className="font-semibold">{a.phone}</h3><span className="text-primary font-semibold">{money(a.balance)}</span></div><p className="mt-2 break-all text-muted-foreground">{a.email}</p><p className="mt-2 text-muted-foreground">{a.status} · Referral {a.referral_code}</p></button>)}</div>{!data.accounts.length&&<p className="rounded-2xl border border-border p-6 text-muted-foreground">No verified accounts match. Older browser-only registrations remain in Joining reports until users create verified Cloud accounts.</p>}<div className="flex items-center justify-between gap-2"><Button variant="outline" disabled={page===0} onClick={()=>update('page',String(page-1))}>Previous</Button><span className="text-muted-foreground">Page {page+1}</span><Button variant="outline" disabled={(page+1)*50>=data.accountCount} onClick={()=>update('page',String(page+1))}>Next</Button></div></section>{account?<SiteAccountControls account={account} run={run} busy={busy}/>:<aside className="rounded-2xl border border-dashed border-border p-6 text-muted-foreground leading-relaxed">Select an account to review its balance, manage access, record adjustments or send secure password reset verification.</aside>}</div>;
}
