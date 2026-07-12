# 06 — Rate limiting on public and sensitive endpoints

## Goal

Protect the two unauthenticated, LLM-backed AI endpoints from cost/abuse, and add basic brute-force protection on login — the current API has zero rate limiting anywhere (`grep -rniE "rate-limit|slowdown|throttl"` across `src` returns nothing).

## Current State

- `POST /ai/course-advisor` (`ai.route.ts`) — fully public, no `authCheck`, calls `askOpenRouter` (a real LLM API call) on every request. Anyone can script unlimited calls.
- `GET /ai/review-summary/:courseId` — also public; only calls the LLM when the cached summary is stale (see `ai.service.ts::getReviewSummary`), but the cache-miss path still burns a real LLM call and is unauthenticated.
- `POST /auth/login` — no attempt limiting; a scripted credential-stuffing/brute-force run against `signInFromDb` is unthrottled today.

## Implementation

1. `yarn add express-rate-limit` in `lms_server`.
2. Create `src/app/middleware/rateLimiter.ts` exporting a couple of named limiters built on `express-rate-limit`'s `rateLimit(...)`:
   - `aiLimiter` — e.g. 10 requests / 10 minutes per IP, applied to `POST /ai/course-advisor` and `GET /ai/review-summary/:courseId`.
   - `loginLimiter` — e.g. 10 attempts / 15 minutes per IP, applied to `POST /auth/login`.
   - Use a shared error response shape consistent with `sendResponse`'s envelope (`{ success: false, message, data: null }`) via the `handler` option, rather than `express-rate-limit`'s default plain-text response, so the frontend's Axios error-normalization (`utils/axiosInstance.ts`) handles it the same way as other errors.
3. Wire `aiLimiter` into `ai.route.ts` (both routes) and `loginLimiter` into `auth.route.ts` (`/login`) as an extra middleware before the existing `validateRequest`/controller chain.
4. Leave every other route unthrottled — this spec is scoped to the two AI endpoints and login only, not a global rate limiter (a global limiter is a reasonable future addition but changes behavior for every consumer including the production frontend, so it's out of scope here to avoid accidentally breaking normal usage).

## Dependencies

- New: `express-rate-limit` (backend). No other packages needed — in-memory store is fine for this app's current single-instance Vercel deployment; note in code that a distributed store (Redis) would be needed if the backend ever scales to multiple instances.

## Verify When Done

- [ ] `yarn build` and `yarn lint` clean.
- [ ] Scripted loop of 15 rapid requests to `POST /ai/course-advisor` gets a 429 after the threshold, with a JSON body matching the existing error envelope shape.
- [ ] Same for `GET /ai/review-summary/:courseId` and `POST /auth/login`.
- [ ] Normal single-digit usage (a real user browsing the course page, or a few login attempts) is never blocked.
- [ ] Confirm the rate limiter does not interfere with the existing `authCheck`/`validateRequest` chain on `/ai/course-advisor` and `/auth/login` (order of middleware matters — rate limiter should run first, before any DB/LLM work happens).
