# 05 — Security hardening pass: re-enable auth checks, add helmet, fix hardcoded instructor password

## Goal

Close three small, independent, currently-open security gaps in one low-risk pass: unauthenticated access to admin/write routes, missing security headers, and a hardcoded default password for new instructor accounts.

## Current State

1. **Commented-out `authCheck(...)`** on three routes (documented as a known gap in `context/architecture.md`):
   - `course.routes.ts` — `GET /course/admin-stats` (backs `courseServices.adminStatistics`, exposes total students/instructors/revenue).
   - `courseModule`'s module routes — `POST /module/add-module`.
   - `VideoModule`'s video routes — `POST /video/add-video`.

   Each currently allows any caller (no token required) to hit an operation that should be admin/instructor-only.

2. **No `helmet`** — `src/app.ts` only sets `cors`, `express.json()`, `morgan`, `cookieParser`, `bodyParser.urlencoded`. No security headers (`X-Content-Type-Options`, `X-Frame-Options`, etc.) are set.

3. **Hardcoded default password** — `auth.service.ts::createInstructor` sets `payload.password = "123456"` unconditionally for every new instructor account (with `needsPasswordChange: true`, so it is a temp-password pattern, just an insecure/predictable one).

## Implementation

1. **Re-enable auth checks** — find the exact commented-out lines in `course.routes.ts`, the module routes file, and the video routes file (search `// authCheck` / `authCheck(`). Uncomment and pass the correct `UserRole` for each, matching what sibling routes in the same file already require:
   - `/course/admin-stats` → `authCheck(UserRole.admin)`.
   - `/module/add-module` → `authCheck(UserRole.admin, UserRole.instructor)` (confirm against how other module-mutating routes in the same file are gated).
   - `/video/add-video` → `authCheck(UserRole.admin, UserRole.instructor)` (same confirmation against sibling video routes).

   Do not change any other routes — this is strictly re-enabling what's already commented out, not a broader authorization redesign.

2. **Add `helmet`** — `yarn add helmet` in `lms_server`, `app.use(helmet())` in `src/app.ts` near the top of the middleware stack (before `cors`, per Express convention, or immediately after — either is fine since `helmet` only sets response headers). Verify it doesn't strip any header the frontend currently depends on (check CORS headers still work against `https://devmats.vercel.app` after the change).

3. **Fix hardcoded instructor password** — in `auth.service.ts::createInstructor`, replace `payload.password = "123456"` with a randomly generated temporary password (e.g. `crypto.randomBytes(9).toString("base64url")` from Node's built-in `crypto`, no new dependency needed). `needsPasswordChange: true` already forces a change on first login, so the random password only needs to exist long enough to be communicated to the instructor — return it in the `createInstructor` API response (already goes through `sendResponse`, admin-only caller) rather than emailing it, to keep this spec's scope minimal (email delivery is separate, see `11-email-notifications.md`).

## Dependencies

- New: `helmet` (backend).
- No changes to `authCheck.ts` itself — reuses the existing middleware as-is.

## Verify When Done

- [ ] `yarn build` and `yarn lint` clean in `lms_server`.
- [ ] `GET /course/admin-stats`, `POST /module/add-module`, `POST /video/add-video` all return 401 without a token, and 403 with a valid non-admin/non-instructor token.
- [ ] Existing admin/instructor flows that use these routes still work end-to-end with a valid token (`yarn dev`, manual request with a real admin/instructor JWT).
- [ ] Response headers on any request now include `helmet`'s defaults (e.g. `X-Content-Type-Options: nosniff`); frontend at `devmats.vercel.app` still loads/functions against the local or staging API after the change.
- [ ] Creating a new instructor no longer sets password `"123456"` — confirm via a test creation that the returned temp password is random and that login with it (then forced change) still works.
