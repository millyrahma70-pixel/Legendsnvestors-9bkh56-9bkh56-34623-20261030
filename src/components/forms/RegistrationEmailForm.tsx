import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import SiteField from '@/components/forms/SiteField';
import { registrationEmailSchema } from '@/lib/siteValidations';
interface Props { initialEmail: string; busy: boolean; disabled: boolean; onSubmit: (email: string) => void }
export default function RegistrationEmailForm({ initialEmail, busy, disabled, onSubmit }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof registrationEmailSchema>>({ resolver: zodResolver(registrationEmailSchema), defaultValues: { email: initialEmail } });
  return <form onSubmit={handleSubmit(values => onSubmit(values.email))} className="space-y-4">
    <p className="text-muted-foreground leading-relaxed">Verify an email you can access to activate your account and recover your password. Once activated, use your name or phone number and password to sign in on any device.</p>
    <SiteField label="Email for verification" type="email" registration={register('email')} error={errors.email?.message} autoComplete="email" disabled={busy || disabled} />
    <Button type="submit" disabled={busy || disabled} className="min-h-12 w-full rounded-xl transition-transform hover:-translate-y-0.5 active:translate-y-0">{busy ? 'Sending code...' : 'Send verification code'}</Button>
  </form>;
}
