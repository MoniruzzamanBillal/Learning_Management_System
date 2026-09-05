# 32 — Manage Assignment link hidden after publish (grading unreachable)

## Goal

User report: "there is no system to mark assignment from the instructor side." Grading was already fully implemented (backend `PATCH /assignment/grade/:submissionId`/`PATCH /assignment/reopen/:submissionId`, frontend `SubmissionsTable.tsx` inside `ManageAssignment.tsx`) — the bug was that the only two nav links to that page were unreachable exactly when needed.

## Root cause

`ManageModule.tsx` and `AssignCourseDetailColmn.tsx` both applied `hidden: isPublished` to their "Manage Assignment" row action, copied from the same flag on "Update Module"/"Add New Video"/"Manage Quiz" (correctly locking structural content edits post-publish). But `ManageAssignment.tsx` also hosts `SubmissionsTable.tsx`, the grading view — and students can only enroll in and submit assignments for a **published** course (`ValidateCourseAccess`). So the one entry point to grading disappeared exactly when real submissions existed to grade.

Confirmed via exploration that "Manage Quiz" has no equivalent results/attempts view (quiz is fully auto-graded, content-edit only), so it correctly keeps `hidden: isPublished` — only "Manage Assignment" was wrong.

## Fix

Removed `hidden: isPublished` from the "Manage Assignment" action object in:
- `components/main/(Instructor)/ManageModule/ManageModule.tsx`
- `components/main/(Instructor)/AssignCourse/column/AssignCourseDetailColmn.tsx`

All other actions ("Update Module", "Add New Video", "Manage Quiz") unchanged. No backend changes — `ManageAssignment.tsx` already allowed editing/deleting the assignment regardless of publish state, so this only makes an already-existing page reachable, not a new capability.

## Verify when done

- [x] `yarn lint` — no new issues in either touched file (pre-existing 28-error/17-warning baseline unchanged).
- [ ] Manual browser check: on a **published** course, confirm "Manage Assignment" now shows in row actions (both the ManageModule accordion and AssignCourseDetail table views) while "Update Module"/"Add New Video"/"Manage Quiz" stay hidden.
- [ ] Manual browser check: grade a real submission (score + feedback) and reopen it from that page on a published course.
