# Shared account access

## Routes and interface
- `/login` is the single sign-in page for members and administrators.
- `/admin/login` redirects to `/login` for existing bookmarks.
- Successful member sign-in opens `/home`; the configured administrator opens `/admin` through the existing server-verified access gate.
- Sign in using a saved full name or phone number and password. Full names are exact matches ignoring case and surrounding whitespace. Duplicate full names are rejected; those accounts should use their unique phone number.
- Ugandan local, nine-digit and international phone formats normalize to the same identity. The existing administrator number remains 0746085840, mapped to the authorized account only on the server.
- Existing email sign-ins remain compatible, but the shared form does not request or require email.

## Registration and recovery
- Step 1: full name, phone number, password, matching password confirmation and optional referral code.
- Step 2: email verification with the configured four-digit OTP. Email is still required to activate a Cloud account; this is not phone-only registration.
- Registration bonuses come from the existing Cloud settings and are credited by the existing enrollment command after successful activation, not by the form.
- Existing balances, referrals, payment flows and accounts are unchanged.
- Forgot Password opens member email recovery and a separate administrator recovery link. Both return to the common account-access flow; administrator recovery retains its existing permission check.

## Server-side sign-in
- `legend-login` is a public Edge Function with JWT verification disabled because it must accept signed-out users.
- It uses service-only `legend_login_identity` to resolve an identity, then authenticates the supplied password against Cloud Auth using the anonymous key.
- Unknown identities, duplicate names and invalid passwords return the same generic credential error. Lookup emails, match lists and service-role credentials never reach the browser.
- Only the authenticated user's access and refresh tokens are returned over HTTPS and installed using the existing singleton Cloud client. Passwords and tokens are not logged.
- HMAC-hashed IP and identity keys enforce 30 IP attempts and 10 identity attempts per fixed 15-minute window. Database failures fail closed. Client retries are disabled.
- The existing admin allowlist, route gate and site gateway remain the authority for administrator permissions; name or number text cannot assign a role.

## Validation status
Read-only SQL checks confirmed the existing administrator resolves from local and international numbers, unknown identities return no matches, existing account phones are canonical, and browser roles cannot execute the privileged lookup or quota functions. Frontend searches found no service-role or PesaJet secret references.

`supabase/functions/_shared/loginIdentifier.test.ts` contains normalization and fingerprint tests. Deno tests and end-to-end browser sign-in were not executed in this editor session. Browser checks should cover member phone/name sign-in, the administrator number, wrong passwords, duplicate names, rate limits, session refresh, legacy `/admin/login` bookmarks, signup confirmation and email verification, and both recovery flows.
