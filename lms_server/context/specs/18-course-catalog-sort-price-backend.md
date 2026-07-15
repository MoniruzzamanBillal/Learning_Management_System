# 18 — Course catalog sort/price backend support (proposal — awaiting review)

> **Status: proposed, not implemented.** This doc was authored as a follow-up from `lms_client/context/specs/08-course-catalog-filters.md`, which added sort/price UI controls to `CoursePage.tsx` on the explicit understanding that backend support is separate work requiring confirmation. Nothing in this file has been built yet — it exists for the user to review before any implementation starts.

## Goal

`GET /course/all-courses` (`course.service.ts::getAllCourses`) needs to accept and act on `sortBy`, `minPrice`, and `maxPrice` query params so the frontend's already-shipped sort `Select` and price-range inputs (`lms_client`'s `CoursePage.tsx` + `PriceFilter.tsx`) actually change the result set instead of being silently ignored.

## Current State

`getAllCourses` today (`lms_server/src/app/modules/course/course.service.ts`):

```ts
const getAllCourses = async (query: Record<string, unknown>) => {
  const { searchTerm, category, limit = 10, page = 1 } = query;
  const params: Record<string, unknown> = {};
  params.published = true;
  if (category) params.category = category;
  if (searchTerm) {
    params.$or = [
      { name: { $regex: new RegExp(searchTerm as string, "i") } },
      { detail: { $regex: new RegExp(searchTerm as string, "i") } },
    ];
  }
  const numaricLimit = Number(limit);
  const numaricPage = Number(page);
  const skip = (numaricPage - 1) * numaricLimit;

  const allCourseData = await courseModel
    .find(params)
    .populate("instructors", " name   ")
    .limit(numaricLimit)
    .skip(skip)
    .select(" -published -createdAt -__v  -description -modules -updatedAt ");

  const result = await Promise.all(
    allCourseData?.map(async (courseData) => {
      const reviewData = await reviewServices.getAverageReviewOfCourse(
        courseData?._id?.toString(),
      );
      return { ...courseData.toObject(), reviewData };
    }),
  );

  const totalCourses = await courseModel.countDocuments({ published: true });
  return { data: result, meta: { totalCourses } };
};
```

- **No `sortBy`, `minPrice`, or `maxPrice` handling at all** — unknown query params are simply ignored (harmless no-op, not an error), which is why the frontend's new controls currently do nothing.
- **No `.sort()` call exists on the query today** — results come back in whatever order MongoDB's `find()` returns them (effectively insertion order).
- `route.ts` (`/all-courses`) has no `validateRequest`/Zod schema on query params — any new param just needs to be destructured and handled in the service, no route-layer change required.

The route is public (`GET /course/all-courses`, no `authCheck`), so this is user-facing, cacheable-by-query-shape data — worth keeping the query cheap.

## Proposed Implementation

### 1. `sortBy` — `createdAt_desc`, `price_asc`, `price_desc` (straightforward)

These three map directly onto real fields on the `Course` document (`createdAt` via `{ timestamps: true }`, `price`). A simple lookup table into `.sort(...)`:

```ts
const sortMap: Record<string, Record<string, 1 | -1>> = {
  createdAt_desc: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
};

let sortStage = sortMap[sortBy as string] ?? { createdAt: -1 };
```

Applied via `.sort(sortStage)` on the existing `courseModel.find(params)` chain. Low risk, small diff.

### 2. `sortBy=rating_desc` — **not a simple `.sort()` addition, needs a bigger restructure**

This is the part worth the user's attention before approving implementation. `averageRating` is **not a field on the `Course` document** — it's computed _after_ the main query, per-course, via a separate aggregate over the `review` collection inside a `Promise.all`:

```ts
const reviewData = await reviewServices.getAverageReviewOfCourse(
  courseData?._id?.toString(),
);
```

...and this happens _after_ `.limit()`/`.skip()` have already run. That means:

- Sorting by `averageRating` today can only ever sort **within the current page** (10 items by default), not the true globally-ranked order — a course with a 5-star average sitting on page 3 would never surface above a 3-star course on page 1.
- Doing this correctly requires restructuring `getAllCourses` to use a Mongo aggregation pipeline (`$lookup` the `review` collection, `$group`/`$avg` to compute `averageRating` per course, `$sort` on that computed field, _then_ `$skip`/`$limit`) instead of `find()` + post-fetch `Promise.all()`. This is a materially different (and better, since it also fixes the current N+1 query pattern) implementation from the other two sort options, and changes the shape of the function meaningfully — flagging so it can be scoped/estimated separately if wanted, e.g. as its own follow-up rather than bundled with the simple `.sort()` cases.
- A cheaper interim option if `rating_desc` is wanted sooner: keep it a UI-only "not yet globally accurate" sort (document the limitation), or drop the option from the frontend `Select` until the aggregation rework lands. Not recommending either unilaterally — flagging for the user's call.

