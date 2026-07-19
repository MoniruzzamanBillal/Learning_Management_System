# 12 — Real admin analytics endpoint (time-series data for charts)

## Goal

Back real dashboard charts (see the paired frontend spec `09-admin-dashboard-charts.md`) with real aggregated data. Today `courseServices.adminStatistics` (`GET /course/admin-stats`) returns only point-in-time counts (`totalCourses`, `totalStudents`, `totalInstructors`, `publishedCourses`, `revenue` for the last 30 days as a single number) — there's no time-series data to chart, and the frontend's "Average Course Completion" stat is a **hardcoded `"78%"` string**, not derived from any real data.

## Current State

- `course.service.ts::adminStatistics` — single `paymentModel.aggregate([...])` grouping all payments in the last 30 days into one total. No day-by-day breakdown.
- No aggregation anywhere computes an actual average completion percentage across all enrollments — `CourseEnrollment.service.ts::courseProgressPercentage` computes progress for one user/course pair at a time, never aggregated across all enrollments.

## Implementation

1. Add a new service function `getAdminAnalytics` (or extend `adminStatistics`) in `course.service.ts` that returns, in addition to the existing point-in-time stats:
   - **Revenue over time:** `paymentModel.aggregate([...])` grouped by day (or week, given real data volume) over the last 30/90 days, using `$dateToString`/`$group` on `createdAt`, `paymentStatus: "Completed"` only.
   - **Enrollments over time:** same shape, aggregating `courseEnrollmentModel` by `createdAt`.
   - **Real average completion:** aggregate over `VideoProgress` (or reuse `courseEnrollmentModel` + a per-enrollment progress computation) to produce one real average-completion percentage across all active enrollments, replacing the frontend's hardcoded `"78%"`.
2. Decide (confirm at implementation time) whether this extends the existing `GET /course/admin-stats` response shape (additive fields, simplest, no new route) or adds a new `GET /course/admin-analytics` route — prefer extending the existing endpoint unless the aggregation is expensive enough to want independent caching/loading state on the frontend.
3. Keep `authCheck(UserRole.admin)` on whichever route serves this (already true for `/course/admin-stats` once `05-security-authcheck-and-hardening.md` re-enables it).

## Dependencies

- No new packages — pure Mongoose aggregation pipeline work, same patterns already used in `adminStatistics`.
- Depends on `05-security-authcheck-and-hardening.md` having re-enabled `authCheck` on the stats route (or do both in either order — not a hard blocker, just note the route is currently open either way).

## Verify When Done

- [ ] `yarn build` and `yarn lint` clean.
- [ ] `GET /course/admin-stats` (or the new route) returns real day-by-day arrays for revenue and enrollments, verified against manually-counted payment/enrollment records in a test dataset.
- [ ] Average completion percentage changes when a real enrollment's progress changes (not a static value).
- [ ] Response time for the aggregation stays reasonable against current data volume (spot-check with `console.time`/logger timing — flag if a >90-day range aggregation becomes slow enough to need pre-aggregation/caching, but don't over-engineer that in this pass).
