# 30. Assignment — Frontend

## Goal

Instructor authoring UI for a module's optional assignment (rich-text instructions, optional due date) plus a grading table, and the student-facing submit experience on the enrolled-course player page, consuming the new `lms_server` `assignment` endpoints (`lms_server/context/specs/31-assignment.md`). Per [`future-update-notes-quiz-assignment-plan.md`](../../../future-update-notes-quiz-assignment-plan.md)'s Feature 3 (as refined in conversation): submission is a plain link/text field (no file upload), editable freely until graded, then locked until the instructor reopens it; grading is a fixed 0–10 score. Pure consumer of the backend spec; has no standalone value until that's implemented. Mirrors the already-shipped Quiz feature's UI patterns throughout (`components/main/(Instructor)/ManageQuiz/`, `QuizPanel.tsx`, `functions/quiz.functions.ts`) rather than introducing new conventions.

## Design

### Student: viewing and submitting the assignment

**Existing state gap in `EnrollCourseDetail.tsx`:** today it already has `activeQuiz: { moduleId, quizId } | null` swapping the main `content` block to `<QuizPanel />`. Add a sibling `activeAssignment: { moduleId: string } | null` state (note: like the shipped `QuizPanel`, which takes only `courseId`/`moduleId` and resolves the rest server-side, `AssignmentPanel` only needs `moduleId` — no need to thread an `assignmentId` through state). When set, `content` renders `<AssignmentPanel courseId={id} moduleId={activeAssignment.moduleId} />` instead of the quiz/video branches; selecting a quiz or a video must clear `activeAssignment` back to `null` (and selecting an assignment must clear `activeQuiz`), so only one of video/quiz/assignment ever occupies the content area at a time. `VideoNotesPanel` stays hidden whenever either `activeQuiz` or `activeAssignment` is set (extend its existing `!activeQuiz` guard to `!activeQuiz && !activeAssignment`).

**Existing type gap in `ModuleShowData.tsx`'s module list:** `EnrolledCourseDetail.type.ts`'s `TModule` currently has `quiz: { id: string } | null`. Add `assignment: { id: string } | null` — matches the new `assignment` field the backend spec adds to `GET /enroll/my-enrolled-course/:courseId`'s `modules` select.

**New accordion row (`ModuleShowData.tsx`):** after a module's video rows and its quiz row (if any), if `module.assignment` is not `null`, render one more `AccordionContent` row — an assignment icon (e.g. `ClipboardList` from `lucide-react`, distinct from the `HelpCircle` quiz icon and the lock/watched/unlocked icons) + "Assignment" label. Its `onClick` calls a new `onSelectAssignment(moduleId: string)` prop (passed up from `EnrollCourseDetail.tsx`, sets `activeAssignment` and clears `activeQuiz`) — same shape as the existing `onSelectQuiz` prop, and `handleGetVideo` must also clear `activeAssignment` alongside its existing `clearActiveQuiz()` call so picking a video always returns to the player.

**New component:** `AssignmentPanel.tsx`, sibling to `QuizPanel.tsx` in `components/main/MyCourses/EnrolledCourseDetail/`. Props: `courseId`, `moduleId`.

