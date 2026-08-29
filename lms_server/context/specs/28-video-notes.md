# 28. Video Notes — Backend

## Goal

Let an enrolled+paid student keep one personal note per video while watching a course. Per the design in [`future-update-notes-quiz-assignment-plan.md`](../../../future-update-notes-quiz-assignment-plan.md)'s Feature 1: a single note per `(user, video)` (not many), created and updated through the same save action, and deleted via soft delete — not a hard `DELETE` — matching this codebase's existing `isDeleted` convention. No timestamp/seek anchoring; plain text only. This is the first of three planned features (Notes → Quiz → Assignment per that doc's build order) and is fully independent of the other two.

## Design

**New Prisma model**, added to `prisma/schema.prisma`:

```prisma
model VideoNote {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId    String   @db.Uuid
  courseId  String   @db.Uuid
  moduleId  String   @db.Uuid
  videoId   String   @db.Uuid
  content   String
  isDeleted Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id])
  course Course @relation(fields: [courseId], references: [id])
  module Module @relation(fields: [moduleId], references: [id])
  video  Video  @relation(fields: [videoId], references: [id])

  @@unique([userId, videoId])
}
```

Add the matching back-relation (`videoNotes VideoNote[]`) to `User`, `Course`, `Module`, and `Video` — the same four models `VideoProgress` already relates to, following that model's exact wiring.

**New module:** `lms_server/src/app/modules/VideoNote/`, mirroring `review`'s file split (`context/architecture.md`'s established pattern) — `VideoNote.route.ts`, `VideoNote.controller.ts`, `VideoNote.service.ts`, `VideoNote.interface.ts`, `VideoNote.validation.ts`.

**Route shape — one deliberate deviation from the design doc:** that doc sketched `GET/PUT/DELETE /video-note/:videoId`, but the existing `ValidateCourseAccess` middleware (the enrolled+paid gate this feature reuses unchanged) hard-requires `req.params.courseId` (see `lms_server/src/app/middleware/ValidateCourseAccess.ts`). So every route here carries both IDs:

- `GET /video-note/:courseId/:videoId` — fetch the caller's own note for that video (`isDeleted: false`), or `data: null` if none exists yet.
- `PUT /video-note/:courseId/:videoId` — upsert: creates on first save, updates on every edit after. Body: `{ content: string }`.
- `DELETE /video-note/:courseId/:videoId` — soft delete (`isDeleted: true`); the row is kept, not removed.

All three: `authCheck(UserRole.user)` → `ValidateCourseAccess` → (`validateRequest` on the `PUT` only) → controller — same middleware ordering `CourseEnrollment.routes.ts` already uses on its gated routes.

**Service logic (`VideoNote.service.ts`):**

- `getMyVideoNote(userId, videoId)` — `prisma.videoNote.findFirst({ where: { userId, videoId, isDeleted: false } })`; returns `null` if none.
- `upsertVideoNote(userId, videoId, content)` — needs `courseId`/`moduleId` to satisfy the required FKs on first create. Derive them server-side from the video itself, rather than trusting client-supplied values:
  ```ts
  const video = await prisma.video.findFirst({
    where: { id: videoId, isDeleted: false },
    select: { moduleId: true, module: { select: { courseId: true } } },
  });
  if (!video) throw new AppError(httpStatus.NOT_FOUND, "Video not found !!!");
  ```
  Then:
  ```ts
  prisma.videoNote.upsert({
    where: { userId_videoId: { userId, videoId } },
    create: { userId, videoId, courseId: video.module.courseId, moduleId: video.moduleId, content },
    update: { content, isDeleted: false },
  });
  ```
  The `update` branch resetting `isDeleted: false` is what makes "write a new note after deleting the old one" work without colliding with the `@@unique([userId, videoId])` constraint — it reactivates the same row instead of attempting a second insert.
- `deleteVideoNote(userId, videoId)` — `findFirst` the existing note (`isDeleted: false`; throw `AppError(NOT_FOUND, "Note not found !!!")` if missing/already deleted), then `prisma.videoNote.update({ where: { id: note.id }, data: { isDeleted: true } })`.

**Validation (`VideoNote.validation.ts`):**
```ts
const upsertVideoNoteSchema = z.object({
  content: z.string().min(1, "Note content is required !!!"),
});
```
Route params (`courseId`, `videoId`) are not run through `validateRequest` — matches the existing convention of trusting route params as-is (`review.route.ts`'s `:courseId`/`:reviewId` aren't Zod-validated either).

