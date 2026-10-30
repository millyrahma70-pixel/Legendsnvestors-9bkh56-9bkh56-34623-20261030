import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { dateTime, money } from '@/lib/siteApi';
import type { SiteSnapshot } from '@/types/site';

interface Props { data:SiteSnapshot }

export default function SiteUserTeam({data}:Props) {
  const account=data.account!;
  const cfg=data.settings.config;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const link = `${origin}/register?ref=${encodeURIComponent(account.referral_code)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=216x216&data=${encodeURIComponent(link)}`;

  return <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]"><section className="rounded-3xl border border-primary/30 bg-card p-6 space-y-4"><h1 className="text-2xl font-semibold">Invite your team</h1><p className="text-muted-foreground leading-relaxed">Referral code: <strong className="text-primary">{account.referral_code}</strong>. When a member joins using your code and purchases an investment, your eligible commission is credited to your wallet immediately.</p><div className="w-fit rounded-2xl bg-foreground p-4"><img src={qrUrl} alt="Your referral QR" width={216} height={216} className="rounded-lg" /></div><p className="break-all rounded-xl bg-secondary p-4">{link}</p><Button className="min-h-12 rounded-xl" onClick={()=>{void navigator.clipboard.writeText(link).then(()=>toast.success('Referral link copied')).catch(()=>toast.error('Copy failed.'));}}>Copy invite link</Button><div className="flex flex-wrap gap-3"><a href={`https://wa.me/?text=${encodeURIComponent(`Join ${cfg.siteName}: ${link}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-border px-4 text-primary hover:bg-primary/10">WhatsApp</a><a href={`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(`Join ${cfg.siteName}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-border px-4 text-primary hover
