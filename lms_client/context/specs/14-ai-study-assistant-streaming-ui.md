# 14 — Consume streamed study assistant replies (stretch)

## Goal

Update `AiStudyAssistant.tsx` (built in spec `06-ai-study-assistant-ui.md`) to render the assistant's reply token-by-token as it streams in, instead of waiting for the full blocking response. Depends entirely on backend spec `17-ai-study-assistant-streaming.md` converting `POST /ai/study-assistant/:courseId` to SSE.

## Current State

- `AiStudyAssistant.tsx` currently uses `usePost` (`hooks/useApi.ts`, a TanStack Query mutation via `apiPost`/`axiosInstance`) — a single request/response cycle. On success it appends one complete `{ role: "assistant", content: result.data.reply }` message. The "Thinking…" bubble shown during `isPending` is the entire loading experience today.
- TanStack Query's `useMutation` (what `usePost` wraps) is not designed for streamed responses — this spec cannot reuse `usePost` as-is for the study-assistant call specifically; other AI/data calls in the app are unaffected and keep using `usePost` normally.

## Implementation

1. For the study-assistant send action specifically, replace the `usePost` call with a raw `fetch` (or `EventSource`, though `EventSource` doesn't support custom `Authorization` headers or `POST` bodies natively, so a manual `fetch` with `ReadableStream` reading is the more likely fit given this endpoint needs `POST` + an auth header) against `${NEXT_PUBLIC_API_BASE_URL}/ai/study-assistant/${courseId}`, reading the `Authorization: Bearer <accessToken>` the same way `utils/axiosInstance.ts`'s interceptor does today (reuse `utils/GetCookies.ts`).
2. Parse incoming SSE `data: ...` frames as they arrive, appending each chunk to a local "streaming" assistant message's `content` (update React state per chunk so the bubble grows live), until the `data: [DONE]` sentinel closes the stream.
3. Replace the current "Thinking…" static bubble with the live-growing assistant bubble itself once the first chunk arrives (keep a brief "Thinking…" state only for the gap before the first chunk lands).
4. Handle stream errors (network drop, backend error frame) by finalizing whatever partial content has been received and appending a visible "message may be incomplete" note, rather than losing the partial response.
5. Everything else about `AiStudyAssistant.tsx` (open/close toggle, message list rendering, input handling) stays unchanged — this spec only touches the send/receive mechanism for this one component.

## Dependencies

- No new npm packages — native `fetch` + `ReadableStream`/`TextDecoder` is sufficient, no SSE client library needed for a single-consumer case like this.

## Verify When Done

- [ ] Sending a message shows the assistant's reply growing incrementally, not appearing all at once.
- [ ] Multi-turn conversation (several exchanges in one session) still works correctly with the streaming mechanism.
- [ ] A simulated network interruption mid-stream leaves a sensible partial message rather than a broken/frozen UI.
- [ ] `yarn lint` and `yarn build` pass cleanly.
