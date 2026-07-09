# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

Live / in production (`lms-server-topaz.vercel.app`, backing `devmats.vercel.app`) — ongoing maintenance & feature iteration, not initial build-out.

## Spec Implementation Status

Tracks work items defined in `context/specs/`. Update the moment implementation starts or finishes on a spec.

| Spec                                                                                       | Status      |
| ------------------------------------------------------------------------------------------ | ----------- |
| [`01-fix-sequential-video-unlock-order.md`](specs/01-fix-sequential-video-unlock-order.md) | ✅ Complete |

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

## Recent Activity (this session)

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

- No automated test suite (`npm test` is a stub).
- Several routes have `authCheck(...)` commented out rather than enforced or removed: `course/admin-stats`, `module/add-module`, `video/add-video` (see `context/architecture.md` → "Known gap"). Needs a decision from the user on whether this is intentional.
- `VideoModule` has leftover test endpoints (`/add-video2`, `/add-video3`) with no auth — worth confirming whether these are still needed before touching that module.

## Next Up

Open — driven by whatever feature/fix is requested next.
