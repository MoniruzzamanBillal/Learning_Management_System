# Build Plan

Unlike a greenfield project, `lms_client` is already built and live — there is no historical unit-by-unit build sequence to record here.

This file exists so future frontend feature work can be planned the same way: when a new feature is scoped, add a numbered spec file here (`01-<feature-name>.md`, `02-<feature-name>.md`, ...) describing its goal, design, and implementation steps, following the same format used in the reference methodology (Goal / Design / Implementation / Dependencies / Verify-when-done). List them below as they're added.

## Units

1. **[01: My Courses — List Page Redesign](./01-my-courses-list-redesign.md)** — visual redesign of `/my-courses` to match the `/courses` catalog's card/grid style. Not yet implemented.
2. **[02: My Course Detail / Player Page Redesign](./02-my-course-detail-redesign.md)** — visual redesign of `/my-courses/[id]` (header, visible progress, card surfaces, consistent module-list styling). Not yet implemented.
3. **[03: Certificate PDF Design](./03-certificate-pdf-design.md)** — replace the broken-image, plain-text certificate PDF with a fully code-drawn, branded certificate. Not yet implemented.
4. **[04: AI Review Summary UI](./04-ai-review-summary-ui.md)** — renders the backend's AI review digest on the public course detail page. Depends on `lms_server` spec `02-ai-review-summarizer.md`. Not yet implemented.
5. **[05: AI Course Advisor UI](./05-ai-course-advisor-ui.md)** — "tell me what you want to learn" box on the course catalog page. Depends on `lms_server` spec `03-ai-course-advisor.md`. Not yet implemented.
6. **[06: AI Study Assistant UI](./06-ai-study-assistant-ui.md)** — floating chat widget on the enrolled-course video page. Depends on `lms_server` spec `04-ai-study-assistant.md`. Not yet implemented.
