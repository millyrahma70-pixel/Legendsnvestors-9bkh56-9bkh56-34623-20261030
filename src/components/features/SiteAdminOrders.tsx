import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import SiteOrderRecord from '@/components/features/SiteOrderRecord';
import type { SiteSnapshot } from '@/types/site';
import type { SiteActionProps } from '@/types/siteActions';
interface Props extends SiteActionProps { data:SiteSnapshot }
export default function SiteAdminOrders({data,run,busy}:Props) {
  const [params,setParams]=useSearchParams();
  const page=Math.max(0,Number(params.get('orderPage'))||0);
  const kind=params.get('tab')==='recharges'?'recharge':params.get('tab')==='withdrawals'?'withdrawal':undefined;
  const title=kind==='recharge'?'Recharge review queue':kind==='withdrawal'?'Withdrawal review queue':'Payment review queue';
  const update=(key:string,value:string)=>setParams(current=>{current.set(key,value);if(key==='orderStatus')current.set('orderPage','0');return current;},{replace:true});
  return <section className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-xl font-semibold">{title}</h2><p className="mt-2 text-muted-foreground">{data.orderCount} matching orders · amounts and destinations are captured at submission.</p></div><div className="space-y-2"><Label htmlFor="order-status" className="text-base">Status filter</Label><select id="order-status" value={params.get('orderStatus')||'all'} onChange={e=>update('orderStatus',e.target.value)} className="min-h-12 rounded-xl border border-border bg-card px-4">{['all','pending','approved','rejected'].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select></div></div><div className="grid gap-4 xl:grid-cols-2">{data.orders.filter(order=>!kind||order.kind===kind).map(order=><SiteOrderRecord key={order.id} order={order} admin run={run} busy={busy}/>)}</div>{!data.orders.length&&<p className="rounded-2xl border border-border p-8 text-muted-foreground">No matching Cloud payment orders.</p>}<div className="flex justify-between items-center"><Button variant="outline" disabled={!page} onClick={()=>update('orderPage',String(page-1))}>Previous</Button><span className="text-muted-foreground">Page {page+1} · 100 per page</span><Button variant="outline" disabled={(page+1)*100>=data.orderCount} onClick={()=>update('orderPage',String(page+1))}>Next</Button></div></section>;
}
