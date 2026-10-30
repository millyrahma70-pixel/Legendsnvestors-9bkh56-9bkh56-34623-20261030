# Automatic investment earnings and referral commissions

## What is implemented

- Each active investment earns at `started_at + N × 24 hours`, never at midnight or 24 hours after the last browser visit.
- Only fully completed periods are eligible, capped by the investment's original end time. Suspended accounts are not paid; stopped investments are excluded.
- Wallet, cumulative income, the period ledger entry, and the investment's paid-through timestamp update in one database transaction. Database locks and a unique investment/period index prevent duplicate payouts on retries or overlapping account refreshes, manual runs, and scheduled jobs.
- Every new investment immediately credits eligible level-1/2/3 uplines using the saved referral tree and configured rates (currently intended as 27%, 2%, 1%). The commission is based on that investment's purchase price, not the wallet recharge. Commission entries identify the investment and level.
- Recharge approval still credits the depositor, but no longer issues referral commission. This also applies to gateway-confirmed PesaJet orders using the shared review command.
- Existing investments keep their paid-through markers; old ledger entries, balances, and referral credits are not rewritten, reversed, or retroactively rewarded.
- Ledger `due_at` is the exact earned-at timestamp. `created_at` remains the real wallet posting timestamp, so job delay is visible rather than hidden.

## Required external scheduler setup

The project's database cannot enable pg_cron because its scheduler is configured for the separate `postgres` database. An Edge Function does not schedule itself. Configuring a secret alone does not start offline payouts.

Create a job in a trusted HTTP scheduler such as cron-job.org:

1. Endpoint: `https://zhrqaulyaprecejqzhrq.backend.onspace.ai/functions/v1/legend-earnings`
2. Method: `POST`
3. Run every minute, UTC, continuously. Do not use a once-daily schedule, as activation times differ by investment.
4. Headers: `Content-Type: application/json` and `Authorization: Bearer <your saved LEGEND_EARNINGS_CRON_SECRET>`.
5. Body: `{}`.
6. Store the credential only in the scheduler's protected configuration. Do not include it in source control, browser environment variables, public links, or screenshots. Never use a password or mobile-money PIN as this secret.
7. Enable retries for 503/network failures. A 202 response means another batch owns the lock; retry after 10 seconds. A 401 means the header is absent or incorrect. A 503 configuration response means a server secret is missing or invalid.
8. Each request processes at most 100 due accounts. If `has_more` is true, run another request promptly until it is false; monitor queue size and increase scheduler throughput if needed.
9. Admin Overview shows the last successful job and highlights missing/stale scheduling. The UI calls the job connected only after a successful receipt within three minutes. This heartbeat is not a promise that every investment has been paid; a catch-up badge indicates remaining work.

The entitlement time is exact to activation; actual wallet delivery depends on scheduler cadence, load, and service availability and cannot be guaranteed to the exact second. With a minute schedule and no backlog it normally posts at the next job. Missed eligible periods are caught up on recovery without shifting future earning times. Account refresh and Admin Run Income remain fallback settlement paths, but are not a substitute for offline scheduling.

## Secret isolation

`LEGEND_EARNINGS_CRON_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` are read only by Edge Function modules. The browser receives scheduler status and the non-secret endpoint, never credentials. `legend_earnings_batch` and both settlement overloads are executable only by service_role. All operational receipt tables have RLS and administrator-only browser read access; no browser writes are allowed.

## Verification

Read-only database acceptance checks passed for: just-before/exact-first payout, multi-day catch-up, 60-day term cap, exclusion of partial periods, referral arithmetic, payout function permissions, deduplication indexes, receipt RLS, and removal of the recharge referral path. No production wallets were modified for testing. Live scheduled delivery and a complete investment/commission transaction still require browser/scheduler verification after setup.

Suggested live check with an authorized test account: note activation timestamp and starting balance, buy once using a referral code, confirm immediate upline commission, confirm no income before the first 24-hour timestamp, then inspect `due_at` and wallet posting after the first scheduled run. Repeat the same scheduler request and confirm no duplicated credit. Pause the scheduler to verify the status warning and catch-up behavior.
