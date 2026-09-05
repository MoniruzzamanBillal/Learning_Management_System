# 33 — split assignment create/edit from grading into separate pages

## Goal

User feedback (after spec 32): assignment creation/update and grading a
submission are different concerns and shouldn't live in the same
component/page. Split `ManageAssignment.tsx` (which rendered the
create/edit form, delete button, *and* `SubmissionsTable` all together)
into two separate pages.

## Design

- `ManageAssignment.tsx` (route: `/dashboard/instructor/manage-assignment/[moduleId]`) —
  now only the create/edit form + delete button. Once an assignment
  exists, shows a "View & grade submissions →" link to the new page.
- New `GradeAssignment.tsx` (route: `/dashboard/instructor/grade-assignment/[moduleId]`) —
  fetches the module's assignment (`GET /assignment/manage/:moduleId`,
  same call `ManageAssignment.tsx` already makes) purely to get its
  `id`, then renders the existing `SubmissionsTable.tsx` unchanged. If
  no assignment exists yet for the module, shows an empty state linking
  back to the create form instead of erroring. Also links back to
  "Edit assignment".
- Nav: added a new always-visible "Grade Assignment" (`ClipboardCheck`
  icon) row action next to "Manage Assignment" in both
  `ManageModule.tsx` and `AssignCourseDetailColmn.tsx`. Restored
  `hidden: isPublished` on "Manage Assignment" itself — now that it's
  content-editing only (title/instructions/due date/delete), it fits
  the same post-publish content lock as "Update Module"/"Add New
  Video"/"Manage Quiz". "Grade Assignment" has no `hidden` flag, so
  grading stays reachable regardless of publish state — this is what
  spec 32 actually needed; splitting into two pages made it possible to
  restore the lock on editing while keeping grading always open.

No backend changes — `SubmissionsTable.tsx`, `assignment.functions.ts`,
and all API endpoints are untouched.

## Verify when done

- [x] `npx tsc --noEmit` clean.
- [x] `yarn lint`: 28 errors/17 warnings, unchanged baseline, zero issues
      in any new/touched file.
- [x] `yarn build` clean; new route
      `/dashboard/instructor/grade-assignment/[moduleId]` generated.
- [ ] Manual browser check: on an unpublished course, "Manage
      Assignment" is visible and "Grade Assignment" is also visible; on
      a published course, only "Grade Assignment" shows. Confirm
      grading/reopen still works from the new page, and the "View &
      grade submissions"/"Edit assignment" cross-links navigate
      correctly.
