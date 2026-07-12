# Unit 06: In-Course AI Study Assistant (chat widget)

## Goal

A floating chat widget on the enrolled-course video page, so a student can ask syllabus-level questions ("what's in module 3?", "how much do I have left?") without leaving the video. Depends on the backend endpoint from `lms_server/context/specs/04-ai-study-assistant.md` (`POST /api/ai/study-assistant/:courseId`, requires auth + enrollment).

## Scope

| File | Role |
| --- | --- |
| `components/main/publicPage/MyCourses/EnrolledCourseDetail/EnrollCourseDetail.tsx` | Existing page component (confirmed by reading it). Receives `id` (the courseId) as a prop already, and renders `ModuleShowData` + the video player inside `EnrolledCourseDetailContainer`. The widget mounts here as a sibling, using the `id` prop directly — **not** inside `ModuleShowData.tsx`, since `id`/courseId is already available at this level. |
| `components/main/publicPage/MyCourses/EnrolledCourseDetail/AiStudyAssistant.tsx` (new) | The floating chat widget itself. |
| `types/ai.types.ts` | Add `TChatMessage`, `TStudyAssistantResponse` (same file started in `04-ai-review-summary-ui.md`). |

## Current State

`EnrollCourseDetail.tsx` has no chat/assistant surface at all — students can only navigate modules/videos via `ModuleShowData`.

## Design

1. `AiStudyAssistant.tsx` takes a `courseId: string` prop. Internal state: `messages: TChatMessage[]` (local `useState`, starts empty — no persistence, matches the backend's stateless design), an input field, and an open/closed boolean for the floating-widget toggle.
2. Floating trigger: a fixed-position round button (bottom-right, similar positioning convention to typical chat widgets — check if any `fixed`/`z-50` positioned element already exists elsewhere in the codebase to match z-index conventions before picking one) that opens/closes a small chat panel.
3. On send: append `{ role: "user", content: <input> }` to local `messages`, clear the input, call `usePost()` (`hooks/useApi.ts`) with `{ url: /ai/study-assistant/${courseId}, payload: { messages: [...messages, newUserMessage] } }`, and on success append `{ role: "assistant", content: result.data.reply }` to `messages`.
4. Render the running `messages` list inside the panel (simple bubble list — user messages right-aligned, assistant left-aligned, matching whatever the codebase's existing color tokens are for primary vs. neutral surfaces per `context/ui-context.md`).
5. Loading state while a reply is pending: disable the input/send button, show a lightweight "thinking…" indicator as the last bubble.
6. Since `ValidateCourseAccess` on the backend already 403s a non-enrolled request, and this component is only ever mounted on the already-access-controlled `EnrollCourseDetail.tsx` page, no separate client-side enrollment check is needed here.

## Implementation Notes

- Add to `types/ai.types.ts`:
  ```ts
  export type TChatMessage = { role: "user" | "assistant"; content: string };
  export type TStudyAssistantResponse = { reply: string };
  ```
- No `functions/*.functions.ts` orchestration — this isn't a create/update/delete-then-navigate flow, it's a running local chat state updated in place, so a direct `usePost` mutation with `onSuccess` state update in the component is the right level of abstraction (matches `handleGetVideo`'s inline `apiGet` + local state pattern already used in `ModuleShowData.tsx`, just via the hook instead of raw `apiGet`).
- Keep the widget mounted even while a video is playing — it's a page-level assistant, not scoped to the currently-open video.

## Verify When Done

- [ ] Widget opens/closes via the floating trigger without disrupting the video player or module list layout.
- [ ] Asking about a real module/video in the enrolled course returns an answer matching the actual syllabus.
- [ ] Asking what a specific video "says" gets an honest "I don't have access to video content" style answer (per the backend spec's system prompt), not a hallucinated one.
- [ ] Conversation history persists across multiple turns within the same page visit (multi-turn context works).
- [ ] `yarn lint` and `yarn build` pass cleanly.
