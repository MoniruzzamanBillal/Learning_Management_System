# 33. Assignment recreate-after-delete crash

## Goal

Fix a second real bug found while live-verifying [`31-assignment.md`](31-assignment.md), found immediately after fixing [`32-assignment-duedate-coercion-not-applied.md`](32-assignment-duedate-coercion-not-applied.md) on the very next re-test: creating an assignment for a module that previously had one **soft-deleted** crashes with an uncaught `500` (raw Prisma `P2002` unique-constraint violation), instead of successfully creating a fresh assignment for that module.

This is the exact same bug class as [`30-quiz-recreate-after-delete-crash.md`](30-quiz-recreate-after-delete-crash.md) — spec 31's Design section explicitly modeled `Assignment.moduleId @unique` on `Quiz.moduleId @unique` ("identical shape") and even referenced quiz's create pattern by name, but did not carry over spec 30's fix for this exact hard-`@unique`-vs-soft-delete interaction. The gap was reintroduced.

## Root cause

`Assignment.moduleId` is a hard `@unique` (`prisma/schema.prisma`), not a partial `isDeleted:false`-scoped index like `Video`'s — required so `Module.assignment` can be a valid singular (`Assignment?`) relation. A soft-deleted `Assignment` row therefore still permanently occupies its module's unique slot.

`assignment.service.ts::createAssignment`'s existing-assignment check only looks at active rows:

```ts
const existingAssignment = await prisma.assignment.findFirst({
  where: { moduleId: payload.moduleId, isDeleted: false },
});

if (existingAssignment) {
  throw new AppError(httpStatus.BAD_REQUEST, "This module already has an assignment !!!");
}
```

When a module's assignment was previously deleted, this `findFirst` finds nothing (correctly, from the isDeleted:false view), so the function falls through to `prisma.assignment.create(...)` — which then hits the real DB-level `@unique` on `moduleId` against the still-present soft-deleted row and throws an uncaught `Prisma.PrismaClientKnownRequestError` (`P2002`), surfacing as a raw `500` with a leaked Prisma stack trace.

Reproduced live: created an assignment on a module, deleted it (soft delete, `isDeleted: true`), then created a new assignment for the same module → `500`, `"Unique constraint failed on the fields: (\"moduleId\")"`.

## Design

Mirror `quiz.service.ts::createQuiz`'s exact fix from spec 30: look up the assignment slot with `findUnique` (no `isDeleted` filter, since a hard `@unique` means at most one row can ever exist for a given `moduleId`, active or not), then branch:

- **Active row exists** (`existingAssignment && !existingAssignment.isDeleted`) → same `400` "This module already has an assignment !!!" as today.
- **Soft-deleted row exists** (`existingAssignment && existingAssignment.isDeleted`) → reactivate the same row instead of inserting a new one: `isDeleted: false` plus the new `title`/`instructions`/`dueDate`, reusing the existing row's `id`.
- **No row at all** → `prisma.assignment.create(...)`, unchanged.

**Submissions on reactivation:** unlike Quiz (which has to clear `QuizAttempt` rows because `@@unique([userId, quizId])` would otherwise permanently block a retake against the new content), Assignment's `submitAssignment` already allows resubmission freely until graded — so a stale `AssignmentSubmission` row surviving reactivation isn't blocked by a unique constraint the way Quiz was. But it's still the wrong behavior: the reactivated row reuses the same `id`, so a student's old submission (possibly already `graded`, with a score/feedback that applied to the **old**, now-replaced `instructions`) would silently reappear attached to a brand-new assignment the student never saw, including a stale "already graded, ask your instructor to reopen" lock carried over from unrelated content. Clear `AssignmentSubmission` rows for the reactivated assignment id as part of the same reactivation, matching spec 30's reasoning (a full reactivation is a full reset of that module's slot) even though the failure mode here is data-correctness, not a second crash.

Wrap the reactivation (clear submissions + update) in a `prisma.$transaction`, matching `quiz.service.ts::createQuiz`'s existing transaction shape.

## Implementation

1. `assignment.service.ts::createAssignment` — replace the `findFirst({ isDeleted: false })` existing-assignment check with `findUnique({ where: { moduleId } })` (no `isDeleted` filter) and the three-way branch described above.
2. `yarn build` / `yarn lint` clean.

## Verify-when-done

- [ ] Create an assignment for a module → `201`.
- [ ] Delete it (soft delete) → `200`.
- [ ] Create a new assignment for the **same** module with different title/instructions → `201` (not `500`), same row `id` reused (confirm via a direct check or by noting `createdAt` stays the original creation time while `updatedAt`/content change).
- [ ] `GET /api/assignment/manage/:moduleId` after the recreate shows the new title/instructions, not the old ones.
- [ ] If a submission existed against the pre-deletion assignment, it's gone after recreation — a following `GET /api/assignment/take/:courseId/:moduleId` as that student returns `submission: null`, not a stale/graded result from the deleted version.
- [ ] Creating a second assignment for a module that already has an **active** one still correctly returns `400` "This module already has an assignment !!!" (regression check — this is the branch spec 31 already covered and must keep working).
- [ ] `yarn build` / `yarn lint` clean.
