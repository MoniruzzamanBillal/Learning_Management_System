# Code Standards

## TypeScript Conventions

- Domain types are plain `type` aliases prefixed with `T` (e.g. `TCourse`, `TUserRole`, `Tresponse<T>`) — not interfaces, not `I`-prefixed. Follow this existing convention for new domain types rather than introducing a different style.
- Use Enums-as-`const` objects for fixed value sets, matched with a derived type where needed (e.g. `UserRole = { admin, instructor, user } as const` in `user.constants.ts`, with `TUserRole` typed off it).
- `any` appears in a few places (e.g. `globalErrorHandler`'s `error: any`) with `eslint-disable` comments — acceptable at true error/boundary catch sites, not for domain data.

## File Organization & Naming

- One directory per resource under `src/app/modules/<name>/`, files named `<domain>.<layer>.ts`: `route`/`routes`, `controller`, `service`, `model`, `interface`, `validation`, `constants`. (Both `.route.ts` and `.routes.ts` appear in the existing codebase — check the module's existing file before creating a new one, don't introduce a third naming variant.)
- Cross-cutting code lives in `src/app/middleware/`, `src/app/util/`, `src/app/Error/`, `src/app/config/`, `src/app/interface/` (shared global interfaces), `src/app/builder/` (query builder).

## Request/Response Conventions

- Controllers are thin: call the service, then `sendResponse(res, { statusCode, success, message, data })`. Business logic and Mongoose queries belong in the service, not the controller.
- Errors are thrown as `new AppError(httpStatus.<CODE>, "message")` (see `src/app/modules/CourseEnrollment/CourseEnrollment.controller` pattern via `ValidateCourseAccess`) and caught by `globalErrorHandler` — don't `res.status(...).json(...)` an error directly from inside a service/controller.
- Use the `http-status` package's named constants (`httpStatus.UNAUTHORIZED`, etc.) instead of raw numbers.

## Validation

- Request bodies are validated with Zod schemas in `*.validation.ts`, applied via the `validateRequest` middleware in the route definition — validation lives in the route chain, not inside the controller/service.

## Linting

`lms_server/eslint.config.mjs` enforces: `no-unused-vars: error`, `no-unused-expressions: error`, `prefer-const: error`, `no-console: warn`, `no-undef: error`, plus `@eslint/js` recommended and `typescript-eslint` recommended rule sets. Run `yarn lint` (or `yarn lint:fix`) before considering backend work done.

## Testing

There is no automated test suite — `yarn test` is a stub (`echo "Error: no test specified" && exit 1`). "Verification" for backend changes means a successful `yarn build` + clean `yarn lint`, plus manual/Postman verification of the affected endpoint (see `LMS_system.postman_collection.json` at the repo root) — not a test run.
