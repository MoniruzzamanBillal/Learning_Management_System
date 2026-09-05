# 28. Video Notes — Frontend

## Goal

Let a student view, write, edit, and delete a personal note for whichever video they're currently watching on the enrolled-course player page, consuming the new `lms_server` `video-note` endpoints (`lms_server/context/specs/28-video-notes.md`). One note per video, plain text, soft-deletable — matches [`future-update-notes-quiz-assignment-plan.md`](../../../future-update-notes-quiz-assignment-plan.md)'s Feature 1. Pure consumer of the backend spec; has no standalone value until that's implemented.

## Design

**New component:** `VideoNotesPanel.tsx` inside `components/main/MyCourses/EnrolledCourseDetail/`, sibling to `ModuleShowData.tsx`.

**Needs the current video's `id`, which today's state doesn't carry.** `EnrollCourseDetail.tsx`'s `videoDataObj` state currently holds only `{ title, videoUrl }` (see its `useState<{ title: string; videoUrl: string } | null>`), so it needs widening:

- `EnrollCourseDetail.tsx` — `videoDataObj` becomes `{ id: string; title: string; videoUrl: string } | null`.
- `ModuleShowData.tsx::handleGetVideo` — the `GET /enroll/my-enrolled-course-videos/:videoId` response (`result?.data`) already has the video's own `id` available (same object `title`/`videoUrl` are already read from) — add `id: result?.data?.id` to the `videoPayload` object it builds before calling `setVideoDataObj`.

**Where it renders:** `VideoNotesPanel.tsx` mounts in `EnrollCourseDetail.tsx`'s `leftVideoSection`, below the video player (`content`), only once `videoDataObj` is set (a video is currently open) — passed `courseId={id}` and `videoId={videoDataObj.id}`.

**Layout:** a shadcn `Textarea` seeded from the fetched note's `content` (empty if `data` is `null`), a "Save Note" button, and a "Delete" button shown only when a note currently exists. Plain `Textarea`, not `ControlledTipTapTextEditor` — matches the backend spec's plain-text design; `ControlledTipTapTextEditor` stays admin-authoring-only for now.

**Data flow (`hooks/useApi.ts`):**
- `useFetchData<TVideoNote | null>([`video-note-${courseId}-${videoId}`], `/video-note/${courseId}/${videoId}`, { enabled: !!courseId && !!videoId })` — a fresh query key per video, so switching videos naturally refetches instead of showing stale content.
- `useUpdateData([[`video-note-${courseId}-${videoId}`]])` (PUT) for save — `mutateAsync({ url: `/video-note/${courseId}/${videoId}`, payload: { content } })`.
- `useDeleteData([[`video-note-${courseId}-${videoId}`]])` for delete — `mutateAsync({ url: `/video-note/${courseId}/${videoId}` })`.
- The `Textarea` is keyed `key={videoId}` (uncontrolled, `defaultValue={note?.content ?? ""}`) so React remounts it fresh on every video switch — avoids needing a `set-state-in-effect` pattern (the kind `AddCourse.tsx`/`UpdateCourse.tsx` already carry a known lint warning for) just to reset the textarea's contents when the fetched note changes.

**Toast pattern:** new `functions/videoNote.functions.ts` — `saveVideoNoteFunction`/`deleteVideoNoteFunction`, following `functions/video.functions.ts`'s exact shape (`toast.loading` → `mutateAsync` → `toast.success`/`toast.error`, same-id toast). No `navigate()` call — this is an in-place panel, nothing to redirect to on success.

**New type**, `type/VideoNote.type.ts`:
```ts
export type TVideoNote = {
  id: string;
  userId: string;
  courseId: string;
  moduleId: string;
  videoId: string;
  content: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};
```

## Implementation

1. `EnrollCourseDetail.tsx` — widen `videoDataObj`'s type to include `id: string`; render `<VideoNotesPanel courseId={id} videoId={videoDataObj.id} />` inside `leftVideoSection`, below the existing `{content}` block, gated on `videoDataObj` being set.
2. `ModuleShowData.tsx::handleGetVideo` — add `id: result?.data?.id` to the `videoPayload` object passed to `setVideoDataObj`.
3. New `type/VideoNote.type.ts` (above).
4. New `functions/videoNote.functions.ts` (save/delete toast wrappers).
5. New `VideoNotesPanel.tsx` — fetch via `useFetchData`, `Textarea` (keyed per video), Save/Delete buttons, an empty state ("No note yet — write one while you watch") when the fetched note is `null`.
6. Manual click-through once built: open a video with no existing note → empty state, not an error. Save a note, reload the page → note persists (confirms a real API round-trip, not just local state). Switch to a different video in the same module → panel shows that video's own note (or empty state), not the previous video's content. Edit and re-save → same note updates in place, no duplicate ever appears. Delete → empty state returns. Save again after delete → works (exercises the backend's upsert-reactivation path).

## Dependencies

- Requires `lms_server` spec 28 (the `video-note` endpoints) implemented and running — this spec has no independent value without it.

## Verify-when-done

- [ ] `tsc --noEmit` / `yarn lint` clean.
- [ ] Opening a video with no existing note shows the empty state, not an error.
- [ ] Saving persists across a full page reload.
- [ ] Switching between two different videos in the same module shows each video's own note independently — no cross-video bleed.
- [ ] Editing and re-saving updates the same note in place — never a duplicate for one video.
- [ ] Delete clears the note and shows the empty state again; saving a new note afterward works (exercises the backend's upsert-reactivation path).
- [ ] A second logged-in user's notes never appear under the first user's account (spot-check with two test accounts if convenient).

This is a planning document — no component or type file has been created yet.
