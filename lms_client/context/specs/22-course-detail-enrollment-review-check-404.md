# 22. Course-detail enrollment/review-eligibility checks always 404

## Goal

Fix `CourseDetailPage.tsx`'s two "is this logged-in user special-cased on this course" checks, which have always 404'd for every logged-in student, found while testing the purchase → watch → certificate → review flow end-to-end as a real user.

## How found

Playwright network logging on `/courses/[id]` while logged in as a `user`-role account surfaced two repeating `404`s, once per render:

```
404 http://localhost:5000/api/enroll/check-user-enrolled/521569b3-70a3-4f2f-93ab-4ba1e842b42f
404 http://localhost:5000/api/review/check-review-eligibility/521569b3-70a3-4f2f-93ab-4ba1e842b42f
```

Visibly, the course-detail page sits on its skeleton loader for several seconds (TanStack Query's default retry/backoff eating the 404s) before finally rendering — and even after it renders, an already-enrolled student always sees the "Enroll Now" button again (never "✓ Course Enrolled"), and a student who has completed the course never sees the review form, since both signals silently stay `undefined`.

## Root cause

Both backend endpoints read `courseId`/`userId` from `req.query`, not from a route param:

- `CourseEnrollment.routes.ts`: `router.get("/check-user-enrolled", ...)` → controller does `const { courseId, userId } = req.query`.
- `review.route.ts`: `router.get("/check-review-eligibility", ...)` → controller does `const { courseId, userId } = req.query`.

But `CourseDetailPage.tsx` calls them as if `courseId` were a route param, and never sends `userId` at all:

```ts
`/enroll/check-user-enrolled/${id}`
`/review/check-review-eligibility/${id}`
```

Express has no route matching `/check-user-enrolled/:something`, so both requests 404 before ever reaching the controller — this has never worked for any user.

## Fix

Send both as query strings, including `userId` (already in scope in both `useFetchData` calls via `userData?.userId`, which already gates the `enabled` flag):

```ts
`/enroll/check-user-enrolled?courseId=${id}&userId=${userData?.userId}`
`/review/check-review-eligibility?courseId=${id}&userId=${userData?.userId}`
```

No backend change needed — the controllers already expect exactly this shape.

## Verify when done

- [ ] `curl "http://localhost:5000/api/enroll/check-user-enrolled?courseId=<id>&userId=<id>"` returns 200 with `{enrolledIncourse: boolean}`.
- [ ] `curl "http://localhost:5000/api/review/check-review-eligibility?courseId=<id>&userId=<id>"` returns 200.
- [ ] Real UI: `/courses/[id]` while logged in as a user loads without the repeated 404s / long skeleton stall.
- [ ] Already-enrolled user sees "✓ Course Enrolled" instead of "Enroll Now".
- [ ] A user who has completed the course sees the review form.
- [ ] `yarn lint` clean on the touched file.
