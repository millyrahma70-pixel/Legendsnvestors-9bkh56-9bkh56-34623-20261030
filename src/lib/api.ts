import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { CLOUD_URL } from '@/constants/admin';
import { withRequestDeadline } from '@/lib/requestDeadline';

let clientPromise: Promise<SupabaseClient> | undefined;

async function createCloudClient(): Promise<SupabaseClient> {
  const env = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env;
  let url = env.VITE_SUPABASE_URL || CLOUD_URL;
  let anonKey = env.VITE_SUPABASE_ANON_KEY;
  if (!anonKey) {
    // Bootstrap only: functions.invoke requires a client key that is not yet available.
    // All feature requests below use the initialized singleton client's APIs.
    const config: unknown = await withRequestDeadline(async signal => {
      const response = await fetch(`${CLOUD_URL}/functions/v1/legend-public-config`, { cache: 'no-store', signal });
      if (!response.ok) throw new Error('Cloud connection is unavailable. Please retry shortly.');
      return response.json();
    }, 10000);
    if (!config || typeof config !== 'object' || !('anonKey' in config) || typeof config.anonKey !== 'string' || !('url' in config) || typeof config.url !== 'string') throw new Error('Cloud configuration is incomplete.');
    url = config.url;
    anonKey = config.anonKey;
  }
  return createClient(url, anonKey, {
    auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'legend_verified_admin_session' },
    global: { fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(20000) }) },
  });
}

export function getSupabaseClient(): Promise<SupabaseClient> {
  if (!clientPromise) clientPromise = createCloudClient().catch(error => { clientPromise = undefined; throw error; });
  return clientPromise;
}
