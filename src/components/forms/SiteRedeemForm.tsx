import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import SiteField from '@/components/forms/SiteField';
import type { SiteActionProps } from '@/types/siteActions';
const schema=z.object({code:z.string().trim().regex(/^[A-Za-z0-9]{4,24}$/,'Enter the gift code shared by admin')});
export default function SiteRedeemForm({run,busy}:SiteActionProps) {
  const {register,handleSubmit,reset,formState:{errors}}=useForm<z.infer<typeof schema>>({resolver:zodResolver(schema)});
  return <form onSubmit={handleSubmit(v=>{void run('redeem',v).then(()=>reset()).catch(()=>{});})} className="rounded-2xl border border-primary/30 bg-card p-6 space-y-4"><h1 className="text-2xl font-semibold">Redeem a gift code</h1><p className="text-muted-foreground leading-relaxed">Use a code shared by the administrator. Codes expire 30 minutes after creation and can be used once across all devices.</p><SiteField label="Gift code" registration={register('code')} error={errors.code?.message}/><Button type="submit" disabled={busy} className="min-h-12 rounded-xl">Redeem reward</Button></form>;
}
