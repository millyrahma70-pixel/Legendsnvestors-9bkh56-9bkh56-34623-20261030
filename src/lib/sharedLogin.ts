import { FunctionsHttpError } from '@supabase/supabase-js';
import { z } from 'zod';
import { getSupabaseClient } from '@/lib/api';
import { mapAdminUser } from '@/lib/adminAuth';

const sessionSchema = z.object({ access_token: z.string().min(1), refresh_token: z.string().min(1) });
export async function signInWithIdentity(identifier: string, password: string) {
  const client = await getSupabaseClient();
  const { data, error } = await client.functions.invoke('legend-login', { body: { identifier, password } });
  if (error) {
    let message = 'Unable to connect to sign-in. Check your connection and try again.';
    if (error instanceof FunctionsHttpError) {
      const text = await error.context.text();
      try {
        const response: unknown = JSON.parse(text);
        if (response && typeof response === 'object' && 'error' in response && typeof response.error === 'string') message = response.error;
      } catch { message = 'The sign-in service returned an invalid response. Please retry.'; }
    }
    throw new Error(message);
  }
  const tokens = sessionSchema.safeParse(data);
  if (!tokens.success) throw new Error('Sign-in did not complete. Please try again.');
  const { data: session, error: sessionError } = await client.auth.setSession(tokens.data);
  if (sessionError || !session.user) throw new Error('Unable to restore your account session. Please sign in again.');
  return mapAdminUser(session.user);
}
