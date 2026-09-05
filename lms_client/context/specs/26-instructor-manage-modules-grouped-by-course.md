# 26. Group Instructor's "Manage Modules" by course too

## Goal

Apply the same course-grouped redesign from [`25-manage-modules-grouped-by-course.md`](25-manage-modules-grouped-by-course.md) to the Instructor's `/dashboard/instructor/manage-module` page — it has the identical flat-table-repeats-course-name problem, since it consumes the exact same `GET /module/all-module` endpoint.

## How found

User report, same shape as spec 25's: pasted the `/module/all-module` response and pointed at this page. Confirmed `components/main/(Instructor)/ManageModule/ManageModule.tsx` renders the flat module array through `GenericTableComponent` + its own `ManageModuleColumns.tsx`, same as the admin page was doing before spec 25 — a course with N modules shows its name N times.

## Current state

- `ManageModule.tsx` (Instructor): fetches `/module/all-module` (untyped `useFetchData<any>`), renders via `GenericTableComponent`, plus an "Add Module" button above the table that routes to `/dashboard/instructor/add-module`.
- `ManageModuleColumns.tsx` (Instructor): `Course Name` | `Course Status` | `Module Name` | `Videos` (already active here, unlike the admin one — this file was never commented out) | actions: `View Details`, `Update Module` (hidden once the course is published), `Add New Video` (hidden once the course is published) — **3 actions**, vs. the admin page's 1 (`View Details` only, since admins don't edit module content).
- `components/shared/table/ModulesByCourseAccordion.tsx` already exists (built for spec 25) and is intentionally generic — it takes `modules` + a `renderActions(module)` prop, with no assumptions about which/how many actions a caller needs. It's a direct fit here with no changes required to the shared component itself.
- Not in scope: whether `/module/all-module` should be scoped to only the logged-in instructor's own modules (it currently returns every module in the system, same as the admin view) — that's an access-scoping question, not a display bug, and isn't what was asked. Left untouched.

## Proposed design

Reuse `ModulesByCourseAccordion` exactly as spec 25 did for the admin page:

`components/main/(Instructor)/ManageModule/ManageModule.tsx`:
- Type the fetch `useFetchData<TModuleWithCourse[]>` (import `TModuleWithCourse` from the shared accordion component, same as the admin page).
- Replace the `GenericTableComponent` call with `<ModulesByCourseAccordion modules={...} renderActions={(module) => <TableRowActions actions={[...]} />} />`, passing the instructor's 3 actions (View Details / Update Module / Add New Video, both conditional actions kept `hidden: module.course.published` exactly as today).
- Keep the "Add Module" button above the accordion, unchanged.

Delete `ManageModuleColumns.tsx` (Instructor) afterward — confirm via grep it has no other importers first (same check spec 25 did for the admin one).

## Verify when done

- [x] Real UI: `/dashboard/instructor/manage-module` shows one accordion section per course, name shown once regardless of module count.
- [x] Each module row shows the correct video count and all 3 actions, with "Update Module"/"Add New Video" correctly hidden for modules under a published course.
- [x] "Add Module" button still works.
- [x] `npx tsc --noEmit` / `yarn lint` clean.

Implemented: `components/main/(Instructor)/ManageModule/ManageModule.tsx` rewired to use `ModulesByCourseAccordion` (no changes needed to the shared component itself). Deleted `components/main/(Instructor)/ManageModule/column/ManageModuleColumns.tsx` — confirmed via grep it had no other importers. Live-verified via Playwright: 5 courses render as separate sections; the published "Frontend Development Using React" course shows only the "View Details" action on each module (Update/Add Video correctly hidden); the unpublished "Mobile App Development with Kotlin" course shows all 3 actions with correct video counts (4/4/4/3); "Add Module" still navigates to `/dashboard/instructor/add-module`.
