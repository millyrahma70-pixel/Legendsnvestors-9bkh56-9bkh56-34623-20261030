import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import SiteField from '@/components/forms/SiteField';
import AccountVerificationForm from '@/components/forms/AccountVerificationForm';
import { sendAccountOtp } from '@/lib/siteAuth';
const schema=z.object({email:z.string().trim().email()});
export default function AccountRecoveryForm() {
  const [email,setEmail]=useState('');
  const {register,handleSubmit,formState:{errors}}=useForm<z.infer<typeof schema>>({resolver:zodResolver(schema)});
  const send=useMutation({mutationFn:async(v:z.infer<typeof schema>)=>{await sendAccountOtp(v.email);return v.email;},onSuccess:value=>{setEmail(value);toast.success('If the account exists, verification has been sent');},onError:(e:Error)=>toast.error(e.message)});
  if(email)return <div className="space-y-4"><AccountVerificationForm email={email}/><Button variant="ghost" className="min-h-11" onClick={()=>setEmail('')}>Request a new code</Button></div>;
  return <form onSubmit={handleSubmit(v=>send.mutate(v))} className="space-y-4"><h2 className="text-2xl font-semibold">Reset your password</h2><p className="text-muted-foreground leading-relaxed">Verify your registered email to choose a new password. Admins can send this code too, but cannot read it or your password.</p><SiteField label="Registered email" type="email" registration={register('email')} error={errors.email?.message}/><Button type="submit" disabled={send.isPending} className="min-h-12 w-full rounded-xl">{send.isPending?'Sending...':'Send reset verification'}</Button></form>;
}
