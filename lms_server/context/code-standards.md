# Code Standards

## TypeScript Conventions

- Domain types are plain `type` aliases prefixed with `T` (e.g. `TCourse`, `TUserRole`, `Tresponse<T>`) — not interfaces, not `I`-prefixed. Follow this existing convention for new domain types rather than introducing a different style. Most `*.interface.ts` files now just re-export the generated Prisma type under that `T*` alias (e.g. `export type TUser = User;` from `@prisma/client`) rather than hand-declaring the shape — prefer extending/narrowing the Prisma type over redefining it from scratch.
- Use Enums-as-`const` objects for fixed value sets, matched with a derived type where needed (e.g. `UserRole = { admin, instructor, user } as const` in `user.constants.ts`, with `TUserRole` typed off it). These string values are kept in sync with the corresponding `enum` in `prisma/schema.prisma` — if you add a new enum value in one, add it in the other.
- `any` appears in a few places (e.g. `globalErrorHandler`'s `error: any`, Multer's `file: any` on upload-handling service functions) with `eslint-disable` comments — acceptable at true error/boundary catch sites, not for domain data.

## File Organization & Naming

- One directory per resource under `src/app/modules/<name>/`, files named `<domain>.<layer>.ts`: `route`/`routes`, `controller`, `service`, `interface`, `validation`, `constants`. (Both `.route.ts` and `.routes.ts` appear in the existing codebase — check the module's existing file before creating a new one, don't introduce a third naming variant.) There is no more `*.model.ts` per module — the entire schema lives in the single root-level `prisma/schema.prisma`; don't reintroduce a per-module Mongoose-style model file.
- Cross-cutting code lives in `src/app/middleware/`, `src/app/util/` (including `prisma.ts`, the Prisma Client singleton), `src/app/Error/`, `src/app/config/`, `src/app/interface/` (shared global interfaces), `src/app/builder/` (query builder — currently unused dead code, predates the Prisma migration, left as-is).

## Request/Response Conventions

- Controllers are thin: call the service, then `sendResponse(res, { statusCode, success, message, data })`. Business logic and Prisma queries belong in the service, not the controller.
- Errors are thrown as `new AppError(httpStatus.<CODE>, "message")` (see `src/app/modules/CourseEnrollment/CourseEnrollment.controller` pattern via `ValidateCourseAccess`) and caught by `globalErrorHandler` — don't `res.status(...).json(...)` an error directly from inside a service/controller. Where a new DB-level constraint can throw a Prisma error a user could plausibly trigger (e.g. a unique-constraint violation), catch `Prisma.PrismaClientKnownRequestError` at that call site and rethrow a friendly `AppError` rather than letting the raw Prisma error/stack reach the client — see `review.service.ts::addReview`'s `P2002` handling for the pattern. `globalErrorHandler` does not normalize Prisma errors generically.
- Use the `http-status` package's named constants (`httpStatus.UNAUTHORIZED`, etc.) instead of raw numbers.

## Validation

- Request bodies are validated with Zod schemas in `*.validation.ts`, applied via the `validateRequest` middleware in the route definition — validation lives in the route chain, not inside the controller/service.
- Any ID field is validated with `z.string().uuid({ message: "Invalid id !!!" })`, not a Mongo-`ObjectId` check — `course.validation.ts`, `module.validation.ts`, and `videol.validation.ts` all follow this.

## Database (Prisma)

- Import the shared singleton — `import prisma from "../../util/prisma"` — never instantiate `new PrismaClient()` in a module.
- Explicit soft-delete filtering is required at every call site for `User`, `Module`, `Video`, and `Review` (`isDeleted: false` in `where`) — there is no automatic query-hook equivalent to Mongoose's `pre("find")`. `CourseEnrollment`/`Payment` are not auto-filtered by convention (they never were, even in Mongo).
- Use `findFirst`, not `findUnique`, whenever a lookup combines a unique field (like `id`) with any other `where` condition (e.g. `isDeleted: false`) — `findUnique` only accepts the unique field(s).
- Multi-step writes that must be atomic use `prisma.$transaction(async (tx) => { ... })` (interactive form) with every operation inside the callback going through `tx`, not `prisma` — see `CourseEnrollment.service.ts::enrollInCourse` or `VideoModule/video.service.ts::addVideo`.
- Day-bucketed aggregations (grouping by calendar day) aren't expressible in Prisma's query builder — use `prisma.$queryRaw` with Postgres `date_trunc('day', "createdAt")`, always via the tagged-template form (parameterized automatically), never string concatenation — see `course.service.ts::adminStatistics`.

## Linting

`lms_server/eslint.config.mjs` enforces: `no-unused-vars: error`, `no-unused-expressions: error`, `prefer-const: error`, `no-console: warn`, `no-undef: error`, plus `@eslint/js` recommended and `typescript-eslint` recommended rule sets. Run `yarn lint` (or `yarn lint:fix`) before considering backend work done.

## Testing

There is no automated test suite — `yarn test` is a stub (`echo "Error: no test specified" && exit 1`). "Verification" for backend changes means a successful `yarn build` + clean `yarn lint`, plus manual/Postman verification of the affected endpoint (see `LMS_system.postman_collection.json` at the repo root) — not a test run.
