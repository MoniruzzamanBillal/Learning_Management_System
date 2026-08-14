# 16 — Frontend folder structure migration (reference-aligned)

## Status

✅ Implemented.

## Resolution of the open questions

Implemented using this plan's own table targets as the defaults, since they were already concrete recommendations:

1. **Parens** — used, exactly as tabled (`(Admin)`, `(Instructor)`, `(User)`).
2. **Dead-code candidates** — left in place, not deleted (`functions/review.function.ts`, `functions/user.function.ts`, `functions/courseEnrollment.function.ts`, `components/shared/schema/imageSchema.tsx`, `types/module.types.ts`).
3. **Redux and `functions/*.functions.ts`** — kept, per "Deliberate deviations" above.

## Goal

Reorganize `lms_client`'s folder structure to follow the conventions of the reference project at `"/home/moniruzzaman/projects/00 own /LMS/Learning_Management_System/reference folder structure"` (a sibling Next.js 16 app by the same author, further along in adopting this layout). **This is a pure file-move + import-path-fix exercise — no component logic, business logic, prop shapes, hooks, or behavior changes.** Every file keeps its existing content; only its path (and the import statements that reference it) change.

## Reference conventions being adopted

Read in full from the reference project's own `CLAUDE.md`/`context/architecture.md` (both included with the reference folder):

1. **Feature module colocation** — each CRUD feature under `components/main/<Group>/<Feature>/` owns everything it needs as subfolders, not scattered global folders:
   - `<Feature>.tsx` — top-level component (list state, fetch, table, modals)
   - `column/Get<Feature>Column.tsx` — `ColumnDef[]` factory
   - `form/CreateUpdate<Feature>.tsx` + `form/<Feature>Form.tsx` — modal + field layout
   - `schema/<Feature>.schema.ts` — Zod schema
   - `type/<Feature>Type.ts` — entity type
   - `modal/` — feature-specific dialogs, where present
2. **Domain grouping via parens** — related features are grouped under a parenthesized parent folder (`(setup)`, `(Warehouse)`, `(Inventory)`, …) purely for visual organization; it carries no Next.js routing meaning since it's outside `app/`.
3. **`components/dashboard/sidebar/`** holds only nav-chrome (menu items) — separate from `components/main/`, which holds all actual feature/page content, dashboard included.
4. **`components/shared/`** is organized by category (`breadcrumb/`, `buttons/`, `input/`, `Modal/`, `table/`, `skeleton/`, …), not a flat file dump.
5. **`lib/`** holds cross-cutting API/auth infrastructure (`axiosInstance.ts`, `api.ts`, `apiResponse.ts`, `tokenManager.ts`, `utils.ts`) — not split across `utils/`/`services/`.
6. **`providers/`** is a dedicated top-level folder for app-wide providers (query client, etc.), separate from `lib/`.
7. **Top-level `types/`** exists but holds only genuinely global/shared types — feature-specific entity types live in that feature's own `type/` folder.
8. There is **no top-level `schemas/`, `actions/`, or `functions/`** in the reference project — Zod schemas are colocated per feature; simple cookie-style actions live in `lib/`. (This codebase's `functions/*.functions.ts` toast+navigate orchestration layer has no reference equivalent — see "Deliberate deviations" below for why it's being kept, not deleted.)

## Deliberate deviations from the reference (flagged for your review)

These are judgment calls made to satisfy "no component change" — reference has no direct equivalent, so I picked the option that avoids touching logic:

1. **Redux (`lib/redux/`) is kept as-is**, just relocated intact. Reference has no client state library at all (TanStack Query only), but removing Redux would be a real architecture change, not a folder move — out of scope here.
2. **`functions/*.functions.ts` orchestration layer is kept**, not folded into components. Reference does mutation+toast+navigate inline inside `form/CreateUpdate<Feature>.tsx`; this codebase's existing (and `CLAUDE.md`-documented) convention puts that in a separate `functions/` file instead. Rewriting that split would be a logic/structure change to components themselves, not a path change — out of scope here. Files are still relocated to colocate with their single consumer where one exists (see tables below).
3. **Parenthesized group folders (`(Admin)`, `(Instructor)`, `(User)`)** under `components/main/` are proposed to mirror the reference's `(setup)`/`(Warehouse)`/etc. pattern. This is purely cosmetic (not a route group — nothing under `components/` affects routing). If you'd rather not fight parens in every relative import, plain `Admin/`, `Instructor/`, `User/` works identically — flag your preference when reviewing.

