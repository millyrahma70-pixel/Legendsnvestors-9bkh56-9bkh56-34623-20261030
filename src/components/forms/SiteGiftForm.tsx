import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Plus, Gift } from 'lucide-react';
import SiteField from '@/components/forms/SiteField';
import { giftSchema } from '@/lib/siteValidations';
import type { SiteActionProps } from '@/types/siteActions';
export default function SiteGiftForm({run,busy}:SiteActionProps) {
  const {register,handleSubmit,reset,formState:{errors}}=useForm<z.infer<typeof giftSchema>>({resolver:zodResolver(giftSchema),defaultValues:{code:'',note:''}});
  return <form onSubmit={handleSubmit(values=>{void run('giftCreate',values).then(()=>reset()).catch(()=>{});})} className="space-y-5 self-start rounded-3xl border border-primary/25 bg-card p-5 sm:p-6"><h3 className="flex items-center gap-3 text-xl font-semibold"><Plus size={24} className="text-primary"/>Create New Code</h3><p className="text-base text-muted-foreground leading-relaxed">Share a one-use reward with a member. Codes expire 30 minutes after creation and work across every device.</p><SiteField label="Custom code (optional)" registration={register('code')} error={errors.code?.message}/><SiteField label="Reward amount (UGX)" type="number" registration={register('amount',{valueAsNumber:true})} error={errors.amount?.message}/><SiteField label="Note (optional)" registration={register('note')} error={errors.note?.message}/><Button type="submit" disabled={busy} className="min-h-12 w-full gap-2 rounded-xl text-base font-semibold transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:transform-none"><Gift size={18}/>{busy?'Saving…':'Create Redeem Code'}</Button></form>;
}
