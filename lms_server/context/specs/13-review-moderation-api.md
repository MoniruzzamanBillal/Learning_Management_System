# 13 — Admin review moderation endpoint

## Goal

Give admins a way to remove inappropriate/spam reviews. Today `review.route.ts` has no delete/flag endpoint at all — students can post and update their own review (`POST /give-review`, `PATCH /update-review`), but nothing lets an admin intervene.

## Current State

- `review.model.ts`/`review.service.ts` — reviews are plain documents (`rating`, `comment`, `userId`, `courseId`), no `isDeleted`/soft-delete field, no moderation/flag field.
- `review.route.ts` exposes: `POST /give-review` (auth: user), `PATCH /update-review` (auth: user, no ownership check currently visible — worth confirming at implementation time whether `updateReview` verifies the caller owns `reviewId`), `GET /course-review/:courseId`, `GET /average-course-review/:courseId`, `GET /check-review-eligibility` (all public reads).
- No admin role is involved anywhere in this module today.

## Implementation

1. Add `isDeleted: { type: Boolean, default: false }` to `review.model.ts` / `TReview` interface (soft delete, consistent with how `User`/`Video`/`CourseEnrollment` already handle deletion elsewhere in this codebase — don't hard-delete).
2. Add pre-`find`/`findOne` hooks filtering `isDeleted: false`, matching the pattern already used in `user.model.ts`.
3. Add `deleteReview(reviewId: string)` to `review.service.ts` — sets `isDeleted: true`; also consider whether the paired `courseEnrollmentModel.isReviewed` flag should be reset to `false` on delete so the student can leave a new review (confirm desired behavior — likely yes, since otherwise a deleted review permanently blocks that student from ever reviewing again).
4. Add `reviewController.deleteReview` + `DELETE /review/:reviewId` route in `review.route.ts`, gated `authCheck(UserRole.admin)`.
5. Update `getCourseReview`/`getAverageReviewOfCourse` aggregations to exclude `isDeleted: true` reviews (the `find`/`aggregate` calls need an explicit `isDeleted: false` match added to the `$match` stage in `getAverageReviewOfCourse`'s aggregation, since Mongoose query-hook filtering doesn't apply inside `.aggregate()`).

## Dependencies

- No new packages.
- Frontend companion: `10-review-moderation-ui.md` (in `lms_client/context/specs/`) builds the admin UI against this endpoint.

## Verify When Done

- [ ] `yarn build` and `yarn lint` clean.
- [ ] Admin can delete a review via the new endpoint; non-admin callers get 403.
- [ ] Deleted review no longer appears in `GET /course-review/:courseId` or factors into `GET /average-course-review/:courseId`'s average.
- [ ] Confirm whether deleting a review resets `isReviewed` on the underlying enrollment as intended, and that the student can (or correctly cannot, per the decided behavior) leave a new review afterward.
