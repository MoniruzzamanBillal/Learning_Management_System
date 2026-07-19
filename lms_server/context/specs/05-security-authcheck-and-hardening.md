# 05 — Security hardening pass: re-enable auth checks, add helmet

## Goal

Close two small, independent, currently-open security gaps in one low-risk pass: unauthenticated access to admin/write routes and missing security headers.

## Current State

1. **Commented-out `authCheck(...)`** on three routes (documented as a known gap in `context/architecture.md`):
   - `course.routes.ts` — `GET /course/admin-stats` (backs `courseServices.adminStatistics`, exposes total students/instructors/revenue).
   - `courseModule`'s module routes — `POST /module/add-module`.
   - `VideoModule`'s video routes — `POST /video/add-video`.

   Each currently allows any caller (no token required) to hit an operation that should be admin/instructor-only.

2. **No `helmet`** — `src/app.ts` only sets `cors`, `express.json()`, `morgan`, `cookieParser`, `bodyParser.urlencoded`. No security headers (`X-Content-Type-Options`, `X-Frame-Options`, etc.) are set.

3. **Hardcoded default password (out of scope for this spec)** — `auth.service.ts::createInstructor` sets `payload.password = "123456"` unconditionally for every new instructor account (with `needsPasswordChange: true`, so it is a temp-password pattern, just an insecure/predictable one). This was considered for this pass but the decision is to keep it as-is — do not "fix" this without asking first.

## Implementation

1. **Re-enable auth checks** — find the exact commented-out lines in `course.routes.ts`, the module routes file, and the video routes file (search `// authCheck` / `authCheck(`). Uncomment and pass the correct `UserRole` for each, matching what sibling routes in the same file already require:
   - `/course/admin-stats` → `authCheck(UserRole.admin)`.
   - `/module/add-module` → `authCheck(UserRole.admin, UserRole.instructor)` (confirm against how other module-mutating routes in the same file are gated).
   - `/video/add-video` → `authCheck(UserRole.admin, UserRole.instructor)` (same confirmation against sibling video routes).

   Do not change any other routes — this is strictly re-enabling what's already commented out, not a broader authorization redesign.

2. **Add `helmet`** — `yarn add helmet` in `lms_server`, `app.use(helmet())` in `src/app.ts` near the top of the middleware stack (before `cors`, per Express convention, or immediately after — either is fine since `helmet` only sets response headers). Verify it doesn't strip any header the frontend currently depends on (check CORS headers still work against `https://devmats.vercel.app` after the change).

## Dependencies

- New: `helmet` (backend).
- No changes to `authCheck.ts` itself — reuses the existing middleware as-is.

## Verify When Done

- [x] `yarn build` and `yarn lint` clean in `lms_server` (lint shows the same 14 pre-existing errors / 11 warnings noted in `progress-tracker.md` from a prior session — none introduced by this change).
- [x] `GET /course/admin-stats`, `POST /module/add-module`, `POST /video/add-video` all return 401 without a token (verified locally via `curl`). 403-with-wrong-role and 200-with-valid-role checks require real admin/instructor credentials against the live production database and were intentionally left for manual verification (not run automatically, to avoid mutating prod data).
- [ ] Existing admin/instructor flows that use these routes still work end-to-end with a valid token (`yarn dev`, manual request with a real admin/instructor JWT).
- [x] Response headers on any request now include `helmet`'s defaults (e.g. `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, CSP) — verified locally via `curl`; `Access-Control-Allow-Origin`/`Access-Control-Allow-Credentials` still present for `https://devmats.vercel.app`, confirming `helmet` didn't strip CORS headers.