**Interface (`VideoNote.interface.ts`):**
```ts
import { VideoNote } from "../../../generated/prisma/client";
export type TVideoNote = VideoNote;
```

**Router registration:** add to `src/app/router/index.ts`'s `routeArray`: `{ path: "/video-note", route: videoNoteRouter }`.

## Implementation

1. `prisma/schema.prisma` — add the `VideoNote` model above; add `videoNotes VideoNote[]` to `User`, `Course`, `Module`, `Video`.
2. `npx prisma migrate dev --name add_video_note` (from `lms_server/`) — creates and applies the migration. Per `CLAUDE.md`: avoid `npx prisma migrate reset` afterward — it replays every migration and would drop the hand-added `Video` partial unique index unless that's manually reapplied.
3. `VideoNote.interface.ts` — re-export the generated type (above).
4. `VideoNote.service.ts` — `getMyVideoNote`, `upsertVideoNote`, `deleteVideoNote` (above).
5. `VideoNote.controller.ts` — thin `catchAsync` + `sendResponse` wrappers, reading `req?.user?.userId` (set by `authCheck`) and `req?.params?.videoId`:
   ```ts
   const getMyVideoNote = catchAsync(async (req, res) => {
     const result = await videoNoteServices.getMyVideoNote(
       req?.user?.userId as string,
       req?.params?.videoId as string,
     );
     sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Video note retrieved successfully !!!", data: result });
   });

   const upsertVideoNote = catchAsync(async (req, res) => {
     const result = await videoNoteServices.upsertVideoNote(
       req?.user?.userId as string,
       req?.params?.videoId as string,
       req?.body?.content,
     );
     sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Note saved successfully !!!", data: result });
   });

   const deleteVideoNote = catchAsync(async (req, res) => {
     const result = await videoNoteServices.deleteVideoNote(
       req?.user?.userId as string,
       req?.params?.videoId as string,
     );
     sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Note deleted successfully !!!", data: result });
   });
   ```
6. `VideoNote.route.ts`:
   ```ts
   router.get("/:courseId/:videoId", authCheck(UserRole.user), ValidateCourseAccess, videoNoteController.getMyVideoNote);
   router.put(
     "/:courseId/:videoId",
     authCheck(UserRole.user),
     ValidateCourseAccess,
     validateRequest(videoNoteValidationSchema.upsertVideoNoteSchema),
     videoNoteController.upsertVideoNote,
   );
   router.delete("/:courseId/:videoId", authCheck(UserRole.user), ValidateCourseAccess, videoNoteController.deleteVideoNote);
   ```
7. `src/app/router/index.ts` — import `videoNoteRouter`, add `{ path: "/video-note", route: videoNoteRouter }` to `routeArray`.

## Dependencies

- No new packages.
- No dependency on Feature 2 (Quiz) or Feature 3 (Assignment) — fully independent, safe to build and ship on its own.

## Verify-when-done

- [ ] `npx prisma migrate status` shows the new migration applied; the `VideoNote` table exists with a `userId_videoId` unique index (check via `prisma studio` or `\d "VideoNote"`).
- [ ] `yarn build` / `yarn lint` clean.
- [ ] `GET /api/video-note/:courseId/:videoId` with no token → `401`.
- [ ] Same call as an enrolled-but-unpaid or not-enrolled user → `403` (via `ValidateCourseAccess`).
- [ ] Enrolled+paid user, no note yet → `200` with `data: null`.
- [ ] `PUT` with `{ content: "..." }` → `200`, creates the row; a following `GET` returns it.
- [ ] `PUT` again with different content → `200`, same row updated (same `id`, new `content`) — not a second row.
- [ ] `DELETE` → `200`; a following `GET` returns `data: null` again (soft-deleted, filtered out).
- [ ] `PUT` again after delete → reactivates the same row (`isDeleted: false`, new content); confirm the row's `id` is unchanged from before the delete, proving it reused the row rather than hitting the unique constraint as a fresh insert.
- [ ] A second user's `GET`/`PUT`/`DELETE` against the first user's note never touches the first user's row (own-note isolation).

This is a planning document — no schema migration or module code has been written yet.
