# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

MATS Academy — a full-stack LMS with three roles (admin, instructor, user/student). Two independent apps in one repo, each with its own `package.json`, deployed separately to Vercel:

- `lms_server/` — Express + TypeScript + Prisma/PostgreSQL REST API
- `lms_client/` — Next.js 16 (App Router) + React 19 + TypeScript frontend

There is no root-level package.json or workspace tooling — always `cd` into the relevant app directory before running commands.

### MongoDB → PostgreSQL/Prisma migration (backend complete)

The backend was migrated from MongoDB/Mongoose to PostgreSQL + Prisma per [`lms_server/context/specs/19-postgres-prisma-migration.md`](lms_server/context/specs/19-postgres-prisma-migration.md) (the original plan at `PostgressMigrationPlan/backend-migration-plan.md`/`frontend-migration-plan.md` at the repo root is now superseded by that spec). It was a clean schema rebuild with no data ETL, done as a single big-bang cutover (no dual-DB phase) — every backend module now reads/writes exclusively through `prisma` (`lms_server/src/app/util/prisma.ts`), and `mongoose.connect` was removed from `src/server.ts` entirely. IDs are Prisma `id` (UUID, Postgres-native `gen_random_uuid()`), not Mongo `_id`. Soft-delete filtering (`isDeleted: false`) is added explicitly per query only on the models that had the old Mongoose hook (`User`, `Module`, `Video`, `Review` — not `CourseEnrollment`/`Payment`). **The frontend migration is also complete** (`lms_client/context/specs/17-postgres-id-migration.md`) — a compiler-driven `_id` → `id` sweep across 102 occurrences in 43 files, plus a follow-on fix for several FK field names that changed as an intentional side effect of the backend's Prisma schema (e.g. old Mongoose `user`/`course`/`Payment`/`module`/`instructor` scalar refs are now `userId`/`courseId`/`paymentId`/`moduleId`/`instructorId`), which the original frontend plan hadn't anticipated. `id` (not `_id`) is now the entity ID field name everywhere in this codebase, frontend and backend alike.

### Living documentation in `context/`

Both `lms_server/context/` and `lms_client/context/` contain actively-maintained docs that are more detailed than this file and take precedence for their app:

