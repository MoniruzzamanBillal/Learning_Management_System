# 19 — Backend error messages swallowed by dead `error?.response?.data?.message` reads

## Goal

Every `*.functions.ts` mutation error handler that reads `error?.response?.data?.message` to build its error toast should instead surface the real backend message, instead of always falling back to its generic `"Something went wrong while …"` string.

## How this was found

Found while seeding course data through the real Admin UI (`context/specs/21-course-seed-data-import.md`, in `lms_server`). After fixing `lms_server`'s `createInstructor`/`createUserIntoDB` to return a friendly `400 "A user with this email already exists !!!"` on a duplicate email (`lms_server/context/specs/20-friendly-duplicate-email-error.md`), re-submitting "Add Instructor" for an already-registered email still only showed the generic toast `"Something went wrong while registering an instructor !!"` — the specific backend message never reached the UI.

## Current State

`lib/axiosInstance.ts`'s response interceptor does **not** reject with the original Axios error. On any non-2xx response it builds a flat object and rejects with that instead:

```ts
const errorObj = {
  statusCode: error?.response?.data?.statusCode || 500,
  message: error?.response?.data?.message || "Something went wrong",
  errorMessages: error?.response?.data?.message,
  errors: error?.response?.data?.errors,
};
return Promise.reject(errorObj);
```

So every caller downstream receives `errorObj` (shape `{statusCode, message, errorMessages, errors}`), which has **no `.response` property at all**. `errorObj.message` already holds the real backend message (or the interceptor's own `"Something went wrong"` fallback).

But 6 files / 12 call sites still read the pre-interceptor Axios shape, `error?.response?.data?.message`, which is always `undefined` on the object they actually receive — so every one of these always falls through to its own local fallback string, silently discarding whatever specific message the backend sent:

- `components/main/(Admin)/ManageCourse/functions/course.functions.ts` — add/update/publish course (3 sites)
- `components/main/(Instructor)/ManageModule/functions/module.function.ts` — add/update module (2 sites)
- `functions/video.functions.ts` — add/update/delete video (3 sites)
- `components/main/(Admin)/ManageInstructor/functions/auth.functions.ts` — register instructor (1 site)
- `components/main/Profile/functions/profile.functions.ts` — profile update (1 site, needs read to confirm exact line)

Reproduced live: submitting "Add Instructor" for a duplicate email shows the generic toast, never the backend's `"A user with this email already exists !!!"`.

This is distinct from `lib/auth.service.ts`/`lib/auth.ts` (the legacy pre-`useApi` service objects, out of scope here — not part of the `usePost`/`*.functions.ts` pattern this bug lives in) and from `hooks/useApi.ts`, which only has this pattern in a commented-out `console.log`/toast (dead code, not executing).

## Proposed Implementation

Root cause is centralized in the interceptor, but changing the interceptor's rejected shape is riskier (touches every consumer, including the 401/403 branches that already run on the *original* Axios error before the transform). The minimal, surgical fix is at each of the 12 call sites: read the field that's actually present on what they receive.

```diff
- const errorMessage = error?.response?.data?.message || "Something went wrong while adding video !!!";
+ const errorMessage = error?.message || "Something went wrong while adding video !!!";
```

Same one-line change (`error?.response?.data?.message` → `error?.message`) in all 12 spots across the 5 files above. No change to the local fallback strings — they stay as a safety net for the case where the interceptor itself had nothing to report.

## Dependencies

None — `errorObj.message` already exists on every rejected mutation error; this only changes which field callers read.

## Verify When Done

- [x] All 12 call sites across the 5 files updated (`error?.response?.data?.message` → `error?.message`); confirmed via repo-wide grep that no live call site still reads the dead field (only the interceptor itself in `lib/axiosInstance.ts`, which correctly reads the real Axios error, and a commented-out dead line in `hooks/useApi.ts` remain).
- [x] `POST /auth/register-instructor` with a duplicate email now shows the real backend toast (`"A user with this email already exists !!!"`) — confirmed live via the seed-data admin UI run (re-adding `instructor1@gmail.com`).
- [x] Happy-path add/update/delete/publish flows unaffected — only the `catch` branch's message source changed, `try` branches untouched.
- [x] `yarn lint` in `lms_client` shows no new errors/warnings in any of the 5 touched files (pre-existing unrelated warning in `video.functions.ts` for an unused `handleToastResponse` import, present before this change).
