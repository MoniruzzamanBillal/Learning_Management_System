# 24. Enrolled-course detail leaks soft-deleted module

## Goal

Fix `CourseEnrollment.service.ts::getUserEnrolledCourse` (backs `GET /enroll/my-enrolled-course/:courseId`, used by `EnrollCourseDetail.tsx`) so it stops returning soft-deleted modules to students.

## How found

While testing the watch-video flow as a real enrolled user (`user1@gmail.com`, "Frontend Development Using React"), the module accordion on `/my-courses/[id]` showed **5** module entries instead of 4 — "Module 1: Getting Started with React & Core Concepts" appeared twice, once in its natural position and once again at the very end of the list. Reproduced on a fresh page load (not a client-render artifact) and confirmed at the DB level:

```
Module 1: Getting Started with React & Core Concepts   isDeleted=false   (real)
Module 1: Getting Started with React & Core Concepts   isDeleted=true    (leftover from a prior debugging cleanup, spec 21)
Module 2 / 3 / 4                                        isDeleted=false
```

The `isDeleted=true` row is the duplicate-module cleanup artifact from `context/specs/21-course-seed-data-import.md`'s "Issues found and fixed" section (soft-deleted rather than hard-deleted, since there's no delete-module API) — it was expected to stay invisible everywhere, per the project's `isDeleted: false` filtering convention (`User`/`Module`/`Video`/`Review`, see `architecture.md`).

## Root cause

`CourseEnrollment.service.ts::getUserEnrolledCourse` (lines ~196-201) selects the `modules` relation — and its nested `videos` — with no `where: { isDeleted: false }`:

```ts
course: {
  select: {
    id: true, name: true, category: true,
    modules: {
      select: {
        id: true, title: true,
        videos: { select: { id: true } },
      },
    },
  },
},
```

This is the same class of gap fixed in `context/specs/23-admin-course-detail-soft-delete-filter.md` for 3 admin-facing `course.service.ts` functions — but this one is a different function/module (`CourseEnrollment.service.ts`) that spec's scope didn't touch, so it was still leaking a soft-deleted module straight into the student-facing "my enrolled course" view.

## Fix

Add `where: { isDeleted: false }` to both the `modules` and nested `videos` selects, matching the already-correct sibling function `getModuleDataEnrlledCourse` in the same file:

```ts
modules: {
  where: { isDeleted: false },
  select: {
    id: true, title: true,
    videos: { where: { isDeleted: false }, select: { id: true } },
  },
},
```

## Verify when done

- [x] DB query confirms course `521569b3-70a3-4f2f-93ab-4ba1e842b42f` has one soft-deleted "Module 1" duplicate alongside 4 real modules.
- [ ] After fix, `curl /api/enroll/my-enrolled-course/:courseId` (authenticated as an enrolled user) returns exactly 4 modules.
- [ ] Real UI: `/my-courses/[id]` accordion shows exactly 4 modules, no duplicate.
- [ ] `yarn lint` clean on the touched file.
