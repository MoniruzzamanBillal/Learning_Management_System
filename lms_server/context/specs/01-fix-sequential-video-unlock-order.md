# 01 — Fix sequential video unlock unlocking the wrong video

## Goal

Course modules unlock videos one at a time in order: on enrollment, `videoOrder: 0` is `unlocked` and the rest are `locked`; watching a video should unlock exactly the video whose `videoOrder` is `current + 1`. In practice, watching video 1 sometimes unlocks video 3 or 4 instead of video 2. This spec fixes the root causes and repairs already-affected data.

## Design

Two independent bugs combine to produce the symptom:

**Bug A — `videoOrder` assignment is not deletion-safe or atomic**

`VideoModule/video.service.ts` (`addVideo`) assigns a new video's order via:

```ts
const videoCount = await videoModel.countDocuments({ module });
payload.videoOrder = videoCount;
```

`videoModel` has `pre("find")`/`pre("findOne")` hooks filtering `isDeleted: false` (`video.model.ts`), but `countDocuments` is not covered by those hooks — it counts soft-deleted videos too. After any delete + re-add in a module, a new video can get a `videoOrder` that skips a number or **duplicates** an existing active video's order. There's also no unique index, and the read-then-write is not atomic, so concurrent "add video" requests can assign the same order to two different videos.

The unlock query itself, `CourseEnrollment.service.ts` `watchVideo` (`findOne({ module, videoOrder: current + 1 })`), is correct in isolation — but when two videos share a `videoOrder`, it nondeterministically matches whichever document Mongo returns first. That's the "unlocks video 3/4 instead of 2" symptom.

**Bug B — the video list shown to the student isn't sorted by `videoOrder`, and doesn't even fetch it**

`CourseEnrollment.service.ts` (`getUserEnrolledModuleVideos`, backing `GET /enroll/module-videos/:moduleId`):

```ts
const videoData = await videoProgressModel
  .find({ module: moduleId, user: userId })
  .populate("video", " _id title ") // videoOrder not selected
  .select("  _id  videoStatus ");
return videoData; // no .sort()
```

Consumed directly by `lms_client/.../EnrolledCourseDetail/ModuleShowData.tsx` (`.map()`, no client sort), whose `TModuleVideo` type doesn't include `videoOrder` at all. The list position is MongoDB's natural/insertion order, not the real `videoOrder`. Combined with Bug A, the item visually labeled "video 2" can be a different document than the one the backend just correctly unlocked.

**Consequence — existing data is likely already corrupted**

Bug A has been live since videos were first added/deleted, so any module that had a video deleted-and-re-added may already have duplicate or out-of-sequence `videoOrder` values today. A one-time backfill is required in addition to the code fix — the code fix alone only prevents new corruption.

## Implementation

1. `VideoModule/video.service.ts` (`addVideo`) — replace the `countDocuments` read with a deletion-safe lookup:

   ```ts
   const lastVideo = await videoModel
     .findOne({ module })
     .sort({ videoOrder: -1 });
   const nextOrder = lastVideo ? lastVideo.videoOrder + 1 : 0;
   payload.videoOrder = nextOrder;
   ```

   Use `nextOrder` for both `payload.videoOrder` and the `videoCount === 0` check passed into `addVideoCoursePublish` (`VideoProgress/videoProgress.functions.ts`, which decides `unlocked` vs `locked` for the first video in a module).

2. `VideoModule/video.model.ts` — add a partial unique index so duplicate order values are rejected at the DB level (defense-in-depth against races):

   ```ts
   videoSchema.index(
     { module: 1, videoOrder: 1 },
     { unique: true, partialFilterExpression: { isDeleted: false } },
   );
   ```

3. `CourseEnrollment.service.ts` (`getUserEnrolledModuleVideos`) — select `videoOrder` in the populate and sort the result in JS (Mongoose can't sort by a populated field at the query level):

   ```ts
   const videoData = await videoProgressModel
     .find({ module: moduleId, user: userId })
     .populate("video", " _id title videoOrder ")
     .select("  _id  videoStatus ");

   videoData.sort(
     (a, b) => (a.video as any)?.videoOrder - (b.video as any)?.videoOrder,
   );

   return videoData;
   ```

4. `lms_client/.../ModuleShowData.tsx` — add `videoOrder` to the nested `video` object in `TModuleVideo`, and sort the fetched array by `video.videoOrder` before rendering (defense-in-depth; the backend now returns pre-sorted data).

5. One-time backfill script, `lms_server/src/scripts/fixVideoOrder.ts`, run once via `ts-node` and then removed: for each distinct `module`, fetch its `Video` docs with `isDeleted: false` sorted by `createdAt` ascending, and reassign `videoOrder = 0, 1, 2, ...` in that order. `VideoProgress` docs reference videos by `_id`, not by order, so the backfill does not need to touch the `VideoProgress` collection. Must be run against a staging copy first, and only against production with explicit confirmation.

## Dependencies

- No new libraries. Uses existing Mongoose model/index APIs.
- Does not touch the commented-out `authCheck(...)` on `video.controller.addVideo` — that's a separate, already-flagged known gap (see `architecture.md`), out of scope here.

## Verify-when-done

- [ ] `yarn build` and `yarn lint` clean in `lms_server`.
- [ ] Delete a video from a module, add a new one, confirm its `videoOrder` doesn't collide with any remaining active video in that module.
- [ ] Manually attempt to create two `Video` docs with the same `{module, videoOrder}` — confirm the unique partial index rejects the second.
- [ ] As a test enrolled student, click through a 3+ video module and confirm each click unlocks exactly the next video, both in the DB (`VideoProgress.videoStatus`) and in the rendered `ModuleShowData` list order.
- [ ] Run the backfill script against a staging DB copy first; spot-check a few modules' `videoOrder` sequences before/after.
