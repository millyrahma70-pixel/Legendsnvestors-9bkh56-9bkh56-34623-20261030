import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import SiteField from '@/components/forms/SiteField';
import SiteSelect from '@/components/forms/SiteSelect';
import { reviewSchema } from '@/lib/siteValidations';
import type { SiteOrder } from '@/types/site';
import type { SiteActionProps } from '@/types/siteActions';
interface Props extends SiteActionProps { order:SiteOrder }
export default function SiteOrderReviewForm({order,run,busy}:Props) {
  const [review,setReview]=useState<z.infer<typeof reviewSchema>|null>(null);
  const {register,handleSubmit,formState:{errors}}=useForm<z.infer<typeof reviewSchema>>({resolver:zodResolver(reviewSchema),defaultValues:{decision:'approved',note:''}});
  return <><form onSubmit={handleSubmit(setReview)} className="mt-4 space-y-4 rounded-xl bg-secondary p-4"><SiteSelect label="Review decision" registration={register('decision')} options={[{value:'approved',label:'Approve'},{value:'rejected',label:'Reject'}]}/><SiteField label="Payment verification / rejection note" registration={register('note')} error={errors.note?.message}/><Button type="submit" disabled={busy} className="min-h-12 rounded-xl">Review decision</Button></form><AlertDialog open={Boolean(review)} onOpenChange={open=>{if(!open)setReview(null);}}><AlertDialogContent className="rounded-2xl"><AlertDialogHeader><AlertDialogTitle>Confirm {review?.decision==='approved'?'approval':'rejection'}?</AlertDialogTitle><AlertDialogDescription className="text-base leading-relaxed">{order.kind==='withdrawal'?'Approve only after sending the mobile-money payout. Rejection refunds the reserved amount exactly once.':'Approve only after confirming the payment reached the receiving account. Approval credits the balance and referral commissions exactly once.'}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction disabled={busy} onClick={()=>{if(review)void run('review',{id:order.id,...review}).then(()=>setReview(null)).catch(()=>{});}}>Confirm decision</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></>;
}