## Current State → Target Structure

### Top-level directories

| Current                    | Target                                                                                                                            | Rationale                                                                                                                                               |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `actions/cookiesAction.ts` | `lib/cookiesAction.ts`                                                                                                            | Only consumer is `services/auth.service.ts`, which itself moves into `lib/`. Reference has no `actions/` folder; cookie-adjacent helpers sit in `lib/`. |
| `config/`                  | unchanged                                                                                                                         | Already matches reference (`config/envConfig.ts`).                                                                                                      |
| `constants/`               | unchanged                                                                                                                         | Already matches reference's flat `constants/` convention.                                                                                               |
| `functions/`               | kept, contents redistributed (see table below)                                                                                    | Single-consumer files move into their feature; multi-consumer/unclear-usage files stay here.                                                            |
| `hooks/`                   | unchanged (`useApi.ts`, `useAuth.ts`, `useGetUser.ts`)                                                                            | Already matches reference's `hooks/`.                                                                                                                   |
| `lib/`                     | gains `axiosInstance.ts`, `api.ts`, `auth.service.ts`, `auth.ts`, `jwt.ts`, `cookiesAction.ts`; `redux/` and `utils.ts` unchanged | Matches reference's `lib/` holding all API/auth infra.                                                                                                  |
| `providers/`               | **new** — `QueryProvider.tsx` (from `app/QueryProvider.tsx`), `StoreProvider.tsx` (from `lib/redux/provider/StoreProvider.tsx`)   | Matches reference's dedicated `providers/` folder.                                                                                                      |
| `public/`                  | unchanged                                                                                                                         | —                                                                                                                                                       |
| `schemas/`                 | **removed**, contents redistributed (see table below)                                                                             | Reference has no top-level `schemas/`; both files here have a single feature consumer.                                                                  |
| `services/`                | **removed**, contents merged into `lib/`                                                                                          | Reference keeps auth/token infra in `lib/`, not a separate `services/`.                                                                                 |
| `types/`                   | kept, contents partly redistributed (see table below)                                                                             | Reference's top-level `types/` holds only genuinely shared types.                                                                                       |
| `utils/`                   | kept, `axiosInstance.ts`/`api.ts` moved out to `lib/`, `useDebounce.ts` moved to `hooks/`                                         | Matches reference's `utils/` (`buildUrl.ts`, `getChangedFields.ts`, etc. stay) vs. `hooks/` (debounce lives there in reference) split.                  |

### `functions/` and `services/` redistribution

| File                                     | Confirmed consumer(s)                                                                    | Target                                                                                                                                                     |
| ---------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `functions/course.functions.ts`          | `ManageCourse/{AddCourse,UpdateCourse,CourseDetail}.tsx` only                            | `components/main/(Admin)/ManageCourse/functions/course.functions.ts`                                                                                       |
| `functions/module.function.ts`           | `(Instructor) ManageModule/{AddModule,UpdateModule}.tsx` only                            | `components/main/(Instructor)/ManageModule/functions/module.function.ts`                                                                                   |
| `functions/auth.functions.ts`            | `ManageInstructor/AddInstructor.tsx` only                                                | `components/main/(Admin)/ManageInstructor/functions/auth.functions.ts`                                                                                     |
| `functions/video.functions.ts`           | Spans both `(Admin)/ManageModule/ModuleDetail.tsx` **and** three `(Instructor)` features | **Stays at `functions/video.functions.ts`** — genuinely cross-group, not colocatable to one feature.                                                       |
| `functions/review.function.ts`           | **No importer found anywhere in the codebase**                                           | **Stays at `functions/review.function.ts`**, flagged as a dead-code candidate — confirm with you before deleting rather than silently dropping it.         |
| `functions/user.function.ts`             | **No importer found anywhere**                                                           | Same as above — flagged, not deleted.                                                                                                                      |
| `functions/courseEnrollment.function.ts` | **No importer found anywhere**                                                           | Same as above — flagged, not deleted.                                                                                                                      |
| `services/auth.service.ts`               | `lib/redux/features/auth/authSlice.ts`                                                   | `lib/auth.service.ts`                                                                                                                                      |
| `services/auth.ts`                       | `hooks/useAuth.ts`                                                                       | `lib/auth.ts` (note: `progress-tracker.md` already flags a dead commented-out `registration` export in this file — untouched here, still just a path move) |
| `services/jwt.ts`                        | `middleware.ts` (repo root)                                                              | `lib/jwt.ts`                                                                                                                                               |

