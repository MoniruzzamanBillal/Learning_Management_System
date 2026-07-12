# 16 — Docker-based local development (stretch)

## Goal

One-command local dev setup — `docker compose up` boots Mongo + both apps, instead of requiring a local Mongo install and manually running `yarn dev` in two terminals. Nice "easy onboarding" signal for a reviewer who clones the repo.

## Current State

- No `Dockerfile` anywhere in the repo (root, `lms_server/`, or `lms_client/`).
- Local dev today requires: a running Mongo instance (local or Atlas, via `DATABASE_URL` in `.env`), `cd lms_server && yarn install && yarn dev`, and separately `cd lms_client && yarn install && yarn dev`.

## Implementation

1. `lms_server/Dockerfile` — multi-stage: build stage runs `yarn install` + `yarn build` (produces `dist/`), runtime stage copies `dist/` + `node_modules` (production-only via `yarn install --production` in the runtime stage, or copy from build stage) and runs `node dist/server.js` (matches the existing `start:prod` script).
2. `lms_client/Dockerfile` — Next.js standard multi-stage build (`next build`, then `next start` in a slim runtime image); confirm whether `next.config.ts` needs `output: "standalone"` for a minimal final image.
3. Root `docker-compose.yml` — three services: `mongo` (official `mongo` image, named volume for persistence), `server` (build from `lms_server/Dockerfile`, env from `lms_server/.env` or compose `environment:` block, depends_on `mongo`), `client` (build from `lms_client/Dockerfile`, `NEXT_PUBLIC_API_BASE_URL` pointing at the `server` service, depends_on `server`).
4. Add a `.dockerignore` per app (exclude `node_modules`, `dist`/`.next`, `.git`).
5. Document in the root `README.md` (see `12-readme-and-docs-cleanup.md`) as an alternative to the existing manual setup instructions — don't replace the existing instructions, add Docker as an option.

## Dependencies

- No new npm packages — pure Docker/Compose configuration.
- This is genuinely optional relative to everything else in this manifest — lower interview signal than testing/CI/security, mostly a convenience/polish item. Do last if at all.

## Verify When Done

- [ ] `docker compose up` from repo root boots Mongo + both apps with no manual steps beyond providing `.env` values.
- [ ] `lms_client` can reach `lms_server` inside the Compose network (correct service-name-based URL, not `localhost`).
- [ ] A fresh clone with only Docker installed (no local Node/Mongo) can get the app running end-to-end following just the README's Docker instructions.
