# 18 — Update profile page

## Goal

Give logged-in users (admin/instructor/user alike) a way to edit their own profile (name + avatar) from the dashboard. `components/main/Profile/ProfilePage.tsx` already renders an "Edit profile" button linking to `/dashboard/update-profile/[userId]`, but that route doesn't exist — the link 404s today. This spec builds it.

## Current State

- `components/main/Profile/ProfilePage.tsx` reads `GET /user/loggedIn-user` and renders `<Link href={`/dashboard/update-profile/${userData?.data?.id}`}>Edit profile</Link>`. No `app/dashboard/update-profile/` route exists yet.
- The backend endpoint this needs already exists: `PATCH /user/update-user` (`lms_server/src/app/modules/user/user.route.ts`), gated by `authCheck(admin, instructor, user)` — any authenticated role. It expects multipart form data: `upload.single("profileImg")` for the avatar file, plus a `data` field holding JSON, parsed via the same inline `req.body = JSON.parse(req.body?.data)` middleware `course.routes.ts` uses. `userServices.updateUser` always updates `prisma.user.update({ where: { id: req.user.userId } })` — **it ignores any `:userId` route param**, it only ever updates the logged-in user from the JWT. The `id` embedded in the existing "Edit profile" link is therefore not needed to build the request URL — it's only useful client-side (e.g. as a guard, or ignored entirely).
- No Zod validation exists for this endpoint today. `user.validation.ts` only has `createUserValidationSchema`/`createInstructorValidationSchema`, and `user.route.ts` doesn't run `validateRequest` on `/update-user` at all — `req.body` reaches `prisma.user.update` completely unchecked. Since this page will be the first real caller, add a matching schema and wire it in (see Implementation).
- **Don't copy this bug:** `components/main/(Admin)/ManageCourse/UpdateCourse.tsx` — the closest existing analog for "form with optional image upload, prefilled from a GET, submitted as multipart" — calls `useUpdateData`, which issues a `PUT` (`lib/api.ts::apiPut`). But `course.routes.ts` registers `/update-course/:id` as `router.patch(...)` only, so that screen's mutation method doesn't match its own backend route (pre-existing bug, out of scope to fix here — noted only so it isn't replicated). `/user/update-user` is likewise `router.patch(...)`, so the new page must call `usePatch`, not `useUpdateData`.
- A password-change endpoint already exists too (`PATCH /user/change-password`, verifies `oldPassword` via bcrypt) with **zero** frontend consumers anywhere in `lms_client` (confirmed via grep). Left out of this spec on purpose — see Out of Scope.
- `types/user.types.ts`'s `TUser` (`name/email/password/profilePicture/isDeleted/userRole`, no `id`) is a generic shape unrelated to this page. The profile read/write shape that actually matches `GET /user/loggedIn-user` is `TuserProfile` in `components/main/Profile/type/Profile.type.ts` — reuse it, don't reach for `TUser`.

## Approach

Structure the new form after `UpdateCourse.tsx` (react-hook-form + `zodResolver`, `reset()` the form once the GET resolves, image preview/remove via a `useRef` file input, submit as `FormData`, orchestration in a `functions/*.functions.ts` file) since it's the nearest existing pattern for this exact shape of form — but fix the PUT/PATCH mismatch, and keep the field set to only what `/update-user` actually accepts (`name`, `profileImg`). No category/instructor-select equivalent here.

## Implementation

### Backend (`lms_server`)

1. `src/app/modules/user/user.validation.ts` — add:
   ```ts
   const updateUserValidationSchema = z.object({
     name: z.string().min(1, "Name is required"),
   });
   ```
   and export it from `userValidationSchemas`. Only `name` — `profilePicture` never appears in the JSON `data` field, it arrives separately as `req.file`.
2. `src/app/modules/user/user.route.ts` — import `validateRequest` and the new schema; add `validateRequest(userValidationSchemas.updateUserValidationSchema)` into the `/update-user` middleware chain, in the same relative position `course.routes.ts`'s `/update-course/:id` uses it (after the JSON-parse middleware). Don't touch `authCheck`'s role list or the multipart/JSON-parse middleware order otherwise.

### Frontend (`lms_client`)

