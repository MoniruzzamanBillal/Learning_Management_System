# 38. Fix: table pagination colors don't match the app's theme (shared component, all 11 tables)

## Goal

On `/dashboard/admin/error-logs` (and, once traced, every other page using the shared table component), the pagination bar's colors don't match the rest of the table or the app's actual brand palette. Fix the shared pagination component so it visually belongs to the same design system as the table it sits under.

## Root cause

The bug is entirely inside the shared table component chain, not the error-logs page itself.

`lms_client/components/main/(Admin)/ErrorLogs/ErrorLogsPage.tsx` renders `GenericTableComponent` correctly (already passes `showToolbar={false}`, unrelated to this bug). `GenericTableComponent` renders `TableContent`, which uses the project's real brand token (`prime-50`, indigo, defined in `app/globals.css`) throughout:

- Table wrapper: `border-prime-50/50 bg-prime-50/5`
- Header row: `bg-prime-50/20`
- Row borders: `border-b-prime-50/50`

But `TableContent` delegates pagination (rendered whenever `filteredRows.length > 10`) to `lms_client/components/shared/table/TablePagination.tsx`, which uses an entirely different, broken set of classes:

- Outer bar: `bg-neutral-600` (plain dark gray, unrelated to `prime-*`)
- Border: `border-slate-200 dark:border-border`
- Prev/Next buttons: `border-table-border`, `tablePaginationNumber`, `tablePaginationGradientBorder` classes, icon `text-white`
- Page-number buttons: `bg-primary-50` (inactive), `bg-primary-500`/`border-primary-500` (active), text `text-neutral-50`

**None of `primary-50`, `primary-500`, `table-border`, `bg-surface`, `tablePaginationNumber`, `tablePaginationGradientBorder` are defined anywhere in this codebase** (confirmed via grep of `app/globals.css` and every stylesheet — no `@theme`/CSS-variable entry, no matching class definition). Tailwind v4's JIT silently emits no CSS for a class with no matching theme key, so these all resolve to nothing. What actually renders is: a dark `bg-neutral-600` bar (one of the few real classes present), a generic default border, and white/near-white text — a plain dark-gray bar sitting directly under an indigo-themed table, which is exactly the visual mismatch reported.

This file appears to have been copied wholesale from a different design-system/template (introduced in commit `6915f026 feat:reusable input, table component add`) that had its own `primary-*` scale and named utility classes, which were never ported into this project's actual theme (`prime-50`/`prime-100`/`prime-200`, per `lms_client/context/ui-context.md`).

**Scope: this is not error-logs-specific.** `GenericTableComponent` (and therefore `TablePagination`) is used on 11 pages: `ErrorLogsPage`, `ManageCourse`, `CourseDetail`, `ManageInstructorPage`, `Enrollment`, `ManageReviewPage`, `AssignCourseDetail`, `ManageAssignCourse`, `ManageVideo`, `MyEnrolledCourses`, `MyCourseCertificates`. Every one of them shows the identical mismatched pagination whenever it has more than 10 rows. The fix belongs entirely in `TablePagination.tsx` — no per-page changes needed.

## Design

Replace every undefined/mismatched class in `lms_client/components/shared/table/TablePagination.tsx` with this project's real `prime-*` tokens, matching `TableContent.tsx`'s existing styling so the pagination bar reads as a continuation of the table rather than a visually separate block:

- Outer bar: `bg-neutral-600` → something in the same family as the table container, e.g. `bg-prime-50/5` (matches `TableContent`'s wrapper) with `border-t border-prime-50/50` instead of `border-slate-200 dark:border-border`.
- Prev/Next buttons: drop `border-table-border tablePaginationNumber tablePaginationGradientBorder` (all no-ops) for real classes, e.g. `border border-prime-50/50 hover:bg-prime-50/10`; icon color from `text-white` to something visible against a light bar, e.g. `text-prime-100` (disabled state should get a visibly muted variant, e.g. `text-gray-300`, — check current disabled-state handling while implementing).
- Page-number buttons: inactive `bg-primary-50` → e.g. `bg-white border border-prime-50/30 text-gray-700`; active `bg-primary-500 border-primary-500` → e.g. `bg-prime-100 border-prime-100 text-white` (mirrors `CourseCard.tsx`'s CTA button, which already uses `bg-prime-100` as the project's real primary-action color); drop the undefined `tablePaginationNumber`/`tablePaginationGradientBorder` classes entirely (or replace with real equivalents if they were meant to add a gradient border effect — confirm intent isn't lost, but if unclear, a plain solid border matching the rest of the table is a safe default).

Exact final class values are a design-polish decision to make during implementation (matching `ui-context.md`'s documented palette) — the important constraint is: **every class used must actually exist** (either a real Tailwind utility or a class defined somewhere in this project's CSS), and the result should read as visually continuous with `TableContent`'s existing indigo/`prime-*` styling, not introduce a new unrelated color.

## Implementation

1. `lms_client/components/shared/table/TablePagination.tsx` — replace the outer bar, border, prev/next button, and page-number button classes per Design above.
2. Since this is a single shared component, no other files need changes.
3. Visually verify against at least 2-3 of the 11 consuming pages (e.g. `ErrorLogsPage`, `ManageCourse`, `MyEnrolledCourses`) with enough rows (>10) to trigger pagination render.
4. `yarn lint` clean in `lms_client`.

## Verify-when-done

- [ ] `/dashboard/admin/error-logs` with >10 error log rows shows a pagination bar visually consistent with the table above it (same color family, no stray dark-gray bar).
- [ ] No Tailwind class used in `TablePagination.tsx` is undefined/a no-op (spot check by temporarily removing a class and confirming the rendered style actually changes, or checking dev tools computed styles).
- [ ] At least 2 other pages using `GenericTableComponent` with >10 rows (e.g. `ManageCourse`, `MyEnrolledCourses`) show the same fixed, consistent pagination styling.
- [ ] Active page number, hover states, and disabled prev/next (on first/last page) are all visually distinguishable from each other.
- [ ] `yarn lint` clean.
