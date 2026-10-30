import { useState } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { AlertCircle, Eye, EyeOff, type LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
interface Props { label: string; registration: UseFormRegisterReturn; icon: LucideIcon; error?: string; type?: string; placeholder?: string; autoComplete?: string; disabled?: boolean; highlighted?: boolean }
export default function AuthField({ label, registration, icon: Icon, error, type = 'text', placeholder, autoComplete, disabled, highlighted }: Props) {
  const [visible, setVisible] = useState(false);
  const id = `auth-${registration.name}`;
  const password = type === 'password';
  return <div className="space-y-2">
    <Label htmlFor={id} className="text-base font-medium text-muted-foreground">{label}</Label>
    <div className="relative">
      <Icon size={21} aria-hidden="true" className={cn('pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground', highlighted && 'text-primary')} />
      <Input id={id} {...registration} type={password && visible ? 'text' : type} placeholder={placeholder} autoComplete={autoComplete} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={cn('h-16 rounded-2xl border-border bg-secondary pl-12 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-primary disabled:opacity-50', password && 'pr-16', highlighted && 'border-primary')} />
      {password && <Button type="button" variant="ghost" disabled={disabled} onClick={() => setVisible(value => !value)} aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} aria-pressed={visible} className="absolute right-2 top-1/2 h-11 w-11 -translate-y-1/2 rounded-xl p-0 text-muted-foreground hover:bg-background hover:text-primary">{visible ? <EyeOff size={21} /> : <Eye size={21} />}</Button>}
    </div>
    {error && <p id={`${id}-error`} role="alert" className="flex items-start gap-2 text-base text-[hsl(var(--error))]"><AlertCircle size={18} className="mt-1 shrink-0" aria-hidden="true" />{error}</p>}
  </div>;
}
