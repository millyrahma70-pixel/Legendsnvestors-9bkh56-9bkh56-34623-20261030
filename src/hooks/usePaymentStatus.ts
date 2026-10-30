import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { paymentRequest } from '@/lib/paymentsApi';
import { paymentPending } from '@/lib/paymentPhone';

export function usePaymentStatus(id: string, initialStatus: string) {
  const { user, loading } = useAdminAuth();
  const client = useQueryClient();
  const notified = useRef('');
  const query = useQuery({
    queryKey: ['payment-status', user?.id, id], queryFn: () => paymentRequest({ action: 'status', id }),
    enabled: !loading && Boolean(user?.verified) && Boolean(id) && paymentPending(initialStatus),
    refetchInterval: query => paymentPending(query.state.data?.payment?.status ?? initialStatus) ? 15000 : false,
    staleTime: 10000, retry: false,
  });
  const status = query.data?.payment?.status ?? initialStatus;
  useEffect(() => {
    if (query.data?.payment && !paymentPending(status) && notified.current !== status) {
      notified.current = status;
      void client.invalidateQueries({ queryKey: ['site'] });
    }
  }, [status, query.data?.payment?.id, client]);
  useEffect(() => { if (query.error) toast.error(query.error.message, { id: `payment-error-${id}` }); }, [query.error, id]);
  return { ...query, status };
}
