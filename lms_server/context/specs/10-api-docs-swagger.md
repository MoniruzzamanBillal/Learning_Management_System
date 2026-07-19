# 10 — API documentation (Swagger/OpenAPI)

## Goal

Add interactive, always-current API documentation. Today the only API reference is a static Postman collection (`LMS_system.postman_collection.json` at repo root) that has to be manually kept in sync — nothing generated from the actual route/validation code.

## Current State

- No `swagger-jsdoc`/`swagger-ui-express` or any OpenAPI dependency in `package.json`.
- Routes are already consistently structured (`*.route.ts` per module, `authCheck(...)` + `validateRequest(zodSchema)` + controller), and Zod validation schemas already exist per module (`*.validation.ts`) — good raw material to document from, just not documented yet.

## Implementation

1. `yarn add swagger-jsdoc swagger-ui-express` + `yarn add -D @types/swagger-jsdoc @types/swagger-ui-express`.
2. `src/app/config/swagger.ts` — `swagger-jsdoc` config: `openapi: "3.0.0"`, `info` (title "MATS Academy API", version from `package.json`), `servers` (local + the deployed `lms-server-topaz.vercel.app` base URL), and `apis` globs pointing at `src/app/modules/**/*.route.ts`.
3. Add JSDoc `@openapi` block comments above each route definition describing method, path, auth requirement, request body shape (reference the Zod schema's shape informally, since `swagger-jsdoc` doesn't auto-derive from Zod), and response shape. Start with the modules already covered in the Postman collection as the source of truth for parameters, to avoid documentation drift from what's actually implemented — prioritize `auth`, `course`, `CourseEnrollment`, `ai` (most novel/recent) first; the rest can follow incrementally rather than blocking this spec on 100% route coverage.
4. Mount `swagger-ui-express` at `GET /api/docs` in `app.ts` (or `src/app/router/index.ts`), serving the generated spec.
5. Optionally export the generated JSON spec via a `GET /api/docs.json` route so it can be imported into Postman/Insomnia directly, replacing the manually-maintained static collection over time (not required to delete the existing Postman file in this pass).

## Dependencies

- New: `swagger-jsdoc`, `swagger-ui-express` (production, since the docs route is served at runtime); `@types/swagger-jsdoc`, `@types/swagger-ui-express` (dev).

## Verify When Done

- [ ] `yarn build` and `yarn lint` clean.
- [ ] `/api/docs` renders the Swagger UI and lists the documented routes with correct methods/auth badges.
- [ ] Spot-check 2-3 documented endpoints against the real request/response shape (e.g. via `curl` or the existing Postman collection) and confirm they match — no fabricated fields.
- [ ] Confirm `/api/docs` itself doesn't require auth (it's documentation, should be publicly viewable) but doesn't leak anything sensitive (no real API keys/secrets in example values).
