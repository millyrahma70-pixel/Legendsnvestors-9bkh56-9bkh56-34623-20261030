import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SiteField from '@/components/forms/SiteField';
import RechargePaymentStatus from '@/components/features/RechargePaymentStatus';
import { rechargeSchema } from '@/lib/siteValidations';
import { useRechargePayment } from '@/hooks/useRechargePayment';
import { paymentProvider } from '@/lib/paymentPhone';
import { money } from '@/lib/siteApi';
import { QUICK_RECHARGE_AMOUNTS } from '@/constants/payments';
import { cn } from '@/lib/utils';
import type { RechargeValues } from '@/types/payment';
import type { SiteSnapshot } from '@/types/site';
import type { SiteActionProps } from '@/types/siteActions';
interface Props extends SiteActionProps { data: SiteSnapshot }
export default function SiteRechargeForm({ data, busy }: Props) {
  const cfg = data.settings.config;
  const minimum = Math.max(30000, cfg.minDeposit);
  const api = useRechargePayment();
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<RechargeValues>({ resolver: zodResolver(rechargeSchema.refine(v => v.amount >= minimum, { message: `Minimum recharge is ${money(minimum)}`, path: ['amount'] })), defaultValues: { amount: minimum, phone: data.account!.phone } });
  const network = paymentProvider(watch('phone'));
  const selectedAmount = watch('amount');
  const locked = busy || api.active || api.start.isPending || api.query.isPending || api.query.isError || !cfg.rechargeOpen;
  const error = api.query.error?.message || (!api.payment?.transactionId ? api.start.error?.message : undefined);
  useEffect(() => { if (api.payment && api.active) reset({ phone: api.payment.phone, amount: api.payment.amount }); }, [api.payment?.id, api.active, reset]);
  return <div className="space-y-6">
    <form noValidate aria-busy={api.start.isPending} onSubmit={handleSubmit(values => api.start.mutate(values))} className="space-y-5 rounded-2xl border border-primary/30 bg-card p-6">
      <div><p className="mb-2 flex items-center gap-2 font-semibold text-primary"><Smartphone size={20} />Mobile-money recharge</p><h1 className="text-2xl font-semibold">Recharge your account</h1><p className="mt-3 text-muted-foreground leading-relaxed">Enter your number and amount. Confirm payment on your phone, not on this website.</p></div>
      <div><p className="mb-3 text-base font-medium">Quick amounts</p><div className="grid grid-cols-2 gap-3">{QUICK_RECHARGE_AMOUNTS.filter(value => value >= minimum).map(value => <Button key={value} type="button" variant="outline" aria-pressed={selectedAmount === value} disabled={locked} onClick={() => setValue('amount', value, { shouldValidate: true })} className={cn('min-h-12 rounded-xl text-base font-semibold transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:transform-none', selectedAmount === value ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-secondary text-muted-foreground')}>{value.toLocaleString()}</Button>)}</div></div>
      <SiteField label="Recharge amount (UGX)" type="number" registration={register('amount', { valueAsNumber: true })} error={errors.amount?.message} disabled={locked} />
      <p className="text-muted-foreground">Minimum recharge: <strong className="font-semibold text-primary">{money(minimum)}</strong></p>
      <SiteField label="Mobile-money phone number" type="tel" registration={register('phone')} error={errors.phone?.message} autoComplete="tel" disabled={locked} />
      <p className="text-muted-foreground">{network ? `Detected automatically: ${network === 'mtn' ? 'MTN Mobile Money' : 'Airtel Money'}` : 'Use 0771234567 or +256771234567. MTN and Airtel are detected automatically.'}</p>
      {error && <p role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-[hsl(var(--error))]"><AlertCircle size={20} className="mt-1 shrink-0" />{error}</p>}
      {api.query.isPending && <p role="status" className="text-muted-foreground">Checking for an existing recharge…</p>}
      <Button type="submit" disabled={locked} className="min-h-12 w-full rounded-xl text-base font-semibold transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:transform-none disabled:opacity-50">{api.start.isPending ? 'Requesting phone prompt…' : api.active ? 'Waiting for payment confirmation' : 'Confirm recharge'}</Button>
      {api.query.isError && <Button type="button" variant="outline" disabled={api.query.isFetching} onClick={() => void api.query.refetch()} className="min-h-12 w-full rounded-xl">{api.query.isFetching ? 'Checking…' : 'Retry payment status'}</Button>}
      {!cfg.rechargeOpen && <p role="status" className="text-muted-foreground">New recharges are temporarily paused. Existing payments can still be checked.</p>}
    </form>
    {api.payment && <RechargePaymentStatus payment={api.payment} checking={api.query.isFetching} onCheck={() => void api.query.refetch()} />}
  </div>;
}