### `schemas/` redistribution

| File                                | Confirmed consumer(s)                            | Target                                                                                                                               |
| ----------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `schemas/Course.schemas.ts`         | `ManageCourse/{AddCourse,UpdateCourse}.tsx` only | `components/main/(Admin)/ManageCourse/schema/Course.schemas.ts`                                                                      |
| `schemas/User.schemas.ts`           | `ManageInstructor/AddInstructor.tsx` only        | `components/main/(Admin)/ManageInstructor/schema/User.schemas.ts`                                                                    |
| `components/schema/imageSchema.tsx` | **No importer found anywhere**                   | Flagged as dead-code candidate — left in place at `components/shared/schema/imageSchema.tsx` pending your confirmation, not deleted. |

### `types/` redistribution

| File                      | Confirmed consumer(s)                                                                           | Target                                                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `types/course.types.ts`   | `(Admin)/ManageCourse/*` **and** `(Instructor)/ManageModule/*`                                  | **Stays global** at `types/course.types.ts` — genuinely cross-group.                                                              |
| `types/user.types.ts`     | `(Admin)/ManageCourse/*` **and** `functions/auth.functions.ts`                                  | **Stays global** at `types/user.types.ts`.                                                                                        |
| `types/auth.types.ts`     | `functions/auth.functions.ts`                                                                   | **Stays global** (auth is inherently cross-cutting).                                                                              |
| `types/ai.types.ts`       | 3 different public feature folders (`Course`, `CourseDetail`, `MyCourses/EnrolledCourseDetail`) | **Stays global**.                                                                                                                 |
| `types/globalTypes.ts`    | By design/name a shared-shape file                                                              | **Stays global**.                                                                                                                 |
| `types/module.types.ts`   | **No importer found anywhere**                                                                  | **Stays global** (unclear ownership — flagged as possibly dead, not moved into any one feature since that would guess at intent). |
| `types/review.types.ts`   | `(Admin)/ManageReview/ManageReviewPage.tsx` only                                                | `components/main/(Admin)/ManageReview/type/review.types.ts`                                                                       |
| `types/video.types.ts`    | `(Instructor)/ManageVideo/{AddVideo,UpdateVideo}.tsx` only                                      | `components/main/(Instructor)/ManageVideo/type/video.types.ts`                                                                    |
| `types/errorLog.types.ts` | `(Admin)/ErrorLogs/*` only                                                                      | `components/main/(Admin)/ErrorLogs/type/errorLog.types.ts`                                                                        |
| `types/stat.types.ts`     | `(Admin)/Stat/*` only                                                                           | `components/main/(Admin)/Stat/type/stat.types.ts`                                                                                 |

### `components/Dashboard/` → `components/dashboard/` (chrome) + `components/main/(Admin|Instructor|User)/` (feature content)

Per the reference split: nav chrome lives in `components/dashboard/sidebar/`; every actual feature screen — admin dashboard included — lives in `components/main/`.

| Current                                                   | Target                                             |
| --------------------------------------------------------- | -------------------------------------------------- |
| `components/Dashboard/Sidebar.tsx`                        | `components/dashboard/sidebar/Sidebar.tsx`         |
| `components/Dashboard/DashbaordLinks/AdminLinks.tsx`      | `components/dashboard/sidebar/AdminLinks.tsx`      |
| `components/Dashboard/DashbaordLinks/InstructorLinks.tsx` | `components/dashboard/sidebar/InstructorLinks.tsx` |
| `components/Dashboard/DashbaordLinks/UserLinks.tsx`       | `components/dashboard/sidebar/UserLinks.tsx`       |
| `components/Dashboard/profile/ProfilePage.tsx`            | `components/main/Profile/ProfilePage.tsx`          |
| `components/Dashboard/profile/UserProfileSkeleton.tsx`    | `components/main/Profile/UserProfileSkeleton.tsx`  |
| `components/Dashboard/profile/type.ts`                    | `components/main/Profile/type/Profile.type.ts`     |

**Admin features → `components/main/(Admin)/...`**

