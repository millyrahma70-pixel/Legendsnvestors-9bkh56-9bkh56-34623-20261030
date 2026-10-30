import type { UseFormRegisterReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
interface Props { label:string; registration:UseFormRegisterReturn; options:{value:string;label:string}[]; error?:string }
export default function SiteSelect({label,registration,options,error}:Props) {
  const id=`select-${registration.name}`;
  return <div className="space-y-2"><Label htmlFor={id} className="text-base">{label}</Label><select id={id} {...registration} className="min-h-12 w-full rounded-xl border border-border bg-secondary px-3 text-base focus-visible:outline focus-visible:outline-primary" aria-invalid={Boolean(error)}>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>{error&&<p role="alert" className="text-[hsl(var(--error))]">{error}</p>}</div>;
}
