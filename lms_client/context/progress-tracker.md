# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

Live / in production (`devmats.vercel.app`) — ongoing maintenance & feature iteration, not initial build-out. The app was recently migrated to Next.js (see Recent Activity).

## Spec Implementation Status

Tracks work items defined in `context/specs/`. Update the moment implementation starts or finishes on a spec.

| Spec                                                                       | Status      | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`01-my-courses-list-redesign.md`](specs/01-my-courses-list-redesign.md)   | ✅ Complete | `MyCourses.tsx`, `MyCourseCard.tsx`, `MyCourseCardSkeleton.tsx` redesigned to match `/courses`' grid/card pattern; lint + build clean; visual pass confirmed by the user.                                                                                                                                                                                                                                                                                                                                                                               |
| [`02-my-course-detail-redesign.md`](specs/02-my-course-detail-redesign.md) | ✅ Complete | `EnrollCourseDetail.tsx`, `NoVideoPlaceholder.tsx`, `VideoLoadingSkeleton.tsx`, `ModuleShowData.tsx`, `EnrolledCourseDetailSkeleton.tsx` redesigned (header, progress bar, card surfaces, grid layout, restyled module status colors, persistent completed badge); lint + build clean; visual pass confirmed by the user.                                                                                                                                                                                                                               |
| [`03-certificate-pdf-design.md`](specs/03-certificate-pdf-design.md)       | ✅ Complete | `CertificateDownloadButton.tsx` redrawn as a fully vector jsPDF landscape layout (border, wordmark, title, centered name, course name/category, date, certificate ID, signature line) — no more `addImage("/certificate.jpg", ...)`, which was silently failing since that file never existed in `public/`. `CertificateTableColumn.tsx` now passes `category`/`completedOn`/`userId`/`courseId` in addition to the existing `userName`/`courseName`. Lint + build clean; manual browser verification (actually clicking "Download") left for the user. |
| [`04-ai-review-summary-ui.md`](specs/04-ai-review-summary-ui.md)           | ✅ Complete | Created `types/ai.types.ts`, `components/main/publicPage/courseDetail/AiReviewSummary.tsx`, updated `CourseDetailPage.tsx` to render AI summary above review list. Build passes.                                                                                                                                                                                                                                                                                                                                                                        |
| [`05-ai-course-advisor-ui.md`](specs/05-ai-course-advisor-ui.md)           | ✅ Complete | Created `components/main/publicPage/course/AiCourseAdvisor.tsx`, extended `types/ai.types.ts` with `TCourseAdvisorResponse`/`TCourseAdvisorRecommendation`, integrated into `CoursePage.tsx` above course grid. Build passes; lint clean in new files.                                                                                                                                                                                                                                                                                                  |
| [`06-ai-study-assistant-ui.md`](specs/06-ai-study-assistant-ui.md)         | ✅ Complete | Created `components/main/publicPage/MyCourses/EnrolledCourseDetail/AiStudyAssistant.tsx` (floating trigger + chat panel, local `messages` state, `usePost` to `POST /ai/study-assistant/:courseId`), extended `types/ai.types.ts` with `TChatMessage`/`TStudyAssistantResponse`, mounted `<AiStudyAssistant courseId={id} />` as a sibling in `EnrollCourseDetail.tsx`. Lint clean in new/changed files (pre-existing baseline errors untouched); build passes.                                                                                         |
| [`08-course-catalog-filters.md`](specs/08-course-catalog-filters.md)       | ✅ Complete | Sort `Select` + `PriceFilter.tsx` added to `CoursePage.tsx`, wired into the existing `useFetchData` query string/`queryKey` (local `useState`, not the dead `filterSlice`). Lint + build clean. Backend companion work has since landed — `lms_server/context/specs/18-course-catalog-sort-price-backend.md` rewrote `getAllCourses` as an aggregation pipeline — so all four "Verify When Done" checkboxes are now ticked for real (live-browser-verified sort reordering and price narrowing against real catalog data), no longer blocked.                                                                                           |
| [`15-error-logs-admin-page.md`](specs/15-error-logs-admin-page.md)         | 📝 Proposed | Frontend companion to `lms_server`'s newly-implemented `09-observability-logging-and-error-tracking.md` (self-hosted MongoDB error log, admin-only, 30-day TTL — no Sentry). Proposes a new `/dashboard/admin/error-logs` admin page (list + detail modal), following the exact `ManageInstructorPage.tsx` pattern. Not yet implemented — awaiting user review of the proposal doc.                                                                                                                                                                                                                                                              |

## Completed (already implemented)

- Public site: home, course catalog + detail, about-us, contact, faqs, instructors, login/sign-up, SSLCOMMERZ payment-outcome pages.
- Auth: login, registration, JWT-cookie-based session, role-gated routing via `middleware.ts`.
- Admin dashboard: course CRUD + publish, instructor CRUD, module management, enrollment management, admin home/stats.
- Instructor dashboard: assigned-course view, module CRUD, video CRUD.
- User dashboard: enrolled courses, certificates.
- Shared: profile page, change-password.
- Data layer: `hooks/useApi.ts` (TanStack Query) + `functions/*.functions.ts` orchestration pattern in active use across course/module/video/review/enrollment flows.

## Recent Activity (this session)

- Implemented [`08-course-catalog-filters.md`](specs/08-course-catalog-filters.md): added a sort `Select` (Newest/Price: Low to High/Price: High to Low/Top Rated → `createdAt_desc`/`price_asc`/`price_desc`/`rating_desc`) next to the search bar in `CoursePage.tsx`, and a new sibling component `PriceFilter.tsx` (min/max number inputs, mirrors `CategoryFilter.tsx`'s card style) mounted below `CategoryFilter` in the sidebar. Both use local `useState` (min/max debounced 400ms via the existing `useDebounce`), matching how `searchTerm`/`categoryType` already work — the dead Redux `filterSlice` was confirmed unused anywhere in the codebase and intentionally left untouched, per the spec. Extended the existing `useFetchData` call's query string and `queryKey` array with `sortBy`/`minPrice`/`maxPrice`. `yarn lint`/`yarn build` clean (no new errors). This spec is **frontend-only by its own design** — `course.service.ts::getAllCourses` has no `sortBy`/`minPrice`/`maxPrice` handling yet, so the new controls currently send params the backend ignores; verified via Playwright that all four filters (search+category+sort+price) combine correctly in the UI/query construction with no conflicts, but did not fabricate verification of actual result reordering/narrowing since that isn't real yet. Per user decision, wrote a backend implementation proposal instead of implementing it: `lms_server/context/specs/18-course-catalog-sort-price-backend.md` (status: 📝 Proposed — awaiting review, not implemented) — it also flags that `rating_desc` needs a bigger aggregation-pipeline restructuring than a simple `.sort()`, plus two pre-existing bugs in the same function worth a look (`searchTerm` regex-matches a nonexistent `detail` field instead of `description`; `meta.totalCourses` isn't filtered).

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

(End of file - total 45 lines)
