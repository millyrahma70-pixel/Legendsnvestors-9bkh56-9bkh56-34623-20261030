import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import { gatewayRequest, verifyGatewayPayment } from './pesajetClient.ts';
import { isPendingPayment, paymentRowSchema, PaymentError, type PaymentRow } from './pesajetTypes.ts';

async function recordPayment(client: SupabaseClient, payment: PaymentRow, transactionId: string, status: string) {
  const { data, error } = await client.rpc('legend_pesajet_record', { p_id: payment.id, p_transaction: transactionId, p_status: status });
  if (error) { console.error('PesaJet settlement failed', { paymentId: payment.id, code: error.code }); throw new PaymentError('Payment verification could not be saved. Check this same payment again.', 409); }
  return paymentRowSchema.parse(data);
}
export async function syncPayment(client: SupabaseClient, payment: PaymentRow): Promise<PaymentRow> {
  if (!isPendingPayment(payment.status)) return payment;
  const { data: claimed, error: claimError } = await client.rpc('legend_pesajet_claim', { p_id: payment.id });
  if (claimError) throw new PaymentError('Payment status is unavailable. Please retry.', 503);
  if (!claimed) {
    const { data, error } = await client.from('legend_pesajet_payments').select('*').eq('id', payment.id).single();
    if (error) throw new PaymentError('Payment status is unavailable. Please retry.', 503);
    return paymentRowSchema.parse(data);
  }
  let saved = payment;
  if (!saved.transaction_id) {
    // PesaJet guarantees replay deduplication for 24 hours. Never replay an uncertain charge after that window.
    if (Date.now() - new Date(saved.created_at).getTime() > 23 * 3600000) throw new PaymentError('This payment needs support reconciliation. Do not start another recharge for it.', 409);
    const transaction = await gatewayRequest('/payments', {
      type: 'COLLECTION', amount: saved.amount, currency: 'UGX', phoneNumber: saved.phone, provider: saved.provider,
      reference: `LEGEND-${saved.id}`, idempotencyKey: `legend-${saved.id}`, description: 'Legend Investors account recharge',
    });
    verifyGatewayPayment(transaction, saved);
    // Store the identifier first. Even an immediate success must be reverified using the authenticated status API.
    saved = await recordPayment(client, saved, transaction.transactionId, 'PENDING');
    if (transaction.status === 'PENDING' || transaction.status === 'PROCESSING') return saved;
  }
  const transaction = await gatewayRequest(`/payments/${encodeURIComponent(saved.transaction_id!)}`);
  verifyGatewayPayment(transaction, saved);
  return recordPayment(client, saved, transaction.transactionId, transaction.status);
}
export async function reconcilePendingPayments(client: SupabaseClient, userId: string, admin: boolean) {
  // Keep the Cloud query simple: its PostgREST-compatible parser rejects this timestamp OR filter.
  // Oldest checks are first; apply the cooldown locally to at most three pending rows.
  let query = client.from('legend_pesajet_payments').select('*').in('status', ['CREATED', 'PENDING', 'PROCESSING'])
    .order('last_checked_at', { nullsFirst: true }).limit(3);
  if (!admin) query = query.eq('user_id', userId);
  const { data, error } = await query;
  if (error) { console.error('PesaJet reconciliation lookup failed', { code: error.code }); return; }
  const due = (data || []).filter(row => !row.last_checked_at || Date.parse(row.last_checked_at) <= Date.now() - 10000);
  await Promise.all(due.map(async row => {
    try { await syncPayment(client, paymentRowSchema.parse(row)); }
    catch { console.error('PesaJet reconciliation deferred', { paymentId: row.id }); }
  }));
}
