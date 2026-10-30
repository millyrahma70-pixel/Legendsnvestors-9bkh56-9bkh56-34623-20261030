import type { PaymentStatus } from '@/types/payment';
export const QUICK_RECHARGE_AMOUNTS = [30000, 90000, 150000, 300000];
export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  CREATED: 'Connecting to PesaJet', PENDING: 'Awaiting phone confirmation', PROCESSING: 'Processing payment',
  COMPLETED: 'Payment confirmed', FAILED: 'Payment unsuccessful', EXPIRED: 'Phone prompt expired', REVERSED: 'Payment reversed',
};
export const paymentStatusLabel = (status: string) => PAYMENT_STATUS_LABELS[status as PaymentStatus] || 'Awaiting gateway verification';
