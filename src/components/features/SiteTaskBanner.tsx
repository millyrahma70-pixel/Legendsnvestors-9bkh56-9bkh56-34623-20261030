import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import sportCoupe from '@/assets/legend-sport-coupe.jpg';
export default function SiteTaskBanner() {
  return <Link to="/tasks" className="group relative isolate flex min-h-44 items-end overflow-hidden rounded-3xl border border-primary/20 bg-card p-6 transition-transform duration-200 hover:-translate-y-0.5">
    <img src={sportCoupe} alt="Silver sports coupe on a sunset mountain road" width={1024} height={768} loading="lazy" decoding="async" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/95 via-background/80 to-background/30" aria-hidden="true" />
    <div className="flex w-full flex-wrap items-end justify-between gap-4">
      <div><h2 className="text-2xl font-semibold text-foreground">Task Center</h2><p className="mt-1 text-base text-foreground">Explore check-in and referral rewards.</p></div>
      <span className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary">Go now <ArrowRight size={20} aria-hidden="true" /></span>
    </div>
  </Link>;
}
