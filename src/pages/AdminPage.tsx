import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useSite } from '@/hooks/useSite';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import SiteAdminHeader from '@/components/layout/SiteAdminHeader';
import SiteAdminNavigation from '@/components/layout/SiteAdminNavigation';
import SiteAdminContent from '@/components/features/SiteAdminContent';
import type { SiteFilter } from '@/types/site';

const TITLES: Record<string, string> = { overview: 'At a glance', users: 'User Management', orders: 'Payment Approvals', recharges: 'Recharge Approvals', withdrawals: 'Withdrawal Approvals', products: 'Package Management', gifts: 'Rewards & Redeem Codes', settings: 'Website Settings', audit: 'Activity & Ledger' };
export default function AdminPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const [logoutBusy, setLogoutBusy] = useState(false);
  const requestedTab = params.get('tab') || 'overview';
  const tab = Object.prototype.hasOwnProperty.call(TITLES, requestedTab) ? requestedTab : 'overview';
  const status = params.get('orderStatus');
  const ledgerUser = params.get('ledgerUser');
  const filter: SiteFilter = { search: params.get('search') || '', page: Math.max(0, Number(params.get('page')) || 0), orderPage: Math.max(0, Number(params.get('orderPage')) || 0), orderStatus: status === 'pending' || status === 'approved' || status === 'rejected' ? status : 'all', orderKind: tab === 'recharges' ? 'recharge' : tab === 'withdrawals' ? 'withdrawal' : 'all', ...(ledgerUser ? { ledgerUser } : {}) };
  const query = useSite(filter);
  const signOut = () => { setLogoutBusy(true); void logout().then(() => navigate('/login', { replace: true })).catch((error: Error) => { setLogoutBusy(false); toast.error(error.message); }); };
  return <div className="admin-theme min-h-screen bg-background text-foreground">
    <SiteAdminHeader siteName={query.data?.settings.config.siteName || 'Legend Investors'} dueAccounts={query.data?.stats.dueIncomeAccounts || 0} unavailable={!query.data?.admin || query.isPending || query.isError || logoutBusy} logoutBusy={logoutBusy} onLogout={signOut} run={query.run} busy={query.command.isPending} />
    <div className="admin-shell mx-auto px-4 pb-12 sm:px-6 lg:px-8">
      <SiteAdminNavigation />
      <main className="min-w-0 pt-6 sm:pt-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-xl font-semibold sm:text-2xl">{TITLES[tab] || TITLES.overview}</h2><p className="mt-1 text-sm text-muted-foreground">Live Cloud totals · {query.dataUpdatedAt ? `updated ${new Date(query.dataUpdatedAt).toLocaleTimeString()}` : 'connecting…'} · refreshes every 15 seconds</p></div>
          <Button variant="outline" disabled={query.isFetching} onClick={() => void query.refetch()} className="min-h-11 gap-2 rounded-xl bg-card text-muted-foreground"><RefreshCw size={17} className="text-primary" />{query.isFetching ? 'Refreshing…' : 'Refresh'}</Button>
        </div>
        {query.isPending ? <p role="status" className="rounded-3xl border border-border bg-card p-8">Loading website controls…</p> : query.isError ? <section role="alert" className="space-y-4 rounded-3xl border border-border bg-card p-6"><h3 className="text-xl font-semibold">Website controls unavailable</h3><p className="text-muted-foreground">{query.error.message}</p><Button onClick={() => void query.refetch()}>Retry connection</Button></section> : query.data.admin ? <SiteAdminContent data={query.data} tab={tab} run={query.run} busy={query.command.isPending} /> : <p role="alert">Administrator access is required.</p>}
      </main>
    </div>
  </div>;
}
