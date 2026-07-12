# 17 — Stream the AI study assistant's reply via SSE (stretch)

## Goal

Convert `POST /ai/study-assistant/:courseId` (spec `04-ai-study-assistant.md`) from a single blocking response to a streamed one, so the chat widget can render the assistant's reply token-by-token instead of waiting for the full response. Good "I understand async/streaming" talking point given the AI features are already a differentiator in this project.

## Current State

- `ai.service.ts::getStudyAssistantReply` calls `askOpenRouter([systemMessage, ...messages])` and awaits the full string reply before returning — `openRouterClient.ts`'s `askOpenRouter` is a single non-streaming call today (confirm exact signature/options at implementation time; it may need a new `stream: true` option added alongside the existing `jsonMode` option already used by the course-advisor endpoint).
- The frontend's `AiStudyAssistant.tsx` (`lms_client`) uses `usePost` (TanStack Query mutation) which expects one JSON response, not a stream — needs the paired frontend spec `14-ai-study-assistant-streaming-ui.md` to actually consume this.

## Implementation

1. Check whether OpenRouter's API (and the specific free-tier models in `FREE_MODELS`) supports `stream: true` — OpenRouter generally proxies OpenAI-compatible streaming (SSE chunks), but confirm per-model support before committing to this, since the fallback-across-free-models behavior in `askOpenRouter` may behave differently under streaming (a mid-stream failure on one model can't cleanly fall back to the next the way a pre-request failure can).
2. Add a streaming variant to `openRouterClient.ts` — e.g. `askOpenRouterStream(messages, options)` returning an async iterable/readable stream of text chunks, kept separate from the existing non-streaming `askOpenRouter` (still used by `review-summary` and `course-advisor`, which don't need streaming).
3. `ai.controller.ts::getStudyAssistantReply` — for this route specifically, set SSE response headers (`Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`), and write each chunk as an SSE `data: ...\n\n` frame as it arrives, ending with a final `data: [DONE]\n\n` sentinel. This changes the route's response contract from `catchAsync` + `sendResponse`'s standard JSON envelope to a raw streamed response — needs its own handling, not the shared `sendResponse` util.
4. Keep `authCheck`/`ValidateCourseAccess`/`validateRequest` middleware unchanged ahead of the controller — only the response-writing part of the controller changes.

## Dependencies

- No new packages if OpenRouter's Node SDK/fetch-based client already supports streaming responses natively (likely does, since it's OpenAI-compatible) — confirm at implementation time whether `openRouterClient.ts`'s current HTTP client (axios vs fetch) needs to change to support a streamed response body; `axios` can consume streams but `fetch`'s native `ReadableStream` handling is often simpler for SSE relay.

## Verify When Done

- [ ] `yarn build` and `yarn lint` clean.
- [ ] A test request to `POST /ai/study-assistant/:courseId` receives incremental SSE chunks rather than one blocking response, verified via `curl -N` or similar.
- [ ] Mid-stream failure (kill the upstream model call partway) degrades gracefully — client gets a clear error frame, not a hung connection.
- [ ] Confirm `ValidateCourseAccess`/`authCheck` still correctly reject unauthorized requests **before** the stream opens (not partway through).
