import { useState } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { AlertCircle, Eye, EyeOff, LockKeyhole, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface Props {
  label: string;
  registration: UseFormRegisterReturn;
  password?: boolean;
  disabled?: boolean;
  error?: string;
}
export default function AdminLoginField({ label, registration, password = false, disabled, error }: Props) {
  const [visible, setVisible] = useState(false);
  const id = `admin-login-${registration.name}`;
  const Icon = password ? LockKeyhole : Phone;
  return <div className="space-y-3">
    <Label htmlFor={id} className="text-base font-normal text-muted-foreground sm:text-lg">{label}</Label>
    <div className="relative">
      <Icon size={22} strokeWidth={1.75} aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input {...registration} id={id} type={password ? (visible ? 'text' : 'password') : 'tel'} disabled={disabled}
        autoComplete={password ? 'current-password' : 'username'} inputMode={password ? undefined : 'tel'}
        placeholder={password ? 'Enter password' : '07XXXXXXXX'} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined}
        className="h-16 rounded-2xl border-border bg-secondary pl-14 pr-16 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-primary disabled:opacity-50 sm:text-lg" />
      {password && <Button type="button" variant="ghost" size="icon" disabled={disabled} aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible}
        onClick={() => setVisible(value => !value)} className="absolute right-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary focus-visible:ring-primary">
        {visible ? <EyeOff size={22} aria-hidden="true" /> : <Eye size={22} aria-hidden="true" />}
      </Button>}
    </div>
    {error && <p id={`${id}-error`} role="alert" className="flex items-start gap-2 text-base text-[hsl(var(--error))]"><AlertCircle size={18} className="mt-1 shrink-0" aria-hidden="true" />{error}</p>}
  </div>;
}
