import { AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminEmailVerificationForm from '@/components/forms/AdminEmailVerificationForm';
import { useAdminRecovery } from '@/hooks/useAdminRecovery';
import { ADMIN_EMAIL } from '@/constants/admin';

export default function AdminPasswordRecovery() {
  const { sent, cooldown, send, save } = useAdminRecovery();
  const busy = send.isPending || save.isPending;
  return <div className="space-y-6">
    <div className="rounded-2xl border border-border bg-secondary p-5">
      <p className="text-muted-foreground">Code delivery address</p>
      <p className="mt-2 flex items-center gap-2 break-all font-medium text-primary"><Mail size={20} className="shrink-0" aria-hidden="true" />{ADMIN_EMAIL}</p>
      <p className="mt-3 text-muted-foreground">Only access to this admin mailbox can authorize a password reset. Check your spam folder if the code does not arrive.</p>
    </div>
    {sent && <AdminEmailVerificationForm busy={busy} error={save.error?.message} onSubmit={values => save.mutate(values)} />}
    {send.isError && <p role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-[hsl(var(--error))]"><AlertCircle size={20} aria-hidden="true" className="mt-1 shrink-0" />{send.error.message}</p>}
    <Button type="button" variant={sent ? 'outline' : 'default'} onClick={() => send.mutate()} disabled={busy || cooldown > 0} className="min-h-12 w-full rounded-xl text-base font-semibold disabled:opacity-50">
      {send.isPending ? 'Requesting code…' : cooldown > 0 ? `Request another code in ${cooldown}s` : sent ? 'Resend verification code' : 'Send verification code'}
    </Button>
    {sent && <p role="status" className="text-base text-muted-foreground">Use the newest code. It expires after one hour; requesting another code may invalidate the previous one.</p>}
  </div>;
}
