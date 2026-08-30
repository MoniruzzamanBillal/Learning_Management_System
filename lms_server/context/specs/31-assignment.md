# 31. Assignment — Backend

## Goal

Let an instructor attach one optional assignment to a module (rich-text instructions, optional due date), and let an enrolled+paid student submit a **link or short free text** (GitHub repo URL, PDF/Drive link, or a placeholder like "will do it later") as their answer — no file upload. The student can edit/resubmit freely until the instructor grades it (score **0–10**, fixed scale); once graded, the submission locks, and only an explicit instructor **reopen** action unlocks it again for further edits (clearing the prior score/feedback). Per [`future-update-notes-quiz-assignment-plan.md`](../../../future-update-notes-quiz-assignment-plan.md)'s Feature 3 (as refined in conversation — link/text-only submission, fixed 0–10 grading, lock-after-grade-with-reopen). This is the third of three planned features (Notes → Quiz → Assignment); independent of Notes (spec 28) and Quiz (spec 29/30), both already shipped. Nothing about the assignment gates video access or module/course progression, matching the precedent set by Quiz.

## Design

### New Prisma models

```prisma
enum AssignmentSubmissionStatus {
  submitted
  graded
}

model Assignment {
  id           String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  moduleId     String    @unique @db.Uuid
  instructorId String    @db.Uuid
  title        String
  instructions String    // TipTap HTML — may contain a GitHub (or any) link, rendered as a normal <a>
  dueDate      DateTime? // informational only, not enforced — no "late" status/logic
  isDeleted    Boolean   @default(false)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  module      Module                 @relation(fields: [moduleId], references: [id])
  instructor  User                   @relation("AssignmentInstructor", fields: [instructorId], references: [id])
  submissions AssignmentSubmission[]
}

model AssignmentSubmission {
  id                   String                     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  assignmentId         String                     @db.Uuid
  userId               String                     @db.Uuid
  courseId             String                     @db.Uuid
  content              String                     // student's link or free text
  submissionVersion    Int                        @default(1)
  status               AssignmentSubmissionStatus @default(submitted)
  score                Int?                       // 0–10, set only when status = graded
  feedback             String?
  gradedByInstructorId String?                    @db.Uuid
  submittedAt          DateTime                   @default(now())
  gradedAt             DateTime?
  createdAt            DateTime                   @default(now())
  updatedAt            DateTime                   @updatedAt

  assignment Assignment @relation(fields: [assignmentId], references: [id])
  user       User       @relation("SubmissionStudent", fields: [userId], references: [id])
  course     Course     @relation(fields: [courseId], references: [id])
  gradedBy   User?      @relation("SubmissionGrader", fields: [gradedByInstructorId], references: [id])

  @@unique([assignmentId, userId])
  @@index([assignmentId, status])
}
```

`isDeleted` on `Assignment` only (instructor-authored, like `Module`/`Video`/`Quiz`) — `AssignmentSubmission` is a student record, not soft-deleted; its lifecycle is `status` (`submitted` ↔ `graded`), not deletion.

**One optional assignment per module** — `Assignment.moduleId @unique`, identical shape to `Quiz.moduleId @unique`. This is what lets an instructor choose exactly which modules get one (e.g. after module 2 and after module 5 in a 5-module course) — no scheduling logic needed, it's just which modules have a row.

**Back-relations to add:**
- `Module.assignment Assignment?` (inverse of `Assignment.moduleId @unique`)
- `User.assignmentsAsInstructor Assignment[] @relation("AssignmentInstructor")`
- `User.assignmentSubmissions AssignmentSubmission[] @relation("SubmissionStudent")`
- `User.assignmentSubmissionsGraded AssignmentSubmission[] @relation("SubmissionGrader")`
- `Course.assignmentSubmissions AssignmentSubmission[]`

### Ownership enforcement

Same pattern as `module.service.ts::updateModule` and `quiz.service.ts` (spec 29): the module's `instructorId` is the source of truth. `createAssignment` checks `module.instructorId === callerId` before allowing an assignment to be attached to that module (and denormalizes it onto `Assignment.instructorId`, mirroring `Quiz.instructorId`). `updateAssignment`/`deleteAssignment`/`gradeSubmission`/`reopenSubmission` then check `assignment.instructorId === callerId`, throwing `AppError(httpStatus.FORBIDDEN, "You are not authorized to ...")` on mismatch — copy the exact wording style already used in `module.service.ts`/`quiz.service.ts`.

### New module: `lms_server/src/app/modules/assignment/`

Mirrors `quiz`'s file split: `assignment.route.ts`, `assignment.controller.ts`, `assignment.service.ts`, `assignment.interface.ts`, `assignment.validation.ts`.

