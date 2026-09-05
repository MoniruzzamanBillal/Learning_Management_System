# 29. Module Quiz — Frontend

## Goal

Instructor authoring UI for a module's optional quiz, and the student-facing take-quiz experience on the enrolled-course player page, consuming the new `lms_server` `quiz` endpoints (`lms_server/context/specs/29-module-quiz.md`). Per [`future-update-notes-quiz-assignment-plan.md`](../../../future-update-notes-quiz-assignment-plan.md)'s Feature 2, **no retakes**: once a student submits, every later visit to that quiz shows the same locked-in results. Pure consumer of the backend spec; has no standalone value until that's implemented.

## Design

### Student: taking the quiz

**Existing state gap in `EnrollCourseDetail.tsx`:** there's currently no notion of "the main content area is showing a quiz instead of a video." Add `const [activeQuiz, setActiveQuiz] = useState<{ moduleId: string; quizId: string } | null>(null)`. When set, the `content` block (today: loading skeleton / placeholder / `MuxPlayer`) is replaced by the new `QuizPanel`, and `VideoNotesPanel` (which needs a video, not a quiz) is hidden. Selecting a video via `ModuleShowData::handleGetVideo` must clear `activeQuiz` back to `null` (so clicking any video always returns to the player) — `setActiveQuiz` is threaded down as a new prop alongside the existing `setVideoDataObj`.

**Existing type gap in `ModuleShowData.tsx`'s module list:** `EnrolledCourseDetail.type.ts`'s `TModule` currently has no way to know a module has a quiz. Add `quiz: { id: string } | null` to `TModule` — matches the new `quiz` field the backend spec adds to `GET /enroll/my-enrolled-course/:courseId`'s `modules` select.

**New accordion row (`ModuleShowData.tsx`):** after a module's video rows, if `module.quiz` is not `null`, render one more `AccordionContent` row — a quiz icon (e.g. `HelpCircle` from `lucide-react`, distinct from the lock/watched/unlocked icons) + "Quiz" label. Its `onClick` calls a new `onSelectQuiz(module.id, module.quiz.id)` prop (passed up from `EnrollCourseDetail.tsx`, sets `activeQuiz`). A module without a quiz shows no such row — nothing to check beyond the existing `module.quiz` truthiness.

**New component:** `QuizPanel.tsx`, sibling to `ModuleShowData.tsx` in `components/main/MyCourses/EnrolledCourseDetail/`. Props: `courseId`, `moduleId`, `quizId`.

