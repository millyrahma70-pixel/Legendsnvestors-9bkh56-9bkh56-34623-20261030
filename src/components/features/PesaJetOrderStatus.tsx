import { Smartphone, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { paymentPending } from '@/lib/paymentPhone';
import { paymentStatusLabel } from '@/constants/payments';
interface Props { paymentId: string; initialStatus: string }
export default function PesaJetOrderStatus({ paymentId, initialStatus }: Props) {
  const query = usePaymentStatus(paymentId, initialStatus);
  return <section aria-live="polite" className="mt-4 space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
    <p className="flex items-center gap-2 font-semibold text-primary"><Smartphone size={18} />PesaJet · {paymentStatusLabel(query.status)}</p>
    {paymentPending(query.status) && <p className="text-muted-foreground leading-relaxed">PIN entry happens only on the provider’s phone prompt. Credit is applied automatically after PesaJet confirms payment; manual approval is disabled.</p>}
    {query.error && <p role="alert" className="flex items-start gap-2 text-[hsl(var(--error))]"><AlertCircle size={18} className="mt-1 shrink-0" />{query.error.message}</p>}
    {paymentPending(query.status) && <Button type="button" variant="outline" disabled={query.isFetching} onClick={() => void query.refetch()} className="min-h-11 gap-2 rounded-xl"><RefreshCw size={16} />{query.isFetching ? 'Checking…' : 'Check gateway status'}</Button>}
  </section>;
}
