# 31. Add "Manage Quiz" / "Manage Assignment" row actions to `AssignCourseDetail`

## Goal

Instructors have no way to reach assignment grading (or quiz management) from `/dashboard/instructor/assign-course-detail/[courseId]` — the module table on that page only offers "View Details", "Update Module", and "Add New Video". The grading UI itself is fully built and already E2E-verified (`context/specs/30-assignment-ui.md`, `29-module-quiz-ui.md`), but it's reachable only via a _different_ page, `ManageModule.tsx` (`/dashboard/instructor/manage-module`). This spec adds the missing links on `assign-course-detail` so instructors can grade submissions from the page they're actually on.

## How found

User reported: after logging in as instructor and opening
`/dashboard/instructor/assign-course-detail/60df7cc0-366a-454f-a924-244ec2ea800f`, they can see module details but have no option to mark/grade a student's assignment.

Investigation (two parallel Explore passes, backend + frontend) confirmed:

- **Backend**: grading is fully implemented and correct — `GET /api/assignment/submissions/:assignmentId` (list submissions, instructor/admin, unrestricted per spec 34), `PATCH /api/assignment/grade/:submissionId` (owner-only), `PATCH /api/assignment/reopen/:submissionId` (owner-only). Nothing to change server-side.
- **Frontend**: the grading screen already exists and works —
  `components/main/(Instructor)/ManageAssignment/ManageAssignment.tsx` (route `/dashboard/instructor/manage-assignment/[moduleId]`) renders `SubmissionsTable.tsx`, a complete card-based grade/reopen UI wired to `gradeSubmissionFunction`/`reopenSubmissionFunction` in `functions/assignment.functions.ts`. The **only** existing entry point to that route is a `"Manage Assignment"` row action inside `ManageModule.tsx`'s `renderActions`. `AssignCourseDetailColmn.tsx` — the column config used by `AssignCourseDetail.tsx`, i.e. the page in the reported URL — never got the equivalent action added. The same gap exists for `"Manage Quiz"` (route `/dashboard/instructor/manage-quiz/[moduleId]`) on this page.

## Fix

Edit `lms_client/components/main/(Instructor)/AssignCourse/column/AssignCourseDetailColmn.tsx` only. Add two entries to the existing `actions` array inside the `"actions"` column's `cell`, mirroring the pattern already proven in `ManageModule.tsx` verbatim (icons, href shape, `hidden` condition):

```tsx
import { ClipboardList, Eye, HelpCircle, Plus, SquarePen } from "lucide-react";
```

```tsx
actions={[
  {
    label: "View Details",
    icon: Eye,
    href: `/dashboard/instructor/module-detail/${rowData?.id}`,
  },
  {
    label: "Update Module",
    icon: SquarePen,
    href: `/dashboard/instructor/update-module/${rowData?.id}`,
    hidden: isPublished,
  },
  {
    label: "Add New Video",
    icon: Plus,
    href: `/dashboard/instructor/add-video/${rowData?.id}`,
    hidden: isPublished,
  },
  {
    label: "Manage Quiz",
    icon: HelpCircle,
    href: `/dashboard/instructor/manage-quiz/${rowData?.id}`,
    hidden: isPublished,
  },
  {
    label: "Manage Assignment",
    icon: ClipboardList,
    href: `/dashboard/instructor/manage-assignment/${rowData?.id}`,
    hidden: isPublished,
  },
]}
```

`rowData?.id` is the module id (matches `TModule.id` already used by the other actions in this file), which is exactly what `manage-assignment/[moduleId]` and `manage-quiz/[moduleId]` expect.

No other files change:

- `TableRowActions.tsx`'s `TTableRowAction` type already supports this shape (`label`, `icon: LucideIcon`, `href`, `hidden`) — no type changes needed.
- No new routes, components, hooks, or backend changes — `manage-assignment/[moduleId]` and `manage-quiz/[moduleId]` pages, and everything they render, already exist and are already wired to working endpoints.

## Verify when done

- [x] `npx tsc --noEmit` / `yarn lint` clean in `lms_client` (28 errors/17 warnings, matching the established baseline; zero in the touched file). `yarn build` clean, all 31 routes generated.
- [ ] Log in as an instructor who owns a course with an unpublished module. On `/dashboard/instructor/assign-course-detail/:courseId`, confirm the module row now shows "Manage Quiz" and "Manage Assignment" actions alongside the existing three.
- [ ] Click "Manage Assignment" → lands on `/dashboard/instructor/manage-assignment/:moduleId`, create an assignment if none exists, have a (test) student submit it, confirm grading/reopen works from here (already covered end-to-end by spec 30, but re-click through from this new entry point).
- [ ] Click "Manage Quiz" → lands on `/dashboard/instructor/manage-quiz/:moduleId` and loads correctly.
- [ ] Confirm both actions are hidden once the module's course is published (matching `ManageModule.tsx`'s existing behavior) — modules under a published course don't show these actions on either page.