| Current                                                     | Target                                                |
| ----------------------------------------------------------- | ----------------------------------------------------- |
| `Dashboard/admin/Enrollment/Enrollment.tsx`                 | `(Admin)/Enrollment/Enrollment.tsx`                   |
| `Dashboard/admin/Enrollment/EnrollmentColumns.tsx`          | `(Admin)/Enrollment/column/EnrollmentColumns.tsx`     |
| `Dashboard/admin/ErrorLogs/ErrorLogsPage.tsx`               | `(Admin)/ErrorLogs/ErrorLogsPage.tsx`                 |
| `Dashboard/admin/ErrorLogs/ErrorLogDetailModal.tsx`         | `(Admin)/ErrorLogs/ErrorLogDetailModal.tsx`           |
| `Dashboard/admin/ManageCourse/ManageCourse.tsx`             | `(Admin)/ManageCourse/ManageCourse.tsx`               |
| `Dashboard/admin/ManageCourse/AddCourse.tsx`                | `(Admin)/ManageCourse/AddCourse.tsx`                  |
| `Dashboard/admin/ManageCourse/UpdateCourse.tsx`             | `(Admin)/ManageCourse/UpdateCourse.tsx`               |
| `Dashboard/admin/ManageCourse/CourseDetail.tsx`             | `(Admin)/ManageCourse/CourseDetail.tsx`               |
| `Dashboard/admin/ManageCourse/CourseColumns.tsx`            | `(Admin)/ManageCourse/column/CourseColumns.tsx`       |
| `Dashboard/admin/ManageCourse/CourseDetailColumns.tsx`      | `(Admin)/ManageCourse/column/CourseDetailColumns.tsx` |
| `Dashboard/admin/ManageInstructor/ManageInstructorPage.tsx` | `(Admin)/ManageInstructor/ManageInstructorPage.tsx`   |
| `Dashboard/admin/ManageInstructor/AddInstructor.tsx`        | `(Admin)/ManageInstructor/AddInstructor.tsx`          |
| `Dashboard/admin/ManageModule/ManageModule.tsx`             | `(Admin)/ManageModule/ManageModule.tsx`               |
| `Dashboard/admin/ManageModule/ManageModuleColumns.tsx`      | `(Admin)/ManageModule/column/ManageModuleColumns.tsx` |
| `Dashboard/admin/ManageModule/ModuleDetail.tsx`             | `(Admin)/ManageModule/ModuleDetail.tsx`               |
| `Dashboard/admin/ManageReview/ManageReviewPage.tsx`         | `(Admin)/ManageReview/ManageReviewPage.tsx`           |
| `Dashboard/admin/Stat/StatPage.tsx`                         | `(Admin)/Stat/StatPage.tsx`                           |
| `Dashboard/admin/Stat/AdminStatCard.tsx`                    | `(Admin)/Stat/AdminStatCard.tsx`                      |
| `Dashboard/admin/Stat/AdminStatCardSkeleton.tsx`            | `(Admin)/Stat/AdminStatCardSkeleton.tsx`              |
| `Dashboard/admin/Stat/ChartSkeleton.tsx`                    | `(Admin)/Stat/ChartSkeleton.tsx`                      |
| `Dashboard/admin/Stat/EnrollmentChart.tsx`                  | `(Admin)/Stat/EnrollmentChart.tsx`                    |
| `Dashboard/admin/Stat/RevenueChart.tsx`                     | `(Admin)/Stat/RevenueChart.tsx`                       |

**Instructor features → `components/main/(Instructor)/...`**

