# 03 — AI Course Advisor / Recommender

## Goal

On the `/courses` catalog page, let a visitor type a plain-English learning goal ("I want to learn backend development") and get back 2-3 recommended courses with a one-line reason each, so browsing feels guided instead of just a filterable grid. Depends on the `ai` module scaffolded in `02-ai-review-summarizer.md` — this spec only adds a new endpoint to it.

## Design

Public endpoint, no auth — same visibility tier as the course catalog itself.

**Data:** a lean, capped fetch of published courses — reuse the existing `published: true` filter pattern from `courseServices.getAllCourses` (`lms_server/src/app/modules/course/course.service.ts`), but without pagination since the whole list needs to go into the LLM prompt:

```ts
courseModel
  .find({ published: true })
  .select("_id name description category price")
  .limit(50);
```

(Cap at 50 to keep the prompt small; if the catalog ever exceeds that, this spec's approach would need revisiting — flag it if it comes up, don't pre-solve it now.)

**Hallucination guard (required):** the LLM must only ever recommend a `courseId` that was actually in the list fed to it. Never trust the returned IDs blindly — always cross-check them against the fetched course list server-side before responding, and drop any that don't match.

## Implementation

1. `ai.validation.ts` — add:

   ```ts
   const courseAdvisorSchema = z.object({
     query: z
       .string()
       .min(5, "Tell me a bit more about what you want to learn")
       .max(500),
   });
   ```

2. `ai.interface.ts` — add:

   ```ts
   export type TCourseAdvisorRecommendation = {
     courseId: string;
     reason: string;
     name: string;
     category: string;
     price: number;
   };
   export type TCourseAdvisorResponse = {
     recommendations: TCourseAdvisorRecommendation[];
   };
   ```

3. `ai.service.ts` — `getCourseAdvice(query: string)`:
   - Fetch the published course list (above).
   - If the list is empty, return `{ recommendations: [] }` without calling the LLM.
   - Build messages: a system message instructing the model to act as a course advisor, to choose **only** from the provided `{_id, name, description, category, price}` list, to recommend at most 3, and to respond in JSON as `{ "recommendations": [{ "courseId": "...", "reason": "..." }] }`. User message = the student's `query` + the serialized course list.
   - Call `askOpenRouter(messages, { jsonMode: true })`, `JSON.parse` the result (wrap in try/catch — on parse failure, return `{ recommendations: [] }` rather than throwing, since this is a best-effort feature).
   - Filter the parsed `recommendations` to only those whose `courseId` exists in the fetched course list (the hallucination guard) — drop the rest silently.
   - For each surviving recommendation, merge in the real `name`/`category`/`price` from the fetched list (don't trust the LLM to echo these back correctly) and return.

4. `ai.controller.ts` — `getCourseAdvice`, reads `req.body.query`, calls the service, `sendResponse`.

5. `ai.route.ts` — add:
   ```ts
   router.post(
     "/course-advisor",
     validateRequest(aiValidation.courseAdvisorSchema),
     aiController.getCourseAdvice,
   );
   ```

## Dependencies

- Requires the `ai` module scaffold from `02-ai-review-summarizer.md` to already exist.
- No new packages.

## Verify-when-done

- [ ] `yarn build` / `yarn lint` clean.
- [ ] `POST /api/ai/course-advisor` with a vague/off-topic query still returns a well-formed (possibly empty) `recommendations` array, never a crash.
- [ ] Every `courseId` in the response corresponds to an actual published course — manually try to provoke a hallucinated ID (e.g. ask about a topic with no matching course) and confirm the guard drops anything invalid rather than passing it through.
- [ ] Response `name`/`category`/`price` match the real `Course` document, not whatever the model echoed.
