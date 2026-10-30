export type PaymentStatus = 'CREATED' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'EXPIRED' | 'REVERSED';
export interface RechargePayment {
  id: string; orderId: string; phone: string; amount: number; provider: 'mtn' | 'airtel';
  status: PaymentStatus; createdAt: string; transactionId: string | null;
}
export interface RechargeValues { phone: string; amount: number }
export type PaymentRequest = { action: 'start'; phone: string; amount: number; requestKey: string } | { action: 'current' } | { action: 'status'; id: string };
export interface PaymentResponse { payment: RechargePayment | null }
