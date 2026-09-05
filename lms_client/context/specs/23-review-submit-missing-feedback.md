# 23. Review submission gives no user feedback

## Goal

Fix `CourseDetailPage.tsx::handleAddReview` so submitting a course review gives the same toast-then-update feedback every other create/update flow in this app already has (per `code-standards.md`'s toast-then-navigate convention).

## How found

While testing the full purchase → watch → certificate → review flow as a real user, submitting a review via the UI worked (the review appeared in the list, `Review` row created correctly in the DB with the right rating/comment), but the button showed no success confirmation at all — no toast, nothing. The only user-visible feedback path was a `console.log(result)`, and the client-side validation checks (`toast.error("Give a meaningfull review")` / `toast.error("Give a star")`) were the only toasts wired up. On a slow connection or if the request ever fails, the user would have zero signal either way.

## Root cause

`handleAddReview` awaits `giveReview(...)` and then just does `console.log(result)` — the success-toast branch is commented out:

```ts
const result = await giveReview({ url: `/review/give-review`, payload });
console.log(result);

// if (result?.data?.success) {
//   reviewDataRefetch();
//   eligibilityRefetch();
// }
```

(The review list and eligibility flag *do* still refresh correctly without those explicit refetches — `usePost`'s `invalidateQueriesKeys` already covers `course-review-${id}` and `review-eligibility-${id}` — so that commented-out block was already redundant, not a missing fix.) There's also no `try/catch`, so a failed submission (e.g. re-submitting after already reviewing) fails silently with no `toast.error`.

## Fix

`components/main/CourseDetail/CourseDetailPage.tsx`, `handleAddReview`:

```ts
try {
  const result = await giveReview({ url: `/review/give-review`, payload });
  if (result?.success) {
    toast.success(result?.message ?? "Review submitted successfully!");
    setReview(null);
    setRating(0);
  }
} catch (error: any) {
  toast.error(error?.message ?? "Failed to submit review");
}
```

Drop the two `console.log`s and the dead commented-out refetch block.

## Verify when done

- [ ] Real UI: submitting a review shows a success toast and the form resets.
- [ ] Re-submitting a review for an already-reviewed course (form shouldn't even be visible, but exercised via direct API) surfaces a `toast.error`, not silence.
- [ ] `yarn lint` clean on the touched file.
