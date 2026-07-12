# Unit 04: AI Review Summary (public course detail page)

## Goal

Show a short AI-generated "what students are saying" digest on the public course detail page, above the raw review list, so a visitor gets the gist without reading every comment. Depends on the backend endpoint from `lms_server/context/specs/02-ai-review-summarizer.md` (`GET /api/ai/review-summary/:courseId`).

## Scope

| File | Role |
| --- | --- |
| `components/main/publicPage/courseDetail/CourseDetailPage.tsx` | Existing page component; already fetches `GET /review/course-review/:id` and renders `<CourseDetailTop>`, a description `Wrapper`, and a `reviewContainer` with `<ReviewInput>` + mapped `<UserReviewCard>`. The new summary is a sibling block, placed above the `reviewContainer`. |
| `components/main/publicPage/courseDetail/AiReviewSummary.tsx` (new) | Fetches and renders the summary. |
| `types/ai.types.ts` (new) | `TReviewSummaryResponse` type mirroring the backend `ai.interface.ts` shape. |

## Current State

`CourseDetailPage.tsx` renders reviews as a flat list with no synthesis — a visitor has to read every `UserReviewCard` individually to get a sense of overall sentiment.

## Design

1. `AiReviewSummary.tsx` takes a `courseId: string` prop, calls `useFetchData<TReviewSummaryResponse>([`ai-review-summary-${courseId}`], `/ai/review-summary/${courseId}`, { enabled: !!courseId })` (`hooks/useApi.ts` — the same hook already used throughout this codebase, no new data-fetching pattern).
2. Render states:
   - Loading → a simple skeleton line block (match the visual weight of existing skeletons in this codebase, e.g. `ModuleItemSkeleton.tsx`'s style — a `bg-gray-200 animate-pulse rounded` block).
   - `generated: false` (not enough reviews yet) → render nothing, or a subtle one-line note — don't show an empty/awkward "AI summary" card for a course with too few reviews.
   - `generated: true` → a small card (rounded surface, subtle border/background distinct from `UserReviewCard`, maybe a small sparkle/robot icon from `lucide-react` for a clear "this is AI-generated" signal) showing `summary`, and optionally `averageRating`/`totalReviews` if not already shown elsewhere on the page (check `CourseDetailTop.tsx` first — don't duplicate the rating display if it's already there).
3. Mount `<AiReviewSummary courseId={id} />` in `CourseDetailPage.tsx` immediately above the existing `reviewContainer` div.

## Implementation Notes

- No new dependencies — `useFetchData` + existing Tailwind/shadcn patterns only.
- Add `TReviewSummaryResponse` to `types/ai.types.ts` (new file, following the per-domain type file convention already used, e.g. `course.types.ts`, `video.types.ts`):
  ```ts
  export type TReviewSummaryResponse = {
    summary: string;
    totalReviews: number;
    averageRating: number | null;
    generated: boolean;
  };
  ```
- This is read-only/presentational — no mutation, no `functions/*.functions.ts` orchestration needed (that pattern is for create/update/delete flows with toasts, not a GET-and-render feature).

## Verify When Done

- [ ] On a course with 3+ reviews, the AI summary renders above the review list.
- [ ] On a course with fewer than 3 reviews, no broken/empty summary card is shown.
- [ ] Loading state shows a skeleton, not a layout jump.
- [ ] `yarn lint` and `yarn build` pass cleanly.
