# 40. Fix: video add/update fails with 413 Content Too Large (Vercel serverless body-size limit)

## Goal

`POST /api/video/add-video` and `PATCH /api/video/update-video/:id` fail with `413 Content Too Large` even for video files well under any limit configured in this app's own code (reported: a video "less than 20mb" still fails). Make video upload actually work in production on Vercel.

## Root cause

This is almost certainly **not an application bug** in the traditional sense — it's a platform limit that the current upload architecture runs straight into.

**Current upload mechanism:** `lms_server/src/app/util/VideoUpload.ts` uses `multer` with `multer-storage-cloudinary`'s `CloudinaryStorage` engine (`resource_type: "video"`), with **no `limits.fileSize` configured** (`export const uploadVideo = multer({ storage });`). This means: the client sends the raw video bytes as a multipart request body directly to the Express app; multer streams and parses that body inside the running server process; `multer-storage-cloudinary` then re-uploads the bytes to Cloudinary from inside that same process. The entire video file passes through the backend server as part of a single HTTP request.

**Why that's fatal on Vercel specifically:** this backend is deployed to Vercel as a Node.js Serverless Function (`lms_server/vercel.json`: legacy `version: 2` format, `builds: [{ src: "dist/server.js", use: "@vercel/node" }]`, a catch-all `routes` rewrite to `dist/server.js` — the whole Express app is one monolithic function, confirmed no `lms_server/api/` folder or per-route function splitting). Vercel's Node.js Serverless Functions enforce a **hard, ~4.5 MB request body size limit**, enforced by Vercel's platform/edge layer *before* the request body reaches application code at all. This is not configurable via `vercel.json`, `express.json()`/`body-parser` limits, or multer's own `limits` option — none of those are even reached, because the platform rejects the request upstream of the Express app. (`express.json()`'s default 100kb limit in `app.ts` line 32 and `body-parser.urlencoded`'s default in line 36 are irrelevant here too — multer parses multipart bodies itself, bypassing both — but neither would matter regardless, since the 413 is happening at the platform layer for *any* body over ~4.5MB, JSON or multipart.)

