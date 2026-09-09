# 39. Fix: course creation crashes on trailing/leading whitespace in name ("public_id must not end with a whitespace")

## Goal

`POST /api/course/add-course` fails with a Cloudinary error when the submitted course `name` has trailing (or leading) whitespace, e.g. `"test "`:

```json
{
  "success": false,
  "message": "public_id must not end with a whitespace.",
  "errorSources": [{ "path": "", "message": "" }]
}
```

Fix this so a course can be created regardless of incidental whitespace in its name, and close a related data-integrity gap the same root cause creates.

## Root cause

Two independent gaps, both upstream of the crash's proximate cause.

**Gap A — `SendImageCloudinary.ts` does no sanitization; the crash is currently avoided by 5 duplicated ad hoc call-site patches, not fixed at the source.**

`lms_server/src/app/util/SendImageCloudinary.ts` (lines 13-24):

```ts
export const SendImageCloudinary = async (path: string, name: string) => {
  const uploadResult = await cloudinary.uploader
    .upload(path, {
      public_id: name,
    })
    .catch((error) => {
      console.log(error);
    });

  return uploadResult;
};
```

`name` is passed straight through as Cloudinary's `public_id` with zero trimming/sanitization. Cloudinary rejects any `public_id` with leading/trailing whitespace, which is where the reported error string comes from.

The crash doesn't happen on *every* call today only because every current call site independently trims a local copy of `name` before calling this function — the exact same snippet, copy-pasted 5 times:

| Call site | File:line |
|---|---|
| `addCourse` | `course.service.ts:29` (local `.trim()`) → passed to `SendImageCloudinary` at line 32 |
| `updateCourseData` | `course.service.ts:424` (local `.trim()`) → passed at line 427 |
| `createUserIntoDB` | `auth.service.ts:15` (local `.trim()`) → passed at line 18 |
| `createInstructor` | `auth.service.ts:59` (local `.trim()`) → passed at line 62 |
| `updateUser` | `user.service.ts:110` (local `.trim()`) → passed at line 113 |

So how does the crash still happen for course creation specifically? Because the trim at `course.service.ts:29` only produces a local variable used for the Cloudinary call — it does not mutate `payload.name`. Re-reading `addCourse` more carefully: the local trimmed `name` **is** what's passed to `SendImageCloudinary` (line 32), so in principle this specific path should already be crash-proof for cover-image uploads today. The reported crash from the live payload (`"name":"test "`) indicates either (a) this code hasn't been deployed to `lms-server-topaz.vercel.app` yet in its current form, or (b) some other whitespace character/edge case (e.g. a name that is whitespace-only after some other transformation, or a Cloudinary-invalid character introduced by the rich-text/description field being confused with name in some edge path) is slipping through. Either way, the underlying design flaw — sanitization living at the call site instead of inside `SendImageCloudinary` — is real and is what should be fixed, since it's a fragile pattern: any new caller that forgets the copy-pasted trim reintroduces this exact crash. **This spec should re-verify against the currently deployed `lms-server-topaz.vercel.app` build before assuming the fix is a pure regression-proofing exercise** — reproduce with the literal reported payload against production first.

**Gap B — the untrimmed name is still what gets persisted to Postgres, silently defeating the unique-name constraint.**

Even where the local `.trim()` prevents the Cloudinary crash, the DB write uses the **original, untrimmed** `payload.name`:

`course.service.ts` (`addCourse`, ~line 61):
```ts
const result = await prisma.course.create({
  data: {
    name: payload.name,   // untrimmed — "test " persisted, not "test"
    ...
```

`updateCourseData` has the identical pattern. Since `Course.name` has a `@unique` constraint (`prisma/schema.prisma`), Postgres treats `"test"` and `"test "` as distinct values — a course named `"test "` can coexist with one named `"test"`, silently bypassing the intended duplicate-name guard. This is a real, separate bug from the crash, caused by the same missing normalization.

**Validation layer has no trim either.** `lms_server/src/app/modules/course/course.validation.ts`'s `crateCourseValidationSchema`/`updateCourseValidationSchema` validate `name` with `z.string().min(1, ...)` only — no `.trim()`/`.transform()`. A whitespace-padded (or even whitespace-only single-character) name passes validation untouched. This is the correct layer to fix Gap B, since `validateRequest` runs before the service ever sees `payload.name`, so normalizing here fixes the Cloudinary call *and* the DB write in one place, for every future caller of these schemas.

