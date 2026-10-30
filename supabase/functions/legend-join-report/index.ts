import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
  try {
    const length = Number(request.headers.get('content-length') || 0);
    if (length > 8192) return jsonResponse({ error: 'Report is too large' }, 413);
    const raw = await request.text();
    if (raw.length > 8192) return jsonResponse({ error: 'Report is too large' }, 413);
    const body = JSON.parse(raw) as Record<string, unknown>;
    if (!body || typeof body !== 'object' || Array.isArray(body)) return jsonResponse({ error: 'Invalid report' }, 400);
    const { localId, phone, referralCode, referredByCode, deviceType, joinedAt, source } = body;
    if (typeof localId !== 'string' || !/^[a-zA-Z0-9_-]{5,64}$/.test(localId) ||
      typeof phone !== 'string' || !/^\+?[0-9]{9,15}$/.test(phone) ||
      typeof referralCode !== 'string' || !/^[A-Z0-9]{4,16}$/.test(referralCode) ||
      (referredByCode !== null && referredByCode !== undefined && (typeof referredByCode !== 'string' || !/^[A-Z0-9]{4,16}$/.test(referredByCode))) ||
      typeof deviceType !== 'string' || !['Mobile', 'Tablet', 'Desktop'].includes(deviceType) ||
      typeof joinedAt !== 'string' || !Number.isFinite(Date.parse(joinedAt)) || Date.parse(joinedAt) > Date.now() + 300000 ||
      (source !== 'new' && source !== 'existing')) return jsonResponse({ error: 'Invalid joining information' }, 400);
    const url = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !serviceKey) return jsonResponse({ error: 'Cloud service unavailable' }, 503);
    const admin = createClient(url, serviceKey);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${serviceKey}:${ip}`));
    const fingerprint = Array.from(new Uint8Array(digest)).map(value => value.toString(16).padStart(2, '0')).join('');
    const quota = await admin.rpc('consume_legend_directory_quota', { fingerprint_value: fingerprint });
    if (quota.error) { console.error('Directory quota check failed', quota.error.code); return jsonResponse({ error: 'Unable to accept report' }, 503); }
    if (!quota.data) return jsonResponse({ error: 'Too many reports. Please retry later.' }, 429);
    // Append-only and idempotent: retries cannot change a previously reported phone.
    const { error } = await admin.from('legend_registration_directory').upsert({
      local_id: localId, phone, referral_code: referralCode, referred_by_code: referredByCode || null,
      device_type: deviceType, source, reported_joined_at: new Date(joinedAt).toISOString(), request_fingerprint: fingerprint,
    }, { onConflict: 'local_id', ignoreDuplicates: true });
    if (error) { console.error('Joining report insert failed', error.code); return jsonResponse({ error: 'Unable to save joining report' }, 503); }
    console.log('Joining report accepted');
    return jsonResponse({ accepted: true });
  } catch (error) {
    if (error instanceof SyntaxError) return jsonResponse({ error: 'Invalid JSON report' }, 400);
    console.error('Joining service request failed');
    return jsonResponse({ error: 'Unable to process joining report. Please retry.' }, 500);
  }
});
