import { Link } from 'react-router-dom';
import { UserRound, ShieldCheck, Wallet, Gift, CalendarCheck, Headphones, ScrollText, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { money } from '@/lib/siteApi';
import SiteTaskBanner from '@/components/features/SiteTaskBanner';
import type { SiteSnapshot } from '@/types/site';
interface Props { data:SiteSnapshot }
const links:{to:string;label:string;icon:LucideIcon}[]=[{to:'/profile',label:'Profile & password',icon:UserRound},{to:'/bind-card',label:'Bind payout account',icon:Wallet},{to:'/records',label:'Transaction records',icon:ScrollText},{to:'/recharge-status',label:'Recharge status',icon:Wallet},{to:'/withdraw-status',label:'Withdrawal status',icon:Wallet},{to:'/redeem',label:'Redeem gift code',icon:Gift},{to:'/checkin',label:'Daily check-in',icon:CalendarCheck},{to:'/customer-service',label:'Customer support',icon:Headphones},{to:'/regulation',label:'Platform rules',icon:ShieldCheck}];
export default function SiteUserMine({data}:Props) {
  const account=data.account!;
  return <div className="space-y-6"><section className="rounded-3xl border border-primary/30 bg-card p-6"><p className="text-primary font-semibold">Verified Cloud account</p><h1 className="mt-3 text-2xl font-semibold">{account.phone}</h1><p className="mt-2 text-muted-foreground break-all">{account.email}</p><p className="mt-4 text-3xl font-semibold text-primary">{money(account.balance)}</p><p className="mt-2 text-muted-foreground">Referral: {account.referral_code} · {account.status}</p></section><SiteTaskBanner /><nav aria-label="Account management" className="grid gap-3 lg:grid-cols-2">{links.map(({to,label,icon:Icon})=><Link key={to} to={to} className="flex min-h-16 items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-primary"><Icon size={22} className="text-primary"/><span className="flex-1 font-medium">{label}</span><ChevronRight size={18} className="text-muted-foreground"/></Link>)}</nav></div>;
}
