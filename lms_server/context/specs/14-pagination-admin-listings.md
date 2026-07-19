# 14 — Pagination for currently-unpaginated admin/listing endpoints

## Goal

Apply the pagination pattern that already exists and works (`course.service.ts::getAllCourses`) to the listing endpoints that currently return everything in one unbounded query — a scalability gap that becomes a real problem as course/instructor/review counts grow, and a common thing interviewers probe ("what happens when this table has 10,000 rows?").

## Current State

Confirmed unpaginated (no `limit`/`skip`/`page` handling at all):

- `course.service.ts::getAllCoursesForAdmin` — `courseModel.find()`, no filter, no limit, populates instructors on every result.
- `course.service.ts::getAllCoursesWithModules` — same, plus populates `modules` on every result (heavier per-document cost).
- `review.service.ts::getCourseReview` — `reviewModel.find({ courseId })`, unbounded (a popular course with thousands of reviews would return them all in one response).
- `user.service.ts::getAllInstructor` — `userModel.find({ userRole: instructor, isDeleted: false })`, unbounded.

Already correct, reference pattern to copy: `course.service.ts::getAllCourses` — takes `{ searchTerm, category, limit = 10, page = 1 }` from `query`, computes `skip = (page - 1) * limit`, returns `{ data, meta: { totalCourses } }`.

## Implementation

For each of the four functions above:

1. Change the signature to accept a `query: Record<string, unknown>` (or extend the existing signature) with `limit = 10, page = 1` defaults, following `getAllCourses`'s exact destructuring/`skip` calculation.
2. Add `.limit(numericLimit).skip(skip)` to the Mongoose query.
3. Add a `countDocuments(...)` call with the same filter to compute `meta.total`, returned alongside `data` in the same `{ data, meta: { total } }` shape `getAllCourses` already uses, so the frontend's pagination-consuming code (if any exists) has one consistent response shape to work against.
4. Update the corresponding controllers to pass `req.query` through, and routes need no changes (query params, not path params).
5. Frontend impact: whichever admin pages currently call these four endpoints (`ManageCourse`, `ManageInstructor`, course-detail reviews list) will start receiving paginated results instead of everything at once — check whether they currently render "load more"/page controls or just dump the array; if the latter, they'll silently show only page 1 (10 items) after this change. **Flag this explicitly rather than fixing silently** — the frontend pages consuming these endpoints need matching pagination UI, which is a separate frontend concern (not scoped into this backend-only spec; note it in `progress-tracker.md` as a follow-up if this spec is implemented before a matching frontend pass).

## Dependencies

- No new packages — reuses the existing `getAllCourses` pattern verbatim.

## Verify When Done

- [ ] `yarn build` and `yarn lint` clean.
- [ ] Each of the four endpoints accepts `?page=&limit=` and returns the correct slice + accurate `meta.total`.
- [ ] Default behavior (`no query params`) doesn't silently drop data below 10 items where a caller expects "all" — spot-check each frontend consumer of these four endpoints to confirm whether it needs an explicit `?limit=999` bump or real pagination UI before this ships (see the note above).
