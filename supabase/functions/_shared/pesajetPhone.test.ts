import { normalizePaymentPhone, paymentProvider } from './pesajetPhone.ts';
import { verifyGatewayPayment } from './pesajetClient.ts';
import type { GatewayTransaction, PaymentRow } from './pesajetTypes.ts';

Deno.test('Ugandan payment numbers normalize consistently and route supported prefixes', () => {
  const examples = ['0771234567', '771234567', '256771234567', '+256771234567', '+256 771 234 567'];
  for (const value of examples) {
    if (normalizePaymentPhone(value) !== '+256771234567') throw new Error('Phone normalization failed');
  }
  if (paymentProvider(normalizePaymentPhone('0791234567')) !== 'mtn') throw new Error('MTN routing failed');
  if (paymentProvider(normalizePaymentPhone('0741234567')) !== 'airtel') throw new Error('Airtel routing failed');
  if (paymentProvider(normalizePaymentPhone('0731234567')) !== null) throw new Error('Ambiguous numbers must not be routed');
  if (paymentProvider(normalizePaymentPhone('123')) !== null) throw new Error('Invalid numbers must not be routed');
});
Deno.test('Gateway confirmation must match reference, amount, phone, provider and transaction identity', () => {
  const payment: PaymentRow = { id: 'b9c02293-8057-42ad-a207-f2dd6dfbf229', user_id: 'd7c02293-8057-42ad-a207-f2dd6dfbf229', order_id: 'd8c02293-8057-42ad-a207-f2dd6dfbf229', request_key: 'd9c02293-8057-42ad-a207-f2dd6dfbf229', phone: '+256771234567', amount: 30000, provider: 'mtn', transaction_id: 'txn-1', status: 'PENDING', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  const transaction: GatewayTransaction = { transactionId: 'txn-1', status: 'COMPLETED', amount: 30000, currency: 'UGX', phoneNumber: '+256771234567', provider: 'mtn', reference: `LEGEND-${payment.id}` };
  verifyGatewayPayment(transaction, payment);
  for (const mismatch of [{ amount: 30001 }, { reference: 'other' }, { phoneNumber: '+256771234568' }, { provider: 'airtel' as const }, { transactionId: 'txn-2' }]) {
    let rejected = false;
    try { verifyGatewayPayment({ ...transaction, ...mismatch }, payment); } catch { rejected = true; }
    if (!rejected) throw new Error('Unmatched payment was accepted');
  }
});
