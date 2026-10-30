import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3.23.8';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { loginFingerprint, normalizeLoginIdentifier } from '../_shared/loginIdentifier.ts';

const schema = z.object({ identifier: z.string().trim().min(2).max(254), password: z.string().min(6).max(72) }).strict();
const invalidCredentials = 'Unable to sign in. Check your name or phone number and password. If another account shares your name, use your phone number.';
interface Identity { user_id: string; email: string }

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
  try {
    const raw = await request.text();
    if (raw.length > 2048) return jsonResponse({ error: 'Request is too large' }, 413);
    const parsed = schema.safeParse(JSON.parse(raw));
    if (!parsed.success) return jsonResponse({ error: 'Enter your name or phone number and a password of at least 6 characters.' }, 400);
    const url = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const identifier = normalizeLoginIdentifier(parsed.data.identifier);
    const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const fingerprints = await Promise.all([loginFingerprint(`ip:${ip}`, serviceKey), loginFingerprint(`identity:${identifier}`, serviceKey)]);
    const quotas = await Promise.all(fingerprints.map((fingerprint, index) => admin.rpc('legend_login_quota', { p_fingerprint: fingerprint, p_limit: index === 0 ? 30 : 10 })));
    if (quotas.some(result => result.error)) throw new Error('Login rate limiter unavailable');
    if (quotas.some(result => result.data !== true)) return jsonResponse({ error: 'Too many sign-in attempts. Wait 15 minutes and try again.' }, 429);
    const { data: identities, error: lookupError } = await admin.rpc('legend_login_identity', { p_identifier: identifier });
    if (lookupError) throw new Error('Login lookup unavailable');
    const matches = identities as Identity[] | null;
    // Reject unknown or ambiguous identities with the same response as a wrong password.
    if (!matches || matches.length !== 1) return jsonResponse({ error: invalidCredentials }, 401);
    const auth = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await auth.auth.signInWithPassword({ email: matches[0].email, password: parsed.data.password });
    if (error || !data.session || !data.user?.email_confirmed_at || data.user.id !== matches[0].user_id) {
      return jsonResponse({ error: error?.status === 429 ? 'Too many sign-in attempts. Wait a few minutes and try again.' : invalidCredentials }, error?.status === 429 ? 429 : 401);
    }
    console.log('Shared sign-in succeeded', { userId: data.user.id });
    // Only the authenticated user's session is returned; service keys, emails and lookup matches never leave the server.
    return jsonResponse({ access_token: data.session.access_token, refresh_token: data.session.refresh_token });
  } catch {
    console.error('Shared sign-in service failed');
    return jsonResponse({ error: 'Sign-in is temporarily unavailable. Check your connection and try again.' }, 503);
  }
});
