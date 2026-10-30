# PesaJet recharge integration

## Credentials and authorization
- `PESAJET_API_KEY` is read only at runtime by `supabase/functions/_shared/pesajetClient.ts`.
- No merchant credentials are placed in client code, Vite variables, responses, storage or logs.
- All merchant requests use the documented `https://payments.pesajet.com/api/v1/payments` endpoint and `X-API-Key` header. Redirects are rejected to prevent forwarding credentials to another host.
- The browser calls `legend-pesajet` through the existing Supabase singleton. Every request is authenticated by `auth.getUser` and requires a verified email session.
- Payment ownership is checked server-side; only authorized admins may check other members' payments.
- SQL verification confirmed that anonymous and authenticated roles cannot execute the reserve, claim, record or existing ledger command functions. Only service_role may execute them.
- Payment rows have RLS, own-row read policy and no browser mutation grants.

## Payment flow
1. The form collects only amount and phone. The minimum is the greater of UGX 30,000 and the configured site minimum.
2. Supported phone formats are normalized to E.164; MTN/Airtel routing is derived from documented prefixes. Ambiguous 073 numbers are rejected rather than guessed.
3. A Cloud reservation records a pending order before contacting PesaJet. A per-user advisory lock prevents simultaneous duplicate reservations, with five new requests per hour.
4. PesaJet creation uses a stable merchant reference and idempotency key derived from the reservation, including when recovering a timeout.
5. The website never requests or stores a mobile-money PIN. PIN authorization takes place only on the provider's phone prompt.
6. Authenticated status responses are matched against amount, UGX currency, phone, provider, merchant reference and transaction ID before settlement. An immediate success from creation is reverified using the status endpoint.
7. Confirmed success uses the existing atomic ledger/referral command. Terminal states cannot credit the same order twice. Failed or expired payments do not credit balances.
8. Manual review is disabled for PesaJet orders; historical manual payments and withdrawals retain their existing review flow.
9. Active payment screens poll every 10 seconds, record screens every 15 seconds. Member/admin snapshots reconcile up to three eligible pending collections concurrently; a 10-second server lease limits duplicate checks across devices.
10. Polling resumes on return to the website. No webhook or scheduled worker is installed; if nobody is viewing the site, settlement is deferred until the next status check.
11. Unknown transactions without an ID are never recreated after 23 hours, within PesaJet's documented 24-hour idempotency guarantee. Those require merchant support reconciliation.

## Verification still required
No live collection or real phone PIN prompt was triggered during development. Use an authorized test account and a phone you control to validate merchant activation and both telecom networks.

- Check UGX 29,999, decimals, invalid phones and ambiguous 073 numbers are rejected.
- Request one allowed MTN recharge and one Airtel recharge; confirm only the authorized provider prompt asks for a PIN.
- Verify pending/processing does not credit a balance; completed credits once with one recharge ledger entry.
- Cancel or let a prompt expire and confirm no credit is applied.
- Refresh or open another device while pending; verify the same Cloud reservation resumes without a second charge.
- Simulate an interrupted initiation and verify retry uses the same provider idempotency key.
- Attempt to check another member's payment as a non-admin; expect not found.
- Verify admin manual review is unavailable for PesaJet orders and preserved for legacy orders/withdrawals.
- Inspect browser bundles and network requests; merchant API key must be absent.

Pure normalization and gateway-matching tests are provided in `supabase/functions/_shared/pesajetPhone.test.ts`. They do not make payment requests. They have not been executed in this editing environment.

## Provider reference
- https://github.com/pesajet/pesajet-pay-demo/blob/main/payments/README.md
- https://github.com/pesajet/pesajet-pay-demo/blob/main/payments/src/pesajet.ts
- https://github.com/pesajet/pesajet-pay-demo/blob/main/payments/src/types.ts
