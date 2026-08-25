# 25. Group "Manage Modules" by course instead of a flat, repeating-course-name table

## Goal

Redesign `/dashboard/admin/manage-modules` (`components/main/(Admin)/ManageModule/ManageModule.tsx`) so a course with N modules doesn't repeat that course's name N times in a flat table — group modules under their course instead.

## How found / user report

`GET /module/all-module` returns one flat array of modules, each carrying its own embedded `course: {id, name, published}`. Rendered as-is in a plain table (`ManageModuleColumns.tsx`), a course with 6 modules shows its name in 6 separate rows — noisy and hard to scan once there are more than a couple of courses. User asked for a redesign that's actually usable for browsing "which courses have which modules."

Side note: the "Videos" column on this page was commented out earlier this session (it was showing `0` for every module) — that was [`26-response-shape-audit.md`](../../../lms_server/context/specs/26-response-shape-audit.md)'s bug (`getAllModuleData` never selected `videos`), now fixed server-side. This redesign should re-enable that column since the underlying data is correct again.

## Current state

- `ManageModule.tsx` fetches `/module/all-module` and renders the flat array through `GenericTableComponent` (search/sort/pagination built in, but no grouping support — `GenericTableComponent`/`TableContent.tsx` only wire `getCoreRowModel`/`getSortedRowModel`/`getPaginationRowModel`, no `getGroupedRowModel`).
- `ManageModuleColumns.tsx` (Admin): `Course` | `Course Status` | `Module Title` | (commented-out `Videos`) | actions (`View Details` only — admin doesn't edit modules, only instructors do).
- **Same underlying issue on the Instructor side**: `/dashboard/instructor/manage-module` (`components/main/(Instructor)/ManageModule/ManageModule.tsx`) hits the exact same `/module/all-module` endpoint through the exact same flat-table pattern, with one more action per row (`Update Module`, `Add New Video`, both hidden once the course is published) via its own `ManageModuleColumns.tsx`. Out of scope for this spec (user asked about the admin page specifically) but the fix below is designed so wiring the instructor page in later is a small follow-on, not a rebuild.
- Precedent for a course→module accordion already exists in this codebase, just for a different audience: `ModuleShowData.tsx` (the enrolled-student video player) groups a single course's modules in a shadcn `Accordion`. That component is progress-tracking-specific (locked/unlocked/watched icons) and not reusable as-is, but it establishes the accordion-per-course pattern as the natural fit here too.

## Proposed design

Replace the flat table with a **course-grouped accordion**: one collapsible section per course (name, published/unpublished badge, module count in the trigger), each expanding to a compact list of that course's modules (title, video count, actions).

1. **New shared component**: `components/shared/table/ModulesByCourseAccordion.tsx`
   - Props: `modules: TModuleWithCourse[]` (the raw flat API response), `renderActions: (module) => ReactNode` (so admin/instructor keep their own role-specific action buttons via `TableRowActions`, which this component doesn't need to know about).
   - Groups the flat array into `{ course: {id, name, published}, modules: [...] }[]` client-side (`reduce` keyed by `course.id`), preserving first-seen order.
   - Renders via `Accordion` (`type="multiple"` — admin should be able to expand more than one course at once when comparing) from `components/ui/accordion.tsx`, one `AccordionItem` per course:
     - `AccordionTrigger`: course name, a status badge reusing the existing green/red "Published"/"Unpublished" span styling from `ManageModuleColumns.tsx`, and a module count (e.g. "4 modules").
     - `AccordionContent`: one row per module — title, video count (`module.videos.length`, now populated correctly), `renderActions(module)`.
   - Empty state (`modules.length === 0`): a "No Data Available" message, matching `TableContent.tsx`'s existing empty-state copy/style for consistency.

2. **`ManageModule.tsx` (Admin)**: swap the `GenericTableComponent` call for `<ModulesByCourseAccordion modules={moduleDataWithCourse.data} renderActions={(m) => <TableRowActions actions={[{label: "View Details", icon: Eye, href: `/dashboard/admin/module-detail/${m.id}`}]} />} />`.

3. Leave `ManageModuleColumns.tsx` (Admin) in place but unused-by-this-page for now (or delete it, since nothing else imports it — confirm via grep before deleting) rather than trying to force column-def shapes into the new accordion.

Not in scope for this pass (flagging, not building): search/filter box above the accordion, and wiring the same component into the Instructor page. Both are small additions once the shared component exists — worth a quick follow-up ask once this lands, not assumed here.

## Files touched

- New: `components/shared/table/ModulesByCourseAccordion.tsx`.
- Changed: `components/main/(Admin)/ManageModule/ManageModule.tsx`.
- Unchanged (no backend change needed — `/module/all-module`'s response shape already has everything required: `course.name`, `course.published`, `title`, `videos`).

## Verify when done

- [x] Real UI: `/dashboard/admin/manage-modules` shows one accordion section per course, course name appearing exactly once per course regardless of module count.
- [x] Expanding a course shows all its modules with correct video counts and a working "View Details" link.
- [x] Multiple courses can be expanded simultaneously.
- [x] Empty/loading states still behave sensibly (loading via `TableDataLoading`; empty via the "No Data Available" fallback in `ModulesByCourseAccordion`, matching `TableContent.tsx`'s copy).
- [x] `npx tsc --noEmit` / `yarn lint` clean on new + touched files.

Implemented: `components/shared/table/ModulesByCourseAccordion.tsx` (new), `components/main/(Admin)/ManageModule/ManageModule.tsx` (rewired). Deleted `components/main/(Admin)/ManageModule/column/ManageModuleColumns.tsx` — confirmed via grep it had no other importers. Live-verified via Playwright: 5 courses render as separate collapsible sections, expanding "Frontend Development Using React" and "Mobile App Development with Kotlin" simultaneously shows correct per-module video counts (5/4/4/4 and 4/4/4/3, matching real seed data), and clicking "View Details" navigates to `/dashboard/admin/module-detail/:id` correctly.
