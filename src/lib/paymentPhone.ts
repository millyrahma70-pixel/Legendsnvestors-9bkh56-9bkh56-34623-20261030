export function normalizePaymentPhone(value: string): string {
  const digits = value.trim().replace(/[\s()+-]/g, '');
  if (/^0\d{9}$/.test(digits)) return `+256${digits.slice(1)}`;
  if (/^256\d{9}$/.test(digits)) return `+${digits}`;
  if (/^\d{9}$/.test(digits)) return `+256${digits}`;
  return '';
}
export function paymentProvider(value: string): 'mtn' | 'airtel' | null {
  const phone = normalizePaymentPhone(value);
  if (/^\+256(77|78|76|79|39)\d{7}$/.test(phone)) return 'mtn';
  if (/^\+256(70|75|74)\d{7}$/.test(phone)) return 'airtel';
  return null;
}
export const paymentPending = (status?: string) => Boolean(status && ['CREATED', 'PENDING', 'PROCESSING'].includes(status));
