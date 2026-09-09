# 40. Fix: locked video icon should be red on enrolled-course content page

## Goal

On `/my-courses/:id`, a locked (not-yet-accessible) video shows a lock icon that currently renders gray. It should render red, per the app's existing status-icon convention, so locked state is visually distinct at a glance from watched/unlocked states.

## Root cause

`lms_client/components/main/MyCourses/EnrolledCourseDetail/ModuleShowData.tsx` (lines ~170-183):

```tsx
{video?.videoStatus === videoProgressStatusConsts?.locked && (
  <Lock className=" text-gray-400 font-bold  size-5 lg:size-6 " />
)}

{video?.videoStatus === videoProgressStatusConsts?.watched && (
  <CircleCheckBig className=" text-green-600 font-bold size-5 lg:size-6 " />
)}

{video?.videoStatus === videoProgressStatusConsts?.unlocked && (
  <LockOpen className=" text-prime-100 font-bold size-5 lg:size-6 " />
)}
```

The locked-state `Lock` icon hardcodes `text-gray-400`, while its sibling status icons both use explicit semantic colors (`text-green-600` for watched, `text-prime-100` for unlocked) — locked is the only one not following that pattern.

This codebase's existing red convention (grepped across `components/main`): plain Tailwind `text-red-600` is used consistently for status/semantic red text (e.g. "Unpublished" labels in `CourseDetail.tsx`/`AssignCourseDetail.tsx`, form-error messages across `ManageModule`/`ManageQuiz`/`ManageAssignment`/`ManageVideo`), with `text-red-500` reserved for small inline destructive action icons (e.g. `Trash2` in `QuizQuestionFields.tsx`). There's no use of the shadcn `text-destructive` semantic token in `components/main`, so introducing that here would be inconsistent with the rest of the app.

## Design

Change the locked icon's class from `text-gray-400` to `text-red-600` — matching the sibling icons' pattern of an explicit `-600` shade for status icons (`green-600` watched, and now `red-600` locked, alongside the brand-colored `prime-100` unlocked), and consistent with the app's existing `text-red-600` status-color convention. No new token needed.

## Implementation

1. `lms_client/components/main/MyCourses/EnrolledCourseDetail/ModuleShowData.tsx` — change the `Lock` icon's className from `text-gray-400` to `text-red-600` (~line 172).
2. While implementing, grep for any other `Lock` icon tied to a "locked" video/module status elsewhere in the app (e.g. an instructor/admin preview of student-facing content, if one exists) — if found, flag as a follow-up for consistency rather than silently expanding this fix's scope.
3. `yarn lint` clean in `lms_client`.

## Verify-when-done

- [x] `ModuleShowData.tsx`'s locked-state `Lock` icon changed from `text-gray-400` to `text-red-600` — the only line touched; watched (`text-green-600`) and unlocked (`text-prime-100`) icons unchanged.
- [x] Grepped the codebase for any other `Lock` icon tied to a "locked" video/module status — none found, no follow-up needed.
- [x] `yarn lint` unchanged at the established 28-error/17-warning baseline, zero new issues in the touched file.
- [ ] Live/visual verification (loading `/my-courses/:id` in a browser and confirming the locked icon renders red) — left for the user, not performed this session.
