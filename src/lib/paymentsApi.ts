import { FunctionsHttpError } from '@supabase/supabase-js';
import { z } from 'zod';
import { getSupabaseClient } from '@/lib/api';
import type { PaymentRequest, PaymentResponse } from '@/types/payment';

const responseSchema = z.object({ payment: z.object({
  id: z.string().uuid(), orderId: z.string().uuid(), phone: z.string(), amount: z.number(),
  provider: z.enum(['mtn', 'airtel']), status: z.enum(['CREATED', 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'EXPIRED', 'REVERSED']),
  createdAt: z.string(), transactionId: z.string().nullable(),
}).nullable() });
// Browser code calls our authenticated Edge Function only, never the merchant API.
export async function paymentRequest(body: PaymentRequest): Promise<PaymentResponse> {
  const client = await getSupabaseClient();
  const { data, error } = await client.functions.invoke('legend-pesajet', { body });
  if (error) {
    let message = 'Payment service could not be reached. Check this payment again before starting another.';
    if (error instanceof FunctionsHttpError) {
      const text = await error.context.text();
      const parsed: unknown = await Promise.resolve().then(() => JSON.parse(text)).catch(() => null);
      if (parsed && typeof parsed === 'object' && 'error' in parsed && typeof parsed.error === 'string') message = parsed.error;
    }
    throw new Error(message);
  }
  const result = responseSchema.safeParse(data);
  if (!result.success) throw new Error('Payment status returned an invalid response. Please retry.');
  return result.data;
}
