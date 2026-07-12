# 02 — AI Review Summarizer

## Goal

On a course's public detail page, show a short AI-generated "what students are saying" digest (pros/cons style) above the raw review list, so a prospective buyer gets the gist without reading every comment. This is the first AI feature and also stands up the shared `ai` module that `03-ai-course-advisor.md` and `04-ai-study-assistant.md` build on.

## Design

**New module:** `lms_server/src/app/modules/ai/`, following the same file split as every other module (`context/architecture.md`):

- `ai.route.ts`, `ai.controller.ts`, `ai.service.ts`, `ai.validation.ts`, `ai.interface.ts`.
- Registered in `src/app/router/index.ts`'s `routeArray`: `{ path: "/ai", route: aiRouter }`.
- No `ai.model.ts` — this feature is stateless per-request except for the caching fields added directly to `Course` (below).

**Reused, not duplicated:**

- `reviewServices.getCourseReview(courseId)` and `reviewServices.getAverageReviewOfCourse(courseId)` (`lms_server/src/app/modules/review/review.service.ts`) — both already exist and already return exactly what's needed (comments + rating, and `{ averageRating, totalReviews }`).
- `askOpenRouter` (`lms_server/src/app/util/openRouterClient.ts`) — the only LLM call in this spec.

**Caching (required — free OpenRouter models are rate-limited, and reviews change rarely):**
Add two optional fields to `Course`:

```ts
// course.interface.ts
aiReviewSummary?: string;
aiReviewSummaryReviewCount?: number;
```

```ts
// course.model.ts
aiReviewSummary: { type: String },
aiReviewSummaryReviewCount: { type: Number },
```

These are additive/optional — no migration needed, existing documents just have them as `undefined` until first generated.

**Not-enough-data fallback:** if `totalReviews < 3`, skip the LLM entirely and return a fixed message (e.g. `"Not enough reviews yet to summarize."`) — don't burn a free-tier call on a near-empty review list.

## Implementation

1. `ai.interface.ts`:

   ```ts
   export type TReviewSummaryResponse = {
     summary: string;
     totalReviews: number;
     averageRating: number | null;
     generated: boolean; // false when the "not enough reviews" fallback was used
   };
   ```

2. `ai.service.ts` — `getReviewSummary(courseId: string)`:
   - Fetch `reviewServices.getAverageReviewOfCourse(courseId)` → `{ averageRating, totalReviews }` (may be `undefined` if zero reviews — handle that).
   - If `!totalReviews || totalReviews < 3` → return the fallback response, `generated: false`. Do not touch the cache fields.
   - Else fetch `courseModel.findById(courseId).select("aiReviewSummary aiReviewSummaryReviewCount")`.
     - If `course.aiReviewSummaryReviewCount === totalReviews` → return the cached `aiReviewSummary`, `generated: true` (cache hit, no LLM call).
     - Else (no cache, or stale because review count changed): fetch `reviewServices.getCourseReview(courseId)` for the comments, build a prompt (system message instructing a concise pros/cons summary in 2-4 sentences, user message = the concatenated comments+ratings), call `askOpenRouter(messages)`, then `courseModel.findByIdAndUpdate(courseId, { aiReviewSummary: text, aiReviewSummaryReviewCount: totalReviews })` and return the fresh summary.

3. `ai.controller.ts` — `getReviewSummary`, thin `catchAsync` + `sendResponse`, matching `reviewController.getCourseReview`'s exact style.

4. `ai.route.ts`:

   ```ts
   router.get("/review-summary/:courseId", aiController.getReviewSummary);
   ```

   No auth — matches the existing public `GET /review/course-review/:courseId` and `GET /review/average-course-review/:courseId`.

5. `ai.validation.ts` — not needed for this endpoint (no body, `:courseId` is a route param); create the file with an empty/placeholder export only if `03`/`04` need it sooner, otherwise add it when the course-advisor spec needs a body schema.

## Dependencies

- No new packages (the `openai` package + `openRouterClient.ts` already exist).
- Depends on nothing from `03`/`04` — this is the first spec to implement and creates the shared module shape they'll extend.

## Verify-when-done

- [x] `yarn build` / `yarn lint` clean.
- [ ] `GET /api/ai/review-summary/:courseId` for a course with 0-2 reviews returns the fallback message and does **not** write to `Course.aiReviewSummary`.
- [ ] Same call for a course with 3+ reviews generates a summary, and `Course.aiReviewSummaryReviewCount` is updated to match the live count.
- [ ] Calling it again immediately (same review count) returns the cached summary with no new LLM call (verify via a temporary log or by checking `aiReviewSummaryReviewCount` doesn't change).
- [ ] Adding a new review then calling again triggers regeneration (count mismatch detected).

**Implementation complete** — remaining unchecked items require manual verification against a real `courseId` in the live database; not run automatically since `DATABASE_URL` points at production. See `progress-tracker.md`'s "Recent Activity" for details.
