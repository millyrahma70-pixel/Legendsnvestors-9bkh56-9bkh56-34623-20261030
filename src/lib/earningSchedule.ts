import type { SiteInvestment } from '@/types/site';

export const EARNING_DAY_MS = 24 * 60 * 60 * 1000;
export function nextInvestmentEarning(investment: SiteInvestment): number | null {
  if (investment.status !== 'active') return null;
  const start = Date.parse(investment.started_at);
  const end = Date.parse(investment.ends_at);
  const paid = Date.parse(investment.last_paid_at);
  if (![start, end, paid].every(Number.isFinite)) return null;
  const completed = Math.max(0, Math.floor((paid - start) / EARNING_DAY_MS));
  const next = start + (completed + 1) * EARNING_DAY_MS;
  return next <= end ? next : null;
}
export function earningCountdown(timestamp: number, now: number): string {
  const seconds = Math.max(0, Math.floor((timestamp - now) / 1000));
  return `${Math.floor(seconds / 3600)}h ${Math.floor(seconds % 3600 / 60)}m ${seconds % 60}s`;
}
