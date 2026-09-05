# 22 — Friendly duplicate-name error on course creation

## Goal

`POST /api/course/add-course` (`courseService.addCourse`, `course.service.ts`) should return a friendly `AppError` (e.g. `400 "A course with this name already exists !!!"`) when `Course.name` (which is `@unique` in `prisma/schema.prisma`) collides, instead of letting a raw `PrismaClientKnownRequestError` bubble up as an unformatted 500.

## How this was found

Found while seeding course data through the real Admin UI (`context/specs/21-course-seed-data-import.md`): the seed script's `add_course` step for "Frontend Development Using React" hit this immediately, because that exact course already existed in the DB from earlier manual testing (unpublished, `createdAt: 2026-08-23`, cover image + `instructor1` already attached) — a detail the script hadn't accounted for. The resulting toast in the browser showed the raw Prisma error text instead of a clear "already exists" message, exactly the same failure shape as `20-friendly-duplicate-email-error.md` (`auth.service.ts`), just in a different module.

## Current State

`course.service.ts::addCourse` calls `prisma.course.create(...)` with no `try/catch` around `Course.name`'s unique constraint:

```ts
const result = await prisma.course.create({
  data: {
    name: payload.name,
    // …
  },
  include: { /* … */ },
});

return result;
```

Reproduced via the live UI run: submitting "Add Course" for a name that already exists returns a `500` whose `message` is the full Prisma error text (source file path + line number included), e.g.:

```
Invalid `prisma.course.create()` invocation in
/…/lms_server/src/app/modules/course/course.service.ts:58:38
Unique constraint failed on the fields: (`name`)
```

Same root cause and same fix shape as spec 20 (`auth.service.ts::createUserIntoDB`/`createInstructor`) and the pre-existing precedent in `review.service.ts::addReview` — `globalErrorHandler` deliberately does not normalize Prisma errors generically (per `architecture.md`), so each call site touching a `@unique` field needs its own friendly mapping.

## Proposed Implementation

Wrap the `prisma.course.create(...)` call in `addCourse` in a `try/catch`, matching the established pattern:

```ts
try {
  const result = await prisma.course.create({
    data: { /* … */ },
    include: { /* … */ },
  });
  return result;
} catch (error) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A course with this name already exists !!!"
    );
  }
  throw error;
}
```

`Prisma`, `AppError`, and `httpStatus` are already imported in `course.service.ts` — no new imports needed.

## Dependencies

None — same pattern already proven in `review.service.ts` and (this session) `auth.service.ts`.

## Verify When Done

- [x] `POST /course/add-course` with a duplicate course name returns `400` with message `"A course with this name already exists !!!"` (no stack trace / file path in the response). Verified via `curl` reproducing the exact seed-run failure, then again after the fix.
- [x] A new, non-duplicate course name still succeeds (`200`) — confirmed no regression by continuing the seed run with the next course.
- [x] `yarn lint` clean in `lms_server` for `course.service.ts` (no new errors/warnings beyond the established baseline).
