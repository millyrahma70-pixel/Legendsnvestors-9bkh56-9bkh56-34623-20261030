import { getProductImage } from '@/constants/productImages';
import { cn } from '@/lib/utils';
interface Props { productId: number; className?: string; muted?: boolean }
export default function SiteProductImage({ productId, className, muted = false }: Props) {
  const image = getProductImage(productId);
  return <div className={cn('relative overflow-hidden rounded-2xl bg-secondary', className)}>
    <img src={image.src} alt={image.alt} width={1024} height={768} loading="lazy" decoding="async" className={cn('h-full w-full object-cover', muted && 'opacity-60 grayscale')} />
    <span className="absolute left-2 top-2 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">VIP {productId}</span>
  </div>;
}
