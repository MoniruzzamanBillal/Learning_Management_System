# 29. Module Quiz — Backend

## Goal

Let an instructor attach one optional quiz to a module (title + multiple-choice questions, single correct option each), and let an enrolled+paid student take it. Per [`future-update-notes-quiz-assignment-plan.md`](../../../future-update-notes-quiz-assignment-plan.md)'s Feature 2, **updated per an explicit later decision: no retakes** — a student gets exactly one attempt per quiz, ever. Nothing about the quiz gates video access or module/course progression. This is the second of three planned features (Notes → Quiz → Assignment); independent of Notes (spec 28, already shipped) and Assignment (not yet designed).

## Design

### New Prisma models

```prisma
model Quiz {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  moduleId     String   @unique @db.Uuid
  instructorId String   @db.Uuid
  title        String
  description  String?
  isDeleted    Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  module     Module         @relation(fields: [moduleId], references: [id])
  instructor User           @relation("QuizInstructor", fields: [instructorId], references: [id])
  questions  QuizQuestion[]
  attempts   QuizAttempt[]
}

model QuizQuestion {
  id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  quizId        String   @db.Uuid
  questionText  String
  questionOrder Int
  isDeleted     Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  quiz    Quiz         @relation(fields: [quizId], references: [id])
  options QuizOption[]

  @@index([quizId, questionOrder])
}

model QuizOption {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  questionId  String   @db.Uuid
  optionText  String
  isCorrect   Boolean  @default(false)
  optionOrder Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  question QuizQuestion @relation(fields: [questionId], references: [id])

  @@index([questionId])
}

model QuizAttempt {
  id             String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  quizId         String   @db.Uuid
  userId         String   @db.Uuid
  courseId       String   @db.Uuid
  score          Int
  totalQuestions Int
  answers        Json     // { [questionId]: optionId } snapshot of what the student picked
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  quiz   Quiz   @relation(fields: [quizId], references: [id])
  user   User   @relation(fields: [userId], references: [id])
  course Course @relation(fields: [courseId], references: [id])

  @@unique([userId, quizId])
  @@index([userId, quizId])
}
```

**No retakes, enforced at the DB level:** `@@unique([userId, quizId])` on `QuizAttempt` (no `attemptNumber` field — every student gets exactly one row per quiz, period). A second submit is rejected by the unique constraint, not by an application-level counter.

`isDeleted` on `Quiz`/`QuizQuestion` only (instructor-authored, like `Module`/`Video`) — `QuizOption` (child of a soft-deletable question) and `QuizAttempt` (immutable submitted record) don't need it.

**Back-relations to add:**
- `Module.quiz Quiz?` (inverse of `Quiz.moduleId @unique` — one optional quiz per module)
- `User.quizzesAsInstructor Quiz[] @relation("QuizInstructor")`
- `User.quizAttempts QuizAttempt[]`
- `Course.quizAttempts QuizAttempt[]`

**Known limitation, accepted for MVP:** editing a quiz (see `updateQuiz` below) fully replaces its questions/options. Any `QuizAttempt` rows already recorded before that edit keep their `answers` JSON referencing now-deleted question/option ids — the attempt's headline `score`/`totalQuestions` (captured at submit time, not derived) still displays correctly, but that old attempt's full per-question breakdown can no longer be reconstructed after the quiz is edited. Not solved here; flagging it like `architecture.md`'s other documented gaps.

### Ownership enforcement (resolves the open question from spec 27 / the design doc)

