import type { ReactNode } from 'react';
import { ShieldCheck, Smartphone, Headphones } from 'lucide-react';
import { usePublicSite } from '@/hooks/useSite';

interface Props { children: ReactNode; title: string }

export default function SiteAuthLayout({ children, title }: Props) {
  const query = usePublicSite();
  const brand = query.data?.settings.config.siteName.replace(/\s+Investors$/i, '') || 'LEGEND';

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-start lg:gap-16">
        
        {/* LEFT SIDE - Brand - always black/gold */}
        <header className="space-y-4 text-center lg:sticky lg:top-16 lg:text-left">
          <h1 className="text-5xl font-black uppercase tracking-tight sm:text-6xl text-white">{brand}</h1>
          <p className="text-xl font-medium text-[#f5c518]">Investors Platform</p>
          <p className="pt-2 text-sm uppercase tracking-[0.3em] text-[#c9a227]">{title}</p>

          {/* Gold bonus card - like your screenshot */}
          <div className="w-full max-w-md mx-auto lg:mx-0 mt-6 bg-[#1c1a0f] border border-[#3d3510] rounded-[24px] p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#f5c518] flex items-center justify-center text-black text-xl">🎁</div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm">Registration Bonus</p>
              <p className="text-[#f5c518] font-bold">UGX 9,000 credited on activation</p>
            </div>
          </div>

          <div className="hidden space-y-6 pt-12 lg:block">
            <div className="h-1 w-16 rounded-full bg-[#f5c518]" />
            <h2 className="max-w-sm text-3xl font-semibold leading-tight text-white">One account.<br />The right dashboard.</h2>
            <p className="max-w-sm text-sm leading-relaxed text-[#a0a0a0]">Use your name or phone number to sign in. Members open their personal account; authorized administrators open their full-control panel.</p>
            <p className="flex items-center gap-3 text-sm text-[#a0a0a0]"><ShieldCheck size={20} className="text-[#f5c518]" />Protected account access</p>
            <p className="flex items-center gap-3 text-sm text-[#a0a0a0]"><Smartphone size={20} className="text-[#f5c518]" />Your Cloud account on every device</p>
          </div>
        </header>

        {/* RIGHT SIDE - Form */}
        <section className="min-w-0 space-y-6" aria-label="Account access">
          {query.data?.settings.config.maintenance && (
            <p role="alert" className="rounded-2xl border border-[#f5c518]/30 bg-[#f5c518]/10 p-4 text-[#f5c518] text-sm">
              Maintenance is in progress. Member actions are paused.
            </p>
          )}
          
          {children}
          
          {query.data && (
            <a href={`https://wa.me/${query.data.settings.config.supportPhone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm text-[#a0a0a0] hover:text-[#f5c518]">
              <Headphones size={18} />Need help? Contact support
            </a>
          )}
        </section>
      </div>
    </main>
  );
}