**Corroborating evidence:** `lms_server/src/app/util/SendImageCloudinary.ts`'s course-cover-image upload (a separate `multer`+`CloudinaryStorage` config, also with no `limits`) uses the *exact same* through-the-function upload pattern and is subject to the identical platform limit — it simply hasn't been hit yet because cover images are far smaller than ~4.5MB. This proves the limit is architectural (Vercel's platform), not something specific to the video route's code.

Given the user confirms the video is well under 20MB, and Vercel's limit is ~4.5MB, essentially any video upload attempt on this deployment will fail this way — this is not an edge case, it's the current architecture being fundamentally incompatible with Vercel serverless functions for file sizes beyond a few MB.

## Design

Stop routing raw video bytes through the Vercel serverless function. Upload the video directly from the browser to the storage provider (Cloudinary, already configured and used elsewhere in this codebase), and have the backend only ever handle small JSON metadata (the resulting URL/public ID), never the file bytes.

**Recommended approach — direct-to-Cloudinary signed upload:**

1. **New backend endpoint**, e.g. `POST /api/video/upload-signature` (or reuse an existing signature-generation pattern if one already exists elsewhere in the codebase — check before adding a new one), gated by `authCheck(UserRole.admin, UserRole.instructor)`. It generates and returns a short-lived signed Cloudinary upload signature (`cloudinary.utils.api_sign_request` — the `cloudinary` SDK is already a dependency per `SendImageCloudinary.ts`), plus the timestamp, API key, cloud name, and target folder (e.g. `course_videos`, matching `VideoUpload.ts`'s existing folder convention). This is a tiny JSON response — no file bytes involved, so it's nowhere near Vercel's body-size limit.

2. **Frontend upload flow changes** (locate the actual add-video/update-video form component under `lms_client/components/main/(Instructor)/` — likely a `ManageVideo`/`AddVideo`/`UpdateVideo` feature folder per this codebase's per-feature `components/main/<Group>/<Feature>/` convention; not yet pinpointed in this investigation, confirm exact path before implementing):
   - On submit, first call the new signature endpoint.
   - Upload the raw video file **directly from the browser** to Cloudinary's public upload API (`https://api.cloudinary.com/v1_1/<cloud_name>/video/upload`) using the returned signature — this request goes browser → Cloudinary directly, never touching the Vercel function, so it isn't subject to Vercel's body-size limit at all (Cloudinary itself supports far larger uploads, and its JS SDK/plain `fetch`+`FormData` supports progress events, useful for a video-sized upload UX).
   - Once Cloudinary responds with the uploaded video's `secure_url` (and any other needed metadata, e.g. duration if available), send **that small JSON payload** (not the file) to the existing `/api/video/add-video` / `/api/video/update-video/:id` endpoints.

3. **Backend `add-video`/`update-video` route/controller/service changes:**
   - Remove `uploadVideo.single("video")` (multer) from these two routes in `lms_server/src/app/modules/VideoModule/video.routes.ts` — they no longer receive a multipart file body, just JSON.
   - `video.controller.ts`/`video.service.ts::addVideo`/`updateVideo` change from reading `req.file`/calling the server-side Cloudinary upload, to reading the video URL directly out of the validated JSON body (add a `videoUrl`-shaped field, or whatever the existing `Video` Prisma model's column is named, to `videol.validation.ts`'s Zod schema). The `Video` model's existing storage field for the Cloudinary URL doesn't change — this only changes *how* that URL gets produced (client-driven direct upload + callback vs. server-side upload from a multer-received file), not what's persisted.
   - Course-cover-image upload (`SendImageCloudinary.ts`) is explicitly **not** touched by this fix (see Explicitly out of scope) — it's a separate, much-smaller-file code path that hasn't hit the limit in practice.

**Alternative considered — Mux direct upload:** this codebase already uses Mux Player for video *playback* (per `lms_client`'s dependency list), but that's unrelated to where video files are currently *stored* (Cloudinary, per `VideoUpload.ts`). Switching video storage to Mux (which has its own direct-upload-URL flow, conceptually similar to Cloudinary's signed upload) is a larger change — new SDK/API integration, a decision about whether existing Cloudinary-hosted videos get migrated or left as-is, and uncertainty about whether Mux is already paid/configured for storage (vs. just embedded as a player against Cloudinary URLs, which is plausible and should be checked). Recommended only if there's already a reason to move off Cloudinary for video specifically; otherwise the signed-upload approach (option above) is the smaller, lower-risk diff since Cloudinary is already fully configured and used for video today.

## Open question (needs a decision before implementation)

- Confirm: is Mux used purely as a client-side player pointed at Cloudinary-hosted video URLs, or does it already ingest/store video itself? This determines whether the Cloudinary-signed-upload approach is compatible with the existing playback setup, or whether video storage needs to move to Mux as part of this fix. Check `lms_client`'s Mux Player integration/whatever backend code configures it before starting implementation.
- Confirm whether an unsigned Cloudinary upload preset (simpler, slightly less secure — anyone with the preset name could upload) is acceptable instead of a signed upload (more secure, requires the new signature endpoint) — signed is recommended given this is paid-course content, but worth confirming against the team's risk tolerance.

## Explicitly out of scope

- Course cover image upload (`SendImageCloudinary.ts`) — same theoretical limit, but not reported as broken and file sizes involved are small; migrating it to a direct-upload pattern too is a reasonable future hardening step but not part of this bug fix.
- Any change to `express.json()`/`body-parser` limits in `app.ts` — confirmed irrelevant to this bug (see Root cause), not touched.
- Any `vercel.json` change — confirmed there is no config surface for this limit.
- Migrating already-uploaded videos to a different storage/CDN.

## Implementation

1. Confirm the Mux-vs-Cloudinary storage question (Open question above) before starting.
2. `lms_server/src/app/modules/VideoModule/` — add a signed-upload-credentials endpoint (route/controller/service/validation, following this codebase's standard module file split); update `videol.validation.ts` to accept a video URL/metadata field in the add/update payload instead of relying on `req.file`.
3. `lms_server/src/app/modules/VideoModule/video.routes.ts` — remove `uploadVideo.single("video")` multer middleware from `add-video`/`update-video` routes.
4. `lms_server/src/app/modules/VideoModule/video.service.ts` — update `addVideo`/`updateVideo` to persist the client-supplied video URL instead of calling server-side Cloudinary upload from a multer file.
5. Frontend: locate and update the add-video/update-video form component(s) to call the signature endpoint, upload directly to Cloudinary from the browser, then submit the resulting URL as JSON.
6. `yarn build` / `yarn lint` clean in both apps.

## Verify-when-done

- [ ] Uploading a video well over Vercel's ~4.5MB limit (e.g. 15-20MB) via `/dashboard/instructor/add-video/:moduleId` succeeds end-to-end in the deployed (Vercel) environment, not just locally.
- [ ] Updating an existing video's file via `/dashboard/instructor/update-video/:id` succeeds the same way.
- [ ] The video plays back correctly afterward (confirms the stored URL/metadata is correct post-migration to the new flow).
- [ ] The new signature endpoint rejects unauthenticated requests and requests from non-instructor/non-admin roles.
- [ ] Course cover image upload (unrelated path) still works unmodified — regression check.
- [ ] `yarn build` / `yarn lint` clean in both apps.
