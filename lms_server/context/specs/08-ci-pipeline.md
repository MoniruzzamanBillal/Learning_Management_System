# 08 — CI pipeline (GitHub Actions)

## Goal

Add automated lint/build/test checks that run on every push/PR, for both `lms_server` and `lms_client`. This is arguably higher-signal than the tests themselves for a resume review — a reviewer sees green checks on the PR history without opening a single file.

## Current State

- No `.github/workflows/` directory anywhere in the repo. No CI of any kind currently runs.
- Both apps are independent (`lms_server/package.json`, `lms_client/package.json`), no root workspace tooling — each needs its own `cd`-then-install-then-run step.
- Depends on `07-backend-testing-suite.md` and `07-frontend-testing-suite.md` (the frontend spec of the same number, in `lms_client/context/specs/`) for there to be a meaningful `test` script to run in each app; the lint/build jobs can be added immediately regardless of whether the test specs are done yet.

## Implementation

1. Create `.github/workflows/ci.yml` at the repo root with two jobs, `server` and `client`, running in parallel:
   - **`server`** job: `working-directory: lms_server`; steps: checkout, `actions/setup-node@v4` (Node version matching `engines`/local dev, e.g. 20.x), `yarn install --frozen-lockfile`, `yarn lint`, `yarn build`, `yarn test` (once `07-backend-testing-suite.md` lands; until then, `yarn lint && yarn build` only).
   - **`client`** job: same shape, `working-directory: lms_client`, `yarn lint`, `yarn build`, `yarn test` (once the frontend testing spec lands).
2. Trigger on `pull_request` (all branches) and `push` to `master` and `dev/*`.
3. Cache `node_modules`/yarn cache per app via `actions/setup-node@v4`'s built-in `cache: "yarn"` + `cache-dependency-path` pointing at each app's `yarn.lock`, to keep runs fast.
4. Do not add a deploy step — Vercel already auto-deploys both apps on push per the existing setup (`lms-server-topaz.vercel.app`, `devmats.vercel.app`); this workflow is check-only, not a deployment pipeline.
5. Do not make `yarn test` a hard requirement in branch protection as part of this spec — that's a repo-settings change outside version-controlled files, and should only happen after real test coverage exists (leave a note for the user to enable it manually once ready).

## Dependencies

- No new packages — this is a workflow YAML file only, using GitHub-hosted `actions/checkout@v4` and `actions/setup-node@v4`.

## Verify When Done

- [ ] Open a throwaway PR (or push a small commit to a branch) and confirm both `server` and `client` jobs run and report status in the PR checks UI.
- [ ] Intentionally break lint (add an unused var) in one app, confirm only that app's job fails, the other stays green.
- [ ] Confirm the workflow does not attempt to run against the real `DATABASE_URL`/production secrets — it should only need `yarn lint`/`yarn build`/`yarn test` which (per `07-backend-testing-suite.md`) use an in-memory Mongo, not the live database.
