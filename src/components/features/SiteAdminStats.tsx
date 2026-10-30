import { Users, Package, Clock3, TrendingUp, CircleArrowDown, Wallet, ChartNoAxesCombined, Network } from 'lucide-react';
import SiteAdminMetricCard from '@/components/features/SiteAdminMetricCard';
import type { SiteStats } from '@/types/site';

interface Props { stats: SiteStats }
const amount = (value: number) => `${(value ?? 0).toLocaleString('en-UG')} UGX`;

export default function SiteAdminStats({ stats }: Props) {
  const cards = [
    { label: 'Total Users', value: stats.users.toLocaleString(), detail: 'Shared Cloud accounts', icon: Users, to: '/admin?tab=users', featured: true },
    { label: 'Active Packages', value: stats.activeInvestments.toLocaleString(), detail: 'Within their earning term', icon: Package, to: '/admin?tab=products' },
    { label: 'Pending Recharges', value: stats.pendingRecharge.toLocaleString(), detail: 'Awaiting payment verification', icon: Clock3, to: '/admin?tab=recharges&orderStatus=pending' },
    { label: 'Total Deposits', value: amount(stats.deposits), detail: 'Approved recharges', icon: TrendingUp, to: '/admin?tab=recharges&orderStatus=approved' },
    { label: 'Total Withdrawals', value: amount(stats.withdrawals), detail: 'Approved withdrawal amounts', icon: CircleArrowDown, to: '/admin?tab=withdrawals&orderStatus=approved' },
    { label: 'Pending Payouts', value: amount(stats.pendingPayoutAmount), detail: `${stats.pendingWithdrawal} requests · after fees`, icon: Wallet, to: '/admin?tab=withdrawals&orderStatus=pending' },
    { label: 'Earnings Distributed', value: amount(stats.earningsDistributed), detail: 'Daily package income credited', icon: ChartNoAxesCombined, to: '/admin?tab=audit' },
    { label: 'Referral Earnings', value: amount(stats.referralEarnings), detail: 'Commissions credited to members', icon: Network, to: '/admin?tab=audit' },
  ];
  return <section aria-label="Website statistics" className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{cards.map(card => <SiteAdminMetricCard key={card.label} {...card} />)}</section>;
}
