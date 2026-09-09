# 38. Fix: admin can't add a new instructor when updating a course

## Goal

On `/dashboard/admin/update-course/[id]`, when an admin selects an additional instructor in the multi-select and submits, the new instructor is not actually attached to the course. Make the update endpoint sync the course's instructor list the same way course creation already does.

## Root cause

Two independent gaps, both on the backend — the frontend already sends the correct data.

**Frontend (`lms_client/components/main/(Admin)/ManageCourse/UpdateCourse.tsx`) is not at fault:** its instructor `Controller`/`react-select` `onChange` replaces the full RHF field value with the complete current selection every time, and `handleUpdateCorse` (lines 104-129) puts that full array into `payload.instructors`, JSON-stringified into the `FormData` `data` field. Confirmed no client-side diffing/filtering drops anything.

**Gap 1 — validation schema strips the field.** `lms_server/src/app/modules/course/course.routes.ts`'s update route runs `validateRequest(courseValidations.updateCourseValidationSchema)` after JSON-parsing the multipart body. `validateRequest` (`lms_server/src/app/middleware/validateRequest.ts`) does `req.body = await Schema.parseAsync(req.body)` — Zod's default "strip unknown keys" behavior means anything not declared in the schema is dropped from the parsed result. `updateCourseValidationSchema` (`lms_server/src/app/modules/course/course.validation.ts`, lines 16-24) has no `instructors` key at all (unlike `crateCourseValidationSchema` just above it, which does), so `instructors` is silently stripped before it ever reaches the controller/service.

**Gap 2 — even if it arrived, the service ignores it.** `updateCourseData` (`lms_server/src/app/modules/course/course.service.ts`, lines 386-429) only ever writes scalar fields (`name`, `description`, `price`, `category`, `courseCover`) to `prisma.course.update`. There is no code touching the `CourseInstructor` join table at all — contrast with `addCourse` (lines 21-93), which validates each instructor ID exists, then does a nested `create` on the `instructors` relation. Update never got the equivalent logic.

## Design

Port `addCourse`'s instructor-validation pattern into `updateCourseData`, and replace (not merge) the course's instructor set on update — matching what the multi-select UI represents (the complete desired set, not a delta). Since `CourseInstructor` is an explicit join model with a required, non-nullable `courseId` FK (`@@unique([courseId, userId])`, schema lines 95-106), the correct nested-write shape for "replace the whole set" is `deleteMany: {}` (removes all existing `CourseInstructor` rows for this course) followed by `create` (inserts the new set) — both inside the same `prisma.course.update` call, which Prisma already wraps in one implicit transaction for nested writes.

### 1. `lms_server/src/app/modules/course/course.validation.ts`

Add to `updateCourseValidationSchema` (currently lines 16-24):

```ts
instructors: z.array(objectIdSchema).optional(),
```

### 2. `lms_server/src/app/modules/course/course.service.ts` — `updateCourseData`

Replace the function body to:

- Destructure `instructors` from `payload`.
- If provided and non-empty, validate every ID exists (mirrors `addCourse` lines 41-56 — same "Instructor don't exist !!!" `AppError`).
- Pass a conditional nested write to `prisma.course.update`:

```ts
const { instructors } = payload;

if (instructors?.length) {
  await Promise.all(
    instructors.map(async (instructor) => {
      const instructorData = await prisma.user.findFirst({
        where: { id: instructor, isDeleted: false },
      });

      if (!instructorData) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Instructor don't exist !!!",
        );
      }
    }),
  );
}

// ...existing file-upload block stays where it is...

const updatedResult = await prisma.course.update({
  where: { id: courseId },
  data: {
    name: payload.name,
    description: payload.description,
    price: payload.price,
    category: payload.category,
    courseCover: payload.courseCover,
    instructors:
      instructors !== undefined
        ? { deleteMany: {}, create: instructors.map((userId) => ({ userId })) }
        : undefined,
  },
  include: {
    instructors: {
      include: { instructor: { select: { id: true, name: true } } },
    },
  },
});

return {
  ...updatedResult,
  instructors: updatedResult.instructors.map((ci) => ci.instructor),
};
```

- `instructors: undefined` (field not sent at all) → the nested-write key itself is `undefined`, so Prisma leaves the relation untouched — matches existing partial-update semantics for the scalar fields.
- `instructors: []` (admin clears every instructor via the multi-select) → `deleteMany: {}` runs, `create: []` is a no-op — course ends up with zero instructors, which is a valid admin action, not an error.
- `deleteMany: {}` before `create` avoids any `P2002` unique-constraint conflict on `[courseId, userId]` for instructors that are re-selected unchanged.
- Remove the now-incorrect comment block ("`instructors` isn't part of the update validation schema...") that rationalized the missing logic.

## Explicitly out of scope

- Diff-based (`connect`/`disconnect` only for changed IDs) instead of delete-and-recreate — the multi-select already sends the full desired set on every submit, and delete+recreate is simpler and matches `addCourse`'s existing style; the `CourseInstructor.id`/`createdAt` churn on unchanged instructors has no visible effect anywhere else in the codebase (nothing references `CourseInstructor.id` from outside this join).
- Adding a `modules` field to `updateCourseValidationSchema` — `crateCourseValidationSchema` has one, but the update flow doesn't touch module assignment via this endpoint, and it's not part of this bug report.

## Implementation

1. `lms_server/src/app/modules/course/course.validation.ts` — add `instructors` to `updateCourseValidationSchema`.
2. `lms_server/src/app/modules/course/course.service.ts` — rewrite `updateCourseData` per above.
3. `yarn build` / `yarn lint` clean in `lms_server`.
4. No frontend changes required.

## Verify-when-done

- [ ] `PATCH /course/update-course/:id` with `instructors: [existingId, newId]` in the payload → both instructors present on the course afterward (confirm via `GET /course/admin-course-detail/:id`).
- [ ] Admin UI: open update-course page for a course with 1 instructor, add a 2nd via the multi-select, save, reload the page → both instructors show as pre-selected.
- [ ] Submitting the update form with `instructors` unchanged from the pre-filled set → no errors, no duplicate-key crash.
- [ ] Removing all instructors via the multi-select and saving → course ends up with zero instructors, no crash.
- [ ] Submitting an update with a non-existent instructor ID → `400 "Instructor don't exist !!!"`, course otherwise unchanged.
- [ ] Updating only scalar fields (no instructor change, `instructors` field absent) → existing instructors untouched (regression check).
- [ ] `yarn build` / `yarn lint` clean.
