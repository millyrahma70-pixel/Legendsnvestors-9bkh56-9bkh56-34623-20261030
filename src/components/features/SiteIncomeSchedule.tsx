import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { money } from '@/lib/siteApi';
import { earningCountdown, nextInvestmentEarning } from '@/lib/earningSchedule';
import type { SiteSnapshot } from '@/types/site';
interface Props { data: SiteSnapshot }
export default function SiteIncomeSchedule({ data }: Props) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const active = data.investments.filter(investment => investment.status === 'active' && Date.parse(investment.ends_at) > now);
  const dates = data.investments.map(nextInvestmentEarning).filter((value): value is number => value !== null);
  const next = dates.length ? Math.min(...dates) : null;
  const connected = Boolean(data.automation?.last_run_at && now - Date.parse(data.automation.last_run_at) < 180000);
  return <section className="rounded-3xl border border-border bg-card p-6">
    <Clock size={24} className="text-primary" aria-hidden="true" /><h2 className="mt-4 text-xl font-semibold">Your earning schedule</h2>
    <p className="mt-3 text-3xl font-semibold">{money(active.reduce((sum, investment) => sum + investment.daily_income, 0))}</p>
    <p className="mt-2 text-muted-foreground leading-relaxed">Daily earnings across {active.length} active products. Each payment is earned exactly 24 hours after activation, then every 24 hours until term end.</p>
    {next !== null ? <div className="mt-4 rounded-xl bg-secondary p-4"><p className="font-semibold text-primary">{next <= now ? 'Earnings due · awaiting payout' : earningCountdown(next, now)}</p><p className="mt-2 text-muted-foreground">Next earned at {new Date(next).toLocaleString()}</p></div> : <p className="mt-4 text-muted-foreground">No upcoming daily earnings. View your products to check their terms.</p>}
    <p className="mt-3 text-muted-foreground leading-relaxed">{connected ? 'The background payout job is connected. Eligible earnings credit while you are offline; processing may follow the scheduled time.' : 'The background payout job is not currently connected. Account refresh still credits completed periods without losing eligible earnings.'}</p>
    <Link to="/product" className="mt-4 inline-flex min-h-11 items-center rounded-lg text-primary hover:opacity-80 focus-visible:outline focus-visible:outline-ring">View active terms</Link>
  </section>;
}
