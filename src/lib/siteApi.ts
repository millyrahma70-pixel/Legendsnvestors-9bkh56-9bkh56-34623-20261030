import { FunctionsHttpError } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/api';
import { withRequestDeadline } from '@/lib/requestDeadline';
import type { SiteCommand, SiteFilter, SiteSnapshot, SiteSettings, SiteProduct } from '@/types/site';

export class SessionExpiredError extends Error {
  constructor(message = 'Your session expired. Return to Sign In to reconnect to your account.') {
    super(message);
    this.name = 'SessionExpiredError';
  }
}

export function siteCommand(command: SiteCommand, filter: SiteFilter = {}, externalSignal?: AbortSignal): Promise<SiteSnapshot> {
  return withRequestDeadline(async signal => {
    const client = await getSupabaseClient();
    signal.throwIfAborted();
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    signal.throwIfAborted();
    if (sessionError) throw new Error('Unable to restore your account session. Check your connection and retry.');
    if (!sessionData.session?.access_token) throw new SessionExpiredError();
    const { data, error } = await client.functions.invoke('legend-site', {
      body: { ...command, filter }, signal,
      headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
    });
    signal.throwIfAborted();
    if (error) {
      let message = 'Unable to reach Cloud. Check your connection and retry.';
      if (error instanceof FunctionsHttpError) {
        const text = await error.context.text().catch(() => '');
        try {
          const response: unknown = JSON.parse(text);
          if (response && typeof response === 'object' && 'error' in response && typeof response.error === 'string') message = response.error;
        } catch { message = 'Cloud returned an unreadable response. Please retry your connection.'; }
        if (error.context.status === 401) throw new SessionExpiredError(message);
      }
      throw new Error(message);
    }
    if (!data || typeof data !== 'object' || !('settings' in data)) throw new Error('Website data is unavailable. Please retry.');
    return data as SiteSnapshot;
  }, command.action === 'snapshot' ? 20000 : 40000, externalSignal);
}

export function fetchPublicSite(): Promise<{ settings: SiteSettings; catalog: SiteProduct[] }> {
  return withRequestDeadline(async signal => {
    const client = await getSupabaseClient();
    signal.throwIfAborted();
    const [settings, catalog] = await Promise.all([
      client.from('legend_site_settings').select('version,config').single().abortSignal(signal),
      client.from('legend_site_catalog').select('*').eq('enabled', true).order('id').abortSignal(signal),
    ]);
    signal.throwIfAborted();
    if (settings.error) throw new Error(settings.error.message);
    if (catalog.error) throw new Error(catalog.error.message);
    return { settings: settings.data as SiteSettings, catalog: catalog.data as SiteProduct[] };
  }, 15000);
}
export const money = (value: number) => `UGX ${value.toLocaleString('en-UG')}`;
export const dateTime = (value: string) => new Date(value).toLocaleString();
