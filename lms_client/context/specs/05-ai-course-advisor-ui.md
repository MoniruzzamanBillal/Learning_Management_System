# Unit 05: AI Course Advisor (catalog page)

## Goal

On the `/courses` catalog page, let a visitor type a plain-English learning goal and get back a short list of recommended courses with a reason each, so browsing feels guided instead of purely filter-driven. Depends on the backend endpoint from `lms_server/context/specs/03-ai-course-advisor.md` (`POST /api/ai/course-advisor`).

## Scope

| File | Role |
| --- | --- |
| `components/main/publicPage/course/CoursePage.tsx` | Existing page component; fetches `/course/all-courses`, renders a search bar + `CategoryFilter` + a grid of `CourseCard`. The new advisor box is a new block above the grid (below or beside the existing search bar). |
| `components/main/publicPage/course/AiCourseAdvisor.tsx` (new) | The input box + recommendation results. |
| `types/ai.types.ts` | Add `TCourseAdvisorResponse`/`TCourseAdvisorRecommendation` (same file started in `04-ai-review-summary-ui.md`). |

## Current State

`CoursePage.tsx` only supports keyword search + category filtering — there's no way to describe an actual goal and get matched courses.

## Design

1. `AiCourseAdvisor.tsx`: a text input (or textarea) + submit button ("Ask AI" / similar), using `usePost()` (`hooks/useApi.ts`) to call `POST /ai/course-advisor` with `{ query: <input value> }` on submit.
2. States:
   - Idle — just the input + button, maybe a placeholder like "e.g. I want to learn backend development".
   - Pending — disable the button, show a small loading indicator (matches other mutation-pending patterns in the codebase, e.g. `EnrollCourseDetail.tsx`'s `isPending ? "Marking as complete..." : ...` button-text-swap style).
   - Success with `recommendations.length > 0` — render each as a compact card (name, category badge, price, the AI's one-line `reason`), each linking to `/courses/${courseId}` (the course detail page route — confirm exact route pattern matches `app/(main)/courses/[id]/page.tsx`).
   - Success with `recommendations.length === 0` — a friendly "couldn't find a close match, try rephrasing" message, not a broken empty state.
   - Error — a simple inline error message (this endpoint has no side effects to roll back, so no toast/navigate orchestration needed — a plain `usePost` mutation with local error state is enough, unlike the `functions/*.functions.ts` toast-then-navigate pattern used for create/update/delete flows).
3. Mount `<AiCourseAdvisor />` in `CoursePage.tsx` above the course grid.

## Implementation Notes

- Reuse `CourseCard.tsx`'s visual language for the recommendation cards where reasonable (category badge styling, rounded surface) so it doesn't look like a bolted-on widget, but it doesn't need to be the exact same component (recommendations show a `reason` string `CourseCard` has no slot for).
- Add to `types/ai.types.ts`:
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
- No debounce/auto-submit needed — this is an explicit submit-on-click action, not live search.

## Verify When Done

- [ ] Submitting a clear goal (e.g. "I want to learn backend development") returns and renders relevant course cards linking to the right course detail pages.
- [ ] Submitting a very short/off-topic query doesn't crash the UI — shows the "no close match" state gracefully.
- [ ] Pending state disables the submit button and gives visible feedback (no double-submit).
- [ ] `npm run lint` and `npm run build` pass cleanly.
