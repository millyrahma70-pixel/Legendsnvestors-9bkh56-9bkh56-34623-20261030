import { useState } from 'react';
import { Button } from '@/components/ui/button';
import SiteProductEditor from '@/components/forms/SiteProductEditor';
import ConfirmSiteAction from '@/components/features/ConfirmSiteAction';
import { money, dateTime } from '@/lib/siteApi';
import type { SiteSnapshot } from '@/types/site';
import type { SiteActionProps } from '@/types/siteActions';
interface Props extends SiteActionProps { data:SiteSnapshot }
export default function SiteAdminProducts({data,run,busy}:Props) {
  const [selected,setSelected]=useState<number>();
  const [editSession,setEditSession]=useState(0);
  const product=data.catalog.find(p=>p.id===selected);
  return <div className="space-y-6"><p className="text-muted-foreground leading-relaxed">Manage all VIP prices, daily income, terms and availability. Changes affect future purchases only.</p><div className="grid gap-6 xl:grid-cols-2"><section className="space-y-3">{data.catalog.map(p=><article key={p.id} className="rounded-2xl border border-border bg-card p-4"><div className="flex justify-between gap-3"><div><h3 className="text-lg font-semibold">{p.name}</h3><p className="mt-2 text-primary font-semibold">{money(p.price)}</p><p className="mt-2 text-muted-foreground">{money(p.daily_income)} / day · {p.term} days · {p.enabled?'Available':'Hidden'}</p></div><Button variant="outline" onClick={()=>{setSelected(p.id);setEditSession(value=>value+1);}} className="min-h-11 rounded-xl">Edit</Button></div></article>)}</section>{product&&<SiteProductEditor key={`${product.id}-${editSession}`} product={product} run={run} busy={busy}/>}</div><section className="rounded-2xl border border-border bg-card p-6 space-y-4"><h2 className="text-xl font-semibold">Latest 100 investment purchases</h2>{data.investments.map(i=><article key={i.id} className="border-t border-border pt-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold">{i.name} · {i.phone}</h3><p className="mt-2 text-muted-foreground">{i.status==='active'&&new Date(i.ends_at)<=new Date()?'Term ended':i.status} · Ends {dateTime(i.ends_at)}</p><p className="mt-2 text-primary">Earned {money(i.total_earned)}</p></div>{i.status==='active'&&new Date(i.ends_at)>new Date()&&<ConfirmSiteAction label="Stop earnings" title="Stop this investment?" description="Accrued daily income is settled first, then future earnings stop. Principal is not automatically refunded; use a documented adjustment if a refund is due." busy={busy} destructive onConfirm={()=>{void run('stop',{id:i.id,note:'Administrator stopped future earnings'}).catch(()=>{});}}/>}</div></article>)}{!data.investments.length&&<p className="text-muted-foreground">No Cloud product purchases yet.</p>}</section></div>;
}
