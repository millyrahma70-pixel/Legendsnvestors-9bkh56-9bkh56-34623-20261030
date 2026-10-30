import { Gift, Clock3 } from 'lucide-react';
import SiteGiftForm from '@/components/forms/SiteGiftForm';
import SiteAdminGiftRecord from '@/components/features/SiteAdminGiftRecord';
import { money } from '@/lib/siteApi';
import type { SiteSnapshot } from '@/types/site';
import type { SiteActionProps } from '@/types/siteActions';

interface Props extends SiteActionProps { data: SiteSnapshot }
export default function SiteAdminGifts({ data, run, busy }: Props) {
  return <section className="space-y-6" aria-labelledby="redeem-codes-title">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="redeem-codes-title" className="flex items-center gap-3 text-2xl font-bold sm:text-3xl"><Gift size={25} className="text-primary" />Redeem Codes</h2><span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm text-muted-foreground"><Clock3 size={16} />30-min expiry</span></div>
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-base text-muted-foreground"><p><strong className="text-primary">{data.stats.giftCreated}</strong> created</p><p><strong className="text-primary">{data.stats.giftRedeemed}</strong> redeemed</p><p><strong className="text-primary">{money(data.stats.giftDistributed)}</strong> distributed</p></div>
    <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
      <SiteGiftForm run={run} busy={busy} />
      <div className="space-y-3"><h3 className="text-lg font-semibold">Recent codes <span className="font-normal text-muted-foreground">· latest 100</span></h3>{data.gifts.map(gift => <SiteAdminGiftRecord key={gift.id} gift={gift} run={run} busy={busy} />)}{!data.gifts.length && <div className="rounded-3xl border border-dashed border-border bg-card p-6"><Gift size={28} className="mb-4 text-primary" /><p className="text-lg font-semibold">Your first reward starts here</p><p className="mt-2 text-base leading-relaxed text-muted-foreground">Create a code, copy it and share it with a member. Redemption history will appear here.</p></div>}</div>
    </div>
  </section>;
}
