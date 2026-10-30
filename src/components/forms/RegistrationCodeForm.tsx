import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SiteField from '@/components/forms/SiteField';
import { registrationCodeSchema } from '@/lib/siteValidations';
interface Props { email: string; busy: boolean; disabled: boolean; verified: boolean; error?: string; onSubmit: (token: string) => void }
export default function RegistrationCodeForm({ email, busy, disabled, verified, error, onSubmit }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof registrationCodeSchema>>({ resolver: zodResolver(registrationCodeSchema) });
  return <form onSubmit={handleSubmit(values => onSubmit(values.token))} className="space-y-4">
    {verified ? <p className="flex items-start gap-2 text-primary"><ShieldCheck size={20} className="mt-1 shrink-0" />Email verified. Retry account creation, or go back to correct your phone number or referral code.</p> : <>
      <p className="text-muted-foreground leading-relaxed">Enter the 4-digit code sent to <strong className="break-all text-foreground">{email}</strong>. It expires in one hour. Your password is already chosen.</p>
      <SiteField label="4-digit email verification code" type="tel" registration={register('token')} error={errors.token?.message} autoComplete="one-time-code" disabled={busy || disabled} />
    </>}
    {error && <p role="alert" className="flex gap-2 text-[hsl(var(--error))]"><AlertCircle size={18} className="mt-1 shrink-0" />{error}</p>}
    <Button type="submit" disabled={busy || disabled} className="min-h-12 w-full rounded-xl transition-transform hover:-translate-y-0.5 active:translate-y-0">{busy ? 'Creating account...' : verified ? 'Retry account creation' : 'Verify & create account'}</Button>
  </form>;
}
