import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import SiteField from '@/components/forms/SiteField';
import { PHONE } from '@/lib/siteValidations';
import type { SiteActionProps } from '@/types/siteActions';
const schema=z.object({phone:PHONE,referral:z.string().trim().regex(/^[A-Za-z0-9]{0,16}$/)});
export default function SiteAccountSetupForm({run,busy}:SiteActionProps) {
  const {register,handleSubmit,formState:{errors}}=useForm<z.infer<typeof schema>>({resolver:zodResolver(schema),defaultValues:{referral:''}});
  return <form onSubmit={handleSubmit(v=>{void run('enroll',v).catch(()=>{});})} className="mx-auto max-w-lg rounded-2xl border border-primary/30 bg-card p-6 space-y-4"><h1 className="text-2xl font-semibold">Complete your Cloud profile</h1><p className="text-muted-foreground leading-relaxed">Your email is verified. Add your phone number to create your shared account. Browser-only balances are not imported; the admin can reconcile past payments separately.</p><SiteField label="Phone number" type="tel" registration={register('phone')} error={errors.phone?.message}/><SiteField label="Referral code (optional)" registration={register('referral')} error={errors.referral?.message}/><Button type="submit" disabled={busy} className="min-h-12 rounded-xl">Create shared profile</Button></form>;
}
