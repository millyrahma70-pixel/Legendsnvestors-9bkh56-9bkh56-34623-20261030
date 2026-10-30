import { useState } from 'react';
import { Button } from '@/components/ui/button';
import SiteCatalogProductCard from '@/components/features/SiteCatalogProductCard';
import SiteInvestmentRecord from '@/components/features/SiteInvestmentRecord';
import type { SiteSnapshot } from '@/types/site';
import type { SiteActionProps } from '@/types/siteActions';
interface Props extends SiteActionProps { data: SiteSnapshot }
export default function SiteUserProducts({ data, run, busy }: Props) {
  const [view, setView] = useState<'catalog' | 'active'>('catalog');
  return <section className="space-y-6">
    <header>
      <h1 className="text-2xl font-semibold">Product center</h1>
      <p className="mt-2 text-muted-foreground leading-relaxed">Compare VIP terms or track your purchased products. Earnings stop at term end; returns are platform-scheduled and carry investment risk.</p>
    </header>
    <div className="flex flex-wrap gap-3">
      <Button variant={view === 'catalog' ? 'secondary' : 'outline'} onClick={() => setView('catalog')} aria-pressed={view === 'catalog'} className="min-h-11 rounded-xl">Available products</Button>
      <Button variant={view === 'active' ? 'secondary' : 'outline'} onClick={() => setView('active')} aria-pressed={view === 'active'} className="min-h-11 rounded-xl">My products ({data.investments.length})</Button>
    </div>
    <div className="grid gap-4 lg:grid-cols-2">
      {view === 'catalog'
        ? data.catalog.filter(p => p.enabled).map(p => <SiteCatalogProductCard key={p.id} product={p} balance={data.account?.balance ?? 0} run={run} busy={busy} />)
        : data.investments.map(i => <SiteInvestmentRecord key={i.id} investment={i} />)}
    </div>
    {view === 'catalog' && <p className="text-base text-muted-foreground">Vehicle pictures are illustrative; each purchase follows the listed platform product terms.</p>}
    {view === 'active' && !data.investments.length && <p className="rounded-2xl border border-dashed border-border p-8 text-muted-foreground">You have no Cloud product purchases yet. Browse the available catalog to compare terms.</p>}
  </section>;
}
