import SiteAdminOverview from '@/components/features/SiteAdminOverview';
import SiteAdminStats from '@/components/features/SiteAdminStats';
import SiteAdminAccounts from '@/components/features/SiteAdminAccounts';
import SiteAdminOrders from '@/components/features/SiteAdminOrders';
import SiteAdminProducts from '@/components/features/SiteAdminProducts';
import SiteAdminGifts from '@/components/features/SiteAdminGifts';
import SiteAdminAudit from '@/components/features/SiteAdminAudit';
import SiteSettingsForm from '@/components/forms/SiteSettingsForm';
import type { SiteSnapshot } from '@/types/site';
import type { SiteActionProps } from '@/types/siteActions';
interface Props extends SiteActionProps { data:SiteSnapshot; tab:string }
export default function SiteAdminContent({data,tab,run,busy}:Props) {
  const props={data,run,busy};
  if(tab==='users')return <SiteAdminAccounts {...props}/>;
  if(['orders','recharges','withdrawals'].includes(tab))return <SiteAdminOrders {...props}/>;
  if(tab==='products')return <SiteAdminProducts {...props}/>;
  if(tab==='gifts')return <div className="space-y-8"><SiteAdminStats stats={data.stats}/><SiteAdminGifts {...props}/></div>;
  if(tab==='settings')return <SiteSettingsForm settings={data.settings} run={run} busy={busy}/>;
  if(tab==='audit')return <SiteAdminAudit data={data}/>;
  return <SiteAdminOverview {...props}/>;
}
