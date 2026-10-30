// The scheduled-job secret is read only in an Edge Function. Never return or log it.
export async function isEarningsSchedulerAuthorized(request: Request): Promise<boolean> {
  const secret = Deno.env.get('LEGEND_EARNINGS_CRON_SECRET');
  const supplied = request.headers.get('Authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!secret || secret.length < 32 || !supplied || supplied.length > 512) return false;
  const encoder = new TextEncoder();
  const [expected, actual] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(secret)),
    crypto.subtle.digest('SHA-256', encoder.encode(supplied)),
  ]);
  const left = new Uint8Array(expected);
  const right = new Uint8Array(actual);
  let difference = 0;
  for (let index = 0; index < left.length; index++) difference |= left[index] ^ right[index];
  return difference === 0;
}
