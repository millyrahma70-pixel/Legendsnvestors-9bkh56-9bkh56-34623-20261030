import { Clock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { SiteEarningsAutomation } from '@/types/site';
interface Props { automation?: SiteEarningsAutomation }
export default function SiteEarningsAutomationStatus({ automation }: Props) {
  const connected = Boolean(automation?.last_run_at && Date.now() - Date.parse(automation.last_run_at) < 180000);
  const endpoint = automation?.endpoint;
  return <section className="rounded-3xl border border-primary/30 bg-card p-6 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-3 text-xl font-semibold"><Clock size={22} className="text-primary" aria-hidden="true" />Automatic daily payouts</h2><span className="rounded-xl bg-primary/10 px-4 py-2 font-semibold text-primary">{connected ? automation?.backlogged ? 'Connected · catching up' : 'Connected' : 'Scheduler setup required'}</span></div>
    <p className="text-muted-foreground leading-relaxed">Each investment earns on its activation time plus full 24-hour periods. The server pays eligible wallets automatically when the scheduled job runs, including offline members. Referral commissions credit immediately when a referred member invests, without this job.</p>
    <p className="text-muted-foreground">Server credential: <strong className="text-foreground">{automation?.configured ? 'Configured securely' : 'Set a random secret of at least 32 characters in Cloud Secrets'}</strong></p>
    <p className="text-muted-foreground">Last successful job: <strong className="text-foreground">{automation?.last_run_at ? new Date(automation.last_run_at).toLocaleString() : 'No scheduled runs yet'}</strong></p>
    {!connected && <div role="status" className="rounded-xl border border-border bg-secondary p-4"><p className="font-semibold">Connect an external scheduler</p><p className="mt-2 text-muted-foreground leading-relaxed">Create a POST job every minute with body <code>{'{}'}</code> and header Authorization: Bearer followed by your saved LEGEND_EARNINGS_CRON_SECRET. Enter the secret only in your scheduler’s protected settings, never in website code.</p>{endpoint && <><p className="mt-3 break-all text-muted-foreground">{endpoint}</p><Button variant="outline" className="mt-3 min-h-11 rounded-xl" onClick={() => void navigator.clipboard.writeText(endpoint).then(() => toast.success('Payout endpoint copied')).catch(() => toast.error('Copy failed. Select the endpoint above.'))}>Copy endpoint</Button></>}</div>}
    <p className="flex items-start gap-3 text-muted-foreground leading-relaxed"><ShieldCheck size={20} className="mt-1 shrink-0 text-primary" aria-hidden="true" />Repeats and overlapping requests cannot credit the same period or investment commission twice. Payout delivery may lag the earned-at time; Run Income remains a manual fallback.</p>
  </section>;
}
