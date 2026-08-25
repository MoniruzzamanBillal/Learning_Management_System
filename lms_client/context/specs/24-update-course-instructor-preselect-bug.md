# 24. Update-course page doesn't pre-select the current instructor(s)

## Goal

Fix `UpdateCourse.tsx` (`/dashboard/admin/update-course/[courseId]`) so the "Instructors Name" `react-select` shows the course's currently-assigned instructor(s) already selected, instead of appearing empty.

## How found

User report: opening `/dashboard/admin/update-course/eb1d753c-73c1-4d44-92c8-87e3ced4906a` ("Mobile App Development with Kotlin") shows the instructor select with nothing pre-selected, even though the course clearly has an assigned instructor. The `GET /course/admin-course-detail/:id` response they provided confirms it:

```json
"instructors": [
  { "id": "b83ae0b0-...", "name": "Instructor Two", "email": "instructor2@gmail.com", "profilePicture": null }
]
```

## Root cause

Two compounding issues in `UpdateCourse.tsx`:

1. **Wrong generic type on the fetch.** `TCourseData<TInstructorType = string, TModuleType = string>` (`types/course.types.ts`) is generic specifically so callers can declare what shape `instructors`/`modules` actually come back as. `UpdateCourse.tsx` calls `useFetchData<TCourseData>(...)` with no type argument, so TypeScript infers `instructors: string[]` — but `admin-course-detail` actually returns populated instructor **objects** (`{id, name, email, profilePicture}[]`), same as the JSON above. Nothing caught the mismatch because nothing in this file was typed strictly enough to fail.

2. **The `reset()` call passes those objects straight into the form field**, unmapped:

   ```ts
   reset({
     ...
     instructors: course?.instructors,   // TInstructor[], not string[]
   });
   ```

   But the `Controller`-wrapped `react-select` for `instructors` — and `updateCourseValidationSchema`'s `instructors: z.array(z.string())` — both expect an array of instructor **ID strings**, exactly like `AddCourse.tsx`'s working version:

   ```ts
   value={instructorOptions?.filter((option) =>
     field?.value?.includes(option?.value),   // option.value is instructor.id (string)
   )}
   ```

   `field.value` ends up as `[{id, name, email, profilePicture}]`; `.includes(option.value)` compares a string against an array of objects, which can never be `true` — so no option ever renders as selected, for any course.

## Fix

`components/main/(Admin)/ManageCourse/UpdateCourse.tsx`:

- Type the fetch with the real shape: `useFetchData<TCourseData<TInstructor>>(...)`.
- In the `reset()` call, map to IDs: `instructors: course?.instructors?.map((instructor) => instructor.id)`.

No backend change needed — the API response shape is correct and consistent with the other admin course-detail consumers; this is purely a frontend type/mapping bug.

## Verify when done

- [ ] Real UI: `/dashboard/admin/update-course/eb1d753c-73c1-4d44-92c8-87e3ced4906a` shows "Instructor Two" pre-selected in the instructor field on load.
- [ ] Submitting the form without touching the instructor field keeps the same instructor assigned (payload sends the ID, not the object).
- [ ] Spot-check a second course to confirm it's not specific to one row.
- [ ] `npx tsc --noEmit` and `yarn lint` clean on the touched file.
