# 08 — Wire up course catalog sort/price filters

## Goal

`lib/redux/features/filter/filterSlice.ts` (`filteringSlice`) is a mostly-generic boilerplate slice — it carries fields like `newsTags`/`newsCategories`/`eventTags`/`eventCategories` that don't apply to this LMS domain at all (leftover from whatever starter template this was built from, `next_js_boiler`), alongside `sortBy`/`courseCategories`/`level`/`languages` fields that *could* apply to courses but are **never dispatched to or read from anywhere** — `CoursePage.tsx` uses plain local `useState` for search/category instead. This spec wires up the parts of that slice that have real backing data, and explicitly does not force-fit the parts that don't.

## Current State

- `CoursePage.tsx` today: local `searchTerm` (debounced) + local `categoryType` state, passed as query params to `GET /course/all-courses?searchTerm=&category=`. No sort control, no price filter, in the UI at all.
- `course.service.ts::getAllCourses` (backend) currently accepts `searchTerm`, `category`, `limit`, `page` — **no `sortBy` or price-range param support today**.
- **Important schema constraint:** `TCourse`/`course.model.ts` has no `level` or `language` field at all — only `name`, `description`, `price`, `category`, `published`, `courseCover`, `instructors`, `modules`. The filter slice's `level`/`languages` fields have no real data to filter on and are out of scope for this spec (would require a backend schema change first — flag as a future spec if actually wanted, don't fake it client-side).
- `price` **does** exist on `TCourse`, and each course's `reviewData.averageRating` is already returned by `getAllCourses` (via `reviewServices.getAverageReviewOfCourse`) — both are real, usable sort/filter dimensions.

## Design

1. Add sort control (e.g. a `Select` in `CoursePage.tsx`, near the search bar): "Newest", "Price: Low to High", "Price: High to Low", "Top Rated" — mapped to a `sortBy` query param (`createdAt_desc`, `price_asc`, `price_desc`, `rating_desc`).
2. Add a simple price-range filter (min/max number inputs or a preset dropdown — a full slider is over-scoped for the actual UI complexity here) feeding `minPrice`/`maxPrice` query params.
3. **Use plain local `useState` for these, matching how `searchTerm`/`categoryType` already work in `CoursePage.tsx`** — do not force these into the Redux `filterSlice`, since that slice's shape (array-based `sortBy: string[]`, etc.) is designed for a different, more generic filter UI than this page actually needs, and `CoursePage.tsx` doesn't use Redux for filtering today at all. Treat the existing `filterSlice` as unused boilerplate to leave alone, not infrastructure to retrofit.
4. Wire the new params into the existing `useFetchData` call's query string and `queryKey` array (so TanStack Query cache-busts correctly per filter combination), same pattern already used for `searchTerm`/`categoryType`.

## Implementation Notes

- Backend companion work required: `course.service.ts::getAllCourses` needs `sortBy`/`minPrice`/`maxPrice` handling added to its `params`/`.sort(...)` chain — this is backend scope, not covered by this frontend-only spec; confirm the backend change lands together or first.
- No new npm packages — reuse `components/ui/select.tsx` (already used elsewhere, e.g. dashboard forms) for the sort dropdown, and `components/ui/input.tsx` for price min/max.
- Leave `CategoryFilter.tsx` as-is; add the new sort/price controls as siblings in the same filter sidebar area.

## Verify When Done

- [ ] Selecting each sort option actually changes result order, verified against real price/rating values in a test dataset.
- [ ] Price min/max filters correctly narrow results; clearing them returns to the unfiltered set.
- [ ] Combined with existing search + category filters (all four together) without conflicts.
- [ ] `yarn lint` and `yarn build` pass cleanly.
