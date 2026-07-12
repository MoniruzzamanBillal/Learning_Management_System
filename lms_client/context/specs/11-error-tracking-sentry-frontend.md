# 11 — Frontend error tracking (Sentry)

## Goal

Pair with backend spec `09-observability-logging-and-error-tracking.md` — today a client-side error (a broken render, an unhandled promise rejection, a bad API response the UI doesn't expect) is invisible unless a real user reports it. Add `@sentry/nextjs` for real-time visibility into production frontend errors.

## Current State

- No error-tracking SDK anywhere in `lms_client/package.json`.
- `utils/axiosInstance.ts`'s response interceptor already normalizes API errors into a consistent shape and force-logs-out on 401 — a good hook point to also report unexpected (non-401/403, non-validation) errors to Sentry.
- Next.js 16 App Router — `@sentry/nextjs`'s standard install wizard (`npx @sentry/wizard@latest -i nextjs`) handles most of the boilerplate (instrumentation files, config) automatically; this spec describes the intended end state, not a manual step-by-step, since the wizard output should be followed as the primary implementation method.

## Implementation

1. Run the official Sentry Next.js setup wizard (or manually add `@sentry/nextjs`, `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, and the `instrumentation.ts` hook per Next.js 16's instrumentation API).
2. Add `NEXT_PUBLIC_SENTRY_DSN` to `config/envConfig.ts`'s centralized env-var list (per this repo's convention of not reading `process.env` ad hoc elsewhere) — feature no-ops if unset, matching the backend spec's same pattern.
3. In `utils/axiosInstance.ts`'s response interceptor, report unexpected errors (5xx responses, network failures) to Sentry via `Sentry.captureException`, but explicitly skip 401 (already handled via logout) and 4xx validation errors (expected, not actionable server-side bugs) — same signal-vs-noise filtering as the backend spec.
4. Add a global error boundary if one doesn't already exist (`app/global-error.tsx` per Next.js App Router convention) that both renders a friendly fallback and reports the error to Sentry.

## Dependencies

- New: `@sentry/nextjs`.
- New env var: `NEXT_PUBLIC_SENTRY_DSN` (optional).

## Verify When Done

- [ ] `yarn build` and `yarn lint` clean (Sentry's build-time source map upload step configured correctly, doesn't break the production build).
- [ ] A deliberately-thrown test error in a throwaway component appears in the Sentry dashboard.
- [ ] A normal 400 validation error (e.g. submitting an invalid form) does **not** appear in Sentry.
- [ ] App functions normally with `NEXT_PUBLIC_SENTRY_DSN` unset (local dev without Sentry configured).
