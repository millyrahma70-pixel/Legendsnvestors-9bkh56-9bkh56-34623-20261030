import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import SiteField from '@/components/forms/SiteField';
import { changeAccountPassword } from '@/lib/sitePassword';
const schema=z.object({oldPassword:z.string().min(1),password:z.string().min(6),confirm:z.string()}).refine(v=>v.password===v.confirm,{message:'Passwords do not match',path:['confirm']});
interface Props { email:string; disabled?:boolean }
export default function SitePasswordForm({email,disabled}:Props) {
  const {register,handleSubmit,reset,formState:{errors}}=useForm<z.infer<typeof schema>>({resolver:zodResolver(schema)});
  const mutation=useMutation({mutationFn:(v:z.infer<typeof schema>)=>changeAccountPassword(email,v.oldPassword,v.password),onSuccess:()=>{reset();toast.success('Password updated');},onError:(e:Error)=>toast.error(e.message)});
  return <form onSubmit={handleSubmit(v=>mutation.mutate(v))} className="rounded-2xl border border-border bg-card p-6 space-y-4"><h2 className="text-xl font-semibold">Update your password</h2><SiteField label="Current password" type="password" registration={register('oldPassword')} error={errors.oldPassword?.message} autoComplete="current-password"/><SiteField label="New password" type="password" registration={register('password')} error={errors.password?.message} autoComplete="new-password"/><SiteField label="Confirm new password" type="password" registration={register('confirm')} error={errors.confirm?.message} autoComplete="new-password"/><Button type="submit" disabled={mutation.isPending||disabled} className="min-h-12 rounded-xl">Save password</Button></form>;
}
