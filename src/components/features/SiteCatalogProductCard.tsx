import ConfirmSiteAction from '@/components/features/ConfirmSiteAction';
import SiteProductImage from '@/components/features/SiteProductImage';
import { money } from '@/lib/siteApi';
import type { SiteProduct } from '@/types/site';
import type { SiteActionProps } from '@/types/siteActions';
interface Props extends SiteActionProps { product: SiteProduct; balance: number }
export default function SiteCatalogProductCard({ product: p, balance, run, busy }: Props) {
  return <article className="overflow-hidden rounded-3xl border border-border bg-card">
    <div className="p-4 sm:p-6">
      <div className="flex items-start gap-4">
        <SiteProductImage productId={p.id} className="h-28 w-28 shrink-0 sm:h-36 sm:w-36" />
        <div className="min-w-0"><h2 className="text-xl font-semibold leading-snug">{p.name}</h2><p className="mt-3 break-words text-2xl font-semibold text-primary sm:text-3xl">{money(p.price)}</p></div>
      </div>
      <dl className="mt-6 space-y-3">
        <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Daily income</dt><dd className="text-right font-semibold text-primary">{money(p.daily_income)}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Term</dt><dd>{p.term} days</dd></div>
        <div className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">Scheduled total</dt><dd className="font-semibold">{money(p.daily_income * p.term)}</dd></div>
      </dl>
    </div>
    <div className="border-t border-border bg-primary/5 p-4 sm:px-6">
      <ConfirmSiteAction label="Purchase product" title={`Purchase VIP ${p.id}?`} description={`${money(p.price)} will be deducted from your available balance. Your ${p.term}-day term begins immediately. Daily income starts accruing after 24 hours.`} busy={busy || balance < p.price} onConfirm={() => { void run('purchase', { id: p.id }).catch(() => {}); }} />
      {balance < p.price && <p className="mt-3 text-base text-muted-foreground">Recharge to purchase this product.</p>}
    </div>
  </article>;
}
