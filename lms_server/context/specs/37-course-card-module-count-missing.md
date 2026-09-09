# 37. Fix: course card module count always shows 0

## Goal

The course card (`CourseCard.tsx`) is designed to show a "N Modules" count next to the rating, but it always renders "0 Modules" for every course, on every page that uses it (`/courses` catalog, homepage "Popular Courses"). Make the count reflect the course's real (non-deleted) module count.

## Root cause

`CourseCard.tsx` (line 68) renders:

```tsx
<span>{course.modules?.length ?? 0} Modules</span>
```

i.e. it expects a `modules` array on the course object and derives the count client-side with `.length`. But the endpoint both consumers of `CourseCard` call — `GET /course/all-courses` (`CoursePage.tsx`, `Home/PopularCourse.tsx`) — is backed by `getAllCourses` in `lms_server/src/app/modules/course/course.service.ts`, which selects rows via `courseListSelect` (lines 104-116):

```ts
const courseListSelect = {
  id: true,
  name: true,
  price: true,
  category: true,
  courseCover: true,
  aiReviewSummary: true,
  aiReviewSummaryReviewCount: true,
  instructors: {
    select: { instructor: { select: { id: true, name: true } } },
  },
  reviews: { select: { rating: true } },
} satisfies Prisma.CourseSelect;
```

There is no `modules` field and no `_count` aggregate here at all, so every course object returned from this endpoint has no `modules` key — `course.modules` is always `undefined`, and `?? 0` silently masks it. The frontend `TCourse` type (`lms_client/components/main/Course/type/Course.type.ts`) even declares `modules: string[]` as a required field, which is misleading — the field genuinely never arrives at runtime from this endpoint.

Other course-fetching functions in the same service file (`getAllCoursesWithModules`, `getCourseDetailsForAdmin`, `getCourseDetailForInstructor`) do fetch modules, but only for admin/instructor management screens — not for the public listing that feeds `CourseCard`.

## Design

Add a Prisma relation count to the existing list query rather than fetching full module rows (cheaper — a single count, not N module records per course), counting only non-deleted modules (per this codebase's convention of filtering `isDeleted: false` on `Module` explicitly per query, since there's no global Prisma middleware for it post-migration).

### 1. `lms_server/src/app/modules/course/course.service.ts`

In `courseListSelect` (lines 104-116), add:

```ts
_count: {
  select: { modules: { where: { isDeleted: false } } },
},
```

In `shapeCourseListItem` (lines 124-138), destructure `_count` out and map it to a clean, purpose-named field instead of leaking Prisma's `_count` shape into the public API:

```ts
const shapeCourseListItem = (course: TCourseListRow) => {
  const { instructors, reviews, _count, ...rest } = course;
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  return {
    ...rest,
    instructors: instructors.map((ci) => ci.instructor),
    totalModules: _count.modules,
    ...(totalReviews > 0
      ? { reviewData: { averageRating, totalReviews, id: rest.id } }
      : {}),
  };
};
```

`TCourseListRow` (line 118-120) is inferred from `typeof courseListSelect`, so it picks up `_count` automatically — no manual type edit needed there.

This only touches `getAllCourses` (the endpoint `CourseCard` actually depends on). `getSingleCoureData` (course detail page), `getAllCoursesForAdmin`, and the modules-fetching functions are untouched — none of their consumers render a module count today, so extending them is out of scope (see below).

### 2. `lms_client/components/main/Course/type/Course.type.ts`

Replace the misleading required `modules: string[]` with what the API actually returns:

```ts
totalModules?: number;
```

(optional, matching the `reviewData?` pattern already in this type, since older cached responses or other future consumers of this type shouldn't be assumed to always carry it).

### 3. `lms_client/components/main/Course/CourseCard.tsx`

Line 68, change:

```tsx
<span>{course.modules?.length ?? 0} Modules</span>
```

to:

```tsx
<span>{course.totalModules ?? 0} Modules</span>
```

Fixing the shared type + shared `CourseCard` component fixes both `CoursePage.tsx` and `Home/PopularCourse.tsx` at once, since both just map `TCourse[]` into `<CourseCard course={course} />`.

## Explicitly out of scope

- `getSingleCoureData` (course detail page `/courses/[id]`) — its consumer (`CourseDetailPage.tsx`) doesn't render a module count today; adding one there is a separate feature, not this bug fix. **Update:** this turned out to already render a module count (`CourseDetailTop.tsx`'s `courseDetails?.modules?.length`, against a `CourseDetailType.modules: string[]` field nothing ever populated) — the same underlying gap, just missed during this spec's original investigation. It also turned out to be build-blocking, not just cosmetic: `Course.type.ts`'s `modules` → `totalModules` change below made `TCourse` no longer satisfy `CourseDetailType`, breaking `yarn build`. Fixed in the same style as this spec (see `lms_client/context/progress-tracker.md`'s "Fixed the `yarn build` failure..." entry).
- `getAllCoursesForAdmin` (admin's own course table) — separate endpoint/UI, doesn't use `CourseCard`.
- `MyCourseCard.tsx` (enrolled-courses grid) — doesn't show a module count at all today; not part of this bug report.

## Implementation

1. `lms_server/src/app/modules/course/course.service.ts` — add `_count` to `courseListSelect`, map it to `totalModules` in `shapeCourseListItem`.
2. `yarn build` / `yarn lint` clean in `lms_server`.
3. `lms_client/components/main/Course/type/Course.type.ts` — replace `modules: string[]` with `totalModules?: number`.
4. `lms_client/components/main/Course/CourseCard.tsx` — read `course.totalModules` instead of `course.modules?.length`.
5. `yarn lint` clean in `lms_client`.

## Verify-when-done

- [ ] `GET /course/all-courses` response includes `totalModules` as a number per course (curl/Postman check).
- [ ] A course with 3 non-deleted modules and 1 soft-deleted module reports `totalModules: 3`, not 4.
- [ ] A course with 0 modules reports `totalModules: 0`.
- [ ] `/courses` catalog page and homepage "Popular Courses" section both render the real module count on each card, not "0 Modules".
- [ ] `yarn build` / `yarn lint` clean in both apps.