### 3. `minPrice` / `maxPrice` (straightforward)

```ts
if (minPrice || maxPrice) {
  params.price = {};
  if (minPrice)
    (params.price as Record<string, number>).$gte = Number(minPrice);
  if (maxPrice)
    (params.price as Record<string, number>).$lte = Number(maxPrice);
}
```

Added alongside the existing `category`/`searchTerm` conditions in `params`. Low risk, small diff.

## Adjacent pre-existing bugs in the same function (flagging, not fixing — separate decision)

Found while reading `getAllCourses` closely for this proposal; both live in the exact code this work would touch, so worth the user's awareness even though fixing them is out of this proposal's scope unless requested:

1. **`searchTerm` search-by-description is silently broken.** The `$or` clause regex-matches a `detail` field — `{ detail: { $regex: ... } }` — but the schema field is `description`, not `detail` (confirmed in `course.interface.ts`/`course.model.ts`). `detail` doesn't exist anywhere on the document, so that half of the `$or` never matches anything; search only actually works against `name` today.
2. **`meta.totalCourses` is not filtered.** It's always `countDocuments({ published: true })`, regardless of the active `searchTerm`/`category`/(proposed) price filters — so any pagination UI built on `meta.totalCourses` would show an inflated/incorrect total for a filtered view.

## Dependencies

- No new packages — `.sort()` and the `$gte`/`$lte` range query use existing Mongoose/MongoDB query capabilities. The `rating_desc` aggregation path (if approved) also needs no new packages, just a heavier query using Mongoose's existing `.aggregate()`.

## Verify When Done (not started — for when/if this is approved and implemented)

- [x] `createdAt_desc`/`price_asc`/`price_desc` each produce correctly globally-ordered results (not just per-page). Verified against the 4 real published courses (prices 5000/6000/6000/7000): `price_asc`/`price_desc` both correct via `curl`; confirmed sort runs before pagination by paging `price_desc` with `limit=2` — page 1 returned the 2 highest (7000, 6000), page 2 continued correctly with the next 2 (6000, 5000), proving global (not per-page) order. `createdAt_desc` matched actual insertion order (verified against ObjectId creation-time ordering). Also confirmed live in a browser: `/courses` visually reorders correctly for Price: Low to High / High to Low with no console errors.
- [x] `minPrice`/`maxPrice` narrow results correctly at the DB level; combined with `category`/`searchTerm` without conflicts. Verified via `curl`: `minPrice=6000&maxPrice=6000` → exactly the 2 matching courses; `minPrice=7000` → only the 7000 course; `maxPrice=5000` → only the 5000 course; no price params → full unfiltered set (clearing works). `category=App Development&minPrice=5000&maxPrice=7000&sortBy=price_asc` combined correctly (both App Development courses, in range, correctly ordered). Also confirmed live in a browser: setting price range 6000–6000 narrowed the visible grid to exactly the two $6000 cards.
- [x] `rating_desc` approach decided (full aggregation rewrite, per user decision) and implemented via `$lookup`/`$addFields`/`$sort` running *before* `$skip`/`$limit` — same pipeline mechanism proven globally-correct above for `price_desc`'s cross-page test, so the sort-before-pagination fix applies identically to `averageRating`. **Caveat, disclosed honestly:** the live DB currently has 0 courses with any reviews, so there's no differentiated real rating data to visually confirm a multi-value global ranking end-to-end — verified instead that `sortBy=rating_desc` returns 200 (no crash) with all courses correctly missing `reviewData` (confirming the `$cond`/`$$REMOVE` no-reviews-omitted logic works), and that the identical pipeline structure is empirically proven correct for `price_desc`. Recommend a follow-up spot-check once real reviews exist in production.
- [x] `yarn build` and `yarn lint` clean in `lms_server` (lint shows the same 14 pre-existing errors/11 warnings baseline — the two `course.service.ts` entries are pre-existing `any` usages in `addCourse`/`updateCourseData`, untouched by this change, just shifted line numbers).
- [ ] Confirm with the frontend (`lms_client` spec 08) that the two blocked "Verify When Done" checkboxes there can now be ticked for real.
