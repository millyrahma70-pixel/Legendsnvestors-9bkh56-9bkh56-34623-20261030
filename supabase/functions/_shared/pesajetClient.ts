import { PaymentError, transactionSchema, type GatewayTransaction, type PaymentRow } from './pesajetTypes.ts';
import { normalizePaymentPhone } from './pesajetPhone.ts';

const PESAJET_API_URL = 'https://payments.pesajet.com/api/v1';
// Merchant credentials are read only here, at Edge Function runtime. Never return them or log responses/headers.
export async function gatewayRequest(path: string, body?: Record<string, unknown>): Promise<GatewayTransaction> {
  const apiKey = Deno.env.get('PESAJET_API_KEY');
  if (!apiKey) throw new PaymentError('PesaJet payments are not configured. Please contact support.', 503);
  let response: Response;
  try {
    response = await fetch(`${PESAJET_API_URL}${path}`, {
      method: body ? 'POST' : 'GET', redirect: 'error',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
      ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(12000),
    });
  } catch {
    throw new PaymentError('PesaJet could not be reached. Check the existing payment status; do not submit another recharge.');
  }
  if (!response.ok) {
    console.error('PesaJet request rejected', { status: response.status, method: body ? 'POST' : 'GET' });
    const message = response.status === 401 || response.status === 403
      ? 'PesaJet did not authorize the merchant account. Contact support to verify the payment credentials.'
      : response.status === 429 ? 'PesaJet is busy. Wait a moment and check this payment again.'
      : 'PesaJet could not confirm this request. Check its status or contact support before attempting another payment.';
    throw new PaymentError(message);
  }
  const raw: unknown = await response.json().catch(() => null);
  const parsed = transactionSchema.safeParse(raw);
  if (!parsed.success) throw new PaymentError('PesaJet returned an unrecognized payment response. No balance was credited; contact support.');
  return parsed.data;
}
export function verifyGatewayPayment(transaction: GatewayTransaction, payment: PaymentRow) {
  if (transaction.amount !== payment.amount || transaction.currency !== 'UGX' || transaction.provider !== payment.provider ||
      normalizePaymentPhone(transaction.phoneNumber) !== payment.phone || transaction.reference !== `LEGEND-${payment.id}` ||
      (payment.transaction_id && transaction.transactionId !== payment.transaction_id)) {
    console.error('PesaJet payment details did not match', { paymentId: payment.id });
    throw new PaymentError('Payment details could not be verified. No balance was credited; contact support.', 409);
  }
}
