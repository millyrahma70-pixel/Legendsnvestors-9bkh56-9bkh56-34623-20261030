export function normalizeAdminPhone(value: string): string {
  const digits = value.replace(/[\s()+-]/g, '');
  if (/^256[0-9]{9}$/.test(digits)) return `0${digits.slice(3)}`;
  if (/^[73][0-9]{8}$/.test(digits)) return `0${digits}`;
  return digits;
}
