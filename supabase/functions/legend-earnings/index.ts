import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { isEarningsSchedulerAuthorized } from '../_shared/earningsAuthorization.ts';

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
  try {
    if ((Deno.env.get('LEGEND_EARNINGS_CRON_SECRET')?.length ?? 0) < 32) {
      console.error('Earnings scheduler secret is not configured');
      return jsonResponse({ error: 'Scheduled payouts are not configured' }, 503);
    }
    if (!await isEarningsSchedulerAuthorized(request)) return jsonResponse({ error: 'Unauthorized scheduled job' }, 401);
    const raw = await request.text();
    if (raw.length > 256) return jsonResponse({ error: 'Request is too large' }, 413);
    let body: unknown = {};
    try { if (raw.trim()) body = JSON.parse(raw); } catch { return jsonResponse({ error: 'Use valid JSON' }, 400); }
    if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length) return jsonResponse({ error: 'Use an empty JSON object; payout amounts and users are server-selected' }, 400);
    const url = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !serviceKey) return jsonResponse({ error: 'Payout service is unavailable' }, 503);
    const client = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await client.rpc('legend_earnings_batch', { p_limit: 100 });
    if (error) {
      console.error('Scheduled earnings batch failed', { code: error.code });
      return jsonResponse({ error: 'Payout batch could not complete. Retry the same scheduled job.' }, 503);
    }
    if (data?.busy) return jsonResponse({ busy: true, retry_after_seconds: 10 }, 202);
    console.log('Scheduled earnings completed', { runId: data?.run_id, accounts: data?.accounts_processed, remaining: data?.remaining_accounts });
    return jsonResponse(data);
  } catch (error) {
    console.error('Scheduled earnings request failed', error instanceof Error ? error.name : 'Unknown error');
    return jsonResponse({ error: 'Payout service is temporarily unavailable. Retry this scheduled job.' }, 503);
  }
});
