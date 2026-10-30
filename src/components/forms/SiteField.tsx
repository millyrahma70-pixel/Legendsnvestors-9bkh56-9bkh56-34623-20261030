import type { UseFormRegisterReturn } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
interface Props { label:string; registration:UseFormRegisterReturn; error?:string; type?:string; multiline?:boolean; disabled?:boolean; autoComplete?:string }
export default function SiteField({label,registration,error,type='text',multiline=false,disabled,autoComplete}:Props) {
  const id=`field-${registration.name}`;
  const props={id,...registration,disabled,autoComplete,'aria-invalid':Boolean(error),'aria-describedby':error?`${id}-error`:undefined,className:'min-h-12 rounded-xl border-border bg-secondary text-base text-foreground focus-visible:ring-primary disabled:opacity-50'};
  return <div className="space-y-2"><Label htmlFor={id} className="text-base">{label}</Label>{multiline?<Textarea {...props}/>:<Input {...props} type={type}/>}{error&&<p id={`${id}-error`} role="alert" className="flex gap-2 text-[hsl(var(--error))]"><AlertCircle size={18} className="shrink-0 mt-1"/>{error}</p>}</div>;
}
