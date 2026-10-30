import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import SiteField from '@/components/forms/SiteField';
import { adjustmentSchema } from '@/lib/siteValidations';
import type { SiteActionProps } from '@/types/siteActions';
interface Props extends SiteActionProps { userId:string }
export default function SiteAccountAdjustmentForm({userId,run,busy}:Props) {
  const {register,handleSubmit,reset,formState:{errors}}=useForm<z.infer<typeof adjustmentSchema>>({resolver:zodResolver(adjustmentSchema)});
  return <form onSubmit={handleSubmit(values=>{void run('adjust',{user_id:userId,...values}).then(()=>reset()).catch(()=>{});})} className="space-y-4"><h3 className="text-lg font-semibold">Adjust balance</h3><p className="text-muted-foreground leading-relaxed">Positive amounts credit, negative amounts deduct. Cloud rejects deductions exceeding the balance. Record the reason for reconciliation.</p><SiteField label="Adjustment (UGX)" type="number" registration={register('amount',{valueAsNumber:true})} error={errors.amount?.message}/><SiteField label="Reason" registration={register('note')} error={errors.note?.message}/><Button type="submit" disabled={busy} className="min-h-12 rounded-xl">{busy?'Saving...':'Record adjustment'}</Button></form>;
}
