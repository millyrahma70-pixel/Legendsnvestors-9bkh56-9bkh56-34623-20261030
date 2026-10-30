import type { ReactNode } from 'react';
import { ShieldCheck, Smartphone, Headphones } from 'lucide-react';
import { usePublicSite } from '@/hooks/useSite';
interface Props { children: ReactNode; title: string }
export default function SiteAuthLayout({ children, title }: Props) {
  const query = usePublicSite();
  const brand = query.data?.settings.config.siteName.replace(/\s+Investors$/i, '') || 'LEGEND';
  return <main className="auth-screen min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 sm:py-12 lg:px-8 lg:py-16">
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-start lg:gap-16">
      <header className="space-y-4 text-center lg:sticky lg:top-16 lg:py-16 lg:text-left">
        <h1 className="text-5xl font-bold uppercase tracking-tight sm:text-6xl">{brand}</h1>
        <p className="text-xl font-medium text-primary">Investors Platform</p>
        <p className="pt-2 text-base uppercase tracking-[0.16em] text-primary">{title}</p>
        <div className="hidden space-y-6 pt-12 lg:block">
          <div className="h-1 w-16 rounded-full bg-primary" aria-hidden="true" />
          <h2 className="max-w-sm text-3xl font-semibold leading-tight">One account.<br />The right dashboard.</h2>
          <p className="max-w-sm text-base leading-relaxed text-muted-foreground">Use your name or phone number to sign in. Members open their personal account; authorized administrators open their full-control panel.</p>
          <p className="flex items-center gap-3 text-base text-muted-foreground"><ShieldCheck size={22} className="text-primary" aria-hidden="true" />Protected account access</p>
          <p className="flex items-center gap-3 text-base text-muted-foreground"><Smartphone size={22} className="text-primary" aria-hidden="true" />Your Cloud account on every device</p>
        </div>
      </header>
      <section className="min-w-0 space-y-6" aria-label="Account access">
        {query.data?.settings.config.maintenance && <p role="alert" className="rounded-2xl border border-primary/30 bg-primary/10 p-4">Maintenance is in progress. Member actions are paused.</p>}
        {children}
        {query.data && <a href={`https://wa.me/${query.data.settings.config.supportPhone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-center gap-2 rounded-xl text-base text-muted-foreground hover:text-primary"><Headphones size={18} aria-hidden="true" />Need help? Contact support</a>}
      </section>
    </div>
  </main>;
}

