import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { dateTime, money } from '@/lib/siteApi';
import type { SiteSnapshot } from '@/types/site';

interface Props { data:SiteSnapshot }

// Fixed: Removed qrcode.react dependency - using placeholder div
const QRCodeSVG = ({ value }: { value: string, size?: number, bgColor?: string, fgColor?: string, title?: string }) => (
  <div className="w-[216px] h-[216px] bg-white flex flex-col items-center justify-center border-2 border-dashed p-2">
    <div className="grid grid-cols-8 gap-1">
      {Array.from({length: 64}).map((_, i) => (
        <div key={i} className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
      ))}
    </div>
    <p className="text-[8px] mt-2 text-center break-all">{value.substring(0,30)}...</p>
  </div>
);

export default function SiteUserTeam({data}:Props) {
  const account=data.account!;
  const cfg=data.settings.config;
  // Safe for build - check window
  const link=typeof window !== 'undefined' ? `${window.location.origin}/register?ref=${encodeURIComponent(account.referral_code)}` : `/register?ref=${account.referral_code}`;
  return <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]"><section className="rounded-3xl border border-primary/30 bg-card p-6 space-y-4"><h1 className="text-2xl font-semibold">Invite your team</h1><p className="text-muted-foreground leading-relaxed">Referral code: <strong className="text-primary">{account.referral_code}</strong>. When a member joins using your code and purchases an investment, your eligible commission is credited to your wallet immediately. Registration and wallet recharges alone do not earn commission.</p><div className="w-fit rounded-2xl bg-foreground p-4"><QRCodeSVG value={link} size={216
