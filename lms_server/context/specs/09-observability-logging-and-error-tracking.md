# 09 — Self-hosted error logging (admin-only, 30-day retention)

## Goal

Replace "no error visibility at all" with a self-hosted, queryable record of every backend error — currently a production error is only visible by reading Vercel's function logs after the fact, and non-admin roles have no way to help diagnose anything. Store every error `globalErrorHandler` sees directly in MongoDB, viewable only by admins, with old rows auto-expiring after 30 days so the collection never grows unbounded and needs no manual cleanup job.

This spec **replaces** an earlier version of itself that proposed `pino` + `@sentry/node` (external structured logging + error tracking service). That plan was never implemented (confirmed zero hits for `pino`/`sentry`/`winston` in `package.json`/`yarn.lock`) and was explicitly superseded by this self-hosted design per user decision — no new logging library, no external service, no new env var required.

## Current State (before this spec)

- `src/app.ts` — `app.use(morgan("dev"))` was the only request logging in the entire backend.
- `globalErrorHandler.ts` normalized every error type (`ZodError`, Mongoose `ValidationError`/`CastError`, duplicate-key, `AppError`, and the fallback branch for unhandled/programmer errors) into a consistent JSON response, but never logged or persisted the error anywhere beyond the HTTP response itself.
- No TTL/`expires` pattern existed anywhere in the codebase (confirmed via grep) — this spec introduces the first one.

## Design decisions

- **Capture scope: all errors, not just 5xx.** Per explicit user decision, every error that reaches `globalErrorHandler` is logged — routine 4xx validation failures (bad login, invalid Zod payload, duplicate key) included, not only unexpected 5xx bugs. The log is a complete request-failure history, not a bug-only tracker.
- **Read access: admin-only.** `authCheck(UserRole.admin)` gates both endpoints; no other role can view error data.
- **Retention: 30 days via MongoDB TTL index**, not an app-level cron job — `errorLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 })`. MongoDB's background TTL monitor removes expired documents automatically.
- **Logging never breaks the error response.** `errorLogServices.logError` wraps its `create()` call in its own try/catch and only `console.error`s on failure — a DB hiccup while persisting a log can never crash `globalErrorHandler` itself or delay/break the client-facing error JSON.

## Implementation

New module at `src/app/modules/errorLog/`, following this repo's standard `route/controller/service/model/interface` split:

1. **`errorLog.interface.ts`** — `TErrorLog`: `message`, `statusCode`, `errorSources` (reuses `TerrorSource` from `src/app/interface/error.ts`), `stack?`, `method`, `path`, `ip?`, `userId?`, `userRole?`.
2. **`errorLog.model.ts`** — plain Mongoose schema, `{ timestamps: true }`, plus the TTL index described above.
3. **`errorLog.service.ts`** — `logError(payload)` (internal-only, called from `globalErrorHandler`), `getAllErrorLogs()` (latest 200, sorted `createdAt` desc, `userId` populated with `name email`), `getErrorLogById(id)` (404s via `AppError` if missing).
4. **`errorLog.controller.ts` / `errorLog.route.ts`** — `GET /` and `GET /:id`, both `authCheck(UserRole.admin)`. No write endpoints are exposed publicly — the only way a row is created is internally.
5. **`src/app/router/index.ts`** — mounted at `/api/error-log`.
6. **`src/app/middleware/globalErrorHandler.ts`** — after the existing status/message/errorSources normalization, calls `errorLogServices.logError({...})` using the already-normalized local `status`/`message`/`errorSources` (not re-deriving from the inconsistent `error.status` vs `error.statusCode` naming across error types), before sending the response. `req.user?.userId`/`req.user?.userRole` are included when the failing request was authenticated.

## Dependencies

None — no new packages. Uses the existing `mongoose`, `express`, `http-status` already in the project.

## Verify When Done

- [x] `yarn build` and `yarn lint` clean. `yarn build` passes with zero errors. `yarn lint` shows the same 14 pre-existing errors as the established baseline, plus one new `no-console` **warning** (12 total warnings, up from 11) in `errorLog.service.ts`'s catch-block `console.error` — same pattern already used in `module.service.ts`, `SSL.service.ts`, `video.service.ts`'s own catch blocks, not a new class of issue.
- [x] Throw a deliberate test error, confirm it's persisted and admin-visible. Verified live against the local dev server (already running via `ts-node-dev --respawn`, which auto-picked up the new module on save): `POST /api/auth/login` with a nonexistent email returned its normal 404 JSON response, and a `GET /api/error-log` call authenticated with a locally-signed admin JWT (signed with the same `JWT_ACCESS_SECRET` from `.env`, for testing only — no real credentials used) showed the entry with correct `statusCode: 404`, `method: "POST"`, `path: "/api/auth/login"`, and the exact error message.
- [x] Admin-only gating enforced. `GET /api/error-log` with no `Authorization` header returned `401`; with the locally-signed admin-role JWT it returned `200` with the log list. (A self-referential 401 from the no-token check was itself captured in the log too, confirming the "log everything" behavior end-to-end.)
- [x] 30-day TTL is real, not just documented. Directly queried the live `errorlogs` collection's indexes via a throwaway script: `{ key: { createdAt: 1 }, name: "createdAt_1", expireAfterSeconds: 2592000 }` — confirms MongoDB will auto-expire rows 30 days (2,592,000 seconds) after `createdAt`. Could not wait out an actual 30-day expiry in verification, but the index's presence and correct `expireAfterSeconds` value are what make that expiry happen automatically going forward.
- [ ] Frontend admin page to browse these logs — **out of scope for this spec**, written up separately as a proposal in `lms_client/context/specs/09-error-logs-admin-page.md` (status: awaiting review, not yet implemented).
