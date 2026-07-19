# 11 — Wire up email notifications (enrollment confirmation, course completion)

## Goal

Actually use the nodemailer setup that already exists but is completely dead code — `src/app/util/sendEmail.ts` is fully configured (reads `config.nodemailer_host`/`nodemailer_sender`/`nodemailer_password`) but `sendEmail(...)` is never called anywhere in the codebase (confirmed via full-repo search). Close that gap for the two most natural transactional-email moments: enrollment confirmation and course completion.

## Current State

- `sendEmail(resetPasswordLink: string, receiverMail: string)` — signature and hardcoded subject (`"Reset your password within 5 mins!"`) suggest it was originally scaffolded for a password-reset flow that was never finished (no forgot-password route exists in `auth.route.ts` today — only `/register`, `/register-instructor`, `/login`, `/update-password` (admin-only)).
- `CourseEnrollment.service.ts::enrollInCourse` creates the enrollment record inside a Mongo transaction but sends no confirmation of any kind.
- Course completion is marked via `PATCH /enroll/complete-my-course/:id` (`CourseEnrollment.controller.ts`) — no email on completion either.

## Implementation

1. Generalize `sendEmail.ts`'s signature to accept a subject + HTML body instead of a hardcoded reset-password subject: `sendEmail({ to, subject, html }: { to: string; subject: string; html: string })`. Keep the existing `nodemailer.createTransport` config as-is.
2. Add `src/app/util/emailTemplates.ts` (or inline template strings where called) for two templates: enrollment confirmation (course name, link to `/my-courses/:id`) and completion congratulations (course name, mention certificate availability).
3. Call `sendEmail(...)` from `CourseEnrollment.service.ts::enrollInCourse`, after the transaction commits successfully, using `userData.email` and `courseData.name`. Wrap in try/catch so an email delivery failure never fails the enrollment itself (log via the logger from `09-observability-logging-and-error-tracking.md` if that spec has landed, otherwise `console.error`, and continue — email is best-effort, not transactional with the enrollment).
4. Call `sendEmail(...)` similarly from the course-completion path (`CourseEnrollment.service.ts`, wherever `completed: true` gets set) — same best-effort try/catch pattern.
5. Do not build the forgot-password flow in this spec — `sendEmail`'s original naming suggests that was the intent, but wiring up a full password-reset flow (token generation, expiry, reset endpoint) is materially larger scope than "send two transactional emails" and deserves its own spec if wanted later.

## Dependencies

- No new packages — `nodemailer` is already installed and configured.

## Verify When Done

- [ ] `yarn build` and `yarn lint` clean.
- [ ] Enroll a real test account in a real (or test) course, confirm an email arrives at the configured test inbox with correct course name/link.
- [ ] Mark a course complete, confirm the completion email arrives.
- [ ] Temporarily break the SMTP config (wrong password) and confirm enrollment/completion still succeed (the email failure doesn't roll back or error the main operation) — check the log output shows the failure.
