# 27. Module detail/update routes have no ownership check (and detail is fully public)

## Goal

Fix `GET /module/module-detail/:moduleId` (currently reachable with **no auth at all**) and `PATCH /module/update-module/:moduleId` (currently reachable by **any** instructor, not just the module's assigned one) so a module can only be edited by the instructor it actually belongs to.

## How found

User report: `/dashboard/instructor/update-module/:moduleId`'s "Course Name" `react-select` wasn't showing the current course as pre-selected. Investigated the component logic first (the same class of bug as spec 24's `UpdateCourse.tsx` instructor pre-select bug) — but `UpdateModule.tsx`'s `reset({ course: module?.course?.id, ... })` and the `Select`'s `value={courseOptions?.find(o => o.value === field.value)}` matching logic are both correct.

Reproduced with two different instructor sessions against the same module (`76dd990d-...`, "Module 1: Foundations of Cybersecurity", owned by `instructor3@gmail.com` per its `instructorId`):
- Logged in as `instructor3` (the real owner): course correctly pre-selects ("Introduction to Cybersecurity").
- Logged in as `instructor1` (**not** assigned to this course at all): the dropdown correctly shows empty, because `courseOptions` comes from `GET /course/instructor-courses/:instructorId` — "courses assigned to *me*" — and this course genuinely isn't in instructor1's list.

So the empty dropdown isn't a UI bug — it's the **correct symptom of a missing access check**: instructor1 should never have been able to reach this edit page for a module they don't own in the first place.

## Root cause

`courseModule/module.routes.ts`:

```ts
router.get("/module-detail/:moduleId", moduleController.getModuleData);
// ^ no authCheck at all — anyone, logged in or not, can read full module +
//   course + video + instructor PII (name, email) for any module.

router.patch(
  "/update-module/:moduleId",
  authCheck(UserRole.instructor),
  moduleController.updateModule
  // ^ requires *an* instructor JWT, but never checks it's the module's
  //   own instructor — module.service.ts::updateModule takes whatever
  //   payload is sent and writes it, no ownership comparison anywhere.
);
```

Confirmed via grep that `/module/module-detail/:moduleId` is only ever consumed by 3 admin/instructor dashboard pages (`UpdateModule.tsx`, `InstructorModule.tsx`, `ModuleDetail.tsx` (Admin)) — never by a public or student-facing page — so requiring login for it doesn't break anything legitimate.

Viewing module details across instructors already appears to be intentional existing behavior elsewhere (`/module/all-module`, used by both dashboards' "Manage Modules" pages, returns every module platform-wide regardless of who's logged in — instructors already browse each other's modules read-only today). So the fix here is scoped narrowly: require login to *read* module detail, but only the *owning* instructor may *write* to it.

## Fix

1. `module.routes.ts` — add `authCheck(UserRole.admin, UserRole.instructor)` to the `GET /module-detail/:moduleId` route (matches the pattern already used by sibling detail routes like `/course/instructor-course-detail/:courseId`).
2. `module.controller.ts::updateModule` — pass `req.user?.userId` through to the service alongside the existing `req.body`/`req.params.moduleId`.
3. `module.service.ts::updateModule` — accept that `instructorId` and check it against the fetched module's `instructorId` before writing; throw `AppError(httpStatus.FORBIDDEN, "You are not authorized to update this module !!!")` on mismatch.

### Frontend follow-on (`lms_client`)

See `lms_client/context/specs/27-update-module-ownership-guard.md` — `UpdateModule.tsx` (Instructor) gets a proactive "you don't have access to this module" state instead of silently rendering a blank, confusing form when the logged-in instructor doesn't own the module being edited.

## Verify when done

- [x] `curl` (no auth header) to `/api/module/module-detail/:moduleId` now returns 401, not the full module payload.
- [x] `curl` as instructor1's token to `PATCH /api/module/update-module/:cybersecurityModuleId` (owned by instructor3) returns 403.
- [x] `curl` as instructor3's token to the same endpoint still succeeds.
- [x] Real UI: instructor3 can still update their own module normally; instructor1 sees the new guarded state instead of a blank form.
- [x] `yarn lint` clean on touched files.

One test-data mishap during verification: an initial curl attempt (run against a stale not-yet-respawned dev process) briefly let instructor1 overwrite the module's title before the fix took effect; caught immediately, restored via a direct DB update, and re-verified the fix actually blocks it on a confirmed-fresh process.
