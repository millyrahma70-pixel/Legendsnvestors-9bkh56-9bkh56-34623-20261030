import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import SiteProductImage from '@/components/features/SiteProductImage';
import { money } from '@/lib/siteApi';
import type { SiteProduct } from '@/types/site';
interface Props { products: SiteProduct[] }
export default function SiteProductGallery({ products }: Props) {
  const featured = products.filter(product => product.enabled).slice(0, 3);
  if (!featured.length) return null;
  return <section className="space-y-4" aria-labelledby="vip-showcase-title">
    <header className="flex flex-wrap items-center justify-between gap-2">
      <h2 id="vip-showcase-title" className="border-l-4 border-primary pl-3 text-xl font-semibold">Discover VIP products</h2>
      <Link to="/product" className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 font-medium text-primary hover:opacity-80">View all <ChevronRight size={18} aria-hidden="true" /></Link>
    </header>
    <div className="grid gap-4 sm:grid-cols-3">
      {featured.map(product => <Link key={product.id} to="/product" className="group overflow-hidden rounded-2xl border border-border bg-card transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-primary">
        <SiteProductImage productId={product.id} className="aspect-[4/3] rounded-none" />
        <div className="space-y-1 p-4"><h3 className="font-semibold">{product.name}</h3><p className="text-xl font-semibold text-primary">{money(product.price)}</p><p className="text-base text-muted-foreground">{product.term}-day term</p></div>
      </Link>)}
    </div>
  </section>;
}
