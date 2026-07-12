# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

Live / in production (`lms-server-topaz.vercel.app`, backing `devmats.vercel.app`) — ongoing maintenance & feature iteration, not initial build-out.

## Spec Implementation Status

Tracks work items defined in `context/specs/`. Update the moment implementation starts or finishes on a spec.

| Spec                                                                                       | Status      |
| ------------------------------------------------------------------------------------------ | ----------- |
| [`01-fix-sequential-video-unlock-order.md`](specs/01-fix-sequential-video-unlock-order.md) | ✅ Complete |
| [`02-ai-review-summarizer.md`](specs/02-ai-review-summarizer.md)                           | ✅ Complete |
| [`03-ai-course-advisor.md`](specs/03-ai-course-advisor.md)                                 | ✅ Complete |

## Completed (already implemented, wired into `router/index.ts`)

- `auth` — register (user + admin-registers-instructor), login, update password.
- `user` — instructor listing, logged-in user lookup, update user, change password.
- `course` — CRUD, publish, admin/instructor/public listings and detail views, admin stats.
- `courseModule` — module CRUD scoped to a course.
- `VideoModule` — video CRUD scoped to a module, including multi-video upload test endpoints (`/add-video2`, `/add-video3`).
- `CourseEnrollment` — enroll, list a user's enrolled/finished courses, per-course progress %, mark-complete, gated module/video access via `ValidateCourseAccess`.
- `VideoProgress` — internal only (no router); used by `CourseEnrollment` to compute progress.
- `payment` / `SSL` — SSLCOMMERZ success/fail/cancel callbacks.
- `review` — add/update review, course review list + average, eligibility check.
- `ai` — `GET /ai/review-summary/:courseId`: cached AI-generated pros/cons digest of a course's reviews (falls back to a fixed "not enough reviews" message under 3 reviews, no LLM call burned). `POST /ai/course-advisor`: public endpoint that accepts a plain-English learning goal and returns 2-3 recommended published courses with one-line reasons, hallucination-guarded (server-side cross-check against the fetched course list). First endpoints in the shared `ai` module that `04-ai-study-assistant.md` will extend.

## Recent Activity (this session)

- Implemented [`02-ai-review-summarizer.md`](specs/02-ai-review-summarizer.md): scaffolded `src/app/modules/ai/` (`ai.interface.ts`, `ai.service.ts`, `ai.controller.ts`, `ai.route.ts`; no model/validation needed yet), registered `/ai` in `router/index.ts`, and added `aiReviewSummary`/`aiReviewSummaryReviewCount` cache fields to `Course` (`course.interface.ts`, `course.model.ts`). Reuses `reviewServices.getAverageReviewOfCourse`/`getCourseReview` and `askOpenRouter` — no new packages, no duplicated logic. `yarn build` and `yarn lint` are clean (lint has 14 pre-existing errors/11 warnings in unrelated files, none introduced by this change). **Not yet manually verified against a live courseId** — this environment's `DATABASE_URL` points at the live/production database and the LLM calls hit a real (rate-limited free-tier) API, so live-endpoint verification was left for the user to run rather than done automatically.
- Implemented [`03-ai-course-advisor.md`](specs/03-ai-course-advisor.md): added `ai.validation.ts` with Zod schema for the `query` body field; extended `ai.interface.ts` with `TCourseAdvisorRecommendation` and `TCourseAdvisorResponse` types; added `getCourseAdvice(query)` in `ai.service.ts` that fetches up to 50 published courses (`_id, name, description, category, price`), builds a system prompt instructing the model to choose ≤3 from the provided list and respond in strict JSON, calls `askOpenRouter` with `jsonMode: true`, parses with try/catch (returns empty array on parse failure), filters recommendations against the fetched course list (hallucination guard), and merges real `name`/`category`/`price` from the DB; added `getCourseAdvice` controller and `POST /course-advisor` route with validation. `yarn build` passes; `yarn lint` shows no new errors in AI module files (all pre-existing).
- Fixed sequential video-unlock bug — clicking video N sometimes unlocked video N+2/N+3 instead of N+1. Root cause: `VideoModule.addVideo` assigned `videoOrder` via `countDocuments`, which isn't covered by the `isDeleted:false` query hooks and isn't atomic, so deletes/re-adds/races could produce duplicate `videoOrder` values within a module; separately, `CourseEnrollment.getUserEnrolledModuleVideos` returned the video list unsorted and without `videoOrder`, so the UI's item order didn't match the real order anyway. See [`context/specs/01-fix-sequential-video-unlock-order.md`](specs/01-fix-sequential-video-unlock-order.md) for full details.
  - `video.service.ts` — `addVideo` now derives `videoOrder` from `max(existing videoOrder) + 1` instead of `countDocuments`.
  - `video.model.ts` — added a partial unique index on `{module, videoOrder}` (only over `isDeleted:false` docs) to reject duplicates at the DB level.
  - `CourseEnrollment.service.ts` — `getUserEnrolledModuleVideos` now selects `videoOrder` and sorts by it before returning.
  - `lms_client` `ModuleShowData.tsx` — `TModuleVideo`'s nested video type now includes `videoOrder`; the list is sorted by it before rendering (defense-in-depth on top of the backend sort).
  - Added `src/scripts/fixVideoOrder.ts`, a one-off backfill to repair `videoOrder` on modules already corrupted by the old logic — **not yet run against any database**; needs to be run manually (staging first) per the spec doc's Verify-when-done checklist.

## Recent Activity (from `git log`)

Backend-specific commits are sparse recently — most of the last several commits on `dev/monir` only touched `lms_client`:

- `60439a9c feat:course complete functionality` — last commit that actually changed backend code (a one-line fix in `CourseEnrollment.controller.ts`).
- `38522b13`, `05bcf0db`, `4c3b66a3`, `c20de8de` — all frontend-only (Next.js migration, dashboard API-consumption fixes, review-eligibility UI fix). Confirmed by `git show --stat` — no `lms_server/src` changes in these.
- Note: `4c3b66a3` accidentally committed `lms_server/node_modules/*` into git history — this is almost certainly why `lms_server/.gitignore` is mid-edit locally (adding `node_modules`, `.vercel`, etc. to ignore patterns). Not part of this context-doc work; flagging for awareness only.

## Known Gaps / Open Questions

- No automated test suite (`yarn test` is a stub).
- Several routes have `authCheck(...)` commented out rather than enforced or removed: `course/admin-stats`, `module/add-module`, `video/add-video` (see `context/architecture.md` → "Known gap"). Needs a decision from the user on whether this is intentional.
- `VideoModule` has leftover test endpoints (`/add-video2`, `/add-video3`) with no auth — worth confirming whether these are still needed before touching that module.

## Next Up

Open — driven by whatever feature/fix is requested next.

(End of file - total 60 lines)