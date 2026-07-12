# 09 — Structured logging + error tracking

## Goal

Replace "only `morgan("dev")` request logging, nothing else" with structured, queryable logs and real-time error visibility — currently a production error is only visible by reading Vercel's function logs after the fact; there's no aggregation, no alerting, and no request correlation.

## Current State

- `src/app.ts` — `app.use(morgan("dev"))` is the only logging in the entire backend. `grep -rniE "winston|pino|sentry"` across `src` returns zero hits.
- `globalErrorHandler.ts` normalizes every error type (`ZodError`, Mongoose `ValidationError`/`CastError`, duplicate-key, `AppError`) into a consistent JSON response, but never logs or reports the error anywhere beyond the HTTP response itself.

## Implementation

1. **Structured logging:** `yarn add pino pino-http`. Create `src/app/util/logger.ts` exporting a configured `pino` instance (pretty-printed in dev via `pino-pretty` as a dev dependency, JSON in production for log-aggregator compatibility). Add `pino-http` as request-level middleware in `app.ts`, generating a request-id per request (`pino-http`'s built-in `genReqId`) — keep `morgan("dev")` alongside it for now rather than replacing (low risk, both can coexist; removing `morgan` entirely is optional cleanup, not required).
2. **Error logging:** in `globalErrorHandler.ts`, log every error via the new `logger` (`logger.error({ err: error, path: req.originalUrl }, message)`) before sending the response — currently errors are silently swallowed into the JSON response with no server-side trace.
3. **Error tracking:** `yarn add @sentry/node`. Initialize Sentry in `src/server.ts` (or a new `src/app/config/sentry.ts` imported first) using a `SENTRY_DSN` env var added to `config/index.ts` (only enabled when the env var is present, so local dev without a DSN doesn't error). Wire Sentry's error capture into `globalErrorHandler.ts` (`Sentry.captureException(error)`), guarded so 4xx client errors (validation, `AppError` with 4xx status) aren't reported as noise — only report 5xx / unexpected errors.
4. Add `SENTRY_DSN` to `config/index.ts`'s centralized env-var list (per this repo's convention of not reading `process.env` ad hoc).

## Dependencies

- New: `pino`, `pino-http`, `@sentry/node` (production); `pino-pretty` (dev only).
- New env var: `SENTRY_DSN` (optional — feature no-ops if unset).

## Verify When Done

- [ ] `yarn build` and `yarn lint` clean.
- [ ] Local dev logs show structured request lines with a request-id via `pino-http`.
- [ ] Throw a deliberate test error in a throwaway route, confirm it appears in both the `pino` log output and the Sentry dashboard (only if `SENTRY_DSN` is configured).
- [ ] Confirm a normal validation error (e.g. bad Zod payload, a 400) does **not** show up in Sentry — only real 5xx/unexpected errors should.
- [ ] Running without `SENTRY_DSN` set (e.g. fresh local `.env`) does not crash the app on startup.
