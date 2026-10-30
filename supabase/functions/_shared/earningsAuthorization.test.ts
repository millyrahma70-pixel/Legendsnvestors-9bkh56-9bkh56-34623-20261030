import { isEarningsSchedulerAuthorized } from './earningsAuthorization.ts';

Deno.test('scheduled payout authorization rejects missing/wrong credentials and accepts only the saved secret', async () => {
  const name = 'LEGEND_EARNINGS_CRON_SECRET';
  const previous = Deno.env.get(name);
  const testSecret = 'scheduler-test-only-'.repeat(3);
  const request = (value?: string) => new Request('https://example.test/legend-earnings', {
    method: 'POST', headers: value ? { Authorization: value } : {},
  });
  try {
    Deno.env.delete(name);
    if (await isEarningsSchedulerAuthorized(request(`Bearer ${testSecret}`))) throw new Error('Unconfigured job accepted');
    Deno.env.set(name, testSecret);
    if (await isEarningsSchedulerAuthorized(request())) throw new Error('Missing credential accepted');
    if (await isEarningsSchedulerAuthorized(request('Bearer wrong-secret'))) throw new Error('Wrong credential accepted');
    if (await isEarningsSchedulerAuthorized(request(`Basic ${testSecret}`))) throw new Error('Wrong scheme accepted');
    if (!await isEarningsSchedulerAuthorized(request(`Bearer ${testSecret}`))) throw new Error('Saved credential rejected');
    Deno.env.set(name, 'short-secret');
    if (await isEarningsSchedulerAuthorized(request('Bearer short-secret'))) throw new Error('Weak configuration accepted');
  } finally {
    if (previous === undefined) Deno.env.delete(name);
    else Deno.env.set(name, previous);
  }
});
