# 07 — Backend automated testing suite

## Goal

Replace the current no-op `yarn test` (`"test": "echo \"Error: no test specified\" && exit 1"`) with a real Jest-based suite: unit tests for business-logic-heavy service functions, plus a couple of integration tests through Supertest against an in-memory Mongo instance. This is the single biggest gap for a mid-level interview — there are zero automated tests anywhere in this repo today.

## Current State

- `lms_server/package.json` `test` script is a stub.
- No `*.test.ts`, `*.spec.ts`, `__tests__/`, or Jest config anywhere in `lms_server`.
- `src/app.ts` already exports the Express `app` separately from `src/server.ts`'s `mongoose.connect` + `app.listen()` call — this means `app` can be imported directly into a Supertest test without booting a real server or hitting the real `DATABASE_URL`, no refactor needed for testability.

## Implementation

1. `yarn add -D jest ts-jest @types/jest supertest @types/supertest mongodb-memory-server`.
2. `jest.config.ts` (or `jest.config.js`) at `lms_server/` root — `ts-jest` preset, `testEnvironment: "node"`, `testMatch` covering `src/**/*.test.ts`.
3. `src/test/setup.ts` — a Jest global setup/teardown using `mongodb-memory-server`: spin up an in-memory Mongo instance before the suite, `mongoose.connect` to it, drop/close after. Reused by every integration test via `jest.config.ts`'s `globalSetup`/`globalTeardown` or a `beforeAll`/`afterAll` helper module.
4. **Unit tests** (no DB needed, or a minimal in-memory doc set):
   - `src/app/modules/CourseEnrollment/CourseEnrollment.service.test.ts` — `courseProgressPercentage`: seed a small set of `VideoProgress` docs with known `videoStatus` values, assert the returned percentage.
   - `src/app/modules/auth/auth.service.test.ts` — `signInFromDb`: correct password succeeds and returns a token, wrong password throws `AppError` with 403, nonexistent email throws 404.
   - `src/app/modules/VideoModule/video.service.test.ts` — `addVideo`'s `videoOrder` assignment (regression test for the bug fixed in spec `01-fix-sequential-video-unlock-order.md`): add three videos, delete the middle one, add a fourth, assert no duplicate `videoOrder` within the module.
5. **Integration test** — `src/test/integration/enrollment-flow.test.ts` using `supertest(app)`: register a user → login → (as an admin/instructor test fixture) create + publish a course → enroll → mark first video watched → assert `courseProgressPercentage` increases and the second video's `videoStatus` flips to `unlocked`.
6. Update `lms_server/package.json`: `"test": "jest"`, optionally `"test:watch": "jest --watch"`.

## Dependencies

- New (dev only): `jest`, `ts-jest`, `@types/jest`, `supertest`, `@types/supertest`, `mongodb-memory-server`.
- No production dependency changes; no changes to any existing service/controller signatures — tests are additive only.

## Verify When Done

- [ ] `yarn test` runs and passes locally, replacing the stub.
- [ ] `yarn build` and `yarn lint` remain clean (new test files should pass lint — add `**/*.test.ts` to ESLint's include if the current config excludes test files).
- [ ] Intentionally break one tested function (e.g. flip a comparison operator in `courseProgressPercentage`) and confirm the corresponding test fails — proves the test actually exercises the real code path, not a trivial always-pass assertion.
- [ ] Confirm tests do not touch the real `DATABASE_URL` — run with network disabled / wrong `.env` and confirm the suite still passes using only the in-memory instance.
