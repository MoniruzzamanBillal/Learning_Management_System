# 10 — Admin review moderation UI

## Goal

Give admins a UI to delete inappropriate/spam reviews, backed by the new `DELETE /review/:reviewId` endpoint from backend spec `13-review-moderation-api.md`. Today there is no admin-facing review management surface anywhere in `lms_client` — reviews are only visible embedded in the public course detail page.

## Current State

- No admin review-management route/component exists under `app/dashboard/admin/` today.
- `components/main/publicPage/courseDetail/UserReviewCard.tsx` (student-facing review display) already exists and can inform the visual pattern for an admin listing (rating, comment, author, date).
- `components/shared/table/GenericTableComponent.tsx` (TanStack Table wrapper, already used across other admin management pages — `ManageCourse`, `ManageInstructor`, etc.) is the established pattern for admin list+action UIs in this codebase.

## Design

1. New route `app/dashboard/admin/manage-reviews/page.tsx` + `components/Dashboard/admin/ManageReview/ManageReviewPage.tsx`, following the same shell pattern as `ManageCourse`/`ManageInstructor` (page header, `GenericTableComponent`, delete confirmation).
2. Table columns: course name, student name, rating (stars), comment (truncated with expand), date, delete action.
3. Delete action uses `components/shared/DeleteModal.tsx` (already exists, used elsewhere for delete confirmations) wired to `useDeleteData` (`hooks/useApi.ts`) against `DELETE /review/:reviewId`, invalidating whatever query key backs the table on success.
4. Data source: since there's no existing "all reviews across all courses" endpoint, this either needs a new backend list endpoint (out of scope for the backend spec `13-review-moderation-api.md`, which only adds the delete endpoint) or this page fetches per-course via the existing `GET /course-review/:courseId` from a course picker — **confirm with the backend spec author (or add a small `GET /review/all` admin-listing endpoint as a follow-up) before implementation**, since the current backend spec doesn't include a bulk-listing endpoint.
5. Add a sidebar link in the admin dashboard nav (`components/Dashboard/Sidebar.tsx`) to the new route.

## Implementation Notes

- Reuse `GenericTableComponent`'s existing column/action patterns rather than building a bespoke table.
- No new npm packages.

## Verify When Done

- [ ] Admin can view and delete reviews end-to-end through the new UI.
- [ ] Deleted review disappears from both the admin table and the public course-detail review list without a page refresh (query invalidation working correctly).
- [ ] Non-admin users cannot reach `/dashboard/admin/manage-reviews` (role-gated per `middleware.ts`'s existing `/admin/:path*` pattern).
- [ ] `yarn lint` and `yarn build` pass cleanly.
