import { Link } from 'react-router-dom';
import { Wallet, ArrowUpRight, Gift } from 'lucide-react';
import { money } from '@/lib/siteApi';
import SiteHomeBanner from '@/components/features/SiteHomeBanner';
import SiteIncomeSchedule from '@/components/features/SiteIncomeSchedule';
import SiteProductGallery from '@/components/features/SiteProductGallery';
import type { SiteSnapshot } from '@/types/site';
interface Props { data:SiteSnapshot }
export default function SiteUserOverview({data}:Props) {
  const account=data.account!;
  const actions=[{to:'/recharge',label:'Recharge',icon:Wallet},{to:'/withdraw',label:'Withdraw',icon:ArrowUpRight},{to:'/invite',label:'Invite',icon:Gift}];
  return <div className="space-y-6"><SiteHomeBanner /><section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]"><div className="rounded-3xl border border-primary/30 bg-primary/10 p-6 lg:p-8"><p className="text-primary font-semibold">Available balance</p><h1 className="mt-4 text-4xl font-semibold text-primary tracking-tight">{money(account.balance)}</h1><p className="mt-4 text-muted-foreground">Lifetime income: {money(account.cumulative_income)}</p><Link to="/product" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-ring">Explore VIP products</Link></div><SiteIncomeSchedule data={data} /></section><SiteProductGallery products={data.catalog} />{data.settings.config.announcement&&<section className="rounded-2xl border border-border bg-card p-6"><h2 className="text-lg font-semibold">Platform announcement</h2><p className="mt-3 whitespace-pre-wrap text-muted-foreground leading-relaxed">{data.settings.config.announcement}</p></section>}<nav aria-label="Wallet shortcuts" className="flex flex-wrap gap-3">{actions.map(({to,label,icon:Icon})=><Link key={to} to={to} className="flex min-h-12 items-center gap-3 rounded-xl border border-border bg-card px-5 hover:bg-primary/10 focus-visible:outline focus-visible:outline-primary"><Icon size={20} className="text-primary"/>{label}</Link>)}</nav><section className="rounded-2xl border border-border bg-card p-6"><h2 className="text-xl font-semibold">Payment status</h2><p className="mt-3 text-muted-foreground">{data.orders.filter(o=>o.status==='pending').length} pending request(s) in your latest 100 orders.</p><Link to="/records" className="mt-3 inline-flex min-h-11 items-center text-primary">Track payments & transactions</Link></section></div>;
}