| Current                                                                | Target                                                         |
| ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| `Dashboard/instructor/AssignCourse/AssignCourseDetail.tsx`             | `(Instructor)/AssignCourse/AssignCourseDetail.tsx`             |
| `Dashboard/instructor/AssignCourse/ManageAssignCourse.tsx`             | `(Instructor)/AssignCourse/ManageAssignCourse.tsx`             |
| `Dashboard/instructor/AssignCourse/AssignCourseDetailColmn.tsx`        | `(Instructor)/AssignCourse/column/AssignCourseDetailColmn.tsx` |
| `Dashboard/instructor/AssignCourse/ManageCourseColumns.tsx`            | `(Instructor)/AssignCourse/column/ManageCourseColumns.tsx`     |
| `Dashboard/instructor/InstructorModule/InstructorModule.tsx`           | `(Instructor)/InstructorModule/InstructorModule.tsx`           |
| `Dashboard/instructor/InstructorVideoDetail/InstructorVideoDetail.tsx` | `(Instructor)/InstructorVideoDetail/InstructorVideoDetail.tsx` |
| `Dashboard/instructor/ManageModule/AddModule.tsx`                      | `(Instructor)/ManageModule/AddModule.tsx`                      |
| `Dashboard/instructor/ManageModule/UpdateModule.tsx`                   | `(Instructor)/ManageModule/UpdateModule.tsx`                   |
| `Dashboard/instructor/ManageModule/ManageModule.tsx`                   | `(Instructor)/ManageModule/ManageModule.tsx`                   |
| `Dashboard/instructor/ManageModule/ManageModuleColumns.tsx`            | `(Instructor)/ManageModule/column/ManageModuleColumns.tsx`     |
| `Dashboard/instructor/ManageVideo/AddVideo.tsx`                        | `(Instructor)/ManageVideo/AddVideo.tsx`                        |
| `Dashboard/instructor/ManageVideo/UpdateVideo.tsx`                     | `(Instructor)/ManageVideo/UpdateVideo.tsx`                     |
| `Dashboard/instructor/ManageVideo/ManageVideo.tsx`                     | `(Instructor)/ManageVideo/ManageVideo.tsx`                     |
| `Dashboard/instructor/ManageVideo/ManageVideoColumns.tsx`              | `(Instructor)/ManageVideo/column/ManageVideoColumns.tsx`       |

**User features → `components/main/(User)/...`**

| Current                                                     | Target                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------- |
| `Dashboard/user/Certificates/MyCourseCertificates.tsx`      | `(User)/Certificates/MyCourseCertificates.tsx`          |
| `Dashboard/user/Certificates/CertificateDownloadButton.tsx` | `(User)/Certificates/CertificateDownloadButton.tsx`     |
| `Dashboard/user/Certificates/CertificateTableColumn.tsx`    | `(User)/Certificates/column/CertificateTableColumn.tsx` |
| `Dashboard/user/MyCourses/MyEnrolledCourses.tsx`            | `(User)/MyCourses/MyEnrolledCourses.tsx`                |
| `Dashboard/user/MyCourses/EnrolledCourseColumn.tsx`         | `(User)/MyCourses/column/EnrolledCourseColumn.tsx`      |

No name collision with the public `components/main/MyCourses/` below — different parent folder on disk (`(User)/MyCourses/` vs `main/MyCourses/`), and each already maps to a genuinely distinct route/component (`/dashboard/user/my-enrolled-courses` vs `/my-courses` — confirmed by reading both `page.tsx` files).

### `components/main/publicPage/` → `components/main/` (drop the `publicPage` nesting) + `components/main/login/` → `components/main/Login/`

Reference keeps un-grouped feature folders flat directly under `components/main/` (e.g. `Login`, `Production`, `Requisition`) rather than wrapping them in an extra "publicPage" layer.

