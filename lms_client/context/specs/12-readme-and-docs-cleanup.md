# 12 — README and docs cleanup

## Goal

The root `README.md` is actually solid (project objectives, feature breakdown by role, tech stack, 8 screenshots, test credentials, install instructions, live demo link) — but `lms_client/README.md` is still the **unedited default `create-next-app` boilerplate** (generic "Getting Started"/"Learn More"/"Deploy on Vercel" content, no project-specific information at all), and the root README has no architecture diagram despite `lms_server/context/architecture.md` already containing all the content needed to build one.

## Current State

- Root `README.md` — good, keep as the primary entry point. No architecture overview/diagram section currently.
- `lms_client/README.md` — 36 lines of default Next.js boilerplate, zero project-specific content.
- `lms_server/README.md` — doesn't exist at all.
- `lms_server/context/architecture.md` and `lms_client/context/architecture.md` already document the stack/module structure in prose — good source material, not a from-scratch writing task.

## Implementation

1. **`lms_client/README.md`** — replace entirely with project-specific content: what this app is (the frontend for MATS Academy LMS), link back to the root README for the full picture, quick local-dev commands (`yarn dev`/`yarn build`/`yarn lint`, already documented in the root `CLAUDE.md`), and a one-line pointer to `context/` docs for anyone doing deeper work.
2. **`lms_server/README.md`** — create with the same shape: what this service is, quick commands, pointer to `context/`.
3. **Root `README.md`** — add a short "Architecture" section: a simple diagram (ASCII, or a `mermaid` code block if GitHub's renderer support is confirmed) showing client ↔ server ↔ MongoDB, plus the SSLCOMMERZ/Cloudinary/OpenRouter external integrations, adapted from `lms_server/context/architecture.md`'s existing prose rather than reinventing it.
4. Do not duplicate the full `context/` docs into the README — link to them instead, keeping the README as an entry point/overview rather than a second copy of the living documentation.

## Dependencies

- None — documentation-only change.

## Verify When Done

- [ ] `lms_client/README.md` and `lms_server/README.md` both contain real, accurate, project-specific content — no leftover boilerplate phrases (e.g. "This is a Next.js project bootstrapped with...").
- [ ] Root `README.md`'s new architecture section accurately reflects `architecture.md` (spot-check a reviewer unfamiliar with the repo can follow the diagram against the actual folder structure).
- [ ] All links between the READMEs and `context/` docs resolve correctly (no broken relative links).