- Fetch: `useFetchData([`quiz-take-${courseId}-${moduleId}`], `/quiz/take/${courseId}/${moduleId}`, { enabled: !!courseId && !!moduleId })`.
- The response is one of two shapes (mirrors the backend spec's `getQuizToTake`):
  - **Question mode** (no prior attempt): `{ quizId, title, description, questions: [{ questionId, questionText, options: [{ optionId, optionText, optionOrder }] }] }` — no `isCorrect`/`wasSelected`/`score` anywhere.
  - **Results mode** (already attempted): `{ attemptId, score, totalQuestions, questions: [{ questionId, questionText, options: [{ optionId, optionText, isCorrect, wasSelected }] }] }`.
  - Distinguish by `"attemptId" in data` — presence of `attemptId` means results mode.
- **Question mode UI:** every question + its options rendered together (radio group per question, one pick), a running local `answers: Record<string, string>` (`questionId -> optionId`) state, and a single Submit button at the bottom **disabled until every question has a selection** (`Object.keys(answers).length === questions.length`).
- **Submit:** `functions/quiz.functions.ts::submitQuizFunction` (new, top-level `functions/` — spans both this student surface and, indirectly, the instructor authoring surface's data shape, so it doesn't belong inside one feature's own `functions/` subfolder, matching `video.functions.ts`'s precedent) — `toast.loading` → `POST /quiz/submit/${courseId}/${quizId}` with `{ answers }` via a `usePost` mutation → `toast.success`/`toast.error`, same-id toast, **no `navigate()`** (in-place panel, same as `videoNote.functions.ts`). On success, set a local `submittedResult` state directly from the mutation response (avoids an extra round trip) and also invalidate the `quiz-take-${courseId}-${moduleId}` query key so a later remount reflects the server's now-permanent results-mode response.
- **Results mode UI** (whether reached via the initial GET or right after submitting): render every question's options, each colored **red** when `wasSelected && !isCorrect`, **green** when `isCorrect` — exactly the "my wrong pick in red, the right one in green" behavior from the design doc. Show `score / totalQuestions` at the top. No retake button anywhere — this mode is permanent.
- A submit attempt against an already-answered quiz (e.g. a stale tab) surfaces the backend's `"You have already submitted this quiz !!!"` toast and should trigger a refetch so the panel flips to results mode instead of staying stuck on a rejected form.

**New type**, `type/Quiz.type.ts` (in `EnrolledCourseDetail/`, take-quiz shapes only):
```ts
export type TQuizOptionTake = {
  optionId: string;
  optionText: string;
  optionOrder?: number;
  isCorrect?: boolean;
  wasSelected?: boolean;
};

export type TQuizQuestionTake = {
  questionId: string;
  questionText: string;
  options: TQuizOptionTake[];
};

export type TQuizTakeQuestionMode = {
  quizId: string;
  title: string;
  description?: string | null;
  questions: TQuizQuestionTake[];
};

export type TQuizTakeResultMode = {
  attemptId: string;
  score: number;
  totalQuestions: number;
  questions: TQuizQuestionTake[];
};
```

### Instructor: authoring the quiz

**New feature folder:** `components/main/(Instructor)/ManageQuiz/` (mirrors `ManageModule`'s placement):
- `ManageQuiz.tsx` — top-level page component, takes `moduleId` (from the route). `useFetchData([`quiz-manage-${moduleId}`], `/quiz/manage/${moduleId}`)`; `data === null` → render `QuizForm` in create mode (empty defaults); `data` present → render `QuizForm` pre-filled (edit mode) plus a "Delete Quiz" button (`DeleteModal` shared component, same pattern as other delete flows in this codebase).
- `QuizForm.tsx` — `react-hook-form` with `useFieldArray` for `questions`; each question row is its own `QuizQuestionFields.tsx` subcomponent holding a nested `useFieldArray` (`control`, name `questions.${index}.options`) for that question's options, since `react-hook-form` requires a separate `useFieldArray` call per nesting level. "Add question" / "Add option" / "Remove question" / "Remove option" buttons, a radio/checkbox per option marking it the correct one (enforce exactly-one-correct client-side, mirroring the backend Zod rule). Submits via `createQuizFunction`/`updateQuizFunction`.
- `schema/Quiz.schema.ts` — Zod schema mirroring the backend's `createQuizSchema`/`updateQuizSchema` (title required, 1+ questions, each with 2+ options and exactly one `isCorrect`), used with `zodResolver` the same way other forms in this codebase are (`AddCourse.tsx`/`UpdateModule.tsx` precedent).
- `type/Quiz.type.ts` (this feature's own, authoring-shaped — distinct from the take-quiz types above): `TQuizManage`, `TQuizQuestionManage` (includes `isCorrect`), form payload types.

**Toast orchestration**, in the shared top-level `functions/quiz.functions.ts` (same file as `submitQuizFunction` above — one file for the whole Quiz feature's mutations, following `video.functions.ts`'s precedent of one file spanning a feature that touches multiple component groups): `createQuizFunction`, `updateQuizFunction`, `deleteQuizFunction` — `toast.loading` → mutate → `toast.success` → `router.push("/dashboard/instructor/manage-module")` (navigate back, matching other instructor create/update/delete flows), `toast.error` on failure.

**Entry point:** `components/main/(Instructor)/ManageModule/ManageModule.tsx`'s per-module `TableRowActions` gets one more action, alongside the existing "View Details" / "Update Module" / "Add New Video":
```ts
{
  label: "Manage Quiz",
  icon: HelpCircle, // or similar, distinct from the existing icons used there
  href: `/dashboard/instructor/manage-quiz/${module.id}`,
  hidden: isPublished, // same restriction already applied to "Update Module" / "Add New Video"
}
```
**New route:** `app/dashboard/instructor/manage-quiz/[moduleId]/page.tsx` — thin wrapper rendering `<ManageQuiz moduleId={params.moduleId} />`, per this codebase's `page.tsx`-is-a-thin-wrapper convention.

## Implementation

1. `EnrolledCourseDetail.type.ts` — add `quiz: { id: string } | null` to `TModule`.
2. `EnrollCourseDetail.tsx` — add `activeQuiz` state; branch `content` to render `QuizPanel` when set; hide `VideoNotesPanel` while a quiz is active; pass `setActiveQuiz`/`onSelectQuiz` down to `ModuleShowData`; clear `activeQuiz` inside video selection.
3. `ModuleShowData.tsx` — render the new "Quiz" accordion row per module (gated on `module.quiz`), wired to `onSelectQuiz`.
4. New `type/Quiz.type.ts` (take-quiz shapes, in `EnrolledCourseDetail/`).
5. New `QuizPanel.tsx` — question mode / results mode per the design above.
6. New `functions/quiz.functions.ts` — `submitQuizFunction`, `createQuizFunction`, `updateQuizFunction`, `deleteQuizFunction`.
7. New `components/main/(Instructor)/ManageQuiz/` — `ManageQuiz.tsx`, `QuizForm.tsx`, `QuizQuestionFields.tsx`, `schema/Quiz.schema.ts`, `type/Quiz.type.ts`.
8. New `app/dashboard/instructor/manage-quiz/[moduleId]/page.tsx`.
9. `ManageModule.tsx` (Instructor) — add the "Manage Quiz" row action.
10. Manual click-through once built (instructor): create a quiz on an unpublished-course module (from "Manage Modules") → question(s) with options saved → reopen "Manage Quiz" for that module → previously entered data pre-fills → edit and save → re-fetch confirms the replacement took effect → delete → reopening shows the create-mode empty form again.
11. Manual click-through (student): open an enrolled+paid course with a quizzed module → "Quiz" row visible only on modules that have one → click it → all questions/options shown together, Submit disabled until all answered → submit → red/green results shown inline, matches what was picked vs. correct → reload the page, reopen the same quiz → same results shown immediately, no re-answer form → clicking a video afterward returns to the player as normal.

## Dependencies

- Requires `lms_server` spec 29 (the `quiz` endpoints) implemented and running — this spec has no independent value without it.
- No new npm packages — `useFieldArray` is already part of the installed `react-hook-form`.

## Verify-when-done

- [ ] `tsc --noEmit` / `yarn lint` clean.
- [ ] A module with no quiz shows no "Quiz" row in the student accordion.
- [ ] A module with a quiz shows exactly one "Quiz" row, after its videos.
- [ ] Clicking "Quiz" swaps the main content area away from the video player; clicking any video afterward swaps back.
- [ ] Submit is disabled until every question has a selected option.
- [ ] After submitting, red/green coloring matches the backend's `isCorrect`/`wasSelected` flags exactly.
- [ ] Reloading the page and reopening the same quiz shows the same results immediately — no blank form ever reappears for an already-attempted quiz.
- [ ] Instructor: creating, editing, and deleting a quiz for a module round-trips correctly through `ManageQuiz`; "Manage Quiz" is hidden once the module's course is published, same as the existing "Update Module"/"Add New Video" actions.
- [ ] A non-owning instructor attempting to reach `manage-quiz/:moduleId` for someone else's module surfaces the backend's 403 rather than a confusing blank/broken form (at minimum, a visible error state — full guarded-state UX like spec 27's is a nice-to-have, not required for this pass).

This is a planning document — no component or type file has been created yet.