| Current                                                          | Target                                                                  |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `main/login/LoginPage.tsx`                                       | `main/Login/LoginPage.tsx`                                              |
| `main/login/schema/LoginSchema.ts`                               | `main/Login/schema/LoginSchema.ts`                                      |
| `main/publicPage/AboutUs/AboutUs.tsx`                            | `main/AboutUs/AboutUs.tsx`                                              |
| `main/publicPage/ContactUs/ContactUs.tsx`                        | `main/ContactUs/ContactUs.tsx`                                          |
| `main/publicPage/ContactUs/MapContainer.tsx`                     | `main/ContactUs/MapContainer.tsx`                                       |
| `main/publicPage/course/AiCourseAdvisor.tsx`                     | `main/Course/AiCourseAdvisor.tsx`                                       |
| `main/publicPage/course/CategoryFilter.tsx`                      | `main/Course/CategoryFilter.tsx`                                        |
| `main/publicPage/course/CourseCardSkeleton.tsx`                  | `main/Course/CourseCardSkeleton.tsx`                                    |
| `main/publicPage/course/CourseCard.tsx`                          | `main/Course/CourseCard.tsx`                                            |
| `main/publicPage/course/CoursePage.tsx`                          | `main/Course/CoursePage.tsx`                                            |
| `main/publicPage/course/PriceFilter.tsx`                         | `main/Course/PriceFilter.tsx`                                           |
| `main/publicPage/course/Course.type.ts`                          | `main/Course/type/Course.type.ts`                                       |
| `main/publicPage/courseDetail/AiReviewSummary.tsx`               | `main/CourseDetail/AiReviewSummary.tsx`                                 |
| `main/publicPage/courseDetail/CourseDetailPage.tsx`              | `main/CourseDetail/CourseDetailPage.tsx`                                |
| `main/publicPage/courseDetail/CourseDetailSkeleton.tsx`          | `main/CourseDetail/CourseDetailSkeleton.tsx`                            |
| `main/publicPage/courseDetail/CourseDetailTop.tsx`               | `main/CourseDetail/CourseDetailTop.tsx`                                 |
| `main/publicPage/courseDetail/ReviewInput.tsx`                   | `main/CourseDetail/ReviewInput.tsx`                                     |
| `main/publicPage/courseDetail/UserReviewCard.tsx`                | `main/CourseDetail/UserReviewCard.tsx`                                  |
| `main/publicPage/FAQPage/FAQPage.tsx`                            | `main/FAQPage/FAQPage.tsx`                                              |
| `main/publicPage/FAQPage/FAQSection.tsx`                         | `main/FAQPage/FAQSection.tsx`                                           |
| `main/publicPage/home/*.tsx` (10 files)                          | `main/Home/*.tsx` (same filenames)                                      |
| `main/publicPage/instructor/Instructor.tsx`                      | `main/Instructor/Instructor.tsx`                                        |
| `main/publicPage/MyCourses/MyCourseCard.tsx`                     | `main/MyCourses/MyCourseCard.tsx`                                       |
| `main/publicPage/MyCourses/MyCourseCardSkeleton.tsx`             | `main/MyCourses/MyCourseCardSkeleton.tsx`                               |
| `main/publicPage/MyCourses/MyCourses.tsx`                        | `main/MyCourses/MyCourses.tsx`                                          |
| `main/publicPage/MyCourses/NoEnrollCourse.tsx`                   | `main/MyCourses/NoEnrollCourse.tsx`                                     |
| `main/publicPage/MyCourses/type.ts`                              | `main/MyCourses/type/MyCourses.type.ts`                                 |
| `main/publicPage/MyCourses/EnrolledCourseDetail/*.tsx` (7 files) | `main/MyCourses/EnrolledCourseDetail/*.tsx` (same filenames)            |
| `main/publicPage/MyCourses/EnrolledCourseDetail/type.ts`         | `main/MyCourses/EnrolledCourseDetail/type/EnrolledCourseDetail.type.ts` |

`main/Instructor/` (public instructor-listing page) and `main/(Instructor)/` (dashboard instructor features) are distinct folders — different casing/parens avoids any collision.

### `components/input/` → `components/shared/input/`

All 10 files (`ControlledCheckbox.tsx`, `ControlledInput.tsx`, `ControlledMultiSelectField.tsx`, `ControlledSearchSelectField.tsx`, `ControlledSelectField.tsx`, `ControlledTextArea.tsx`, `DateSelect.tsx`, `FileUploadController.tsx`, `FileUploadControllerPdfImg.tsx`, and the `ControlledTipTapTextEditor/` subfolder intact) move under `components/shared/input/`, matching the reference's `shared/input/Controlled*.tsx` convention.

### `components/shared/` reorganization

| Current                                                                   | Target                                                |
| ------------------------------------------------------------------------- | ----------------------------------------------------- |
| `shared/Breadcrumb.tsx`                                                   | `shared/breadcrumb/Breadcrumb.tsx`                    |
| `shared/PrimaryButton/PrimaryButton.tsx`                                  | `shared/buttons/PrimaryButton.tsx`                    |
| `shared/DeleteModal.tsx`                                                  | `shared/Modal/DeleteModal.tsx`                        |
| `shared/TableLoading.tsx`                                                 | `shared/table/TableLoading.tsx`                       |
| `shared/PageHeader/PageHeader.tsx`                                        | unchanged — no reference equivalent, project-specific |
| `shared/Modal/BaseModal.tsx`, `ModalActionButtons.tsx`                    | unchanged                                             |
| `shared/table/*.tsx` (7 files)                                            | unchanged                                             |
| `shared/Footer.tsx`, `NavBar.tsx`, `FormSubmitLoading.tsx`, `Wrapper.tsx` | unchanged — flat, no reference category fits          |

`components/ui/` — unchanged (shadcn primitives).

### `app/` and `middleware.ts`

