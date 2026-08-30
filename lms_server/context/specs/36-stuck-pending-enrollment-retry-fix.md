# 36. Fix: stuck pending enrollment, no retry path

## Goal

Resolve [`35-stuck-pending-enrollment-no-retry.md`](35-stuck-pending-enrollment-no-retry.md): make the enrollment flow retry-aware so a student whose SSLCommerz checkout is abandoned/never completes (closed tab, declined card, gateway timeout — anything that never triggers the gateway's success/fail webhook) can retry payment instead of being permanently stuck seeing a false "✓ Course Enrolled" state with no way to ever actually access the course.

## Root cause (recap from spec 35)

`CourseEnrollment.service.ts::enrollInCourse` creates a `Payment` row (`paymentStatus: Pending` by schema default) and a `CourseEnrollment` row together, before the SSLCommerz redirect even happens. Two independent gaps then compound into a dead end:

1. `enrollInCourse`'s duplicate guard (`findFirst({ userId, courseId, isDeleted: false })`) checks only row existence, not `payment.paymentStatus` — so a `Pending` row blocks any second attempt exactly the same as a `Completed` one.
2. `checkUserEnrolledInCourse` (backing `GET /enroll/check-user-enrolled`, the only signal `CourseDetailPage.tsx`/`CourseDetailTop.tsx` use to decide whether to show "Enroll Now" vs. "✓ Course Enrolled") likewise never looks at `payment.paymentStatus`.

`ValidateCourseAccess` (the middleware that actually gates real content routes) already does its own correct, independent `Payment.paymentStatus === Completed` check and needs **no change**.

## Design

Make the existing `POST /enroll/enroll-course` endpoint distinguish "already paid" (still reject) from "stuck pending" (reactivate the same rows and issue a fresh payment session) — mirroring the reactivation pattern this codebase already established twice for an unrelated but structurally identical class of bug ("a row exists in a stale state and blocks a fresh create"): [`30-quiz-recreate-after-delete-crash.md`](30-quiz-recreate-after-delete-crash.md)'s `quiz.service.ts::createQuiz` and [`33-assignment-recreate-after-delete-crash.md`](33-assignment-recreate-after-delete-crash.md)'s `assignment.service.ts::createAssignment` — both look up the existing row without the normal filter, then branch: valid-active → reject; stale → reactivate the *same* row in place; missing → create fresh.

No schema changes. No new endpoints.

### 1. `CourseEnrollment.service.ts::enrollInCourse`

Replace the duplicate-guard block (currently):

```ts
const previousEnrolledData = await prisma.courseEnrollment.findFirst({
  where: { userId: user, courseId: course, isDeleted: false },
});

if (previousEnrolledData) {
  throw new AppError(
    httpStatus.BAD_REQUEST,
    "This course is already enrolled by the user !!!"
  );
}
```

with a 3-way branch:

```ts
const previousEnrolledData = await prisma.courseEnrollment.findFirst({
  where: { userId: user, courseId: course, isDeleted: false },
  include: { payment: true },
});

if (previousEnrolledData) {
  if (previousEnrolledData.payment.paymentStatus === PAYMENTSTATUS.Completed) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This course is already enrolled by the user !!!"
    );
  }

  // Payment is still Pending (checkout was abandoned/never completed) —
  // reuse the SAME CourseEnrollment/Payment rows instead of inserting new
  // ones; only the transactionId changes, so a fresh SSLCommerz session can
  // be started for the exact same purchase attempt. Mirrors
  // quiz.service.ts::createQuiz / assignment.service.ts::createAssignment's
  // established "reactivate the stale row in place" pattern (specs 30/33) —
  // same idea, just keyed off payment status here instead of isDeleted.
  const retryTransactionId = `TXN-${Date.now()}`;

  const retryResult = await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: previousEnrolledData.paymentId },
      data: { transactionId: retryTransactionId },
    });

    return sslServices.initPayment({
      price: Number(courseData.price),
      transactionId: retryTransactionId,
      productName: courseData.name,
      productCategory: courseData.category,
      userName: userData.name,
      userEmail: userData.email,
    });
  });

  return retryResult;
}
```

Add `import { PAYMENTSTATUS } from "../payment/payment.constant";` at the top (same relative shape `ValidateCourseAccess.ts` already uses one directory over: `"../modules/payment/payment.constant"`).

Notes:
- `previousEnrolledData.payment` is never null when `previousEnrolledData` exists — `CourseEnrollment.paymentId` is a required, non-nullable FK.
- No `VideoProgress` reset needed — those rows were already created correctly (locked/unlocked per video order) on the *first* call and remain valid regardless of payment retries.
- No `CourseEnrollment.completed`/`isReviewed` reset needed — both are still at their default `false`, since the course was never actually paid for.
- A genuinely `Failed`-and-soft-deleted row (via the existing `failPayment` webhook path, unchanged by this fix) is already invisible to this query (`isDeleted: false` filter, unchanged) and naturally falls into the "no existing row" branch below it — no new handling needed for that case.
- Wrapping the payment-row update + `sslServices.initPayment` call in `prisma.$transaction` mirrors this function's own existing documented decision for the fresh-insert path ("keep the SSLCommerz HTTP call inside the DB transaction exactly as today") — if `initPayment` throws (gateway down), the `transactionId` update rolls back too.
- `CourseEnrollment.controller.ts`/`CourseEnrollment.routes.ts` need **no changes** — the return shape (`GatewayPageURL` string) is identical either way.

### 2. `CourseEnrollment.service.ts::checkUserEnrolledInCourse`

Extend the response to expose payment completion alongside row existence:

```ts
const previousEnrolledData = await prisma.courseEnrollment.findFirst({
  where: { userId, courseId, isDeleted: false },
  include: { payment: true },
});

return {
  enrolledIncourse: !!previousEnrolledData,
  paymentCompleted:
    previousEnrolledData?.payment.paymentStatus === PAYMENTSTATUS.Completed,
};
```

(the earlier `!userData` early-return also gets `paymentCompleted: false` added, for response-shape consistency across both return points).

Confirmed via grep that `CourseDetailPage.tsx` is the **only** consumer of `GET /enroll/check-user-enrolled` anywhere in `lms_client` — safe to change the response shape freely, no other call site breaks. `CourseEnrollment.controller.ts`/route need no changes (pass-through).

### 3. `lms_client/components/main/CourseDetail/CourseDetailPage.tsx`

Extend the `useFetchData<{ enrolledIncourse: boolean }>` generic to also carry `paymentCompleted: boolean`, and pass it down as a new `paymentCompleted` prop to `<CourseDetailTop />` alongside the existing `alreadyEnrolled` prop.

### 4. `lms_client/components/main/CourseDetail/CourseDetailTop.tsx`

Add `paymentCompleted: boolean` to `TCourseDetailProps` and the destructure. Replace the current binary ternary with a 3-way render:

- `alreadyEnrolled && paymentCompleted` → unchanged green "✓ Course Enrolled".
- `alreadyEnrolled && !paymentCompleted` → a distinct "Payment Pending" indicator plus a button labeled **"Complete Payment"**, reusing the *exact same* `handleEnrollCourse` handler already in this file (it already POSTs to `/enroll/enroll-course` and redirects to whatever `GatewayPageURL` comes back — after the backend fix above, that's now a fresh session for the same pending purchase, not a rejection).
- neither → unchanged "Enroll Now" button.

`handleEnrollCourse` itself needs no changes — it's already generic over the response shape.

### 5. `lms_client/components/main/MyCourses/EnrolledCourseDetail/EnrollCourseDetail.tsx`

Destructure `isError` from the existing `useFetchData<TEnrollCourseDetail>` call, and add it as the **first** branch in the `content` if/else chain (ahead of the quiz/assignment/video branches — none of them have real data to show when the fetch 403'd anyway): render a clear "This course isn't available yet — your payment may still be pending" message with a `Link` back to `/courses/${id}`, instead of silently falling through to `<NoVideoPlaceholder />`.

The message must stay deliberately generic (covering either real 403 cause — not-enrolled-at-all or payment-pending) rather than trying to surface the backend's specific message: the axios interceptor (`lib/axiosInstance.ts`) always shows a fixed toast on any `403` and rejects with the **raw**, unparsed axios error object (confirmed by reading the file — it does `return Promise.reject(error)` before ever building the normalized `{statusCode, message}` shape used for other statuses), so reliably reading the exact backend message out of `error` in this component isn't safe to depend on.

## Explicitly out of scope

- A cron/cleanup job for ancient stale-`Pending` rows — retry capability above already solves "stuck forever" without needing automatic expiry.
- A "Payment Pending" badge on the `/my-courses` grid or `/dashboard/user/my-enrolled-courses` table — would need `getAllUserEnrolledCourse`'s response shape extended plus two more frontend components; a natural follow-on, not required to fix the core bug.
- `courseEnroll-fail/page.tsx`'s generic "Try Again" link (points to `/courses`, not the specific course).
- `failPayment`'s soft-delete-only behavior (never actually sets `paymentStatus: Failed`) — left entirely unchanged.

## Implementation

1. `lms_server/src/app/modules/CourseEnrollment/CourseEnrollment.service.ts` — 3-way branch in `enrollInCourse`; extend `checkUserEnrolledInCourse`'s return shape. Add the `PAYMENTSTATUS` import.
2. `yarn build` / `yarn lint` clean in `lms_server`.
3. `lms_client/components/main/CourseDetail/CourseDetailPage.tsx` — extend the fetch generic, pass `paymentCompleted` prop.
4. `lms_client/components/main/CourseDetail/CourseDetailTop.tsx` — 3-way render, new "Payment Pending"/"Complete Payment" state.
5. `lms_client/components/main/MyCourses/EnrolledCourseDetail/EnrollCourseDetail.tsx` — `isError` branch with informative message + link back.
6. `yarn build` / `yarn lint` clean in `lms_client`.

## Verify-when-done

**Backend (curl + DB spot-checks):**
- [ ] Fresh `POST /enroll/enroll-course` → `201`, one `Payment`(`Pending`) + one `CourseEnrollment` row created.
- [ ] Second `POST /enroll/enroll-course` for the same user/course *before* completing payment → now `201` (not `400`), with a **different** `GatewayPageURL`; confirm via DB that `Payment.id`/`CourseEnrollment.id` are unchanged from the first call, only `transactionId`/`updatedAt` changed.
- [ ] Replay `/api/payment/success` for the latest `tran_id` → `Payment.paymentStatus` becomes `Completed`.
- [ ] A third `POST /enroll/enroll-course` attempt now correctly `400`s "already enrolled" (regression check on the Completed branch).
- [ ] `GET /enroll/check-user-enrolled` returns the right `{enrolledIncourse, paymentCompleted}` pair at each of the three stages above (not-enrolled / pending / completed).
- [ ] `GET /enroll/my-enrolled-course/:courseId` still `403`s while pending, `200`s once completed (regression check — confirms `ValidateCourseAccess` needed no change).
- [ ] A genuinely `Failed`-and-webhook-soft-deleted row (via existing `POST /payment/fail` with `status:"FAILED"`) still lets a fresh `enrollInCourse` create brand-new rows (regression check on the pre-existing `failPayment` path, unaffected by this change).
- [ ] `yarn build` / `yarn lint` clean.

**Frontend (Playwright click-through against the real local stack + SSLCommerz sandbox):**
- [ ] Enroll, abandon the sandbox tab without completing checkout, revisit `/courses/[id]` → amber "Payment Pending" indicator + "Complete Payment" button, **not** the green "✓ Course Enrolled" badge.
- [ ] Click "Complete Payment" → redirected to a fresh sandbox `GatewayPageURL` (different session than the first attempt).
- [ ] Complete the sandbox checkout this time → revisit `/courses/[id]` → now shows green "✓ Course Enrolled".
- [ ] While payment is still pending, visit `/my-courses/[id]` → shows the new informative message with a working link back to `/courses/[id]`, instead of the blank `<NoVideoPlaceholder />` shell.
- [ ] After completing payment, `/my-courses/[id]` loads normally — module list, video player, progress bar all render as before (regression check).
- [ ] `yarn build` / `yarn lint` clean.

All test data created during verification (throwaway course/student) to be deleted afterward via a direct Prisma script, matching this session's established convention — no delete-course/-module/-user endpoints exist in this codebase.
