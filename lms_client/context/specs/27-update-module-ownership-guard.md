# 27. Guard `UpdateModule.tsx` for instructors who don't own the module

## Goal

Frontend follow-on to `lms_server/context/specs/27-module-detail-update-authorization-gap.md` — once the backend enforces ownership, `UpdateModule.tsx` (Instructor) should show a clear "you don't have access" state instead of silently rendering a form with a blank, confusing course dropdown when the logged-in instructor doesn't own the module being edited.

## How found

Same investigation as the server spec: user reported the course dropdown not pre-selecting on `/dashboard/instructor/update-module/:moduleId`. Root cause was the logged-in instructor not owning that module — a case the UI currently has no explicit handling for at all, it just renders the normal (visibly broken-looking) form.

## Fix

`components/main/(Instructor)/ManageModule/UpdateModule.tsx` — after `moduleData` loads, compare `moduleData.data.instructorId` against `userInfo?.userId`. When they don't match, render a simple access-denied state (message + a link/button back to "Manage Modules") instead of the form.

```tsx
const isOwner = moduleData?.data?.instructorId === userInfo?.userId;
```

Gate the form render with `moduleDataLoading ? ... : isOwner ? <form>...</form> : <AccessDenied />`. This is purely a UX improvement — the real enforcement is the backend 403 from spec 27 (server); this just avoids showing a confusing dead-end form before that 403 would ever fire (the page never even attempts a submit in that state).

## Verify when done

- [x] Real UI: instructor3 (owner) sees the normal form, pre-selected correctly.
- [x] instructor1 (non-owner) sees the access-denied state instead of a blank form.
- [x] `npx tsc --noEmit` / `yarn lint` clean (2 pre-existing lint errors on untouched lines in this file, unrelated to this change).
