# 35. Abandoned/pending enrollment permanently blocks purchase, with no retry path

## Goal

**This is a planning document only — do not implement.** Found live during a full-system Playwright E2E test (creating a course/module/video/assignment from scratch, signing up a new student, and purchasing the course via the real SSLCommerz sandbox). Documented per the user's explicit instruction for this test phase: write up bugs found, do not fix them.

## What happened

1. A brand-new student clicked "Enroll Now" on a real published course. `POST /enroll/enroll-course` created a `Payment` row (`paymentStatus: Pending`) and a `CourseEnrollment` row immediately, then returned the SSLCommerz sandbox `GatewayPageURL` for the browser to redirect to (`CourseDetailTop.tsx::handleEnrollCourse` does `window.location.href = result.data`).
2. The Playwright session navigated to that gateway URL, but the automated test didn't complete the sandbox checkout form on the first pass (the SSLCommerz `easyCheckout` Angular app takes a few seconds to render and wasn't interacted with in time). The gateway session was effectively abandoned — exactly what happens in real life whenever a real user closes the tab, loses connectivity, or bails out of checkout.
3. Revisiting the course detail page afterward: `GET /enroll/check-user-enrolled?courseId=...&userId=...` returned `{ enrolledIncourse: true }`, so the frontend rendered the green "✓ Course Enrolled" state instead of the "Enroll Now" button (`CourseDetailTop.tsx`'s `alreadyEnrolled` ternary) — telling the student they're done.
4. But the payment was never actually completed. `GET /enroll/my-enrolled-course/:courseId` (the endpoint that actually serves course content, gated by `ValidateCourseAccess`) returned a real `403`: `"Payment is not completed for this course!"`.
5. There is **no way out of this state** for the student: `enrollInCourse`'s own guard —

   ```ts
   const previousEnrolledData = await prisma.courseEnrollment.findFirst({
     where: { userId: user, courseId: course, isDeleted: false },
   });

   if (previousEnrolledData) {
     throw new AppError(
       httpStatus.BAD_REQUEST,
       "This course is already enrolled by the user !!!",
     );
   }
   ```

   rejects a second `POST /enroll/enroll-course` attempt outright, since a `CourseEnrollment` row already exists from step 1 — regardless of whether its linked `Payment` ever reached `Completed`. There is no "retry payment" endpoint, and the frontend never shows "Enroll Now" again once `enrolledIncourse` is `true`. The student is stuck seeing "✓ Course Enrolled" forever, while every real content page 403s.

This was only unblocked in this test session by manually replaying the real `/payment/success` webhook by hand (`POST /api/payment/success` with the pending transaction's `tran_id` and `status=VALID`) — not something a real student can do.

## Root cause

Two independent gaps compound into a dead end:

1. **`CourseEnrollment.service.ts::enrollInCourse`** creates the `CourseEnrollment` row *before* payment is confirmed, and its duplicate-enrollment guard checks only row existence (`isDeleted: false`), not `payment.paymentStatus`. A `Pending` payment is treated identically to a `Completed` one for the purpose of blocking re-enrollment.
2. **`CourseEnrollment.service.ts::checkUserEnrolledInCourse`** (backing `GET /check-user-enrolled`) likewise only checks `CourseEnrollment` row existence, not payment completion — so the frontend's `alreadyEnrolled` flag is `true` the instant the row is created, long before (or even if never) the payment actually completes.

Neither function was touched by the Postgres/Prisma migration (spec 19) in a way that introduced this — the same shape almost certainly existed in the original Mongoose version too; this is a pre-existing product gap, not a migration regression.

## Impact

Any real-world checkout abandonment (closed tab, browser crash, declined card retried later, sandbox/gateway timeout, network drop) permanently strands the student: they can never purchase that course through the UI again, and supportwise there is no self-serve recovery — only a manual DB fix (as done in this test) or a manual replay of the success webhook could unstick them.

## Suggested directions (not decided, for the user to weigh in on)

- Make `checkUserEnrolledInCourse`/the frontend's `alreadyEnrolled` state check `payment.paymentStatus === Completed`, not just `CourseEnrollment` row existence — so an abandoned checkout still shows "Enroll Now" (or a distinct "Complete your payment" state) instead of a misleading "✓ Course Enrolled".
- Decide what `enrollInCourse` should do when a `CourseEnrollment` exists but its `Payment` is still `Pending`/`Failed`: either reuse the existing row and issue a fresh `GatewayPageURL` (re-attempt payment), or soft-delete/replace the stale pending pair and start over. Needs a decision on whether stale `Pending` rows should ever expire/be cleaned up (a cron, similar to the existing `errorLog` 30-day cleanup cron) versus being retried indefinitely.
- Consider whether `Payment`/`CourseEnrollment` creation should be deferred until the success webhook fires at all (i.e., don't create either row until payment is confirmed), which would sidestep the whole class of "row exists but payment didn't happen" states — but this is a bigger design change than the two options above and would need to account for existing rows already in this shape.

## Verify-when-done

Left blank — this is a documentation-only spec per this session's explicit instruction. No implementation, no checklist, until the user reviews and decides a direction.
