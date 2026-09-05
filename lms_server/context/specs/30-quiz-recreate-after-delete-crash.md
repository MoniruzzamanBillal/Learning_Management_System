# 30. Creating a quiz for a module that once had a deleted one crashes (500)

## Goal

Fix `POST /quiz` throwing an unhandled 500 when an instructor creates a quiz for a module whose *previous* quiz was soft-deleted. Found live during frontend UI testing of spec 29 (Playwright click-through of the instructor "Create Quiz" flow, immediately after the same module's quiz had been created-then-deleted during spec 29's own backend verification).

## Root cause

`Quiz.moduleId String @unique @db.Uuid` in `prisma/schema.prisma` is a **hard** unique constraint at the DB level — unlike `Video`'s `{moduleId, videoOrder}` uniqueness, which is deliberately a hand-added **partial** index (`WHERE "isDeleted" = false`, per `context/specs/19-postgres-prisma-migration.md` Stage 1.2), `Quiz.moduleId` can't use that same trick and still keep `Module.quiz Quiz?` as a valid Prisma singular relation — Prisma requires a real schema-level `@unique` attribute to generate a to-one back-relation (the exact reason `CourseEnrollment.paymentId` is `@unique` too, per that field's own comment in the schema).

Net effect: a module's "quiz slot" is permanently claimed by the first `Quiz` row ever created for it, even after that row is soft-deleted. `quiz.service.ts::createQuiz`'s existing pre-check (`findFirst({ moduleId, isDeleted: false })` → friendly 400) only catches an *active* quiz — a soft-deleted one still occupies the unique slot, so the following `prisma.quiz.create(...)` throws an uncaught `Prisma.PrismaClientKnownRequestError`/`P2002`, which reaches `globalErrorHandler` as a raw, unfriendly 500.

Reproduced live: created a quiz on module `ab298fac-940b-4766-af2f-e27cdd6dadc5` via curl during spec 29 verification, deleted it (soft delete) as part of that same verification's cleanup, then hit this exact crash trying to create a fresh quiz for that module through the real UI.

## Fix

Mirror the pattern already proven in this exact codebase for the identical shape of problem — `VideoNote.service.ts::upsertVideoNote`'s "reactivate the soft-deleted row instead of inserting a new one" logic — rather than trying to route around Prisma's relation-typing requirement.

`quiz.service.ts::createQuiz`:
1. Fetch the module, check ownership — unchanged.
2. Replace the existing `findFirst({moduleId, isDeleted:false})` pre-check with `findUnique({ where: { moduleId } })` (valid without an `isDeleted` filter precisely because `moduleId` really is globally unique across all rows, active or not).
3. If a row comes back and `isDeleted === false` → same friendly 400 as before ("This module already has a quiz !!!").
4. If a row comes back and `isDeleted === true` → **reactivate it**: run the same "delete old questions/options, write new ones" transaction `updateQuiz` already uses, plus flip `isDeleted: false` and set the new `title`/`description` — same row `id`, not a new one (exactly how `VideoNote`'s upsert reuses its row across a delete-then-recreate cycle).
5. If no row at all → today's plain nested `create`, unchanged.

Pull the shared "replace all questions/options in a transaction" logic out of `updateQuiz` into one private helper (`replaceQuizQuestions(tx, quizId, questions)`) so `createQuiz`'s reactivation branch and `updateQuiz` call the same code instead of duplicating the delete-then-recreate transaction body.

No schema/migration change needed — `moduleId`'s `@unique` stays exactly as-is; this is a service-logic fix, not a data-model fix.

## Implementation

1. `quiz.service.ts` — extract `replaceQuizQuestions(tx, quizId, questions)` from `updateQuiz`'s transaction body.
2. `quiz.service.ts::createQuiz` — swap the pre-check to `findUnique({where:{moduleId}})`; branch on `isDeleted` as described; reactivation branch calls `replaceQuizQuestions` inside a `$transaction`, then `quiz.update` for `isDeleted:false`/`title`/`description`, returning the same shape (`include: {questions: {include: {options: true}}}`) the plain-create branch already returns.
3. `yarn build`/`yarn lint` clean.
4. Re-verify live: delete a quiz, recreate one for the same module through the real UI → succeeds (`200`, not `500`); confirm the reactivated row's `id` is unchanged from before the delete (same reuse-proof check spec 28's `VideoNote` verification already established the pattern for); confirm old questions/options from the pre-delete quiz are gone (replaced, not merged) via a follow-up `GET /quiz/manage/:moduleId`.

## Addendum: reactivation also has to clear old `QuizAttempt` rows

Found immediately after re-verifying the crash fix above, via the same Playwright click-through: the reactivated `Quiz` row keeps its **original `id`** (that's the whole point — same slot, same row). But `QuizAttempt.quizId` points at that same id, so a student who attempted the *old* (now-replaced) quiz content still has a `QuizAttempt` row satisfying `@@unique([userId, quizId])` — `getQuizToTake` finds it and permanently shows that student "already attempted" results for the brand-new questions they never actually saw. Worse than the crash: it's silent, not an error, and permanently blocks every student who took the old version from ever taking the new one.

**Fix:** in `createQuiz`'s reactivation branch only, clear old attempts as part of the same transaction — `tx.quizAttempt.deleteMany({ where: { quizId: existingQuiz.id } })`, alongside `replaceQuizQuestions`. This is a deliberately different call than `updateQuiz`'s existing behavior (spec 29's "Known limitation" note): editing a *live* quiz keeps past attempts' `score`/`totalQuestions` intact by design (a smaller, already-accepted trade-off), but delete-then-recreate is a full reset of that module's quiz slot — treating it as a fresh start, attempts included, is the only reading that doesn't leave students permanently locked out.

## Verify-when-done

- [ ] Creating a quiz on a module that has never had one → still works exactly as before (plain create path unaffected).
- [ ] Deleting a quiz then immediately creating a new one for the same module → `200`, not `500`; same row `id` reused.
- [ ] Creating a quiz on a module that already has an **active** quiz → still `400` "This module already has a quiz !!!" (pre-check branch unaffected).
- [ ] The reactivated quiz's questions/options match exactly what was just submitted (old ones fully replaced, none lingering).
- [ ] A student who attempted the *old* (pre-delete) quiz content can take the *reactivated* quiz fresh — no leftover "already attempted" results from the deleted version.
- [ ] `updateQuiz` (editing a still-active quiz, no delete involved) still leaves existing attempts alone — unaffected by this fix.
- [ ] `yarn build`/`yarn lint` clean.