No route changes. Every `page.tsx` keeps its route path — only the `import` statement pulling in its rendered component changes to match that component's new path. `middleware.ts`'s only affected import is `./services/jwt` → `./lib/jwt`.

## Implementation steps

1. [x] Move files per the tables above using `git mv` (preserves history) rather than delete+recreate. All ~135 files moved via `git mv`, confirmed as renames in `git status`.
2. [x] For every moved file, update every other file's `import` statement that referenced its old path. Every `@/...`-alias import was fixed via a scripted literal replacement (anchored to the closing quote to avoid prefix collisions like `FileUploadController` vs `FileUploadControllerPdfImg`) covering the full old→new path table (84 replacements across 72 files); the ~20 relative (`./`/`../`) imports broken by files moving into a `type/`/`column/`/`schema/`/`functions/` subfolder, or by the importing file itself relocating a directory level, were fixed individually and verified by inspection.
3. [x] Delete the now-empty `actions/`, `schemas/`, `services/`, `components/Dashboard/`, `components/main/publicPage/`, `components/main/login/`, `components/input/`, `components/schema/`, `components/shared/PrimaryButton/` folders. (`imageSchema.tsx`'s dead-code status was left unresolved per the open question, so it was relocated rather than deleted — to `components/shared/schema/imageSchema.tsx`.) `lib/redux/provider/` was also emptied by the `StoreProvider.tsx` move and removed.
4. [x] Run `yarn lint` and `yarn build`. `node_modules` wasn't installed in this environment; ran `yarn install` first. `yarn lint`: 31 errors/17 warnings, all pre-existing code-quality issues unrelated to file location (`no-explicit-any`, `react-hooks/set-state-in-effect`, `no-img-element`, `no-assign-module-variable`, unused-vars) — zero module-resolution errors. `yarn build`: compiled successfully, all 31 routes generated, TypeScript passed clean.
5. [ ] Manually smoke-test each of the three dashboards (admin/instructor/user) and the public site in the browser. Not done in this session — `yarn build`'s full static generation of all 31 routes with no errors is strong evidence every import resolves correctly, but an actual browser click-through is left for the user, consistent with this environment having no way to log in as each role.
6. [x] Update `lms_client/CLAUDE.md`'s "Frontend" architecture section and `context/architecture.md` to reflect the new paths — done in the same change, plus knock-on fixes to `context/ui-context.md`, `context/code-standards.md`, `context/ai-workflow-rules.md`, and `context/progress-tracker.md`'s "Known Gaps" entry (all had their own stale path references).
7. [x] Update `context/progress-tracker.md`: spec row marked complete below.

## Open questions for your review

1. **Parens or no parens** for `(Admin)`/`(Instructor)`/`(User)` grouping folders under `components/main/` — cosmetic only, pick either.
2. **Dead-code candidates** flagged above (`functions/review.function.ts`, `functions/user.function.ts`, `functions/courseEnrollment.function.ts`, `components/schema/imageSchema.tsx`, `types/module.types.ts`) — this plan leaves them in place (just possibly relocated per the tables) rather than deleting; confirm whether you want them deleted outright once the move is done, or kept as-is.
3. **Redux and the `functions/*.functions.ts` layer** are being kept per "Deliberate deviations" above — confirm that's right, since a folder-structure-only pass is the wrong time to reconsider either.

## Verify When Done

- [x] `yarn lint` clean — no new errors introduced by the move. Confirmed: all 31 errors/17 warnings are pre-existing code-quality issues unrelated to import paths (verified none are on lines this migration touched, which were exclusively import statements).
- [x] `yarn tsc --noEmit` / `yarn build` clean — no broken import paths anywhere. `yarn build` compiled successfully and generated all 31 routes.
- [ ] Manual browser pass: public site (home, courses, course detail, about/contact/faqs/instructors, login/sign-up, my-courses), admin dashboard (all listed features), instructor dashboard (all listed features), user dashboard (enrolled courses, certificates), profile/change-password — every page renders with no console errors and no visual difference from before the move. **Left for the user** — this session verified via `yarn build`'s static generation succeeding for every route, not an actual browser click-through.
- [x] `git diff --stat` shows only renames/moves (`git mv`) plus import-line edits — no unintended content changes to any component's logic. Confirmed via `git status --short`: 133 `R` (rename) entries plus a small set of `M` entries, every one of which is a `page.tsx` wrapper's import line or one of the ~20 identified relative-import fixes — no component logic touched.
