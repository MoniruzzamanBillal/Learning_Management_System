# 23 — Admin course-detail endpoints don't filter soft-deleted modules/videos

## Goal

`course.service.ts`'s `getCourseDetailsForAdmin`, `getAllCoursesWithModules`, and `getCourseDetailForInstructor` should only return active (`isDeleted: false`) modules — and, where videos are nested, only active videos — matching the explicit-soft-delete-filter convention already followed everywhere else `Module`/`Video` is queried (`architecture.md`'s invariant, and the working reference implementation in `courseModule/module.service.ts::getModuleFromCourseId`).

## How this was found

Found visually while confirming the course-seed-data import (`context/specs/21-course-seed-data-import.md`) looked right in the browser: `/dashboard/admin/course-detail/:courseId` showed **5 modules** for "Frontend Development Using React" instead of the real 4 — a leftover soft-deleted duplicate module (created and then soft-deleted mid-session while fixing the seed script's idempotency, per spec 21 issue #5) was still showing up, with a "0 videos" count. The *real* Module 1 also showed **6 videos** instead of 5 — a soft-deleted debug video (created and then soft-deleted while verifying the `AddVideo.tsx` fix, per `lms_client` spec 20's verify note) was still being counted.

The equivalent instructor-facing view (`/dashboard/instructor/assign-course-detail/:courseId`, backed by `courseModule/module.service.ts::getModuleFromCourseId`) correctly showed only the 4 real modules with correct video counts throughout — confirming this is specific to the admin-side queries, not a real data problem (the seed data itself is correct; this is a display-layer bug).

## Current State

Three functions in `course.service.ts` build `modules`/nested `videos` via a plain Prisma relation `select`/`include` with **no `where` clause**, so Prisma includes every related row regardless of `isDeleted`:

```ts
// getCourseDetailsForAdmin (~line 312)
modules: {
  select: {
    id: true,
    courseId: true,
    title: true,
    instructorId: true,
    videos: { select: { id: true } },   // no isDeleted filter
  },
},                                        // no isDeleted filter on modules either

// getAllCoursesWithModules (~line 232) — identical gap, plus `isDeleted: true` selected
// (already exposes the flag but doesn't filter by it)

// getCourseDetailForInstructor (~line 344)
modules: { select: { id: true } },        // no isDeleted filter
```

Compare with the already-correct pattern used elsewhere in this exact module tree (`courseModule/module.service.ts::getModuleFromCourseId`):

```ts
const result = await prisma.module.findMany({
  where: { courseId, isDeleted: false },
  // …
});
```

## Proposed Implementation

Add a `where: { isDeleted: false }` inside each relation `select`/`include`, at both the `modules` level and the nested `videos` level wherever videos are included — Prisma supports filtering a to-many relation this way (`relationName: { where: {...}, select: {...} }`), not just at the top-level query:

```ts
// getCourseDetailsForAdmin / getAllCoursesWithModules
modules: {
  where: { isDeleted: false },
  select: {
    id: true,
    courseId: true,
    title: true,
    instructorId: true,
    videos: {
      where: { isDeleted: false },
      select: { id: true },
    },
  },
},

// getCourseDetailForInstructor
modules: { where: { isDeleted: false }, select: { id: true } },
```

No shape/type changes — this only narrows which rows are included, the response contract stays identical.

## Dependencies

None — same Prisma relation-filter capability already used at the top level throughout this codebase.

## Verify When Done

- [x] `GET /course/admin-course-detail/:courseId` for "Frontend Development Using React" returns exactly 4 modules (not 5), and Module 1 reports exactly 5 videos (not 6) — verified via `curl` against the live soft-deleted leftovers this bug was found from, and confirmed visually in the browser (Playwright screenshot of `/dashboard/admin/course-detail/:id`) after the fix.
- [ ] `GET /course/all-courses-modules` (`getAllCoursesWithModules`) shows the same corrected counts — same fix applied, not separately re-verified live (no leftover soft-deleted data exists under this specific endpoint to reproduce against).
- [ ] `GET /course/instructor-course-detail/:courseId` module count also excludes soft-deleted modules — same fix applied, not separately re-verified live.
- [x] `yarn lint` clean in `lms_server`, no new errors in `course.service.ts` (same pre-existing baseline as before this change).
