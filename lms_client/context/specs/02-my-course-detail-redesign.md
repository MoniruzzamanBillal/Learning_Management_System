# Unit 02: My Course Detail / Player Page Redesign

## Goal

Give the enrolled-course video-player page (`/my-courses/[id]`) a real page header, visible progress, and consistent card/surface treatment matching the site's established visual language — without changing any data-fetching, video-playback, or progress-tracking behavior. This is a presentation-only change.

## Scope

| File                                                                                         | Role                                                                                                                                                              |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/(main)/my-courses/[id]/page.tsx`                                                        | Route entry, resolves `id` param, dynamically imports `EnrollCourseDetail` with `EnrolledCourseDetailSkeleton` as the loading fallback. No changes expected here. |
| `components/main/publicPage/MyCourses/EnrolledCourseDetail/EnrollCourseDetail.tsx`           | Main page component: fetches enrollment/course data, holds video + progress state, renders video area + module sidebar + complete-course button.                  |
| `components/main/publicPage/MyCourses/EnrolledCourseDetail/ModuleShowData.tsx`               | Accordion of modules → videos, with locked/unlocked/watched status icons.                                                                                         |
| `components/main/publicPage/MyCourses/EnrolledCourseDetail/NoVideoPlaceholder.tsx`           | Placeholder shown before a video is selected.                                                                                                                     |
| `components/main/publicPage/MyCourses/EnrolledCourseDetail/VideoLoadingSkeleton.tsx`         | Loading state shown while a video is being fetched.                                                                                                               |
| `components/main/publicPage/MyCourses/EnrolledCourseDetail/EnrolledCourseDetailSkeleton.tsx` | Full-page skeleton shown during the initial dynamic import / data fetch.                                                                                          |
| `components/main/publicPage/MyCourses/EnrolledCourseDetail/type.ts`                          | `TModule`, `TCourse`, `TEnrollCourseDetail` — read-only reference.                                                                                                |

## Current State (as of this spec)

- `EnrollCourseDetail.tsx` fetches `TEnrollCourseDetail` (via `useFetchData` on `/enroll/my-enrolled-course/:id`), which includes `course.name` and `course.category` — **but neither is ever rendered.** There is no page title, no confirmation of which course the user is on beyond the URL.
- No breadcrumb or back-link to `/my-courses`.
- `courseProgress` is tracked in local state and updated after each video fetch (see `ModuleShowData.tsx`'s `handleGetVideo`), but it is **only used as a boolean gate** (`courseProgress === 100`) to reveal the "Mark as Completed" button — it's never rendered as a visible progress bar, unlike the list page's `MyCourseCard.tsx`, which does show one.
- The page body is two bare flex columns (`leftVideoSection` / `rightSection`) with no card/surface wrapper — no `bg-white`, no `rounded-*`, no `shadow`. This is inconsistent with the rest of the site, where content sits in white rounded cards (`MyCourseCard`, `CourseCard`, and even this page's own `NoVideoPlaceholder`, which _does_ have card styling that the rest of the page lacks).
- Column widths use one-off Tailwind arbitrary values (`sm:w-[70%] lg:w-[60%]` for video, `sm:w-[30%] lg:w-[40%]` for the module sidebar) not tied to any documented breakpoint in `context/ui-context.md`.
- `ModuleShowData.tsx`'s accordion items use ad hoc styling: `bg-prime-50/10` background, and hardcoded `text-red-600` (locked), `text-green-700` (watched), `text-blue-600` (unlocked) icon colors that don't come from the project's documented token set (`context/ui-context.md`).
- The "Mark as Completed" button only appears once `courseProgress === 100` and `!completed`; after clicking, `handleMarkCompleteCourse` shows a `toast.success` but the button/page state doesn't visibly reflect "this course is now completed" afterward (relies on a query invalidation + refetch of `enroll-course-detail-${id}`, which will eventually flip `enrolledCourseData.data.completed` to `true`, but there's no dedicated "completed" visual state defined for that case).

## Design

1. **Page header:** add a header row above the two-column layout showing `enrolledCourseData.data.course.name` (large heading) and `course.category` (small eyebrow/badge, matching the styling pattern already used elsewhere — e.g. `text-prime-50 text-xs font-semibold tracking-widest uppercase`, as seen in `MyCourses.tsx` and `CoursePage.tsx`). Include a back-link to `/my-courses` (e.g. an arrow icon + "Back to My Courses").
2. **Progress bar:** render the tracked `courseProgress` state as a visible `<Progress>` bar (same shadcn component already used in `MyCourseCard.tsx`) in the header area, with the percentage shown next to it. This makes the existing state visible instead of only using it as an internal gate.
3. **Surface treatment:** wrap the video area in a `bg-white rounded-2xl shadow-sm border border-gray-100` container (matching `NoVideoPlaceholder.tsx`'s existing card styling, so the video player and its placeholder/loading states share one consistent frame). Wrap the module accordion sidebar in the same card treatment.
4. **Layout widths:** replace the arbitrary `w-[70%]/w-[60%]` / `w-[30%]/w-[40%]` splits with a clearer two-column layout — e.g. `lg:grid lg:grid-cols-[1fr_360px] gap-6` (or similar), avoiding one-off percentage math. Keep the existing stack-on-mobile behavior (single column below `sm`/`lg`).
5. **Module list restyle:** in `ModuleShowData.tsx`, replace the hardcoded `bg-prime-50/10` / raw red-600/green-700/blue-600 icon colors with a small, consistent status-color scheme (e.g. muted gray for locked, `text-prime-100` for unlocked, a success green already used elsewhere in the codebase for watched) — the goal is visual consistency, not changing which icon represents which state (`Lock`/`LockOpen`/`CircleCheckBig` stay as-is functionally).
6. **Completion state:** once `enrolledCourseData.data.completed === true`, replace the "Mark as Completed" button area with a clear completed indicator (e.g. a green "Course Completed" badge/row with a checkmark), instead of the button simply disappearing. Keep the existing `handleMarkCompleteCourse` mutation call (`PATCH /enroll/complete-my-course/:id`) and its `toast.success` unchanged.
7. Leave `VideoLoadingSkeleton.tsx` and `EnrolledCourseDetailSkeleton.tsx` functionally as-is; only adjust their surrounding container classes if needed so they sit correctly inside the new card wrappers from step 3 (no layout shift when a skeleton is replaced by real content).

## Implementation Notes

- **No data-layer changes.** `useFetchData`, `usePatch`, and the `apiGet` calls inside `ModuleShowData.tsx`'s `handleGetVideo` are all out of scope — this is a presentation-only pass over existing state and existing API responses.
- No new dependencies — reuse `components/ui/progress.tsx`, `components/ui/accordion.tsx`, `components/ui/button.tsx`, and `lucide-react` icons already imported in these files. Do not introduce a shadcn `Badge` component (none exists in `components/ui/` yet) — follow the existing plain-`<span>` badge pattern from `CourseCard.tsx` if a badge-like element is needed.
- `MuxPlayer` usage in `EnrollCourseDetail.tsx` (playback props, `src`, `streamType`, etc.) must remain functionally unchanged — only its wrapping container may gain card styling.

## Verify When Done

- [x] Course name and category are visible on page load, without needing to select a video.
- [x] A back-link to `/my-courses` is present and works.
- [x] The progress bar reflects `courseProgress` and updates after watching/completing a video, matching the existing state-update behavior.
- [x] Video area and module sidebar are visually consistent (white rounded card) with the rest of the site.
- [x] Locked / unlocked / watched module-video states remain functionally identical (same click behavior, same icons) — only the color treatment changes.
- [x] Completing a course still calls `PATCH /enroll/complete-my-course/:id` and now shows a persistent "completed" visual state afterward, not just a toast.
- [x] Responsive: single column on mobile, two-column layout on `lg`+, with no layout shift versus the skeleton states.
- [x] `yarn lint` and `yarn build` pass cleanly.

Visual pass confirmed by the user. Spec complete.