**`assignment.interface.ts`** — re-export generated types (`TAssignment`, `TAssignmentSubmission`), same pattern as `quiz.interface.ts`.

**`assignment.validation.ts`:**
```ts
import { z } from "zod";

const createAssignmentSchema = z.object({
  moduleId: z.string().uuid("Invalid module id !!!"),
  title: z.string().min(1, "Assignment title is required !!!"),
  instructions: z.string().min(1, "Instructions are required !!!"),
  dueDate: z.coerce.date().optional(),
});

const updateAssignmentSchema = z.object({
  title: z.string().min(1, "Assignment title is required !!!"),
  instructions: z.string().min(1, "Instructions are required !!!"),
  dueDate: z.coerce.date().optional(),
});

const submitAssignmentSchema = z.object({
  content: z.string().min(1, "Submission cannot be empty !!!"),
});

const gradeSubmissionSchema = z.object({
  score: z.number().int().min(0, "Score cannot be negative !!!").max(10, "Score cannot exceed 10 !!!"),
  feedback: z.string().optional(),
});

export const assignmentValidationSchema = {
  createAssignmentSchema,
  updateAssignmentSchema,
  submitAssignmentSchema,
  gradeSubmissionSchema,
};
```

`dueDate` uses `z.coerce.date()`, not `z.string().datetime()` — the frontend's native `<input type="date">` (see `30-assignment-ui.md`) emits a bare `"YYYY-MM-DD"` string, which `.datetime()` rejects (it requires a full ISO-8601 datetime with a `T`/timezone) but `z.coerce.date()` parses correctly via `new Date(...)`, same as a full ISO string. This avoids needing a client-side conversion step for a field that's informational only.

**`assignment.service.ts`:**

- `createAssignment(instructorId, payload)` — fetch module (`isDeleted: false`); 404 if missing. Check `module.instructorId === instructorId`, else 403. Check no existing assignment for that module (`findFirst({ moduleId, isDeleted: false })`); 400 "This module already has an assignment !!!" if one exists (friendly upfront check, same spirit as `quiz.service.ts::createQuiz` — the `@@unique` on `Assignment.moduleId` is the real guarantee). Create: `prisma.assignment.create({ data: { moduleId, instructorId: module.instructorId, title, instructions, dueDate } })`.

- `getAssignmentForManage(moduleId)` — instructor/admin authoring view:
  ```ts
  prisma.assignment.findFirst({ where: { moduleId, isDeleted: false } });
  ```
  Returns `null` if the module has no assignment yet — not an error (same convention as `quiz.service.ts::getQuizForManage`).

- `updateAssignment(assignmentId, instructorId, payload)` — fetch assignment (`isDeleted: false`); 404 if missing. Ownership check (`assignment.instructorId === instructorId`, else 403). `prisma.assignment.update({ where: { id: assignmentId }, data: { title, instructions, dueDate } })`.

- `deleteAssignment(assignmentId, instructorId)` — same fetch + ownership check. Soft delete: `prisma.assignment.update({ where: { id: assignmentId }, data: { isDeleted: true } })`. Existing `AssignmentSubmission` rows are left as-is (become unreachable once queries filter on `assignment.isDeleted: false`), same precedent as `quiz.service.ts::deleteQuiz` not cascading onto its children.

- `getAssignmentSubmissions(assignmentId, instructorId)` — grading list. Ownership check as above. Returns all submissions for the assignment with the submitting student's `id`/`name`/`email` included, ordered by `submittedAt desc`:
  ```ts
  prisma.assignmentSubmission.findMany({
    where: { assignmentId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { submittedAt: "desc" },
  });
  ```
  No `quiz` analog for this endpoint — quizzes are auto-graded, assignments need an instructor-facing list to grade against.

- `getAssignmentToTake(userId, courseId, moduleId)` — find the assignment for `moduleId` (`isDeleted: false`); 404 "This module has no assignment !!!" if none. **Security check**, same shape as `quiz.service.ts::submitQuiz`'s cross-course check: verify `assignment.module.courseId === courseId` (`ValidateCourseAccess` only proves the caller is enrolled+paid for the `courseId` in the URL, not that this assignment belongs to that course) — mismatch → 404. Find any existing `AssignmentSubmission` for `(userId, assignment.id)`. Return `{ assignmentId, title, instructions, dueDate, submission: submission ?? null }` — `submission` carries `content`/`status`/`score`/`feedback`/`submissionVersion` when present, `null` when the student hasn't submitted yet. Unlike Quiz's "results mode vs question mode" split, this is always one shape — the frontend just checks whether `submission` is present and whether `submission.status === "graded"` to decide editable vs locked.

