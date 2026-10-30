import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import SiteField from '@/components/forms/SiteField';
import { verificationSchema } from '@/lib/siteValidations';
import { verifyAccountPassword, registerAccount } from '@/lib/siteAuth';
interface Props { email:string; registration?:{phone:string;referral:string} }
export default function AccountVerificationForm({email,registration}:Props) {
  const navigate=useNavigate();
  const {register,handleSubmit,formState:{errors}}=useForm<z.infer<typeof verificationSchema>>({resolver:zodResolver(verificationSchema)});
  const verify=useMutation({mutationFn:async(v:z.infer<typeof verificationSchema>)=>{if(registration)await registerAccount({email,...registration,token:v.token,password:v.password});else await verifyAccountPassword(email,v.token,v.password);},onSuccess:()=>{toast.success(registration?'Verified account created':'Password updated');navigate('/home',{replace:true});},onError:(e:Error)=>toast.error(e.message)});
  return <form onSubmit={handleSubmit(v=>verify.mutate(v))} className="space-y-4"><h2 className="text-2xl font-semibold">Verify your email</h2><p className="text-muted-foreground leading-relaxed">Enter the 4-digit code sent to <strong className="text-foreground break-all">{email}</strong> and choose a password. The code expires in one hour.</p><SiteField label="4-digit verification code" registration={register('token')} error={errors.token?.message} autoComplete="one-time-code"/><SiteField label="New password (at least 6 characters)" type="password" registration={register('password')} error={errors.password?.message} autoComplete="new-password"/><SiteField label="Confirm password" type="password" registration={register('confirm')} error={errors.confirm?.message} autoComplete="new-password"/><Button type="submit" disabled={verify.isPending} className="min-h-12 w-full rounded-xl">{verify.isPending?'Verifying...':registration?'Verify & create account':'Verify & save password'}</Button></form>;
}
