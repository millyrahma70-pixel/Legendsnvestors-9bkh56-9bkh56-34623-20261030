import { AlertCircle, CheckCircle2, Smartphone, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { money } from '@/lib/siteApi';
import { paymentPending } from '@/lib/paymentPhone';
import { paymentStatusLabel } from '@/constants/payments';
import type { RechargePayment } from '@/types/payment';
interface Props { payment: RechargePayment; checking: boolean; onCheck: () => void }
export default function RechargePaymentStatus({ payment, checking, onCheck }: Props) {
  const pending = paymentPending(payment.status);
  const completed = payment.status === 'COMPLETED';
  const Icon = completed ? CheckCircle2 : pending ? Smartphone : AlertCircle;
  return <section aria-label="Current recharge status" aria-live="polite" className="space-y-4 rounded-2xl border border-primary/30 bg-primary/5 p-6">
    <div className="flex items-start gap-3"><Icon size={24} className={completed || pending ? 'mt-1 shrink-0 text-primary' : 'mt-1 shrink-0 text-[hsl(var(--error))]'} /><div><h2 className="text-lg font-semibold">{paymentStatusLabel(payment.status)}</h2><p className="mt-1 text-2xl font-semibold text-primary">{money(payment.amount)}</p></div></div>
    <p className="text-muted-foreground">{payment.provider === 'mtn' ? 'MTN Mobile Money' : 'Airtel Money'} · {payment.phone}</p>
    <p className="text-muted-foreground leading-relaxed">{completed ? 'PesaJet verified the payment. Your recharge has been credited to your account.' : pending ? 'Check this phone for the provider’s payment prompt. Confirm the amount there and enter your mobile-money PIN only on that prompt. Do not start a second recharge while this one is pending.' : 'This payment did not complete. No recharge amount was credited. You may start a new recharge after checking your mobile-money account.'}</p>
    {pending && <Button type="button" variant="outline" onClick={onCheck} disabled={checking} className="min-h-12 rounded-xl gap-2"><RefreshCw size={18} />{checking ? 'Checking…' : 'Check payment status'}</Button>}
    <Link to="/recharge-status" className="flex min-h-11 items-center text-primary hover:opacity-80">View recharge history</Link>
  </section>;
}