- `submitAssignment(userId, courseId, assignmentId, content)` — fetch the assignment (`isDeleted: false`) with its module; 404 if missing. Same cross-course `assignment.module.courseId === courseId` check as `getAssignmentToTake` → 404 on mismatch. Fetch any existing submission for `(assignmentId, userId)`:
  - **If it exists and `status === "graded"`**: reject — `throw new AppError(httpStatus.BAD_REQUEST, "This assignment has already been graded. Ask your instructor to reopen it before resubmitting !!!")`.
  - **Otherwise**: upsert on `(assignmentId, userId)` — `prisma.assignmentSubmission.upsert({ where: { assignmentId_userId: { assignmentId, userId } }, create: { assignmentId, userId, courseId, content, submissionVersion: 1 }, update: { content, submissionVersion: { increment: 1 }, submittedAt: new Date() } })`. Same upsert-on-save shape as `VideoNote.service.ts`'s save, adapted with the version bump.

  (The `graded`-status short-circuit happens in application code, not a DB constraint, because the goal is a friendly message — unlike Quiz's one-shot-by-`@@unique` design, resubmission is normally allowed here, just conditionally blocked.)

- `gradeSubmission(submissionId, instructorId, { score, feedback })` — fetch submission with its `assignment` (`isDeleted: false` on the assignment); 404 if missing. Ownership check: `submission.assignment.instructorId === instructorId`, else 403. `prisma.assignmentSubmission.update({ where: { id: submissionId }, data: { score, feedback, status: "graded", gradedByInstructorId: instructorId, gradedAt: new Date() } })`.

- `reopenSubmission(submissionId, instructorId)` — same fetch + ownership check as `gradeSubmission`. `prisma.assignmentSubmission.update({ where: { id: submissionId }, data: { status: "submitted", score: null, feedback: null, gradedByInstructorId: null, gradedAt: null } })` — this is the **only** way a graded submission becomes editable again; `submitAssignment`'s graded-status check is what enforces that.

**`assignment.controller.ts`** — thin `catchAsync` + `sendResponse` wrappers, same shape as `quiz.controller.ts`, reading `req.user.userId` / `req.params` / `req.body`.

**`assignment.route.ts`:**
```ts
router.post("/", authCheck(UserRole.instructor), validateRequest(assignmentValidationSchema.createAssignmentSchema), assignmentController.createAssignment);
router.get("/manage/:moduleId", authCheck(UserRole.instructor, UserRole.admin), assignmentController.getAssignmentForManage);
router.patch("/:assignmentId", authCheck(UserRole.instructor), validateRequest(assignmentValidationSchema.updateAssignmentSchema), assignmentController.updateAssignment);
router.delete("/:assignmentId", authCheck(UserRole.instructor), assignmentController.deleteAssignment);
router.get("/submissions/:assignmentId", authCheck(UserRole.instructor, UserRole.admin), assignmentController.getAssignmentSubmissions);
router.get("/take/:courseId/:moduleId", authCheck(UserRole.user), ValidateCourseAccess, assignmentController.getAssignmentToTake);
router.put("/submit/:courseId/:assignmentId", authCheck(UserRole.user), ValidateCourseAccess, validateRequest(assignmentValidationSchema.submitAssignmentSchema), assignmentController.submitAssignment);
router.patch("/grade/:submissionId", authCheck(UserRole.instructor), validateRequest(assignmentValidationSchema.gradeSubmissionSchema), assignmentController.gradeSubmission);
router.patch("/reopen/:submissionId", authCheck(UserRole.instructor), assignmentController.reopenSubmission);
```
`GET /manage/:moduleId` and `GET /submissions/:assignmentId` are deliberately readable by any authenticated instructor/admin (not ownership-gated), matching the exact precedent already established by `GET /quiz/manage/:moduleId` (spec 27 / spec 29's stated rationale: "viewing across instructors is already intentional existing behavior"); only the writes (`PATCH`/`DELETE`/`POST create`/`grade`/`reopen`) are ownership-gated.

**Router registration:** add to `src/app/router/index.ts`'s `routeArray`: `{ path: "/assignment", route: assignmentRouter }`.

### Existing-endpoint change: expose "does this module have an assignment" to the student accordion

`CourseEnrollment.service.ts::getUserEnrolledCourse` currently selects `modules: { select: { id, title, videos: {...}, quiz: {...} } }` (added by spec 29). Add `assignment: { where: { isDeleted: false }, select: { id: true } }` to that same `modules.select`, identical shape to the existing `quiz` select — Prisma returns it as a single object or `null` (to-one, via `Assignment.moduleId @unique`), no extra mapping needed. This is the only existing backend file this feature touches, same as Quiz's single touch point.

## Implementation

1. `prisma/schema.prisma` — add `AssignmentSubmissionStatus` enum, `Assignment`/`AssignmentSubmission` models; add the five back-relations (`Module.assignment`, `User.assignmentsAsInstructor`, `User.assignmentSubmissions`, `User.assignmentSubmissionsGraded`, `Course.assignmentSubmissions`).
2. `npx prisma migrate dev --name add_assignment` (from `lms_server/`). Per `CLAUDE.md`: avoid `npx prisma migrate reset` afterward.
3. New `src/app/modules/assignment/` — `assignment.interface.ts`, `assignment.validation.ts`, `assignment.service.ts`, `assignment.controller.ts`, `assignment.route.ts` (all above).
4. `src/app/router/index.ts` — import `assignmentRouter`, add `{ path: "/assignment", route: assignmentRouter }`.
5. `CourseEnrollment.service.ts::getUserEnrolledCourse` — add the `assignment` select as described above.
6. `yarn build` / `yarn lint` clean.

## Dependencies

- No new packages — no file upload involved, so `SendImageCloudinary.ts`/multer are **not** touched by this feature.
- Independent of Notes (spec 28) and Quiz (spec 29), both already shipped. Fully additive — touches one existing line in `CourseEnrollment.service.ts` and nothing else pre-existing.

## Verify-when-done

**Instructor authoring:**
- [ ] `POST /api/assignment` with no token → `401`.
- [ ] As an instructor who does **not** own the target module → `403`.
- [ ] As the owning instructor, valid payload → `201`/`200`, assignment created.
- [ ] Same payload again for the same module → `400` "This module already has an assignment !!!" (not a raw Prisma unique-constraint error).
- [ ] `GET /api/assignment/manage/:moduleId` as any logged-in instructor/admin → `200`; for a module with no assignment → `200` with `data: null`.
- [ ] `PATCH /api/assignment/:assignmentId` as a non-owning instructor → `403`; as the owner → updates title/instructions/dueDate, confirmed via a following `GET /manage/:moduleId`.
- [ ] `DELETE /api/assignment/:assignmentId` as the owner → `200`, soft-deleted; a following `GET /manage/:moduleId` returns `data: null`; the module's "does it have an assignment" indicator (see below) also flips back to none.

**Student submission:**
- [ ] `GET /api/assignment/take/:courseId/:moduleId` with no token → `401`; as an enrolled-but-unpaid or not-enrolled user → `403` (via `ValidateCourseAccess`).
- [ ] Enrolled+paid, module has no assignment → `404`.
- [ ] Enrolled+paid, assignment exists, no prior submission → `200`, `submission: null`.
- [ ] `PUT /api/assignment/submit/:courseId/:assignmentId` with `{ content: "https://github.com/..." }` → `200`/`201`, `AssignmentSubmission` created with `status: submitted`, `submissionVersion: 1`.
- [ ] Submitting again with different `content` (still `submitted`, not yet graded) → `200`, same row updated in place, `submissionVersion` incremented to `2`, no second row created (spot-check row count).
- [ ] Submitting a free-text placeholder like `"I will do it later"` is accepted the same as a URL — no URL-format validation server-side.
- [ ] Submitting an `assignmentId` that belongs to a module of a *different* course than the `:courseId` in the URL (using a course the caller is legitimately enrolled+paid for) → `404`, not a successful cross-course submit.

**Grading / lock / reopen:**
- [ ] `GET /api/assignment/submissions/:assignmentId` as the owning instructor → `200`, list includes the submitter's `id`/`name`/`email` and `content`/`status`.
- [ ] `PATCH /api/assignment/grade/:submissionId` with `{ score: 11, feedback: "..." }` → `400` from Zod (score above 10 rejected); with `{ score: -1 }` → `400`; with `{ score: 7, feedback: "Good work" }` → `200`, `status: graded`, `gradedByInstructorId`/`gradedAt` set.
- [ ] As a non-owning instructor → `403` on `grade`.
- [ ] After grading, student calls `PUT /api/assignment/submit/:courseId/:assignmentId` again → `400` "This assignment has already been graded. Ask your instructor to reopen it before resubmitting !!!" — content/score/status all unchanged in the DB (spot-check).
- [ ] `PATCH /api/assignment/reopen/:submissionId` as the owning instructor → `200`, `status: submitted`, `score`/`feedback`/`gradedByInstructorId`/`gradedAt` all cleared to `null`.
- [ ] Following reopen, the student can `PUT /submit` again successfully — content updates, `submissionVersion` increments, `status` stays `submitted` until graded again.
- [ ] A second, different enrolled+paid user's submission to the same assignment is entirely independent (own `content`/`status`/`score`, no interference with the first user's row).

**Cross-cutting:**
- [ ] `GET /api/enroll/my-enrolled-course/:courseId` — each module in the response now carries `assignment: { id } | null`; verify against a module with an assignment and one without.
- [ ] `yarn build` / `yarn lint` clean on all touched/new files.

This is a planning document — no schema migration or module code has been written yet.