**Frontend has the same gap but is not the fix location.** `lms_client/components/main/(Admin)/ManageCourse/schema/Course.schemas.ts`'s `addCourseValidationSchema.name` also has no `.trim()`/`.transform()`, and `AddCourse.tsx`'s name `<Input>` has no blur-trim. A trailing space is trivially reproducible client-side (pasted text, accidental trailing space before submit). This is a nice-to-have UX layer only — the API is reachable directly (Postman, other clients per this repo's own manual-testing convention), so the backend fix is mandatory regardless.

## Design

Fix at both the right layers, not by re-patching call sites:

1. **Centralize sanitization inside `SendImageCloudinary.ts`** (`lms_server/src/app/util/SendImageCloudinary.ts`) — trim (and, if trivial, strip characters Cloudinary's `public_id` disallows) inside the function itself, so it's a single choke point for every current and future caller:
   ```ts
   public_id: name.trim(),
   ```
   This makes the function safe by construction instead of relying on callers remembering to trim.

2. **Add `.trim()` normalization to `name` in the course Zod schemas** (`lms_server/src/app/modules/course/course.validation.ts`), both `crateCourseValidationSchema` and `updateCourseValidationSchema`:
   ```ts
   name: z.string().min(1, "Course name is required").trim(),
   ```
   (Zod's `.trim()` is a built-in string transform — runs after `.min()` validation order matters less here since `.min(1)` on `" "` still passes length-1, so also consider swapping order or re-checking non-empty after trim: `z.string().trim().min(1, "Course name is required")` is the correct order — trim first, then enforce non-empty, so a whitespace-only name like `"   "` is correctly rejected as empty rather than accepted as a 3-character string.)
   This ensures `payload.name` is already trimmed by the time it reaches `addCourse`/`updateCourseData`, so both the Cloudinary `public_id` derivation and the `prisma.course.create/update` write see the same normalized value — closing Gap B without touching the service layer.

3. **Cleanup: remove the now-redundant local `.trim()` snippets** in `course.service.ts` (`addCourse`, `updateCourseData`), once `SendImageCloudinary` and the Zod schema both normalize independently. (`auth.service.ts` and `user.service.ts`'s local trims are for `User.name`, a separate schema — see item 4.)

4. **Apply the same schema-level `.trim()` fix to the equivalent `name` field** in whichever Zod schema(s) validate `auth.service.ts::createUserIntoDB`/`createInstructor` and `user.service.ts::updateUser`'s inputs (likely `lms_server/src/app/modules/auth/auth.validation.ts` and `lms_server/src/app/modules/user/user.validation.ts` — confirm exact schema/field names at implementation time), for the same reason: it's the identical bug shape (Cloudinary `public_id` from an untrimmed `name`, plus — if `User.name` or an equivalent field is unique/queried by exact match anywhere — the same silent-duplicate risk). Low effort, same root cause, worth doing in the same change.

5. **Optional frontend UX layer (not a substitute for 1-4):** add `.trim()` to `name` in `lms_client/components/main/(Admin)/ManageCourse/schema/Course.schemas.ts`'s `addCourseValidationSchema`/`updateCourseValidationSchema`, so the common case doesn't round-trip a request that the backend will reject/normalize anyway.

## Explicitly out of scope

- Broader Cloudinary `public_id`-safe-character sanitization (e.g. slashes, non-ASCII) beyond whitespace — not reported, not evidenced by the current bug; `.trim()` alone resolves the reported crash.
- Re-keying/deduplicating any already-persisted courses whose `name` has incidental whitespace (e.g. a pre-existing `"test "` row) — a data-cleanup concern, separate from the code fix, and not evidenced to currently exist.

## Implementation

1. `lms_server/src/app/util/SendImageCloudinary.ts` — trim `name` inside the function before using it as `public_id`.
2. `lms_server/src/app/modules/course/course.validation.ts` — `.trim()` (before `.min(1, ...)`) on `name` in both `crateCourseValidationSchema` and `updateCourseValidationSchema`.
3. `lms_server/src/app/modules/course/course.service.ts` — remove the now-redundant local `.trim()` lines in `addCourse`/`updateCourseData` (kept only if they're doing something else, e.g. also trimming `file.path`, in which case only the `name`-trim line is removable).
4. Locate and apply the same `.trim()` schema fix to the `name` field validated ahead of `auth.service.ts::createUserIntoDB`/`createInstructor` and `user.service.ts::updateUser` (`auth.validation.ts`, `user.validation.ts`) — remove their redundant local trims once done.
5. Optional: `lms_client/components/main/(Admin)/ManageCourse/schema/Course.schemas.ts` — add `.trim()` to `name`.
6. `yarn build` / `yarn lint` clean in `lms_server` (and `lms_client` if item 5 is included).

## Verify-when-done

- [x] `SendImageCloudinary.ts` trims `name` before using it as `public_id` — fixes the crash at its single choke point for every current and future caller.
- [x] `crateCourseValidationSchema`/`updateCourseValidationSchema` (`course.validation.ts`) and `createUserValidationSchema`/`createInstructorValidationSchema`/`updateUserValidationSchema` (`user.validation.ts`) all trim `name` before the `.min(1, ...)` check, so a whitespace-only name is correctly rejected as empty rather than silently accepted, and the trimmed value is what reaches both the Cloudinary call and the DB write.
- [x] Redundant local `.trim()` snippets removed from `course.service.ts` (`addCourse`, `updateCourseData`), `auth.service.ts` (`createUserIntoDB`, `createInstructor`), and `user.service.ts` (`updateUser`) — `payload.name` is now trimmed upstream by Zod before these functions ever run.
- [x] Optional frontend layer: `.trim()` added to `name` in `lms_client`'s `addCourseValidationSchema`/`updateCourseValidationSchema`.
- [x] `yarn build` clean in `lms_server` (Prisma generate + `tsc`); `npx tsc --noEmit` clean in `lms_client` for this change (one unrelated pre-existing type error in `CourseDetailPage.tsx` predates this session — confirmed via `git stash`, not touched by this spec).
- [x] `yarn lint` in `lms_server` unchanged at the established 5-error/6-warning baseline, zero new issues in any touched file.
- [ ] Live/manual verification (create a course named `"test "` with a cover image against a running server + real Cloudinary credentials; confirm persisted name is trimmed; confirm a duplicate-name collision after trimming) — left for the user, not performed this session.