3. **Route** — `app/dashboard/update-profile/[userId]/page.tsx`, a thin server wrapper rendering `<UpdateProfile />`, matching the `[courseId]`/`[moduleId]` wrapper pattern already used under `app/dashboard/admin/update-course/[courseId]/page.tsx`. The `userId` param doesn't drive any request — don't build URLs from it.
4. **Component** — `components/main/Profile/UpdateProfile.tsx` (`"use client"`):
   - `useFetchData<TuserProfile>(["user-date"], "/user/loggedIn-user")` — reuse the exact query key `ProfilePage.tsx` already uses, so invalidating it on success (next point) refreshes the read page too.
   - `usePatch([["user-date"]])` for the mutation.
   - `useForm({ resolver: zodResolver(updateProfileSchema) })`; in a `useEffect` on the fetched data, `reset({ name: data.name })` and seed an image-preview `useState` from `data.profilePicture`, mirroring `UpdateCourse.tsx`'s `courseData` effect.
   - Fields: name input (`ControlledInput` from `components/shared/input/ControlledInput.tsx`, or the `register`-based `Input` + `Label` pattern `UpdateCourse.tsx` uses — either is an established pattern, prefer `ControlledInput` as the newer shared component) and a file input with preview/remove, copying `UpdateCourse.tsx`'s `changeImagePreviewUrl`/`handleRemoveImage`/`imageInputRef` handling verbatim. Render email as plain read-only text (not a form field) — no backend support for changing it here, and it's the login identifier.
   - Submit handler: build `FormData` with `data: JSON.stringify({ name })` and, only if a new file was picked, `profileImg: file` (must be exactly this field name — `upload.single("profileImg")` on the backend). Call the orchestration function, then `router.push("/dashboard/profile")` (or `router.back()`, matching `UpdateCourse.tsx`'s `handleNavigate`) on success.
5. **Schema** — `components/main/Profile/schema/Profile.schemas.ts`:
   ```ts
   export const updateProfileSchema = z.object({
     name: z.string().min(1, "Name is required"),
     image: imageSchema.optional(),
   });
   ```
   reusing `components/shared/schema/imageSchema.tsx` as-is (it already handles "existing URL string vs newly-picked File").
6. **Orchestration** — this feature has no `functions/` file yet; add `components/main/Profile/functions/profile.functions.ts` with `updateProfileFunction`, following `updateCourseFunction`'s exact shape (`toast.loading` → `mutateAsync({ url: "/user/update-user", payload: formData })` → `toast.success`/`toast.error` → `setTimeout(navigate, 700)`). No id in the URL (point 2 in Current State).
7. **Type** — no new shared type needed; `TuserProfile` already covers the read shape. Derive the form type inline: `type TUpdateProfileForm = z.infer<typeof updateProfileSchema>`, matching `UpdateCourse.tsx`'s `TUpdateCourseType`.

## Out of Scope

- Change-password UI — the backend endpoint (`PATCH /user/change-password`) exists and is unused; a real candidate for its own follow-up spec, not bundled here per `ai-workflow-rules.md`'s "one feature at a time."
- Email editing — no backend support, and changing the login identifier would need its own verification flow if ever built.
- Admin editing another user's profile — `/update-user` only ever updates `req.user.userId`; a different (admin-only) endpoint would be needed for that, not part of this spec.

## Dependencies

None new — `react-hook-form`, `@hookform/resolvers/zod`, `imageSchema`, `usePatch`/`useFetchData` all already exist in the codebase.

## Verify When Done

- [ ] `/dashboard/profile`'s "Edit profile" link resolves (no 404) for all three roles — admin, instructor, and user all share this same route.
- [ ] Name-only update reflects immediately on `/dashboard/profile` after submit (confirms the `["user-date"]` cache invalidation is wired correctly).
- [ ] New avatar upload updates `profilePicture` (Cloudinary round-trip).
- [ ] Submitting with no new image leaves the existing `profilePicture` untouched (backend only overwrites it when `req.file` is present).
- [ ] Empty name is rejected both client-side (Zod) and server-side (bypass the client, e.g. `curl`, to confirm the new `validateRequest` wiring on `/update-user` actually runs).
- [ ] `yarn lint` and `yarn build` clean in both `lms_server` and `lms_client`.
- [ ] `lms_client/context/progress-tracker.md` and `lms_server/context/progress-tracker.md` updated (this spec touches both apps).
