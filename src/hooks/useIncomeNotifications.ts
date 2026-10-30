import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { money } from '@/lib/siteApi';
import type { SiteSnapshot } from '@/types/site';

export function useIncomeNotifications(data: SiteSnapshot | undefined) {
  const seen = useRef<{ user: string; ids: Set<string> } | null>(null);
  useEffect(() => {
    if (!data?.account || data.admin) return;
    const entries = data.ledger.filter(entry => entry.kind === 'income' || entry.kind === 'referral');
    const first = seen.current?.user !== data.account.user_id;
    const fresh = first ? [] : entries.filter(entry => !seen.current?.ids.has(entry.id));
    seen.current = { user: data.account.user_id, ids: new Set(entries.map(entry => entry.id)) };
    if (first && data.credited > 0) {
      toast.success(`${money(data.credited)} daily earnings credited`, { description: 'Completed 24-hour periods have been added to your wallet. View Records for product details.' });
    }
    for (const kind of ['income', 'referral']) {
      const credits = fresh.filter(entry => entry.kind === kind && entry.amount > 0);
      if (!credits.length) continue;
      toast.success(`${money(credits.reduce((sum, entry) => sum + entry.amount, 0))} ${kind === 'income' ? 'daily earnings' : 'referral commission'} credited`, {
        id: `${kind}-${credits[0].id}`,
        description: [...new Set(credits.map(entry => entry.description))].slice(0, 3).join('; '),
      });
    }
  }, [data]);
}
