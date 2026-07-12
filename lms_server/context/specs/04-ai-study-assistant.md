# 04 — In-Course AI Study Assistant

## Goal

A chat endpoint scoped to one enrolled course, so a paying student can ask syllabus-level questions — "what's covered in module 3?", "how much do I have left?", "what should I watch next?" — grounded in that course's real structure and their own real progress. Depends on the `ai` module scaffolded in `02-ai-review-summarizer.md`.

**Explicit non-goal:** it cannot answer questions about what a video actually _says_ — there's no transcript/caption text stored anywhere in the data model (`Video` only has `title`, `videoUrl`, `videoOrder`). The system prompt must tell the model to say so honestly if asked, rather than making something up.

## Design

**Access control:** this is enrolled-course content, so it's gated exactly like the other enrolled-course routes — `authCheck(UserRole.user)` + `ValidateCourseAccess` (`lms_server/src/app/middleware/ValidateCourseAccess.ts`), the same pair already used on `GET /enroll/my-enrolled-course-modules/:courseId` (`CourseEnrollment.routes.ts`). `ValidateCourseAccess` reads `req.params.courseId` and `req.user.userId`, so the route must be `POST /ai/study-assistant/:courseId`.

**Stateless chat:** no new Mongoose model for conversation history. The client holds the running conversation and resends the full history each turn, using the `TChatMessage[]` shape already exported from `openRouterClient.ts` (`{ role: "system" | "user" | "assistant", content: string }`) — this is the same pattern any OpenAI-style chat client uses, so the frontend doesn't need anything new either.

**Context to ground the assistant (built server-side every request, not client-supplied):**

- Course `name` + `description` (`courseModel.findById(courseId)`).
- Ordered module → video titles for the course. Reuse the populate pattern already used in `CourseEnrollment.service.ts` (`moduleModel.find({ course: courseId, isDeleted: false }).populate({ path: "videos", model: "Video", select: "_id title videoOrder" })`), sorting each module's videos by `videoOrder`.
- This user's progress: `courseEnrollmentService.courseProgressPercentage(courseId, userId)` (already exported from `CourseEnrollment.service.ts`) for the overall %, plus a per-video watched/unlocked/locked breakdown via `videoProgressModel.find({ course: courseId, user: userId }).populate("video", "_id title videoOrder").select("videoStatus")`.

## Implementation

1. `ai.validation.ts` — add:

   ```ts
   const chatMessageSchema = z.object({
     role: z.enum(["user", "assistant"]), // client never sends "system"
     content: z.string().min(1).max(2000),
   });
   const studyAssistantSchema = z.object({
     messages: z.array(chatMessageSchema).min(1).max(20),
   });
   ```

   (Cap of 20 messages / 2000 chars each is a basic abuse guard against runaway prompt size on a free-tier model — not a full rate limiter, just a sanity bound.)

2. `ai.interface.ts` — add:

   ```ts
   export type TStudyAssistantRequest = {
     messages: TChatMessage[]; // imported from openRouterClient.ts
   };
   export type TStudyAssistantResponse = {
     reply: string;
   };
   ```

3. `ai.service.ts` — `getStudyAssistantReply(courseId: string, userId: string, messages: TChatMessage[])`:
   - Fetch course, modules+videos, progress % and per-video status as described above (throw `AppError(BAD_REQUEST, ...)` if the course doesn't exist — mirrors every other service's existing-check pattern, e.g. `videoServices.getSingleVideo`).
   - Build a system message serializing: course name/description, an ordered `module title → [video titles]` outline, overall progress %, and which specific videos are watched vs. locked/unlocked — plus an explicit instruction that it has no access to video content/transcripts and must say so if asked about what's actually said in a video.
   - Prepend that system message to the client's `messages` array and call `askOpenRouter([systemMessage, ...messages])`.
   - Return `{ reply: <content> }`.

4. `ai.controller.ts` — `getStudyAssistantReply`, reads `req.params.courseId`, `req.user.userId` (set by `authCheck`), `req.body.messages`.

5. `ai.route.ts` — add:
   ```ts
   router.post(
     "/study-assistant/:courseId",
     authCheck(UserRole.user),
     ValidateCourseAccess,
     validateRequest(aiValidation.studyAssistantSchema),
     aiController.getStudyAssistantReply,
   );
   ```
   (Validate-then-access-check ordering should match how `CourseEnrollment.routes.ts` orders its own `authCheck`/`ValidateCourseAccess`/controller chain — `authCheck` before `ValidateCourseAccess` since the latter needs `req.user`.)

## Dependencies

- Requires the `ai` module scaffold from `02-ai-review-summarizer.md`.
- Reuses `courseEnrollmentService.courseProgressPercentage` — if that function's signature or export name ever changes, this spec's service code needs updating too.
- No new packages.

## Verify-when-done

- [ ] `yarn build` / `yarn lint` clean.
- [ ] A logged-in user who is **not** enrolled/paid for the course gets `403` (same as existing `ValidateCourseAccess`-gated routes).
- [ ] An enrolled student asking "what's in module 2?" gets an answer matching that module's actual video titles.
- [ ] An enrolled student asking "what have I completed?" gets an answer consistent with their real `VideoProgress` state.
- [ ] Asking "what does the video say about X" gets an honest "I don't have access to video content" style answer, not a fabricated one.
- [ ] `messages` array over 20 items or an oversized `content` string is rejected by validation before it reaches the LLM call.
