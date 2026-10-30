import { Smartphone, Tablet, Monitor, Clock, UserRound } from 'lucide-react';
import type { JoiningRecord } from '@/types/admin';

interface Props { record: JoiningRecord }

export default function AdminJoiningRecord({ record }: Props) {
  const DeviceIcon = record.device_type === 'Mobile' ? Smartphone : record.device_type === 'Tablet' ? Tablet : Monitor;
  return <article className="rounded-2xl border border-border bg-card p-4 transition-transform hover:-translate-y-0.5">
    <div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-semibold text-foreground">{record.phone}</h3><p className="mt-1 text-muted-foreground">Unverified phone · joining report</p></div><UserRound size={22} className="text-primary shrink-0" /></div>
    <dl className="mt-4 grid gap-3 text-base">
      <div className="flex items-center justify-between gap-3"><dt className="flex items-center gap-2 text-muted-foreground"><DeviceIcon size={18} />Device</dt><dd>{record.device_type}</dd></div>
      <div><dt className="flex items-center gap-2 text-muted-foreground"><Clock size={18} />Joined (reported)</dt><dd className="mt-1">{new Date(record.reported_joined_at).toLocaleString()}</dd></div>
      <div><dt className="text-muted-foreground">Received by cloud</dt><dd className="mt-1">{new Date(record.received_at).toLocaleString()}</dd></div>
      <div className="flex items-center justify-between gap-3"><dt className="text-muted-foreground">Referral code</dt><dd className="font-semibold text-primary">{record.referral_code}</dd></div>
      {record.referred_by_code && <div className="flex items-center justify-between gap-3"><dt className="text-muted-foreground">Invited by</dt><dd>{record.referred_by_code}</dd></div>}
    </dl>
    <p className="mt-4 border-t border-border pt-3 text-muted-foreground">{record.source === 'existing' ? 'Existing account reported from this browser' : 'New registration report'}</p>
  </article>;
}
