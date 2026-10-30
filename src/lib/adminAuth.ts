import type { User } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/api';
import { ADMIN_EMAIL, ADMIN_LOGIN_NUMBER } from '@/constants/admin';
import { normalizeAdminPhone } from '@/lib/adminPhone';
import type { AdminUser } from '@/types/admin';

export function mapAdminUser(user: User): AdminUser {
  return { id: user.id, email: user.email || '', verified: Boolean(user.email_confirmed_at), passwordReady: user.user_metadata?.directory_password_setup === true };
}

export function isAuthorizedAdmin(user: AdminUser | null): boolean {
  // Password sign-in does not depend on the legacy email-setup metadata flag.
  // AdminAccessGate separately verifies server-side administrator permissions.
  return Boolean(user?.verified && user.email.toLowerCase() === ADMIN_EMAIL);
}

export async function sendAdminOtp() {
  const client = await getSupabaseClient();
  const { error } = await client.auth.signInWithOtp({ email: ADMIN_EMAIL, options: { shouldCreateUser: false } });
  if (error) throw new Error(error.status === 429 ? 'Too many code requests. Wait at least one minute before trying again.' : `Unable to request a recovery code: ${error.message}`);
}

export async function verifyAdminOtpAndSetPassword(token: string, password: string) {
  const client = await getSupabaseClient();
  const { data, error } = await client.auth.verifyOtp({ email: ADMIN_EMAIL, token, type: 'email' });
  if (error) throw new Error(error.status === 429 ? 'Too many verification attempts. Wait before trying again.' : 'The verification code is invalid or expired. Use the newest email code or request a new one.');
  const { data: allowed, error: accessError } = await client.rpc('is_legend_directory_admin');
  if (accessError || allowed !== true || !data.user?.email_confirmed_at || data.user.email?.toLowerCase() !== ADMIN_EMAIL) {
    const { error: logoutError } = await client.auth.signOut({ scope: 'local' });
    if (logoutError) throw new Error('Administrator verification failed and the session could not be closed. Reload and retry.');
    throw new Error('Administrator permissions could not be verified. No password was changed; retry your connection.');
  }
  const { error: saveError } = await client.auth.updateUser({ password, data: { username: 'Legend administrator', directory_password_setup: true } });
  // End recovery only after the save resolves; the normal login page is not mounted during OTP verification.
  const { error: logoutError } = await client.auth.signOut({ scope: saveError ? 'local' : 'global' });
  if (saveError) throw new Error(`Password was not saved: ${saveError.message}${logoutError ? ' Reload before retrying.' : ' Request a new code and try again.'}`);
  if (logoutError) throw new Error('Your password was saved, but the recovery session could not be closed. Reload and sign in with your new password.');
}

export async function signInAdmin(phone: string, password: string) {
  if (normalizeAdminPhone(phone) !== ADMIN_LOGIN_NUMBER) {
    throw new Error('Unable to sign in. Check your admin number and password.');
  }
  const client = await getSupabaseClient();
  const { data, error } = await client.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
  if (error) throw new Error(error.status === 429 ? 'Too many sign-in attempts. Wait a few minutes before trying again.' : error.code === 'invalid_credentials' || error.status === 400 ? 'The admin number or password was not accepted. Check your details or use “Forgot admin password?” to set a new password.' : 'Unable to connect to admin sign-in. Check your connection and try again.');
  const { data: allowed, error: accessError } = await client.rpc('is_legend_directory_admin');
  if (accessError || allowed !== true || !data.user?.email_confirmed_at || data.user.email?.toLowerCase() !== ADMIN_EMAIL) {
    const { error: logoutError } = await client.auth.signOut();
    if (logoutError) throw new Error('Unable to verify admin access or close the session. Please sign out and retry.');
    throw new Error('Administrator access could not be verified. Please contact support or retry your connection.');
  }
}

export async function checkAdminAccess() {
  const client = await getSupabaseClient();
  const { data, error } = await client.rpc('is_legend_directory_admin');
  if (error) throw new Error('Unable to verify administrator access. Please retry.');
  return data === true;
}
