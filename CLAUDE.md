# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

MATS Academy — a full-stack LMS with three roles (admin, instructor, user/student). Two independent apps in one repo, each with its own `package.json`, deployed separately to Vercel:

- `lms_server/` — Express + TypeScript + Mongoose REST API
- `lms_client/` — Next.js 16 (App Router) + React 19 + TypeScript frontend

There is no root-level package.json or workspace tooling — always `cd` into the relevant app directory before running commands.

### Living documentation in `context/`

Both `lms_server/context/` and `lms_client/context/` contain actively-maintained docs that are more detailed than this file and take precedence for their app:

- `project-overview.md` — goals, user flows, feature inventory.
- `architecture.md` — stack table, system boundaries, invariants, and known gaps (e.g. a few routes have `authCheck(...)` commented out rather than removed — don't silently "fix" these, ask first).
- `code-standards.md` — naming/typing conventions and the verification checklist for "done."
- `ai-workflow-rules.md` — scoping rules for AI-assisted changes (no speculative refactors, protected files, when to stop and ask).
- `progress-tracker.md` — current phase, what's implemented, recent activity, open questions; **update this after every meaningful change**.
- `specs/NN-<feature-name>.md` — per-feature Goal/Design/Implementation/Verify docs; check here before implementing anything that might already be scoped, and mark spec status in `progress-tracker.md` when starting/finishing one.

Read the relevant app's `context/` docs before making non-trivial changes, and keep them in sync (per `ai-workflow-rules.md`) when a change alters something they document.

## Commands

### lms_server (run from `lms_server/`)

- `yarn dev` — start dev server with ts-node-dev (auto-restart)
- `yarn build` — compile TypeScript to `dist/`
- `yarn start:prod` — run compiled `dist/server.js`
- `yarn lint` / `yarn lint:fix` — ESLint over `src`
- `yarn prettier:fix` — format `src`
- No test suite is configured (`yarn test` is a stub that exits 1).

### lms_client (run from `lms_client/`)

- `yarn dev` — Next.js dev server (http://localhost:3000)
- `yarn build` — production build
- `yarn start` — serve production build
- `yarn lint` — ESLint (flat config, `eslint-config-next`)
- No test suite is configured.

## Architecture

### Backend (`lms_server/src`)

Express app entry is `src/server.ts` (connects Mongoose, then `app.listen`); the Express app itself is assembled in `src/app.ts` (CORS allowlist, JSON/body-parser, morgan, cookie-parser, mounts `MainRouter` at `/api`, global error handler, 404 handler last).

Everything domain-specific lives under `src/app/modules/<name>/`, one module per REST resource: `auth`, `user`, `course`, `courseModule`, `VideoModule`, `VideoProgress`, `CourseEnrollment`, `payment`, `SSL`, `review`. Each module follows the same file split — **not every module has every file**, but the naming is consistent:

- `*.route.ts` / `*.routes.ts` — Express router, wires middleware + controller
- `*.controller.ts` — thin, wraps service calls with `catchAsync` + `sendResponse`
- `*.service.ts` — business logic, Mongoose queries
- `*.model.ts` — Mongoose schema/model
- `*.interface.ts` — TypeScript types for the domain object
- `*.validation.ts` — Zod schemas, used via `validateRequest` middleware
- `*.constants.ts` — enums/constants (e.g. `user/user.constants.ts` defines `UserRole = { admin, instructor, user }`)

All module routers are aggregated in `src/app/router/index.ts` and mounted under their own path prefix (e.g. `/api/course`, `/api/enroll`, `/api/payment`).

Cross-cutting pieces:

- `src/app/middleware/authCheck.ts` — `authCheck(...requiredRoles)` verifies the JWT from the `Authorization: Bearer <token>` header and attaches `req.user`; pass no roles to just require auth, or specific `UserRole` values to restrict.
- `src/app/middleware/ValidateCourseAccess.ts` — checks the user has both a `CourseEnrollment` and a completed `payment` record for a course before allowing access to protected course content.
- `src/app/middleware/validateRequest.ts` — runs a Zod schema against `req.body`.
- `src/app/middleware/globalErrorHandler.ts` — normalizes `ZodError`, Mongoose `ValidationError`/`CastError`, duplicate-key (11000), and `AppError` into a consistent JSON error shape; must be registered after routes, before the 404 handler.
- `src/app/util/catchAsync.ts` — wraps async route handlers so thrown errors reach `next(error)`.
- `src/app/util/sendResponse.ts` — standard `{ success, message, data, token? }` response envelope.
- `src/app/util/SendImageCloudinary.ts` — Multer + Cloudinary storage config (`upload.single(...)`) used for course covers, etc.
- `src/app/util/VideoUpload.ts` — video upload handling, paired with the `VideoModule`/`VideoProgress` modules for course content and per-user watch progress.
- `src/app/config/index.ts` — single place all `process.env` values are read (Mongo URI, JWT secret, Cloudinary, nodemailer, SSLCOMMERZ store credentials/URLs); reference this instead of `process.env` directly in new code.

Payments go through SSLCOMMERZ (`payment` + `SSL` modules); enrollment access is gated on `payment.paymentStatus === Completed` (see `ValidateCourseAccess`).

AI features are in progress: `src/app/util/openRouterClient.ts` exports `askOpenRouter(messages, options)`, a single choke point that calls OpenRouter's free-tier models with automatic fallback across a `FREE_MODELS` list, reading `config.openRouterApiKey`. The `ai` module (`src/app/modules/ai/`) now exists with one endpoint, `GET /api/ai/review-summary/:courseId` (cached AI digest of a course's reviews, caching on `Course.aiReviewSummary`/`aiReviewSummaryReviewCount`) — implemented per `lms_server/context/specs/02-ai-review-summarizer.md`. Two more planned endpoints (`course-advisor`, `study-assistant`) are scoped in `specs/03-*`/`04-*` but not yet implemented; check `progress-tracker.md`'s spec status table before starting one.

Route files often JSON-parse a `data` field out of multipart bodies before validation (see the inline middleware in `course.routes.ts` that does `req.body = JSON.parse(req.body?.data)` between `upload.single(...)` and `validateRequest`) — follow this pattern for any new endpoint that accepts a file alongside structured JSON fields.

### Frontend (`lms_client`)

Next.js App Router. Route groups:

- `app/(main)/` — public/marketing + auth pages (home, courses, login, sign-up, contact, etc.)
- `app/dashboard/` — role-scoped dashboard, split into `admin/`, `instructor/`, `user/`, `profile/` subtrees, each with its own nested pages for CRUD flows (add/update/manage course, module, video, etc.)

`middleware.ts` (repo root of `lms_client`) gates `/admin/:path*` and `/user/:path*` plus `/login` and `/`: it reads the `accessToken` cookie, decodes the JWT (`services/jwt.ts`), and redirects based on `role` (`admin` vs `user`) — keep new protected routes' path prefixes in sync with the `matcher` config and the role checks here.

Data layer conventions:

- `utils/axiosInstance.ts` — single Axios instance; base URL from `config/envConfig.ts` (`NEXT_PUBLIC_API_BASE_URL`, falls back to the deployed server). Request interceptor attaches `Authorization: Bearer <accessToken>` from cookies (via `utils/GetCookies.ts` and `constants/storageKey.ts`) except for the login endpoint, and switches `Content-Type` between JSON and multipart automatically based on whether the payload is `FormData`. Response interceptor unwraps `{data, meta}`, force-logs-out and redirects to `/login` on 401, toasts on 403, and normalizes errors to `{statusCode, message, errorMessages, errors}`.
- `utils/api.ts` — thin `apiGet/apiPost/apiPut/apiPatch/apiDelete` wrappers around `axiosInstance`.
- `hooks/useApi.ts` — TanStack Query wrappers built on `utils/api.ts`: `useFetchData(key, endpoint, options)` for GET, and `usePost`/`useUpdateData`/`usePatch`/`useDeleteData` mutation hooks that take `{ url, payload }` and optionally a list of query keys to invalidate on success.
- `functions/*.functions.ts` (e.g. `course.functions.ts`, `video.functions.ts`) — orchestration helpers that call a mutation hook, drive a `sonner` toast (`loading` → `success`/`error`), and navigate on success. New create/update/delete flows should follow this same toast-then-navigate pattern rather than handling toasts ad hoc in components.
- `services/` — a couple of hand-written service objects (`auth.service.ts`, `auth.ts`) predating the `useApi`/`functions` pattern; prefer the hook + functions pattern for new code.
- `lib/redux/` — Redux Toolkit store (`store.ts`) with `auth`, `filter`, and `permission` slices under `features/`; `StoreProvider.tsx` wraps the app. Used for client-side UI/auth state, not server data (that's TanStack Query's job).
- `app/QueryProvider.tsx` — TanStack Query client provider, wraps the app alongside the Redux provider in `app/layout.tsx`.
- `schemas/` — Zod schemas for form validation (paired with `react-hook-form` + `@hookform/resolvers`).
- `types/` — shared TypeScript types per domain (`course.types.ts`, `video.types.ts`, `module.types.ts`, `user.types.ts`, `auth.types.ts`, `globalTypes.ts`).
- Path alias `@/*` maps to the `lms_client/` root (see `tsconfig.json`).

UI stack: Tailwind CSS v4 + shadcn/ui (Radix primitives, `components.json` for the shadcn CLI), Tiptap for rich text editing, Mux Player for video, `react-quill`, `swiper`, `react-select`, `react-day-picker`.

### Auth model

JWT-based; roles are `admin`, `instructor`, `user` (`UserRole` in `lms_server/src/app/modules/user/user.constants.ts`). The client stores the access token in a cookie under the `accessToken` key (`constants/storageKey.ts`) and decodes it client-side (`jwt-decode`) to read `role` for route gating — both `lms_client/middleware.ts` (edge) and page-level checks rely on this decoded role rather than a server round-trip.

## Conventions to follow

- New backend endpoints: add files following the existing `route/controller/service/model/interface/validation` split inside `src/app/modules/<name>/`, register the router in `src/app/router/index.ts`, and use `authCheck(...)` + `validateRequest(...)` + `catchAsync` + `sendResponse` consistently with existing modules.
- New frontend data fetching/mutations: use `hooks/useApi.ts` (TanStack Query) rather than calling `axiosInstance` directly from components; put multi-step create/update/delete orchestration (toast + navigate) in `functions/*.functions.ts`.
- Env vars are centralized: backend via `src/app/config/index.ts`, frontend base URL via `config/envConfig.ts` — don't read `process.env` ad hoc elsewhere.
- After any meaningful change, update the relevant app's `context/progress-tracker.md` (and `architecture.md`/`code-standards.md` if the change alters something they document) — see "Living documentation" above.
