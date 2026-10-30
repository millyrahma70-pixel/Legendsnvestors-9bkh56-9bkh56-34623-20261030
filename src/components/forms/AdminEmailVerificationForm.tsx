import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminFormField from '@/components/forms/AdminFormField';
import { adminVerificationSchema, type AdminVerificationValues } from '@/lib/adminValidations';
import { ADMIN_LOGIN_NUMBER, ADMIN_OTP_LENGTH } from '@/constants/admin';

interface Props {
  onSubmit: (values: AdminVerificationValues) => void;
  busy: boolean;
  error?: string;
}
export default function AdminEmailVerificationForm({ onSubmit, busy, error }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<AdminVerificationValues>({ resolver: zodResolver(adminVerificationSchema), defaultValues: { token: '', password: '', confirm: '' } });
  return <form noValidate aria-busy={busy} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    <p className="text-muted-foreground leading-relaxed">Enter your email code and choose the password you want to use with {ADMIN_LOGIN_NUMBER}. Passwords are saved securely in Cloud, not in this website’s code.</p>
    <AdminFormField label={`${ADMIN_OTP_LENGTH}-digit verification code`} type="text" registration={register('token')} error={errors.token?.message} autoComplete="one-time-code" disabled={busy} />
    <AdminFormField label="New admin password" registration={register('password')} error={errors.password?.message} autoComplete="new-password" disabled={busy} />
    <AdminFormField label="Confirm new password" registration={register('confirm')} error={errors.confirm?.message} autoComplete="new-password" disabled={busy} />
    {error && <p role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-[hsl(var(--error))]"><AlertCircle size={20} className="mt-1 shrink-0" aria-hidden="true" />{error}</p>}
    <Button type="submit" disabled={busy} className="h-12 w-full rounded-xl font-semibold transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:transform-none disabled:opacity-50">
      {busy ? 'Verifying and saving…' : 'Verify code and save password'}
    </Button>
  </form>;
}
