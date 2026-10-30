import { Gift } from 'lucide-react';
import { money } from '@/lib/siteApi';
interface Props { amount: number }
export default function RegistrationBonus({ amount }: Props) {
  return <aside className="flex items-center gap-4 rounded-3xl border border-primary/30 bg-primary/10 p-4 sm:p-6" aria-label="Registration bonus">
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground"><Gift size={26} strokeWidth={1.8} aria-hidden="true" /></span>
    <div><p className="text-lg font-semibold">Registration Bonus</p><p className="text-xl font-bold text-primary">{money(amount)} credited on activation</p></div>
  </aside>;
}