- `project-overview.md` — goals, user flows, feature inventory.
- `architecture.md` — stack table, system boundaries, invariants, and known gaps (e.g. `auth.service.ts::createInstructor` hardcodes a default instructor password — deliberately kept as-is, don't "fix" it without asking first).
- `code-standards.md` — naming/typing conventions and the verification checklist for "done."
- `ai-workflow-rules.md` — scoping rules for AI-assisted changes (no speculative refactors, protected files, when to stop and ask).
- `progress-tracker.md` — current phase, what's implemented, recent activity, open questions; **update this after every meaningful change**.
- `specs/NN-<feature-name>.md` — per-feature Goal/Design/Implementation/Verify docs; check here before implementing anything that might already be scoped, and mark spec status in `progress-tracker.md` when starting/finishing one.
- `lms_client/context/` additionally has `ui-context.md` — theme, colors, typography, and component conventions for the frontend.

Read the relevant app's `context/` docs before making non-trivial changes, and keep them in sync (per `ai-workflow-rules.md`) when a change alters something they document. Each app also has an `AGENTS.md` pointing at this same `context/` reading order, for tools that read that file instead.

The repo-root `future-update-notes-quiz-assignment-plan.md` is a pre-implementation design doc for three features — Video Notes, Module Quiz, Assignment. The first two are now implemented (`lms_server/context/specs/28-video-notes.md`, `29-module-quiz.md`, `30-quiz-recreate-after-delete-crash.md`, and the `VideoNote`/`Quiz`/`QuizQuestion`/`QuizOption`/`QuizAttempt` models below) — treat that doc as historical for those two. Assignment (its Feature 3) is not implemented; no `Assignment` model exists in `schema.prisma` yet, so that section is still a live proposal if picked up.

## Commands

### lms_server (run from `lms_server/`)

- `yarn dev` — start dev server with ts-node-dev (auto-restart)
- `yarn build` — compile TypeScript to `dist/`
- `yarn start:prod` — run compiled `dist/server.js`
- `yarn lint` / `yarn lint:fix` — ESLint over `src`
- `yarn prettier:fix` — format `src`
- No test suite is configured (`yarn test` is a stub that exits 1).
- Prisma has no `package.json` scripts — invoke via `npx` from `lms_server/`: `npx prisma migrate dev --name <name>` (create + apply a migration against your local DB), `npx prisma generate` (regenerate the client — also runs automatically via `postinstall`), `npx prisma studio` (GUI for inspecting/editing data). Avoid `npx prisma migrate reset` — it replays all migrations and will drop the hand-added partial unique index described below unless it's re-added.

### lms_client (run from `lms_client/`)

- `yarn dev` — Next.js dev server (http://localhost:3000)
- `yarn build` — production build
- `yarn start` — serve production build
- `yarn lint` — ESLint (flat config, `eslint-config-next`)
- No test suite is configured.

## Architecture

### Backend (`lms_server/src`)

Express app entry is `src/server.ts` (connects the Prisma singleton via `prisma.$connect()`, then `app.listen`); the Express app itself is assembled in `src/app.ts` (CORS allowlist, JSON/body-parser, morgan, cookie-parser, mounts `MainRouter` at `/api`, global error handler, 404 handler last).

Everything domain-specific lives under `src/app/modules/<name>/`, one module per REST resource: `auth`, `user`, `course`, `courseModule`, `VideoModule`, `VideoNote`, `VideoProgress`, `CourseEnrollment`, `payment`, `SSL`, `review`, `quiz`, `ai`, `errorLog`. Each module follows the same file split — **not every module has every file**, but the naming is consistent:

- `*.route.ts` / `*.routes.ts` — Express router, wires middleware + controller
- `*.controller.ts` — thin, wraps service calls with `catchAsync` + `sendResponse`
- `*.service.ts` — business logic, Prisma queries (`import prisma from "../../util/prisma"`)
- `*.interface.ts` — TypeScript types for the domain object; most just re-export the generated Prisma type (e.g. `export type TUser = User;` from the generated client — see the Prisma 7 note below, not `@prisma/client` directly)
- `*.validation.ts` — Zod schemas, used via `validateRequest` middleware; any ID field is `z.string().uuid(...)`
- `*.constants.ts` — enums/constants (e.g. `user/user.constants.ts` defines `UserRole = { admin, instructor, user }`, kept in sync with the matching `enum` in `prisma/schema.prisma`)

There is no more per-module `*.model.ts` — the entire schema lives in one root-level `lms_server/prisma/schema.prisma` (14 models plus a `CourseInstructor` join model, 3 enums), applied via Prisma Migrate. One constraint isn't expressible in the schema DSL and so isn't visible there: `Video`'s real uniqueness guarantee (`UNIQUE ("moduleId","videoOrder") WHERE "isDeleted" = false`) is a hand-added `CREATE UNIQUE INDEX` statement inside `prisma/migrations/20260817100918_init/migration.sql`. It survives normal `migrate dev` runs but must be manually reapplied if that migration is ever reset/replayed.

**Prisma 7 driver-adapter setup:** `schema.prisma`'s `datasource` block has no `url` — the connection string lives in two separate places instead. `prisma.config.ts` (repo root of `lms_server/`, next to `package.json`) supplies it to the CLI (`migrate`/`studio`/`db`) via `env("DATABASE_URL")`. `src/app/util/prisma.ts` supplies it to the runtime client by wrapping `config.database_url` in a `PrismaPg` adapter (`@prisma/adapter-pg` + `pg`) and passing `{ adapter }` to `new PrismaClient(...)`. The generator (`prisma-client`, not the legacy `prisma-client-js`) outputs to `src/generated/prisma/` — gitignored, regenerated via `postinstall`/`yarn build` (`prisma generate && tsc`), never edited by hand — with `moduleFormat = "cjs"` so it matches this project's existing CommonJS/`ts-node-dev` setup rather than forcing an ESM migration. Anything importing Prisma types/the `Prisma` namespace imports from that generated path (`../../../generated/prisma/client` from a module's `*.interface.ts`/`*.service.ts`, one directory shallower — `../../generated/prisma/client` — from `util/prisma.ts`), not from `@prisma/client` itself.

All module routers are aggregated in `src/app/router/index.ts` and mounted under their own path prefix (e.g. `/api/course`, `/api/enroll`, `/api/payment`).

Cross-cutting pieces:

- `src/app/middleware/authCheck.ts` — `authCheck(...requiredRoles)` verifies the JWT from the `Authorization: Bearer <token>` header and attaches `req.user`; pass no roles to just require auth, or specific `UserRole` values to restrict.
- `src/app/middleware/ValidateCourseAccess.ts` — checks the user has both a `CourseEnrollment` and a completed `payment` record for a course before allowing access to protected course content.
- `src/app/middleware/validateRequest.ts` — runs a Zod schema against `req.body`.
- `src/app/middleware/rateLimiter.ts` — `aiLimiter` (10 req/10 min per IP, on both AI endpoints) and `loginLimiter` (10 req/15 min per IP, on `/auth/login`), built on `express-rate-limit`; always the first middleware in its route's chain so rate-limited requests never reach DB/LLM work. In-memory store, per-instance only.
- `src/app/middleware/globalErrorHandler.ts` — normalizes `ZodError`, duplicate-key, and `AppError` into a consistent JSON error shape; must be registered after routes, before the 404 handler. Its Mongoose `ValidationError`/`CastError` branches are now dead code post-migration (nothing can throw them anymore) but were left in place as out of scope for the Postgres migration; Prisma errors are **not** normalized generically here — handle a specific one (e.g. a unique-constraint violation) at its call site if a friendly message matters, per `review.service.ts::addReview`'s `Prisma.PrismaClientKnownRequestError`/`P2002` handling.
- `src/app/middleware/verifyCronSecret.ts` — checks `Authorization: Bearer <CRON_SECRET>` against `config.cron_secret`; gates `GET /error-log/cleanup` (Vercel Cron invocation only, not a user-JWT flow).
- `helmet()` is applied first in `src/app.ts`'s middleware stack (before `cors`) for baseline security headers.
- `src/app/util/catchAsync.ts` — wraps async route handlers so thrown errors reach `next(error)`.
- `src/app/util/sendResponse.ts` — standard `{ success, message, data, token? }` response envelope.
- `src/app/util/prisma.ts` — the Prisma Client singleton (serverless-safe `globalThis` pattern outside production), constructed with a `PrismaPg` driver adapter per the Prisma 7 note above; import this rather than instantiating `new PrismaClient()`.
- `src/app/util/SendImageCloudinary.ts` — Multer + Cloudinary storage config (`upload.single(...)`) used for course covers, etc.
- `src/app/util/VideoUpload.ts` — video upload handling, paired with the `VideoModule`/`VideoProgress` modules for course content and per-user watch progress.
- `src/app/config/index.ts` — single place all `process.env` values are read (`DATABASE_URL` — same env var name Mongoose used, its value was repurposed from a Mongo URI to a Postgres connection string in place, not renamed — JWT secret, Cloudinary, nodemailer, SSLCOMMERZ store credentials/URLs, `CRON_SECRET`); reference this instead of `process.env` directly in new code.

Payments go through SSLCOMMERZ (`payment` + `SSL` modules); enrollment access is gated on `payment.paymentStatus === Completed` (see `ValidateCourseAccess`).

AI features: `src/app/util/openRouterClient.ts` exports `askOpenRouter(messages, options)`, a single choke point that calls OpenRouter's free-tier models with automatic fallback across a `FREE_MODELS` list, reading `config.openRouterApiKey`. The `ai` module (`src/app/modules/ai/`) has three endpoints, all rate-limited by `aiLimiter` where public: `GET /api/ai/review-summary/:courseId` (cached AI digest of a course's reviews, caching on `Course.aiReviewSummary`/`aiReviewSummaryReviewCount`, per `specs/02-ai-review-summarizer.md`), `POST /api/ai/course-advisor` (public endpoint accepting a plain-English learning goal, returns 2-3 recommended published courses with hallucination-guarded server-side cross-checking against the fetched course list, per `specs/03-ai-course-advisor.md`), and `POST /api/ai/study-assistant/:courseId` (enrolled+paid-only via `authCheck(UserRole.user)` + `ValidateCourseAccess`, stateless per-course chat grounded in the student's real module/video outline and progress, per `specs/04-ai-study-assistant.md`). Check `progress-tracker.md`'s spec status table before starting new AI work — several follow-on specs exist under `context/specs/`.

Error logging: `src/app/modules/errorLog/` persists every error that reaches `globalErrorHandler` (all 4xx/5xx, not just unexpected bugs) — message, status, method, path, IP, and the requesting user when authenticated. Reads are admin-only (`GET /api/error-log`, `GET /api/error-log/:id`, both behind `authCheck(UserRole.admin)`); there's no public write endpoint, rows are only ever created internally from `globalErrorHandler`. Mongo's 30-day TTL index (auto-expiry, no cron needed) has no Postgres/Prisma equivalent — 30-day retention is now enforced by a Vercel Cron job (`vercel.json`'s `crons` entry, daily at 3am UTC) hitting `GET /api/error-log/cleanup`, gated by `verifyCronSecret` rather than `authCheck`. See `context/specs/09-observability-logging-and-error-tracking.md` and `context/specs/19-postgres-prisma-migration.md`.

Route files often JSON-parse a `data` field out of multipart bodies before validation (see the inline middleware in `course.routes.ts` that does `req.body = JSON.parse(req.body?.data)` between `upload.single(...)` and `validateRequest`) — follow this pattern for any new endpoint that accepts a file alongside structured JSON fields.

### Frontend (`lms_client`)

Next.js App Router. Route groups:

- `app/(main)/` — public/marketing + auth pages (home, courses, login, sign-up, contact, etc.)
- `app/dashboard/` — role-scoped dashboard, split into `admin/`, `instructor/`, `user/`, `profile/` subtrees, each with its own nested pages for CRUD flows (add/update/manage course, module, video, etc.)

Every `page.tsx`/`layout.tsx` is a thin wrapper that just renders a component from `components/main/` (or `components/dashboard/` for chrome) — the folder structure under `components/` does **not** mirror `app/`'s routing; it's organized by feature/domain instead (see below).

`middleware.ts` (repo root of `lms_client`) gates `/admin/:path*` and `/user/:path*` plus `/login` and `/`: it reads the `accessToken` cookie, decodes the JWT (`lib/jwt.ts`), and redirects based on `role` (`admin` vs `user`) — keep new protected routes' path prefixes in sync with the `matcher` config and the role checks here. **Known gap:** every real dashboard route lives under `/dashboard/admin/...` or `/dashboard/user/...`, not `/admin/...`/`/user/...`, so this matcher never actually matches them — edge-level gating is effectively a no-op for the whole dashboard today. In practice, protection comes from the API rejecting unauthorized requests with `401` and the axios response interceptor force-logging-out on `401` (see below), not from this middleware. Don't assume adding a new `/dashboard/...` page is edge-protected just because it's under `/dashboard/admin/`.

Component organization (`components/`), reorganized per `context/specs/16-frontend-folder-structure-migration.md` to colocate each feature's own files rather than scattering them across global folders:

- `components/main/<Group>/<Feature>/` — every feature/page component, public and dashboard alike. `<Group>` is a parenthesized grouping folder for role-scoped dashboard features (`(Admin)/`, `(Instructor)/`, `(User)/`, e.g. `components/main/(Admin)/ManageCourse/`) — cosmetic only, not a Next.js route group; public pages sit directly under `components/main/` with no group wrapper (e.g. `components/main/Course/`, `components/main/Home/`, `components/main/Login/`). Within a feature folder: `<Feature>.tsx`/page components at the top level, `column/` for `ColumnDef[]` table-column factories, `schema/` for that feature's Zod schema, `type/` for its entity type, `functions/` for its `*.functions.ts` orchestration file where one exists and is single-feature-scoped.
- `components/dashboard/sidebar/` — dashboard nav chrome only (`Sidebar.tsx`, `AdminLinks.tsx`, `InstructorLinks.tsx`, `UserLinks.tsx`); every actual dashboard feature screen lives under `components/main/(Admin|Instructor|User)/` instead.
- `components/shared/` — cross-feature UI, organized by category: `input/` (`Controlled*.tsx` form fields, `ControlledTipTapTextEditor/`), `table/` (`GenericTableComponent.tsx` and friends), `Modal/` (`BaseModal.tsx`, `DeleteModal.tsx`, `ModalActionButtons.tsx`), `buttons/` (`PrimaryButton.tsx`), `breadcrumb/`, `schema/` (`imageSchema.tsx`), `PageHeader/`, plus a few flat files (`Footer.tsx`, `NavBar.tsx`, `Wrapper.tsx`, `FormSubmitLoading.tsx`) with no natural category.
- `components/ui/` — shadcn/ui primitives, unchanged.

Data layer conventions:

- `lib/axiosInstance.ts` — single Axios instance; base URL from `config/envConfig.ts` (`NEXT_PUBLIC_API_BASE_URL`, falls back to the deployed server). Request interceptor attaches `Authorization: Bearer <accessToken>` from cookies (via `utils/GetCookies.ts` and `constants/storageKey.ts`) except for the login endpoint, and switches `Content-Type` between JSON and multipart automatically based on whether the payload is `FormData`. Response interceptor unwraps `{data, meta}`, force-logs-out and redirects to `/login` on 401, toasts on 403, and normalizes errors to `{statusCode, message, errorMessages, errors}`.
- `lib/api.ts` — thin `apiGet/apiPost/apiPut/apiPatch/apiDelete` wrappers around `axiosInstance`.
- `hooks/useApi.ts` — TanStack Query wrappers built on `lib/api.ts`: `useFetchData(key, endpoint, options)` for GET, and `usePost`/`useUpdateData`/`usePatch`/`useDeleteData` mutation hooks that take `{ url, payload }` and optionally a list of query keys to invalidate on success.
- `functions/*.functions.ts` — orchestration helpers that call a mutation hook, drive a `sonner` toast (`loading` → `success`/`error`), and navigate on success. New create/update/delete flows should follow this same toast-then-navigate pattern rather than handling toasts ad hoc in components. Single-feature-scoped files now live colocated inside that feature's own `functions/` subfolder (e.g. `components/main/(Admin)/ManageCourse/functions/course.functions.ts`); files spanning multiple feature groups (`video.functions.ts`) or with no current importer (`review.function.ts`, `user.function.ts`, `courseEnrollment.function.ts` — flagged dead-code candidates, not deleted) stay at the top-level `functions/`.
- `lib/auth.service.ts`, `lib/auth.ts` — legacy hand-written service objects predating the `useApi`/`functions` pattern; prefer the hook + functions pattern for new code.
- `lib/redux/` — Redux Toolkit store (`store.ts`) with `auth`, `filter`, and `permission` slices under `features/`. Used for client-side UI/auth state, not server data (that's TanStack Query's job).
- `providers/StoreProvider.tsx`, `providers/QueryProvider.tsx` — wrap the app in `app/layout.tsx` (Redux store and TanStack Query client respectively).
- `schemas/` no longer exists as a top-level folder — Zod schemas for forms are colocated in their single-consuming feature's `schema/` subfolder (e.g. `components/main/(Admin)/ManageCourse/schema/Course.schemas.ts`).
- `types/` — holds only genuinely cross-feature-group types (`course.types.ts`, `user.types.ts`, `auth.types.ts`, `ai.types.ts`, `globalTypes.ts`, `module.types.ts`); single-feature types have moved into that feature's own `type/` subfolder (e.g. `components/main/(Admin)/Stat/type/stat.types.ts`).
- Path alias `@/*` maps to the `lms_client/` root (see `tsconfig.json`).

UI stack: Tailwind CSS v4 + shadcn/ui (Radix primitives, `components.json` for the shadcn CLI), Tiptap for rich text editing, Mux Player for video, `react-quill`, `swiper`, `react-select`, `react-day-picker`.

### Auth model

JWT-based; roles are `admin`, `instructor`, `user` (`UserRole` in `lms_server/src/app/modules/user/user.constants.ts`). The client stores the access token in a cookie under the `accessToken` key (`constants/storageKey.ts`) and decodes it client-side (`jwt-decode`) to read `role` for route gating — both `lms_client/middleware.ts` (edge) and page-level checks rely on this decoded role rather than a server round-trip.

## Conventions to follow

- New backend endpoints: add files following the existing `route/controller/service/interface/validation` split inside `src/app/modules/<name>/` (schema changes go in the shared `prisma/schema.prisma`, not a per-module file), register the router in `src/app/router/index.ts`, and use `authCheck(...)` + `validateRequest(...)` + `catchAsync` + `sendResponse` consistently with existing modules.
- New frontend data fetching/mutations: use `hooks/useApi.ts` (TanStack Query) rather than calling `axiosInstance` directly from components; put multi-step create/update/delete orchestration (toast + navigate) in `functions/*.functions.ts`.
- Env vars are centralized: backend via `src/app/config/index.ts`, frontend base URL via `config/envConfig.ts` — don't read `process.env` ad hoc elsewhere.
- After any meaningful change, update the relevant app's `context/progress-tracker.md` (and `architecture.md`/`code-standards.md` if the change alters something they document) — see "Living documentation" above.

## Manual API testing

`LMS_system.postman_collection.json` at the repo root is a Postman collection covering the REST API — import it when manually exercising endpoints instead of hand-writing requests. There's no seeded/guaranteed-current set of test credentials to rely on; instructor accounts created via `auth.service.ts::createInstructor` get the hardcoded default password (`123456`, forcing `needsPasswordChange`) until changed, but don't assume any specific account still has it — verify against the DB (e.g. `needsPasswordChange` still `true`) before assuming a login will work.
