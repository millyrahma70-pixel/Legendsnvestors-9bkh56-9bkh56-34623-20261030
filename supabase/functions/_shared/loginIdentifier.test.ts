import { loginFingerprint, normalizeLoginIdentifier } from './loginIdentifier.ts';

Deno.test('Ugandan number formats resolve to the same login identity', () => {
  for (const value of ['0746085840', '746085840', '256746085840', '+256 746 085 840']) {
    if (normalizeLoginIdentifier(value) !== '+256746085840') throw new Error('Phone normalization failed');
  }
});
Deno.test('Login names match without case differences and retain exact spelling', () => {
  if (normalizeLoginIdentifier('  John Doe  ') !== 'john doe') throw new Error('Name normalization failed');
  if (normalizeLoginIdentifier('John%') !== 'john%') throw new Error('Names must not become wildcard searches');
});
Deno.test('Rate-limit fingerprints are deterministic and contain no personal data', async () => {
  const first = await loginFingerprint('identity:john doe', 'test-secret');
  const second = await loginFingerprint('identity:john doe', 'test-secret');
  if (first !== second || !/^auth:[a-f0-9]{64}$/.test(first)) throw new Error('Invalid fingerprint');
  if (first === await loginFingerprint('identity:john doe', 'different-secret')) throw new Error('Fingerprint must be secret-bound');
});
