import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SiteLedger from '@/components/features/SiteLedger';
import SiteOrderRecord from '@/components/features/SiteOrderRecord';
import type { SiteSnapshot } from '@/types/site';
interface Props { data:SiteSnapshot; kind?:'recharge'|'withdrawal' }
export default function SiteUserRecords({data,kind}:Props) {
  const [params,setParams]=useSearchParams();
  const page=Number(params.get('orderPage')||0);
  const orders=kind?data.orders.filter(o=>o.kind===kind):data.orders;
  const update=(next:number)=>setParams(current=>{current.set('orderPage',String(next));return current;});
  return <div className="space-y-8"><section className="space-y-4"><h1 className="text-2xl font-semibold">{kind==='recharge'?'Recharge status':kind==='withdrawal'?'Withdrawal status':'Payment records'}</h1><p className="text-muted-foreground leading-relaxed">Records refresh every 15 seconds. PesaJet recharges are credited only after gateway confirmation; older manual payments and withdrawals use admin verification.</p><div className="grid gap-4 lg:grid-cols-2">{orders.map(order=><SiteOrderRecord key={order.id} order={order}/>)}</div>{!orders.length&&<p className="rounded-2xl border border-dashed border-border p-8 text-muted-foreground">No {kind||'payment'} orders in this page of your records.</p>}<div className="flex justify-between items-center gap-3"><Button variant="outline" disabled={!page} onClick={()=>update(page-1)}>Previous</Button><span className="text-muted-foreground">Page {page+1} · 100 orders per page</span><Button variant="outline" disabled={(page+1)*100>=data.orderCount} onClick={()=>update(page+1)}>Next</Button></div></section>{!kind&&<SiteLedger ledger={data.ledger}/>}</div>;
}
