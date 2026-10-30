import SitePasswordForm from '@/components/forms/SitePasswordForm';
import SiteIncomeChart from '@/components/features/SiteIncomeChart';
import { money, dateTime } from '@/lib/siteApi';
import type { SiteSnapshot } from '@/types/site';
interface Props { data:SiteSnapshot; disabled:boolean }
export default function SiteUserProfile({data,disabled}:Props) {
  const account=data.account!;
  const totals=[{label:'Verified email',value:account.email},{label:'Phone number',value:account.phone},{label:'Joined',value:dateTime(account.created_at)},{label:'Total approved deposits',value:money(data.personalStats.deposits)},{label:'Total approved withdrawals',value:money(data.personalStats.withdrawals)},{label:'Active products',value:String(data.personalStats.activeProducts)},{label:'Total referral earnings',value:money(data.personalStats.referrals)}];
  return <div className="space-y-6"><h1 className="text-2xl font-semibold">Profile & security</h1><div className="grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-border bg-card p-6"><h2 className="text-xl font-semibold">Personal summary</h2><dl className="mt-4 space-y-4">{totals.map(t=><div key={t.label}><dt className="text-muted-foreground">{t.label}</dt><dd className="mt-1 break-all font-semibold">{t.value}</dd></div>)}</dl></section><SitePasswordForm email={account.email} disabled={disabled}/></div><SiteIncomeChart ledger={data.ledger}/></div>;
}
