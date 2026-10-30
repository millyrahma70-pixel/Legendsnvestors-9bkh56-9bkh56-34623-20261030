import { createClient } from 'npm:@supabase/supabase-js@2';
import { reconcilePendingPayments } from './pesajetSync.ts';

interface BackgroundRuntime { waitUntil: (task: Promise<unknown>) => void }

// Payment-provider availability must never block opening a wallet.
// Explicit recharge/status requests still verify and settle through legend-pesajet.
export function deferPaymentReconciliation(userId: string, admin: boolean) {
  const runtime = (globalThis as typeof globalThis & { EdgeRuntime?: BackgroundRuntime }).EdgeRuntime;
  if (!runtime?.waitUntil) {
    console.log('Background payment checks unavailable; explicit payment status checks remain enabled');
    return;
  }
  const client = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(8000) }) },
  });
  runtime.waitUntil(reconcilePendingPayments(client, userId, admin).catch(() => {
    console.error('Background payment reconciliation deferred');
  }));
}
