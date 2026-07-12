# Unit 01: My Courses — List Page Redesign

## Goal

Bring `/my-courses` (the enrolled-courses list) up to the same visual quality and pattern already established on the public course catalog (`/courses`), so the site feels like one consistent design system. This is a presentation-only change — no API contract or data-fetching logic changes.

## Scope

| File                                                            | Role                                                                                                                    |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `app/(main)/my-courses/page.tsx`                                | Route entry, renders `<MyCourses />`. No changes expected here.                                                         |
| `components/main/publicPage/MyCourses/MyCourses.tsx`            | Page shell: header, layout container, loading/empty/list states.                                                        |
| `components/main/publicPage/MyCourses/MyCourseCard.tsx`         | Individual enrolled-course card.                                                                                        |
| `components/main/publicPage/MyCourses/MyCourseCardSkeleton.tsx` | Loading skeleton, must match the new card shape.                                                                        |
| `components/main/publicPage/MyCourses/NoEnrollCourse.tsx`       | Empty state — already fine, no design complaint against it; leave as-is unless it visually clashes with the new layout. |
| `components/main/publicPage/MyCourses/type.ts`                  | `TUserEnrolledCourse` type — read-only reference, not expected to change.                                               |

## Current State (as of this spec)

- `MyCourses.tsx` renders enrolled courses as a **vertical stack of horizontal cards** (`flex flex-col gap-5`), each full-width.
- `MyCourseCard.tsx` is a horizontal card: cover image on the left (`sm:w-48`), name/progress/CTA on the right. No category badge, no hover treatment beyond a shadow bump, no gradient overlay on the cover.
- `TUserEnrolledCourse.completed` (a boolean) exists on the data but is **never used** in `MyCourseCard.tsx` — a fully completed course looks identical to one at 1% progress except for the progress bar's fill amount.
- Loading state (`MyCourseCardSkeleton.tsx`) and empty state (`NoEnrollCourse.tsx`) already exist and work correctly.

## Reference Pattern

The public catalog (`components/main/publicPage/course/CoursePage.tsx` + `CourseCard.tsx`) already solves this well and should be the visual reference:

- Responsive grid: `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5`.
- Card: `rounded-2xl` white surface, `border border-gray-100`, `hover:shadow-xl hover:border-indigo-100`, cover image with `group-hover:scale-105` zoom and a `bg-gradient-to-t from-black/30 to-transparent` overlay.
- Category badge: a plain styled `<span>` positioned `absolute top-3 left-3` over the cover image (`bg-white/95 backdrop-blur-sm text-prime-100 text-xs font-semibold px-3 py-1 rounded-full shadow-sm`) — **not** a shadcn `Badge` component (none exists in `components/ui/` currently; don't add one just for this — match the existing span pattern instead).
- Page header: centered `text-prime-50` eyebrow label + `text-3xl font-bold` title, same pattern `MyCourses.tsx` already uses — keep this as-is, it already matches.

## Design

1. **Layout:** change `MyCourses.tsx`'s list container from `flex flex-col gap-5` to the same responsive grid as `CoursePage.tsx` (`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5`).
2. **Card shape:** convert `MyCourseCard.tsx` from a horizontal (image-left, content-right) layout to a vertical card matching `CourseCard.tsx`'s structure: cover image on top (fixed height, e.g. `h-48`), content below.
3. **Cover treatment:** add the same hover-zoom (`group` + `group-hover:scale-105`) and gradient overlay as `CourseCard.tsx`.
4. **Category badge:** add the course category as a floating badge on the cover, using `courseData.course.category` — **note:** confirm this field is actually present on the enrolled-course API response (`TUserEnrolledCourse.course.category` already exists in `type.ts`, so it's available — just currently unused in the card).
5. **Completed state:** when `courseData.completed === true`, replace the progress bar + percentage with a distinct "Completed" indicator (e.g. a green badge/checkmark row in the same slot), and change the CTA button text from "Continue" to something like "Review Course" (still linking to `/my-courses/[id]`). When not completed, keep the existing `<Progress value={courseData.courseProgress}>` + percentage exactly as today.
6. **CTA:** keep the "Continue" button and its `Link` to `/my-courses/${courseData.course._id}` — only restyle to match `CourseCard.tsx`'s button treatment (`rounded-lg`, sizing) for visual consistency; the destination and behavior don't change.
7. Keep `NoEnrollCourse.tsx` untouched unless its centered empty-state layout looks out of place inside the new grid container (it renders full-width regardless of grid via `col-span-full`-style centering — verify visually once the grid is in place, adjust only if actually broken).

## Implementation Notes

- No new dependencies — reuse the existing shadcn `Button` and `Progress` components (`components/ui/button.tsx`, `components/ui/progress.tsx`) and `lucide-react` icons already imported elsewhere in the codebase (e.g. `CheckCircle2` or similar for the completed state, matching icons already used in `ModuleShowData.tsx`'s `CircleCheckBig`).
- `hooks/useApi.ts`'s `useFetchData` call in `MyCourses.tsx` (`[user-enroll-courses]`, `/enroll/user-all-enrolled-couses`) is unchanged — this is a rendering-only pass.
- Update `MyCourseCardSkeleton.tsx` to mirror the new vertical card shape (cover-on-top, then stacked skeleton lines) instead of the current horizontal skeleton.

## Verify When Done

- [x] `/my-courses` renders enrolled courses in a responsive grid (1 col mobile, 2 col `sm`, 3 col `md+`), matching `/courses`' breakpoints.
- [x] Cards show a category badge, hover zoom/shadow, and gradient overlay consistent with `/courses`.
- [x] A completed course is visually distinguishable from an in-progress one.
- [x] Loading skeleton shape matches the new card layout (no layout shift between skeleton and loaded card).
- [x] Empty state (`NoEnrollCourse`) still renders correctly when the user has zero enrollments.
- [x] "Continue"/CTA still links to `/my-courses/[id]` with the correct course id.
- [x] `yarn lint` and `yarn build` pass cleanly.

Visual pass confirmed by the user. Spec complete.
