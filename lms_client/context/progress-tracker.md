# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

Live / in production (`devmats.vercel.app`) — ongoing maintenance & feature iteration, not initial build-out. The app was recently migrated to Next.js (see Recent Activity).

## Spec Implementation Status

Tracks work items defined in `context/specs/`. Update the moment implementation starts or finishes on a spec.

| Spec                                                                     | Status         | Notes                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`01-my-courses-list-redesign.md`](specs/01-my-courses-list-redesign.md) | ✅ Complete | `MyCourses.tsx`, `MyCourseCard.tsx`, `MyCourseCardSkeleton.tsx` redesigned to match `/courses`' grid/card pattern; lint + build clean; visual pass confirmed by the user. |

## Completed (already implemented)

- Public site: home, course catalog + detail, about-us, contact, faqs, instructors, login/sign-up, SSLCOMMERZ payment-outcome pages.
- Auth: login, registration, JWT-cookie-based session, role-gated routing via `middleware.ts`.
- Admin dashboard: course CRUD + publish, instructor CRUD, module management, enrollment management, admin home/stats.
- Instructor dashboard: assigned-course view, module CRUD, video CRUD.
- User dashboard: enrolled courses, certificates.
- Shared: profile page, change-password.
- Data layer: `hooks/useApi.ts` (TanStack Query) + `functions/*.functions.ts` orchestration pattern in active use across course/module/video/review/enrollment flows.

## Recent Activity (from `git log`, `dev/monir` branch)

- `c20de8de feat: migrate to next js` — the frontend was migrated to Next.js (the current App Router structure).
- `4c3b66a3 fix(dashboard): instructor, user dashboard api update` — dashboard API-consumption fixes across `AddCourse`, `ManageInstructorPage`, `ManageAssignCourse`, `UpdateModule`, `MyCourseCertificates`, `EnrolledCourseColumn`, `MyEnrolledCourses`, plus an `envConfig.ts` tweak. **Note:** this commit also accidentally included `lms_server/node_modules/*` — unrelated to frontend work, but explains why `lms_server/.gitignore` is being reworked locally.
- `5ff8ff20 style: update ui`
- `05bcf0db fix: instructor dashboard api fixes` — `InstructorLinks`, `CourseColumns`, `CourseDetailColumns`, `ManageAssignCourse`, `AddModule`, `ManageModule`, `ManageVideo`, `NavBar`.
- `38522b13 fix(courseDetail): fix review eligibility api endpoint` — `CourseDetailPage.tsx`.

## Known Gaps / Open Questions

- No automated test suite configured.
- `services/auth.ts` contains a dead, commented-out `registration` function — the real signup flow (`app/(main)/sign-up/page.tsx`) posts to `/auth/register` directly via `usePost`. Candidate for cleanup, but not removed automatically — confirm before deleting in case something still imports it.
- Two data-orchestration file-naming conventions coexist (`*.functions.ts` and `*.function.ts` under `functions/`) — not unified; new files should match whichever suffix the relevant domain already uses.

## Next Up

Open — driven by whatever feature/fix is requested next.
