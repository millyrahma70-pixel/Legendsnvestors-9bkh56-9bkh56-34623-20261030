import { useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { paymentRequest } from '@/lib/paymentsApi';
import { normalizePaymentPhone, paymentPending } from '@/lib/paymentPhone';
import type { RechargeValues } from '@/types/payment';

export function useRechargePayment() {
  const { user, loading } = useAdminAuth();
  const client = useQueryClient();
  const keys = useRef(new Map<string, string>());
  const previous = useRef<{ id: string; status: string }>();
  const queryKey = ['recharge-payment', user?.id];
  const query = useQuery({
    queryKey, queryFn: () => paymentRequest({ action: 'current' }), enabled: !loading && Boolean(user?.verified),
    refetchInterval: query => paymentPending(query.state.data?.payment?.status) || query.state.error ? 10000 : false,
    staleTime: 5000, retry: false,
  });
  const payment = query.data?.payment;
  useEffect(() => {
    if (payment && previous.current?.id === payment.id && paymentPending(previous.current.status) && !paymentPending(payment.status)) {
      if (payment.status === 'COMPLETED') toast.success(`UGX ${payment.amount.toLocaleString()} recharge confirmed and credited`);
      else toast.error('The payment did not complete. No recharge amount was credited.');
      void client.invalidateQueries({ queryKey: ['site'] });
      keys.current.clear();
    }
    if (payment) previous.current = { id: payment.id, status: payment.status };
  }, [payment?.id, payment?.status, client]);
  const start = useMutation({
    mutationFn: (values: RechargeValues) => {
      const payload = { phone: normalizePaymentPhone(values.phone), amount: values.amount };
      const fingerprint = JSON.stringify(payload);
      const requestKey = keys.current.get(fingerprint) || crypto.randomUUID();
      keys.current.set(fingerprint, requestKey);
      return paymentRequest({ action: 'start', ...payload, requestKey });
    },
    onSuccess: result => {
      keys.current.clear();
      if (result.payment) previous.current = { id: result.payment.id, status: result.payment.status };
      client.setQueryData(queryKey, result);
      void client.invalidateQueries({ queryKey: ['site'] });
      if (result.payment?.status === 'COMPLETED') toast.success('PesaJet confirmed your recharge and credited your balance.');
      else if (paymentPending(result.payment?.status)) toast.success('Recharge request saved. Check your phone for the mobile-money prompt.');
      else toast.error('Payment did not complete. No recharge amount was credited.');
    },
    onError: (error: Error) => { toast.error(error.message); void client.invalidateQueries({ queryKey }); },
    retry: false,
  });
  useEffect(() => { if (query.error) toast.error(query.error.message, { id: 'recharge-status-error' }); }, [query.error]);
  return { query, start, payment, active: paymentPending(payment?.status) };
}