Same pattern as `module.service.ts::updateModule` (spec 27's fix): the module's `instructorId` is the source of truth. `createQuiz` checks `module.instructorId === callerId` before allowing a quiz to be attached to that module (and denormalizes it onto `Quiz.instructorId`, mirroring `Video.instructorId`). `updateQuiz`/`deleteQuiz` then check `quiz.instructorId === callerId`, throwing `AppError(FORBIDDEN, "You are not authorized to ...")` on mismatch — copy the exact wording style already used there.

### New module: `lms_server/src/app/modules/quiz/`

Mirrors `review`'s file split: `quiz.route.ts`, `quiz.controller.ts`, `quiz.service.ts`, `quiz.interface.ts`, `quiz.validation.ts`.

**`quiz.interface.ts`** — re-export generated types (`TQuiz`, `TQuizQuestion`, `TQuizOption`, `TQuizAttempt`), same pattern as `VideoNote.interface.ts`.

**`quiz.validation.ts`:**
```ts
import { z } from "zod";

const optionSchema = z.object({
  optionText: z.string().min(1, "Option text is required !!!"),
  isCorrect: z.boolean(),
  optionOrder: z.number().int().min(0),
});

const questionSchema = z.object({
  questionText: z.string().min(1, "Question text is required !!!"),
  questionOrder: z.number().int().min(0),
  options: z
    .array(optionSchema)
    .min(2, "At least 2 options are required per question !!!")
    .refine((options) => options.filter((o) => o.isCorrect).length === 1, {
      message: "Exactly one option must be marked correct !!!",
    }),
});

const createQuizSchema = z.object({
  moduleId: z.string().uuid("Invalid module id !!!"),
  title: z.string().min(1, "Quiz title is required !!!"),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, "At least 1 question is required !!!"),
});

const updateQuizSchema = z.object({
  title: z.string().min(1, "Quiz title is required !!!"),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, "At least 1 question is required !!!"),
});

const submitQuizSchema = z.object({
  // keys/values validated as plain non-empty strings here; real question/option
  // existence is checked server-side in quiz.service.ts::submitQuiz.
  answers: z.record(z.string(), z.string()),
});

export const quizValidationSchema = {
  createQuizSchema,
  updateQuizSchema,
  submitQuizSchema,
};
```
(`z.record(z.string(), z.string())` used instead of `.uuid()` on the record's key/value to sidestep the currently-installed zod 3.24's less battle-tested generic-record-key typing — real UUID/existence validation happens against the DB in the service layer regardless.)

**`quiz.service.ts`:**

- `createQuiz(instructorId, payload)` — fetch module (`isDeleted: false`); 404 if missing. Check `module.instructorId === instructorId`, else 403. Check no existing quiz for that module (`findFirst({ moduleId, isDeleted: false })`); 400 "This module already has a quiz !!!" if one exists (friendly upfront check, same spirit as `module.service.ts::addModule`'s existence checks — the `@@unique` on `Quiz.moduleId` is the real guarantee). Create via one nested write:
  ```ts
  prisma.quiz.create({
    data: {
      moduleId: payload.moduleId,
      instructorId: module.instructorId,
      title: payload.title,
      description: payload.description,
      questions: {
        create: payload.questions.map((q) => ({
          questionText: q.questionText,
          questionOrder: q.questionOrder,
          options: { create: q.options.map((o) => ({ ...o })) },
        })),
      },
    },
    include: { questions: { include: { options: true } } },
  });
  ```

- `getQuizForManage(moduleId)` — instructor/admin authoring view, **includes `isCorrect`**:
  ```ts
  prisma.quiz.findFirst({
    where: { moduleId, isDeleted: false },
    include: {
      questions: {
        where: { isDeleted: false },
        orderBy: { questionOrder: "asc" },
        include: { options: { orderBy: { optionOrder: "asc" } } },
      },
    },
  });
  ```
  Returns `null` if the module has no quiz yet — not an error (same convention as `VideoNote.service.ts::getMyVideoNote`).

- `updateQuiz(quizId, instructorId, payload)` — fetch quiz (`isDeleted: false`); 404 if missing. Ownership check (`quiz.instructorId === instructorId`, else 403 — exact `module.service.ts::updateModule` pattern). In a `$transaction`: delete existing `QuizOption` rows (via the quiz's question ids), delete existing `QuizQuestion` rows, then `quiz.update` with new `title`/`description` plus a nested `questions: { create: [...] }` (same shape as `createQuiz`). Full replace, not a per-question diff — see "Known limitation" above.

- `deleteQuiz(quizId, instructorId)` — same fetch + ownership check as `updateQuiz`. Soft delete: `prisma.quiz.update({ where: { id: quizId }, data: { isDeleted: true } })` — does **not** cascade `isDeleted` onto its questions (matches design doc's stated `isDeleted` scope; questions become unreachable anyway once every query filters on `quiz.isDeleted: false` first).

- `getQuizToTake(userId, courseId, moduleId)` — find the quiz for `moduleId` (`isDeleted: false`); 404 "This module has no quiz !!!" if none. Find any existing `QuizAttempt` for `(userId, quiz.id)`.
  - **Attempt exists:** return the same shape `submitQuiz` returns (built via the shared `buildQuizResultPayload` helper below) — the frontend opens straight into results mode, never a blank form.
  - **No attempt yet:** return `{ quizId, title, description, questions: [...] }` with each question's options **stripped of `isCorrect`** — the security requirement carried over unchanged from the design doc.

- `submitQuiz(userId, courseId, quizId, answers)` — fetch the quiz with its questions+options (`isDeleted: false` on the quiz and its questions); 404 if missing. **Security check:** verify the quiz's module actually belongs to `courseId` (`quiz.module.courseId === courseId`) — `ValidateCourseAccess` only proves the caller is enrolled+paid for the `courseId` in the URL, not that `quizId` belongs to that course, so without this check a paid student in course A could submit a `quizId` belonging to a module of an unrelated course B by putting course A's id in the URL. Mismatch → 404 (don't leak that the quiz exists elsewhere). Compute `score` by comparing each `answers[question.id]` against that question's correct option. Wrap the create in try/catch for the `@@unique([userId, quizId])` violation:
  ```ts
  try {
    attempt = await prisma.quizAttempt.create({
      data: { quizId, userId, courseId, score, totalQuestions: questions.length, answers },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new AppError(httpStatus.BAD_REQUEST, "You have already submitted this quiz !!!");
    }
    throw error;
  }
  ```
  (Exact `Prisma.PrismaClientKnownRequestError`/`P2002` pattern as `review.service.ts::addReview`.) Return `buildQuizResultPayload(quiz, attempt)`.

- `buildQuizResultPayload(quiz, attempt)` (private helper, not exported) — shapes the response both `getQuizToTake` (attempt-exists branch) and `submitQuiz` return:
  ```ts
  {
    attemptId: attempt.id,
    score: attempt.score,
    totalQuestions: attempt.totalQuestions,
    questions: quiz.questions.map((q) => ({
      questionId: q.id,
      questionText: q.questionText,
      options: q.options.map((o) => ({
        optionId: o.id,
        optionText: o.optionText,
        isCorrect: o.isCorrect,
        wasSelected: (attempt.answers as Record<string, string>)[q.id] === o.id,
      })),
    })),
  }
  ```

**`quiz.controller.ts`** — thin `catchAsync` + `sendResponse` wrappers, same shape as `VideoNote.controller.ts`, reading `req.user.userId` / `req.params` / `req.body`.

**`quiz.route.ts`:**
```ts
router.post("/", authCheck(UserRole.instructor), validateRequest(quizValidationSchema.createQuizSchema), quizController.createQuiz);
router.get("/manage/:moduleId", authCheck(UserRole.instructor, UserRole.admin), quizController.getQuizForManage);
router.patch("/:quizId", authCheck(UserRole.instructor), validateRequest(quizValidationSchema.updateQuizSchema), quizController.updateQuiz);
router.delete("/:quizId", authCheck(UserRole.instructor), quizController.deleteQuiz);
router.get("/take/:courseId/:moduleId", authCheck(UserRole.user), ValidateCourseAccess, quizController.getQuizToTake);
router.post("/submit/:courseId/:quizId", authCheck(UserRole.user), ValidateCourseAccess, validateRequest(quizValidationSchema.submitQuizSchema), quizController.submitQuiz);
```
`GET /manage/:moduleId` is deliberately readable by any authenticated instructor/admin (not ownership-gated) — same precedent as module detail per spec 27 ("viewing across instructors is already intentional existing behavior"); only the writes (`PATCH`/`DELETE`, and `POST` create against someone else's module) are ownership-gated.

**Router registration:** add to `src/app/router/index.ts`'s `routeArray`: `{ path: "/quiz", route: quizRouter }`.

### Existing-endpoint change: expose "does this module have a quiz" to the student accordion

`CourseEnrollment.service.ts::getUserEnrolledCourse` (backs `GET /enroll/my-enrolled-course/:courseId`, the call `EnrollCourseDetail.tsx` makes) currently selects `modules: { select: { id, title, videos: {...} } }`. Add `quiz: { where: { isDeleted: false }, select: { id: true } }` to that same `modules.select` — Prisma returns it as a single object or `null` (to-one, via `Quiz.moduleId @unique`), no extra mapping needed (unlike `videos`, which is mapped down to an id array — leave `quiz` as the raw `{ id } | null` object). This is the only existing backend file this feature touches.

## Implementation

1. `prisma/schema.prisma` — add `Quiz`/`QuizQuestion`/`QuizOption`/`QuizAttempt`; add the four back-relations (`Module.quiz`, `User.quizzesAsInstructor`, `User.quizAttempts`, `Course.quizAttempts`).
2. `npx prisma migrate dev --name add_quiz` (from `lms_server/`). Per `CLAUDE.md`: avoid `npx prisma migrate reset` afterward.
3. New `src/app/modules/quiz/` — `quiz.interface.ts`, `quiz.validation.ts`, `quiz.service.ts`, `quiz.controller.ts`, `quiz.route.ts` (all above).
4. `src/app/router/index.ts` — import `quizRouter`, add `{ path: "/quiz", route: quizRouter }`.
5. `CourseEnrollment.service.ts::getUserEnrolledCourse` — add the `quiz` select as described above.
6. `yarn build` / `yarn lint` clean.

## Dependencies

- No new packages.
- Independent of Assignment (not yet designed). Fully additive to Notes (spec 28) and everything else — touches one existing line in `CourseEnrollment.service.ts` and nothing else pre-existing.

## Verify-when-done

**Instructor authoring:**
- [ ] `POST /api/quiz` with no token → `401`.
- [ ] As an instructor who does **not** own the target module → `403`.
- [ ] As the owning instructor, valid payload (1+ questions, each with exactly one `isCorrect` option) → `201`/`200`, quiz + questions + options created in one call.
- [ ] Same payload again for the same module → `400` "This module already has a quiz !!!" (not a raw Prisma unique-constraint error).
- [ ] A question payload with zero or two `isCorrect: true` options → `400` from Zod, not a silently-wrong DB write.
- [ ] `GET /api/quiz/manage/:moduleId` as any logged-in instructor/admin → `200` with `isCorrect` visible; for a module with no quiz → `200` with `data: null`.
- [ ] `PATCH /api/quiz/:quizId` as a non-owning instructor → `403`; as the owner → replaces the full question/option set, confirmed via a following `GET /manage/:moduleId`.
- [ ] `DELETE /api/quiz/:quizId` as the owner → `200`, soft-deleted; a following `GET /manage/:moduleId` returns `data: null` again; the module's "does it have a quiz" indicator (see below) also flips back to none.

**Student participation:**
- [ ] `GET /api/quiz/take/:courseId/:moduleId` with no token → `401`; as an enrolled-but-unpaid or not-enrolled user → `403` (via `ValidateCourseAccess`).
- [ ] Enrolled+paid, module has no quiz → `404`.
- [ ] Enrolled+paid, quiz exists, no prior attempt → `200`, questions/options returned **without** `isCorrect` anywhere in the payload (grep the raw response body to confirm).
- [ ] `POST /api/quiz/submit/:courseId/:quizId` with a full `answers` map → `200`/`201`, correct `score`, and a per-question breakdown with the right options flagged `isCorrect`/`wasSelected`.
- [ ] Submitting again for the same `(user, quiz)` → `400` "You have already submitted this quiz !!!" (not a raw `P2002`), and no second row was created (spot-check row count).
- [ ] Following that, `GET /api/quiz/take/:courseId/:moduleId` returns the **same** results payload (results mode) instead of a blank question form — confirms the "no retake, always shows past result" flow.
- [ ] Submitting a `quizId` that belongs to a module of a *different* course than the `:courseId` in the URL (using a course the caller is legitimately enrolled+paid for) → `404`, not a successful cross-course submit.
- [ ] A second, different enrolled+paid user's attempt at the same quiz is entirely independent (own `score`/`answers`, no interference with the first user's row).

**Cross-cutting:**
- [ ] `GET /api/enroll/my-enrolled-course/:courseId` — each module in the response now carries `quiz: { id } | null`; verify against a module with a quiz and one without.
- [ ] `yarn build` / `yarn lint` clean on all touched/new files.

This is a planning document — no schema migration or module code has been written yet.