- Fetch: `useFetchData([`assignment-take-${courseId}-${moduleId}`], `/assignment/take/${courseId}/${moduleId}`, { enabled: !!courseId && !!moduleId })`.
- Response shape (per the backend spec): `{ assignmentId, title, instructions, dueDate, submission: { content, status, score, feedback, submissionVersion } | null }`.
- Render `instructions` via `dangerouslySetInnerHTML={{ __html: data.instructions }}` — same pattern already used for course descriptions in `CourseDetailPage.tsx` (TipTap-authored HTML rendered as-is; any GitHub/other link the instructor embedded is already a real `<a>`).
- A local `content` textarea state, seeded from `data.submission?.content ?? ""`.
- **Locked state:** when `data.submission?.status === "graded"`, the textarea is `disabled`, no Submit button — instead show the score (`Score: {score} / 10`) and `feedback` if present, plus a note like "This assignment has been graded. Ask your instructor to reopen it if you need to resubmit."
- **Editable state:** otherwise (`submission` is `null` or `status === "submitted"`), textarea is editable, one Submit/Update button (label depends on whether `submission` already exists: "Submit" vs "Update Submission").
- **Auto-linkify on the instructor's grading side, not here** — the student always sees their own plain textarea; the clickable-link rendering (checking if `content` looks like a URL) is an instructor-side grading-table concern, not this panel's.
- **Submit:** new `functions/assignment.functions.ts::submitAssignmentFunction` (top-level `functions/`, spans both this student surface and the instructor grading surface's data shape, matching `quiz.functions.ts`'s precedent of one file per feature) — `toast.loading` → `PUT /assignment/submit/${courseId}/${data.assignmentId}` with `{ content }` via a `usePut`-style mutation (check `hooks/useApi.ts` for the existing PUT wrapper; if none exists, add one following the exact shape of `usePatch`/`usePost` — same `{ url, payload }` mutate signature) → `toast.success`/`toast.error`, same-id toast, **no `navigate()`** (in-place panel, same as `videoNote.functions.ts`/`quiz.functions.ts`'s `submitQuizFunction`). On success, invalidate the `assignment-take-${courseId}-${moduleId}` query key so the panel reflects the new `submissionVersion`.
- A submit attempt against an already-graded assignment (e.g. a stale tab) surfaces the backend's "already been graded" toast and should trigger a refetch so the panel flips to locked state instead of staying stuck on a rejected form.

**New type**, `type/Assignment.type.ts` (in `EnrolledCourseDetail/`, take/submit shapes):
```ts
export type TAssignmentSubmissionTake = {
  content: string;
  status: "submitted" | "graded";
  score: number | null;
  feedback: string | null;
  submissionVersion: number;
};

export type TAssignmentTake = {
  assignmentId: string;
  title: string;
  instructions: string;
  dueDate: string | null;
  submission: TAssignmentSubmissionTake | null;
};
```

### Instructor: authoring the assignment and grading submissions

**New feature folder:** `components/main/(Instructor)/ManageAssignment/` (mirrors `ManageQuiz`'s placement and structure exactly):
- `ManageAssignment.tsx` — top-level page component, no props, reads `moduleId` via `useParams()` (matches the shipped `ManageQuiz.tsx`, not the older draft's "module picker" idea — the module is fixed by the route). `useFetchData([`assignment-manage-${moduleId}`], `/assignment/manage/${moduleId}`)`; `data === null` → render `AssignmentForm` in create mode (empty defaults); `data` present → render `AssignmentForm` pre-filled (edit mode), a "Delete Assignment" button (`DeleteModal` shared component, same pattern as `ManageQuiz.tsx`), and the submissions/grading table below (only fetched once an assignment exists).
- `AssignmentForm.tsx` — `react-hook-form`, fields: `title` (text input), `instructions` (`TextEditorTipTap` from `components/shared/input/ControlledTipTapTextEditor/TextEditorTipTap`, same import used in `AddCourse.tsx`), `dueDate` (optional — plain native `<input type="date">` via `register`, no new date-picker component needed for a single optional field). Submitted as-is (bare `"YYYY-MM-DD"`, no client-side ISO conversion) — the backend's `dueDate` validation (`31-assignment.md`) uses `z.coerce.date()` specifically so this format is accepted directly. Submits via `createAssignmentFunction`/`updateAssignmentFunction`.
- `SubmissionsTable.tsx` — new, no Quiz analog (quizzes are auto-graded; assignments need a manual grading list). Fetches `useFetchData([`assignment-submissions-${assignment.id}`], `/assignment/submissions/${assignment.id}`, { enabled: !!assignment })`. One row per student: name/email, `content` rendered as a clickable `<a href={content} target="_blank">` when it matches a simple URL regex (`/^https?:\/\//`), plain text otherwise (covers both the "click the link" requirement and free-text placeholders like "I will do it later"), a status badge (`submitted` / `graded`), and:
  - If `status === "submitted"`: a "Grade" button opening a small inline form or modal — `score` (number input, 0–10, client-validated to match the backend's Zod bounds) + `feedback` (textarea) + Save, calling `gradeSubmissionFunction`.
  - If `status === "graded"`: shows `score`/`feedback` read-only plus a "Reopen" button calling `reopenSubmissionFunction`.
- `schema/Assignment.schema.ts` — Zod schema mirroring the backend's `createAssignmentSchema`/`updateAssignmentSchema` (title + instructions required), used with `zodResolver` (`AddCourse.tsx`/`QuizForm.tsx` precedent).
- `type/Assignment.type.ts` (this feature's own, authoring-shaped — distinct from the take/submit types above): `TAssignmentManage`, `TAssignmentSubmissionManage` (includes grader fields), form payload types.

**Toast orchestration**, in the shared top-level `functions/assignment.functions.ts` (same file as `submitAssignmentFunction` above, following `quiz.functions.ts`'s precedent of one file spanning the whole feature's mutations): `createAssignmentFunction`, `updateAssignmentFunction`, `deleteAssignmentFunction` — `toast.loading` → mutate → `toast.success` → `router.push("/dashboard/instructor/manage-module")` (navigate back, matching `quiz.functions.ts`'s create/update/delete flows), `toast.error` on failure. `gradeSubmissionFunction`/`reopenSubmissionFunction` — `toast.loading` → mutate → `toast.success`, **no navigate** (stays on the grading table, same in-place spirit as `submitQuizFunction`).

**Entry point:** `components/main/(Instructor)/ManageModule/ManageModule.tsx`'s per-module `TableRowActions` (already has "View Details" / "Update Module" / "Add New Video" / "Manage Quiz" at lines 38–59) gets one more action:
```ts
{
  label: "Manage Assignment",
  icon: ClipboardList, // distinct from HelpCircle (quiz) and the other existing icons
  href: `/dashboard/instructor/manage-assignment/${module.id}`,
  hidden: isPublished, // same restriction already applied to "Update Module" / "Add New Video" / "Manage Quiz"
}
```
**New route:** `app/dashboard/instructor/manage-assignment/[moduleId]/page.tsx` — thin wrapper rendering `<ManageAssignment />` (no props passed, matches the shipped `manage-quiz/[moduleId]/page.tsx` exactly, which also passes nothing and lets the component read `useParams()` itself), with a `metadata` export following the same shape as `manage-quiz/[moduleId]/page.tsx`'s.

## Implementation

1. `EnrolledCourseDetail.type.ts` — add `assignment: { id: string } | null` to `TModule`.
2. `EnrollCourseDetail.tsx` — add `activeAssignment` state; branch `content` to render `AssignmentPanel` when set; extend the `VideoNotesPanel` guard to `!activeQuiz && !activeAssignment`; pass `onSelectAssignment` down to `ModuleShowData`; clear `activeAssignment` wherever `activeQuiz` is currently cleared (video selection, quiz selection) and vice versa.
3. `ModuleShowData.tsx` — render the new "Assignment" accordion row per module (gated on `module.assignment`), wired to `onSelectAssignment`.
4. New `type/Assignment.type.ts` (take/submit shapes, in `EnrolledCourseDetail/`).
5. New `AssignmentPanel.tsx` — locked/editable states per the design above.
6. New `functions/assignment.functions.ts` — `submitAssignmentFunction`, `createAssignmentFunction`, `updateAssignmentFunction`, `deleteAssignmentFunction`, `gradeSubmissionFunction`, `reopenSubmissionFunction`.
7. If `hooks/useApi.ts` has no PUT mutation wrapper yet, add one matching the existing `usePatch`/`usePost` shape (check before assuming — `submitAssignment`'s backend route is a `PUT`).
8. New `components/main/(Instructor)/ManageAssignment/` — `ManageAssignment.tsx`, `AssignmentForm.tsx`, `SubmissionsTable.tsx`, `schema/Assignment.schema.ts`, `type/Assignment.type.ts`.
9. New `app/dashboard/instructor/manage-assignment/[moduleId]/page.tsx`.
10. `ManageModule.tsx` (Instructor) — add the "Manage Assignment" row action.
11. Manual click-through once built (instructor): create an assignment on an unpublished-course module (from "Manage Modules") → title + rich-text instructions with an embedded link saved → reopen "Manage Assignment" for that module → previously entered data pre-fills → edit and save → delete → reopening shows the create-mode empty form again.
12. Manual click-through (student): open an enrolled+paid course with an assignment-bearing module → "Assignment" row visible only on modules that have one, after the quiz row → click it → instructions rendered with the embedded link clickable → submit a GitHub link → reload, reopen → submission persists and is still editable → resubmit with different text → `submissionVersion` visibly changes (if surfaced in UI) or at least the new content persists.
13. Manual click-through (grading loop): instructor opens "Manage Assignment" for that module → submissions table shows the student's submission with the link clickable → grade it (e.g. `7`, feedback "Good start") → student reloads their assignment panel → sees locked state with score/feedback, textarea disabled → instructor clicks "Reopen" → student can edit and resubmit again → instructor re-grades.

## Dependencies

- Requires `lms_server` spec 31 (the `assignment` endpoints) implemented and running — this spec has no independent value without it.
- No new npm packages — `TextEditorTipTap` is already used elsewhere (`AddCourse.tsx`/`UpdateCourse.tsx`), `react-hook-form` is already installed.

## Verify-when-done

- [ ] `tsc --noEmit` / `yarn lint` clean.
- [ ] A module with no assignment shows no "Assignment" row in the student accordion.
- [ ] A module with an assignment shows exactly one "Assignment" row, after its videos and quiz row (if any).
- [ ] Clicking "Assignment" swaps the main content area away from the video player/quiz panel; clicking any video or the quiz row afterward swaps back correctly (all three — video, quiz, assignment — are mutually exclusive in `content`).
- [ ] Instructions render with any embedded link (e.g. a GitHub repo URL) as a real, clickable `<a>`.
- [ ] Student can submit, see it persist on reload, and edit/resubmit multiple times while `status` stays `submitted`.
- [ ] Free-text content (e.g. "I will do it later") is accepted and displayed without the UI treating it as invalid.
- [ ] After the instructor grades a submission, the student's panel shows the score/feedback and the textarea is disabled — submitting again is not possible from the UI (and if attempted via a stale form, the backend's rejection is surfaced as a toast, not a silent failure).
- [ ] Instructor's grading table shows the student's `content` as a clickable link when URL-like, plain text otherwise; grading with a score outside `0–10` is rejected client-side before hitting the network.
- [ ] "Reopen" flips a graded submission back to editable for the student, and the previously shown score/feedback disappears from the student's view until re-graded.
- [ ] Instructor: creating, editing, and deleting an assignment for a module round-trips correctly through `ManageAssignment`; "Manage Assignment" is hidden once the module's course is published, same as "Manage Quiz"/"Update Module"/"Add New Video".
- [ ] A non-owning instructor attempting to reach `manage-assignment/:moduleId` or grade/reopen someone else's submission surfaces the backend's `403` rather than a confusing blank/broken UI.

This is a planning document — no component or type file has been created yet.
