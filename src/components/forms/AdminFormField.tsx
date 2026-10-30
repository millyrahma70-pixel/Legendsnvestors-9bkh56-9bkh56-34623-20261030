import type { UseFormRegisterReturn } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  label: string;
  registration: UseFormRegisterReturn;
  type?: 'password' | 'text' | 'tel';
  disabled?: boolean;
  error?: string;
  autoComplete?: string;
}

export default function AdminFormField({ label, registration, type = 'password', error, autoComplete, disabled }: Props) {
  const id = `admin-${registration.name}`;
  return <div className="space-y-2">
    <Label htmlFor={id} className="text-base text-foreground">{label}</Label>
    <Input id={id} type={type} {...registration} disabled={disabled} autoComplete={autoComplete} inputMode={registration.name === 'token' ? 'numeric' : type === 'tel' ? 'tel' : undefined}
      className="h-12 rounded-xl bg-secondary text-base text-foreground border-border focus-visible:ring-primary disabled:opacity-50"
      aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
    {error && <p id={`${id}-error`} role="alert" className="flex gap-2 text-base text-[hsl(var(--error))]"><AlertCircle size={18} className="shrink-0 mt-1" />{error}</p>}
  </div>;
}
