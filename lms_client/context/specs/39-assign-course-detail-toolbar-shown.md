# 39. Fix: table toolbar incorrectly shown on instructor's assign-course-detail page

## Goal

`/dashboard/instructor/assign-course-detail/:id` shows a table toolbar (search/filter/column controls) above its module list. This page is a read-only detail view and should not show it, matching the convention already used elsewhere in this codebase.

## Root cause

`lms_client/components/main/(Instructor)/AssignCourse/AssignCourseDetail.tsx` (lines ~89-92):

```tsx
<GenericTableComponent
  columns={AssignCourseDetailColmn}
  data={courseDetailWithModule?.data}
/>
```

No `showToolbar` prop is passed. `lms_client/components/shared/table/GenericTableComponent.tsx` (line ~51) defaults `showToolbar = true` when the prop is omitted, and conditionally renders `TableToolbar` (search/date/filter controls) whenever it's truthy — so this page gets the toolbar by default, even though it's a read-only module listing with nothing to search/filter meaningfully.

This is exactly the same situation `lms_client/components/main/(Admin)/ManageCourse/CourseDetail.tsx` already handles correctly, for the same kind of read-only nested table:

```tsx
// Instructors table (lines ~157-161)
<GenericTableComponent columns={InstructorColumn} data={...} showToolbar={false} />

// Modules table (lines ~173-177)
<GenericTableComponent columns={CourseDetailModuleColumn} data={...} showToolbar={false} />
```

`ErrorLogsPage.tsx` also already passes `showToolbar={false}` correctly. So the established convention in this codebase is clear — `AssignCourseDetail.tsx` is simply missing the prop that every comparable read-only detail table already has.

## Design

Add `showToolbar={false}` to the `GenericTableComponent` call in `AssignCourseDetail.tsx`, matching `CourseDetail.tsx`'s pattern exactly. No other change needed — this isn't a shared-component bug (unlike spec 38), it's a single page missing an existing, working opt-out prop.

## Implementation

1. `lms_client/components/main/(Instructor)/AssignCourse/AssignCourseDetail.tsx` — add `showToolbar={false}` to the `GenericTableComponent` usage (~lines 89-92).
2. `yarn lint` clean in `lms_client`.

## Verify-when-done

- [ ] `/dashboard/instructor/assign-course-detail/:id` no longer shows a search/filter toolbar above the module table.
- [ ] The module table itself still renders correctly (columns, data, pagination if applicable).
- [ ] No other page that intentionally wants the toolbar (e.g. `ManageCourse`, `ManageVideo`) is affected — this change is scoped to one file/one usage.
- [ ] `yarn lint` clean.
