# 25. `/course/all-courses` nests `meta` inside `data` instead of alongside it

## Goal

Fix the public course-catalog endpoint (`GET /course/all-courses`) so its response envelope is flat — `{success, message, data, meta}` — instead of nesting pagination metadata inside `data`.

## How found

User report, reproduced via `curl "http://localhost:5000/api/course/all-courses?sortBy=createdAt_desc"`:

```json
{
  "success": true,
  "message": "Course data retrives successfully !!!",
  "data": {
    "data": [ ... courses ... ],
    "meta": { "totalCourses": 1 }
  }
}
```

Expected shape (matching the standard `{success, message, data, meta?}` envelope every other paginated/list endpoint in the app follows structurally, `meta` just never having been populated before): `data` should be the array directly, with `meta` a sibling key at the top level.

## Root cause

`sendResponse.ts` (`src/app/util/sendResponse.ts`) only ever emits `{success, message, data, token}` — it has no `meta` field in its type or output. `course.service.ts::getAllCourses` is the **only** service function in the whole backend that produces a `{data, meta}`-shaped return value (grep confirms no other `*.service.ts` returns a `meta` key at all — every other list endpoint just returns a bare array). Its controller (`course.controller.ts::getAllCourses`) passes that whole `{data, meta}` object straight through as the single `data:` argument to `sendResponse`:

```ts
const result = await courseServices.getAllCourses(req?.query);
sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "...", data: result });
```

Since `result` is itself `{data: [...], meta: {...}}`, and `sendResponse` wraps whatever it's given under `data`, the final response ends up double-nested. `meta` was never wired into `sendResponse` at all — this was an oversight from when the `rating_desc` sort spec (`18-course-catalog-sort-price-backend.md`) added the `totalCourses` count.

## Fix

1. `sendResponse.ts` — add an optional `meta?: unknown` field to `Tresponse<T>` and pass it through in the `res.json(...)` call (omitted/`undefined` for every other endpoint that doesn't pass one — no change to any other response).
2. `course.controller.ts::getAllCourses` — destructure the service result and pass `data`/`meta` as separate top-level fields:
   ```ts
   const { data, meta } = await courseServices.getAllCourses(req?.query);
   sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "...", data, meta });
   ```
3. `course.service.ts::getAllCourses` needs no change — it already returns `{data, meta}`, which is now consumed correctly instead of being re-wrapped.

### Frontend follow-on (`lms_client`)

The only two consumers of `/course/all-courses` read the old nested shape and need updating to match:

- `components/main/Course/CoursePage.tsx` — `useFetchData<{data: TCourse[]}>` → `useFetchData<TCourse[]>`; `allCourseData?.data?.data` → `allCourseData?.data`.
- `components/main/Home/PopularCourse.tsx` — same change.

Neither currently reads `meta`, so no UI behavior changes — this is purely an envelope-shape correction. `hooks/useApi.ts`'s `TgenericResponse<TData>` gets an optional `meta?: unknown` field added too, so future consumers (e.g. if `/courses` grows real pagination) can type it.

## Verify when done

- [ ] `curl "http://localhost:5000/api/course/all-courses?sortBy=createdAt_desc"` returns `data` as a bare array and a top-level `meta.totalCourses`.
- [ ] Every other existing endpoint's response shape is unchanged (spot-check a couple, e.g. `/course/course-detail/:id`, `/auth/login`) — no stray `"meta": null`.
- [ ] Real UI: `/courses` and the home page's "Popular Courses" section still render course cards correctly.
- [ ] `yarn lint` / `npx tsc --noEmit` clean in both apps on touched files.
