# Build Plan

Unlike a greenfield project, `lms_server` is already built and live — there is no historical unit-by-unit build sequence to record here.

This file exists so future backend feature work can be planned the same way: when a new feature is scoped, add a numbered spec file here (`01-<feature-name>.md`, `02-<feature-name>.md`, ...) describing its goal, design, and implementation steps, following the same format used in the reference methodology (Goal / Design / Implementation / Dependencies / Verify-when-done). List them below as they're added.

## Units

- [`01-fix-sequential-video-unlock-order.md`](./01-fix-sequential-video-unlock-order.md) — fixes `videoOrder` assignment/unlock-list sorting bugs causing the wrong video to unlock, plus a data backfill for already-corrupted modules.
- [`02-ai-review-summarizer.md`](./02-ai-review-summarizer.md) — scaffolds the new `ai` module and adds `GET /ai/review-summary/:courseId`, an AI-generated pros/cons digest of course reviews with DB-cached results. Not yet implemented.
- [`03-ai-course-advisor.md`](./03-ai-course-advisor.md) — adds `POST /ai/course-advisor`, matching a student's typed learning goal against the published course catalog via the LLM, with a hallucination guard on returned course IDs. Not yet implemented.
- [`04-ai-study-assistant.md`](./04-ai-study-assistant.md) — adds `POST /ai/study-assistant/:courseId`, an enrollment-gated chat endpoint answering syllabus-level questions grounded in the course's real structure and the student's real progress. Not yet implemented.
