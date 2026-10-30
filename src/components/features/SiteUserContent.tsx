import { Link } from 'react-router-dom';
import SiteUserOverview from '@/components/features/SiteUserOverview';
import SiteUserProducts from '@/components/features/SiteUserProducts';
import SiteUserTeam from '@/components/features/SiteUserTeam';
import SiteUserMine from '@/components/features/SiteUserMine';
import SiteUserProfile from '@/components/features/SiteUserProfile';
import SiteUserRecords from '@/components/features/SiteUserRecords';
import SiteDailyCheckin from '@/components/features/SiteDailyCheckin';
import SiteUserInfo from '@/components/features/SiteUserInfo';
import SiteRechargeForm from '@/components/forms/SiteRechargeForm';
import RechargeGuide from '@/components/features/RechargeGuide';
import PaymentErrorBoundary from '@/components/features/PaymentErrorBoundary';
import SiteWithdrawalForm from '@/components/forms/SiteWithdrawalForm';
import SiteBankForm from '@/components/forms/SiteBankForm';
import SiteRedeemForm from '@/components/forms/SiteRedeemForm';
import type { SiteSnapshot } from '@/types/site';
import type { SiteActionProps } from '@/types/siteActions';
interface Props extends SiteActionProps { data:SiteSnapshot; path:string }
export default function SiteUserContent({data,path,run,busy}:Props) {
  const props={data,run,busy};
  if(path==='/product')return <SiteUserProducts {...props}/>;
  if(path==='/team'||path==='/invite')return <SiteUserTeam data={data}/>;
  if(path==='/mine')return <SiteUserMine data={data}/>;
  if(path==='/profile')return <SiteUserProfile data={data} disabled={busy}/>;
  if(path==='/recharge')return <PaymentErrorBoundary><div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]"><SiteRechargeForm {...props}/><RechargeGuide/></div></PaymentErrorBoundary>;
  if(path==='/withdraw')return <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]"><SiteWithdrawalForm {...props}/><aside className="rounded-2xl border border-border bg-card p-6 h-fit"><h2 className="text-xl font-semibold">Track your request</h2><p className="mt-3 text-muted-foreground leading-relaxed">Reserved funds remain attached to your request until admin approval or rejection.</p><Link to="/withdraw-status" className="mt-4 inline-flex min-h-11 items-center text-primary">View withdrawal status</Link></aside></div>;
  if(path==='/bind-card')return <SiteBankForm {...props}/>;
  if(path==='/redeem')return <SiteRedeemForm run={run} busy={busy}/>;
  if(path==='/checkin'||path==='/tasks')return <div className="space-y-6"><SiteDailyCheckin {...props}/><Link to="/redeem" className="inline-flex min-h-11 items-center text-primary">Redeem an admin-shared gift code</Link></div>;
  if(path==='/records')return <SiteUserRecords data={data}/>;
  if(path==='/recharge-status')return <SiteUserRecords data={data} kind="recharge"/>;
  if(path==='/withdraw-status')return <SiteUserRecords data={data} kind="withdrawal"/>;
  if(['/about','/regulation','/customer-service'].includes(path))return <SiteUserInfo config={data.settings.config} about={path==='/about'} support={path==='/customer-service'}/>;
  return <SiteUserOverview data={data}/>;
}
