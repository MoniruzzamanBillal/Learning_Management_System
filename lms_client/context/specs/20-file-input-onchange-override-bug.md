# 20 — File inputs silently drop the selected file (register `onChange` clobbered by a preview handler)

## Goal

Every `type="file"` input that combines `{...register(fieldName)}` with a separately-declared `onChange={...}` prop (used only to drive a local image/video preview) should keep react-hook-form actually informed of the selected file, instead of losing it — which currently makes `Add Video` **always fail with a 500** (server-required `videoUrl` never arrives) and makes `Add/Update Course` cover image, `Add Instructor` profile picture, `Update Profile` avatar, and `Update Video` all **silently** submit with no file, no error, no upload.

## How this was found

Found live while seeding course data through the real Instructor UI (`lms_server/context/specs/21-course-seed-data-import.md`): every "Add Video" submission failed with `500 Argument videoUrl is missing`, even though the file input visibly had a file selected (Mux preview rendered correctly) and Playwright confirmed `input.files.length === 1` right before submit. Network inspection showed the actual POST body was only 263 bytes — the `video` field never made it into the submitted `FormData` at all.

## Root Cause

In each affected file, the JSX looks like this (`AddVideo.tsx`, real code):

```tsx
<Input
  id="video"
  type="file"
  accept="video/*"
  placeholder="Enter Video"
  {...register("video", { required: "video is required !!!" })}
  onChange={(e) => handleChangeVideoUrl(e)}
/>
```

`{...register(...)}` spreads an object that includes react-hook-form's own `onChange` (the thing that actually updates RHF's internal form state for that field). The `onChange={(e) => handleChangeVideoUrl(e)}` prop written immediately after it is a **later key in the same object literal**, so by plain JS object/JSX prop semantics it **completely replaces** RHF's `onChange` — `handleChangeVideoUrl` (used only to build a local preview URL via `URL.createObjectURL`) is the only thing that ever runs. RHF's field value for `video`/`image` never updates, so `data.video`/`data.image` is always empty at submit time, regardless of what the user actually selected.

This is **not** a controlled/`Controller`-based field — it's RHF's uncontrolled `register()` pattern, which depends entirely on its own `onChange` firing to know the file was picked. (The two `Controller`-based file inputs in the codebase, `FileUploadController.tsx`/`FileUploadControllerPdfImg.tsx`, call `field.onChange(...)` correctly inside their own `handleFileChange` and are **not** affected — and have no current importers per `code-standards.md`'s dead-code notes anyway.)

## All 6 occurrences and their impact

| File | Field | Required? | Effect of the bug |
|---|---|---|---|
| `components/main/(Instructor)/ManageVideo/AddVideo.tsx` | `video` | **Yes** | **Hard failure.** Every real "Add Video" submission 500s (`Argument videoUrl is missing` — see `course.service.ts`... actually `video.service.ts::addVideo`). This is the one that surfaced the bug. |
| `components/main/(Instructor)/ManageVideo/UpdateVideo.tsx` | `video` | No (replace-if-provided) | Silent — attempting to replace a video's file on Update Video never actually uploads the new file (title-only updates still work, since the field is optional there). |
| `components/main/(Admin)/ManageCourse/AddCourse.tsx` | `image` (courseCover) | No | Silent — course is created successfully but `courseCover` stays `null` no matter what image is picked. |
| `components/main/(Admin)/ManageCourse/UpdateCourse.tsx` | `image` (courseCover) | No | Silent — same as above, on update. |
| `components/main/(Admin)/ManageInstructor/AddInstructor.tsx` | `image` (profilePicture) | No | Silent — instructor is created with no profile picture regardless of the picked file. |
| `components/main/Profile/UpdateProfile.tsx` | `image` (profilePicture) | No | Silent — profile avatar update never actually uploads the new picture. |

## Proposed Implementation

Same minimal fix shape in all 6 places: capture the single `register(...)` result in a local variable so it can be reused, then call its real `onChange` (and `ref`, where one is separately merged for a file-input ref) from inside the wrapping handler instead of letting the wrapping handler replace it.

```tsx
// before
<Input
  id="video"
  type="file"
  accept="video/*"
  {...register("video", { required: "video is required !!!" })}
  onChange={(e) => handleChangeVideoUrl(e)}
/>

// after
const videoField = register("video", { required: "video is required !!!" });
// …
<Input
  id="video"
  type="file"
  accept="video/*"
  {...videoField}
  onChange={(e) => {
    videoField.onChange(e);
    handleChangeVideoUrl(e);
  }}
/>
```

For the 4 files that also separately merge a custom `ref` (`AddCourse.tsx`, `UpdateCourse.tsx`, `AddInstructor.tsx`, `UpdateProfile.tsx` — all of which currently call `register("image")` a **second** time just to get `.ref`, e.g. `ref={(e) => { register("image").ref(e); imageInputRef.current = e; }}`), the same captured variable removes that redundant second `register()` call too:

```tsx
const imageField = register("image");
// …
<Input
  id="image"
  type="file"
  {...imageField}
  ref={(e) => {
    imageField.ref(e);
    imageInputRef.current = e;
  }}
  onChange={(e) => {
    imageField.onChange(e);
    changeImagePreviewUrl(e);
  }}
/>
```

No schema/type/backend changes needed — this only fixes which `onChange` actually reaches react-hook-form's internal state; the `data.video`/`data.image` shapes each `handle*` submit function already expects are unchanged.

## Dependencies

None.

## Verify When Done

- [x] `Add Video` (`AddVideo.tsx`) — submitting with a real file selected now succeeds. Verified live via Playwright against the real running backend: selecting the 22MB reference video and submitting produced a real `POST /video/add-video` that took ~20s (previously ~0.3s with an empty body) and returned `"Video added successfully !!!"`, with the created row's `videoUrl` pointing at a real Cloudinary asset (`res.cloudinary.com/.../course_videos/...mp4`) — confirmed via `GET /module/module-detail/:id`. This directly unblocked the seed-data run (`lms_server/context/specs/21-course-seed-data-import.md`), which was hard-blocked on this exact bug.
- [ ] `Add Course` (`AddCourse.tsx`) — a picked cover image is present as `courseCover` on the created course. Not yet spot-checked with a real image (the seed-data run doesn't set course covers), but same fix shape as the verified `AddVideo.tsx` case.
- [ ] `Update Course`, `Add Instructor`, `Update Profile`, `Update Video` — each still submits successfully with **no** file picked (unaffected happy path for the optional cases), and actually uploads when a file **is** picked. Not yet spot-checked individually.
- [x] `yarn lint` in `lms_client` shows no new errors/warnings introduced by any of the 6 touched files (all remaining messages in those files — unused `router` var, pre-existing `any` types, `set-state-in-effect`, `<img>` LCP warning — are on unrelated lines/pre-existing).
