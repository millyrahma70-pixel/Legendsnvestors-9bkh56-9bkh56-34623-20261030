import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import RegistrationEmailForm from '@/components/forms/RegistrationEmailForm';
import RegistrationCodeForm from '@/components/forms/RegistrationCodeForm';
import { sendAccountOtp } from '@/lib/siteAuth';
import { useRegistrationVerification } from '@/hooks/useRegistrationVerification';
import type { RegistrationValues } from '@/lib/siteValidations';
interface Props { values: RegistrationValues; disabled: boolean; onBack: () => void }
export default function RegistrationVerification({ values, disabled, onBack }: Props) {
  const [email, setEmail] = useState('');
  const [lastEmail, setLastEmail] = useState('');
  const { save, verified } = useRegistrationVerification(email, values);
  const send = useMutation({
    mutationFn: async (value: string) => { await sendAccountOtp(value, true); return value; },
    onSuccess: value => { setEmail(value); setLastEmail(value); save.reset(); toast.success('Verification code sent. Check your email.'); },
    onError: (error: Error) => toast.error(error.message),
    retry: false,
  });
  const busy = send.isPending || save.isPending;
  return <section className="space-y-4" aria-label="Registration email verification">
    <p className="font-semibold text-primary">Step 2 of 2 · Email verification</p>
    <h2 className="text-2xl font-semibold">Finish your registration</h2>
    <p className="rounded-xl border border-border bg-secondary p-4 text-muted-foreground"><strong className="text-foreground">{values.name}</strong><br />{values.phone}</p>
    {email ? <RegistrationCodeForm email={email} busy={busy} disabled={disabled} verified={verified} error={save.error?.message} onSubmit={token => save.mutate(token)} /> : <RegistrationEmailForm initialEmail={lastEmail} busy={busy} disabled={disabled} onSubmit={value => send.mutate(value)} />}
    {email && !verified && <Button type="button" variant="ghost" className="min-h-11 w-full" disabled={busy || disabled} onClick={() => setEmail('')}>Change email or request a new code</Button>}
    <Button type="button" variant="ghost" className="min-h-11 w-full" disabled={busy} onClick={onBack}>Back to account details</Button>
  </section>;
}
