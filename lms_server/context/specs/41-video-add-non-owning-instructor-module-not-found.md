# 41. Fix: non-owning instructor gets "This module don't exist" when adding a video

## Goal

A course can have multiple instructors (`CourseInstructor` join table — a real, exercised feature used to build an instructor's assigned-courses list). But when an instructor who is assigned to a course, but did **not** personally create a given module, tries to add a video to that module via `/dashboard/instructor/add-video/:moduleId`, they get:

```json
{ "success": false, "message": "This module don't exist !!!" }
```

even though the module and course both genuinely exist and the instructor is legitimately assigned to the course. Fix `addVideo`'s authorization check so any instructor assigned to the course can add videos to its modules.

## Root cause

`lms_server/src/app/modules/VideoModule/video.service.ts::addVideo` (lines ~14-26):

```ts
const addVideo = async (payload: TAddVideoPayload, videoUrl: string) => {
  const { module, instructor } = payload;

  const moduleData = await prisma.module.findFirst({
    where: { id: module, instructorId: instructor, isDeleted: false },
    include: { course: { select: { id: true, published: true } } },
  });

  if (!moduleData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This module don't exist !!!");
  }
  ...
```

The query filters `Module` by **both** `id` and `instructorId: instructor` (the *requesting* instructor's own id, taken from the payload). `Module.instructorId` (`prisma/schema.prisma`) is a single, required FK to whichever instructor created that module — it is not a multi-instructor field. So when instructor B (assigned to the course, but not the module's creator) calls this, the module row exists but fails the `instructorId` equality filter, `moduleData` comes back `null`, and the generic "module doesn't exist" message fires — a misleading error for what's actually an authorization mismatch, not a missing resource.

**This is not an isolated inconsistency in video specifically** — the same single-owner-only pattern (`row.instructorId !== instructorId` → reject) is used consistently across this codebase's content-management authorization:

- `module.service.ts::updateModule` — `if (moduleData.instructorId !== instructorId) throw ... "You are not authorized to update this module !!!"`
- `quiz.service.ts::createQuiz`/`updateQuiz`/`deleteQuiz` — same shape, checking `quiz.instructorId !== instructorId` / `moduleData.instructorId !== instructorId`.
- `assignment.service.ts` (create/update/delete/grade/reopen) — same shape.

Meanwhile, `CourseInstructor` (`courseId`, `userId`, `@@unique([courseId, userId])`) — the actual multi-instructor-per-course join table — is used **only** inside `course.service.ts`, for two things: assigning instructors to a course on create/update, and building an instructor's own "my assigned courses" list (`getInstructorsAssignCourses`). It is never consulted anywhere in Module/Video/Quiz/Assignment authorization.

So there's a real architectural gap between "a course supports multiple instructors" (true, and used for course-level listing) and "content management (modules/videos/quizzes/assignments) is single-creator-owned" (true everywhere else). The reported bug is the video-specific symptom of that gap.

## Design

Replace the single-owner check in `addVideo` with a course-level membership check via `CourseInstructor`, so any instructor assigned to the module's course — not just the module's original creator — can add a video to it:

```ts
const moduleData = await prisma.module.findFirst({
  where: { id: module, isDeleted: false },
  include: { course: { select: { id: true, published: true } } },
});

if (!moduleData) {
  throw new AppError(httpStatus.BAD_REQUEST, "This module don't exist !!!");
}

const isAssignedInstructor = await prisma.courseInstructor.findFirst({
  where: { courseId: moduleData.courseId, userId: instructor },
});

if (!isAssignedInstructor) {
  throw new AppError(
    httpStatus.FORBIDDEN,
    "You are not authorized to add a video to this module !!!",
  );
}
```

This also fixes the misleading error message: a real "module doesn't exist" case (bad/soft-deleted id) still 400s with that message, while a real authorization mismatch now correctly 403s with an "not authorized" message instead of masquerading as a missing resource.

**Scope decision — flagged for review before implementation, not resolved by this spec:** should the same course-level-membership fix be applied to `module.service.ts::updateModule`, and to `quiz.service.ts`/`assignment.service.ts`'s equivalent checks, for consistency? Arguments for yes: the reported symptom is really "multi-instructor courses don't work for content management," and video is likely just the first place a real user hit it — a second instructor trying to edit a module, add a quiz, or grade an assignment on a shared course would hit the identical wall. Arguments for scoping tightly to video only: it's the only symptom actually reported, and widening authorization on Module/Quiz/Assignment is a more consequential change (e.g. any assigned instructor could now delete another instructor's quiz/assignment, not just add content) that deserves its own explicit review rather than being bundled into a video bug fix. **Recommendation: fix `addVideo` (and `updateVideo`/`deleteVideo` if they have the identical check — verify at implementation time, this investigation only confirmed `addVideo`) now, and open a separate follow-up spec for Module/Quiz/Assignment if the team wants the same widening there.**

## Explicitly out of scope (pending the decision above)

- `module.service.ts::updateModule`'s `instructorId !== instructorId` check.
- `quiz.service.ts`/`assignment.service.ts`'s equivalent single-owner checks.
- Any change to `CourseInstructor`'s schema or the course-level instructor-assignment UI/endpoints — those already work correctly.

## Implementation

1. `lms_server/src/app/modules/VideoModule/video.service.ts::addVideo` — replace the combined `id`+`instructorId` module lookup with an `id`-only lookup followed by a separate `CourseInstructor` membership check, per Design above (403 on failure, not 400).
2. Check `updateVideo`/`deleteVideo` in the same file for the identical `instructorId`-scoped module/video lookup pattern; apply the same fix if present.
3. Update `videol.validation.ts`/any related type only if the payload shape changes (it shouldn't — `instructor` is already passed in the payload today, just used differently).
4. `yarn build` / `yarn lint` clean in `lms_server`.

## Verify-when-done

- [ ] Instructor A creates a module and a video in it; Instructor B (assigned to the same course via `CourseInstructor`, not the module creator) can now successfully add a second video to that same module.
- [ ] An instructor **not** assigned to the course at all still correctly gets rejected (403, "not authorized") when attempting to add a video to one of its modules.
- [ ] A request with a genuinely nonexistent/soft-deleted module id still gets the original 400 "This module don't exist !!!" message.
- [ ] `updateVideo`/`deleteVideo` (if patched per step 2) show the same corrected behavior — a non-creator assigned instructor can update/delete; a non-assigned instructor cannot.
- [ ] `yarn build` / `yarn lint` clean.
- [ ] Decision recorded (in this spec or a follow-up) on whether Module/Quiz/Assignment get the same widening.
