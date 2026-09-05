# 20 — Friendly duplicate-email error on register / register-instructor

## Goal

`POST /api/auth/register` (`authServices.createUserIntoDB`) and `POST /api/auth/register-instructor` (`authServices.createInstructor`) should return a friendly, expected `AppError` (e.g. `400 "A user with this email already exists !!!"`) when the email is already taken, instead of letting Prisma's raw `PrismaClientKnownRequestError` bubble up to `globalErrorHandler` and back to the client as an unformatted stack trace.

## How this was found

Found while seeding course data through the real Admin UI (`context/specs/21-course-seed-data-import.md`): re-submitting the "Add Instructor" form for `instructor1@gmail.com` (an account that already existed from earlier manual testing) surfaced a raw 500 response instead of the expected "email already registered" message, and the toast in the browser showed the same raw text.

## Current State

Both `createUserIntoDB` and `createInstructor` in `lms_server/src/app/modules/auth/auth.service.ts` call `prisma.user.create(...)` with no `try/catch` around the unique-constraint on `User.email`:

```ts
const result = await prisma.user.create({
  data: {
    ...payload,
    password: hashedPassword,
  } as Prisma.UserCreateInput,
});
```

`globalErrorHandler` (`lms_server/src/app/middleware/globalErrorHandler.ts`) does **not** normalize Prisma errors generically (by design — see `architecture.md`), so an unhandled `PrismaClientKnownRequestError` (`P2002`, unique constraint on `email`) falls through to a raw 500 whose `message` is the full Prisma error text, including a source file path and line number:

```json
{
  "success": false,
  "message": "\nInvalid `prisma.user.create()` invocation in\n/…/lms_server/src/app/modules/auth/auth.service.ts:68:36\n\n  65   Number(config.bcrypt_salt_rounds)\n  66 );\n  67 \n→ 68 const result = await prisma.user.create(\nUnique constraint failed on the fields: (`email`)",
  ...
}
```

Reproduced via `curl`:

```
POST /api/auth/register-instructor  (existing email instructor1@gmail.com)
→ 500, message = raw Prisma stack trace (see above)
```

This is the exact same category of bug `review.service.ts::addReview` was already fixed for (its `@@unique([userId, courseId])` constraint), per the precedent noted in `architecture.md`:

```ts
// review.service.ts
} catch (error) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "You already reivewed this course !!!");
  }
  throw error;
}
```

`createUserIntoDB`/`createInstructor` never got the equivalent treatment for `User.email`'s `@unique`.

## Proposed Implementation

Wrap the `prisma.user.create(...)` call in both `createUserIntoDB` and `createInstructor` in a `try/catch`, mirroring `review.service.ts`'s pattern exactly:

```ts
try {
  const result = await prisma.user.create({
    data: { ...payload, password: hashedPassword } as Prisma.UserCreateInput,
  });
  return result;
} catch (error) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A user with this email already exists !!!"
    );
  }
  throw error;
}
```

- `Prisma` and `AppError` are already imported in `auth.service.ts` — no new imports needed.
- `httpStatus` already imported.
- Applies to both functions identically since both hit the same `User.email` unique constraint.

## Dependencies

None — same Prisma error type/import already used elsewhere in this file's module tree (`review.service.ts`).

## Verify When Done

- [x] `POST /auth/register-instructor` with a duplicate email returns `400` with message `"A user with this email already exists !!!"` (no stack trace / file path in the response). Verified via `curl` against the real `instructor1@gmail.com` duplicate.
- [x] `createUserIntoDB` (`/auth/register`) wrapped with the identical try/catch — same `P2002` code path, not separately curl-verified but mechanically identical to the verified `createInstructor` case.
- [x] Happy path still succeeds for a new, non-duplicate email — verified via `curl` (`fixverify-temp@example.com` → `201`-style success, then deleted).
- [x] `yarn lint` shows no new errors/warnings from `auth.service.ts` (baseline pre-existing errors elsewhere unchanged: 5 errors/6 warnings, none in this file).
