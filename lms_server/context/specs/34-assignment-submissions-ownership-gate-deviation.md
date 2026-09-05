# 34. `getAssignmentSubmissions` incorrectly ownership-gated

## Goal

Fix a real deviation from [`31-assignment.md`](31-assignment.md)'s own Design section, found while frontend-testing [`lms_client` spec `30-assignment-ui.md`](../../../lms_client/context/specs/30-assignment-ui.md): `GET /api/assignment/submissions/:assignmentId` currently throws a `403` for any instructor other than the assignment's owner, even though spec 31 explicitly designed this endpoint to be unrestricted.

## Root cause

Spec 31's Design section states, in its own words:

> `GET /manage/:moduleId` and `GET /submissions/:assignmentId` are deliberately readable by any authenticated instructor/admin (not ownership-gated), matching the exact precedent already established by `GET /quiz/manage/:moduleId` (spec 27 / spec 29's stated rationale: "viewing across instructors is already intentional existing behavior"); only the writes (`PATCH`/`DELETE`/`POST create`/`grade`/`reopen`) are ownership-gated.

`getAssignmentForManage` was implemented correctly (no ownership check — any instructor/admin can view). But `getAssignmentSubmissions` (`assignment.service.ts`) was implemented with an ownership check anyway:

```ts
const getAssignmentSubmissions = async (
  assignmentId: string,
  instructorId: string,
) => {
  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, isDeleted: false },
  });

  if (!assignment) {
    throw new AppError(httpStatus.NOT_FOUND, "This assignment don't exist !!!");
  }

  if (assignment.instructorId !== instructorId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to view submissions for this assignment !!!",
    );
  }
  // ...
};
```

This directly contradicts the spec's stated design for this one function — a self-inconsistency introduced during spec 31's own implementation, not a later regression.

**Reproduced live:** `instructor2` (does not own the module/assignment in question) — `GET /api/assignment/manage/:moduleId` for that module succeeds (`200`, full assignment data, as designed), but `GET /api/assignment/submissions/:assignmentId` for the same assignment returns `403` "You are not authorized to view submissions for this assignment !!!".

**Frontend symptom:** `lms_client`'s new `SubmissionsTable.tsx` (spec 30-assignment-ui) has no error-state handling — on a `403` it doesn't render an error message, and depending on TanStack Query's retry timing, can leave the "Loading submissions..." text showing indefinitely instead of either the real data (if the fix below lands) or a clear error state.

## Design

Remove the ownership check from `getAssignmentSubmissions`, matching `getAssignmentForManage`'s already-correct shape (fetch + 404-if-missing only, no instructor comparison). This makes the function consistent with the spec's own Design section and with `getAssignmentForManage`'s sibling behavior.

No frontend change is required once the backend returns real data instead of a `403` — `SubmissionsTable.tsx` will render normally for any instructor/admin, same as `ManageAssignment.tsx`'s `AssignmentForm` pre-fill already does today. (A generic error-state fallback in `SubmissionsTable.tsx` for network/permission failures is still a reasonable hardening, but is not required to fix *this* bug — the bug is the backend incorrectly rejecting a request the design says should succeed.)

## Implementation

1. `lms_server/src/app/modules/assignment/assignment.service.ts::getAssignmentSubmissions` — remove the `assignment.instructorId !== instructorId` check and its `403` throw. Keep the `findFirst({ id: assignmentId, isDeleted: false })` existence check and `404` on missing.
2. `yarn build` / `yarn lint` clean.
3. Re-verify live: a non-owning instructor's `GET /assignment/submissions/:assignmentId` now returns `200` with the real submission list, matching `GET /assignment/manage/:moduleId`'s existing unrestricted behavior.

## Verify-when-done

- [ ] `GET /api/assignment/submissions/:assignmentId` as a non-owning instructor → `200` with the real submissions list (not `403`).
- [ ] `GET /api/assignment/submissions/:assignmentId` as the owning instructor → unchanged, still `200`.
- [ ] `GET /api/assignment/submissions/:assignmentId` for a nonexistent assignment id → still `404`.
- [ ] `PATCH /assignment/grade/:submissionId` / `PATCH /assignment/reopen/:submissionId` as a non-owning instructor → still `403` (unaffected — this fix only touches the read endpoint).
- [ ] `lms_client`'s `SubmissionsTable.tsx` renders real submission rows for a non-owning instructor opening "Manage Assignment" on someone else's module, instead of getting stuck on "Loading submissions...".
- [ ] `yarn build` / `yarn lint` clean.
