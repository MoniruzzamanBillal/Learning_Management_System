# Architecture

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| **Runtime/Framework** | Node.js + Express 4 | HTTP server and routing. |
| **Language** | TypeScript | Static typing across routes/services/models. |
| **Database** | MongoDB via Mongoose | Persistence for all domain models. |
| **Auth** | `jsonwebtoken` | Access-token issuance/verification (`config.jwt_secret`). |
| **Validation** | Zod | Request-body schema validation via `validateRequest`. |
| **File/Video Upload** | Multer + `multer-storage-cloudinary` + Cloudinary | Course cover images and course videos. |
| **Payments** | `sslcommerz-lts` (SSLCOMMERZ) | Course payment processing. |
| **Email** | Nodemailer | Transactional email (`src/app/util/sendEmail.ts`). |
| **Other** | `pdf-lib` | Used for certificate/PDF generation. |

## System Boundaries

- `src/server.ts` — process entry point: connects Mongoose (`config.database_url`), then starts the HTTP listener.
- `src/app.ts` — Express app composition, in order: CORS (explicit origin allowlist) → `express.json()` → `morgan("dev")` → `cookieParser()` → `body-parser` urlencoded → `MainRouter` mounted at `/api` → root `GET /` health check → `globalErrorHandler` → catch-all 404 handler. This order matters — the error handler must come after routes and before the 404 handler.
- `src/app/router/index.ts` — aggregates every module's router and mounts it under a path prefix (`/user`, `/auth`, `/course`, `/module`, `/video`, `/enroll`, `/payment`, `/review`, `/ai`), all under the `/api` base from `app.ts`.
- `src/app/modules/<name>/` — one directory per domain resource: `auth`, `user`, `course`, `courseModule`, `VideoModule`, `VideoProgress`, `CourseEnrollment`, `payment`, `SSL`, `review`, `ai`. Not every module has every file below, but the split is consistent:
  - `*.route.ts` / `*.routes.ts` — Express router; wires middleware (`authCheck`, `validateRequest`, `upload`) to controller methods.
  - `*.controller.ts` — thin; wraps a service call with `catchAsync` and responds via `sendResponse`.
  - `*.service.ts` — business logic and Mongoose queries.
  - `*.model.ts` — Mongoose schema/model.
  - `*.interface.ts` — TS types for the domain object (e.g. `TUserRole`).
  - `*.validation.ts` — Zod schemas.
  - `*.constants.ts` — enums/constants (e.g. `UserRole`, `PAYMENTSTATUS`).
  - `VideoProgress` and `SSL` have no `route.ts` — they're internal-only, consumed by `CourseEnrollment`'s service and the `payment` module respectively, not exposed as their own HTTP surface.
  - `ai` has no `ai.model.ts` or `ai.validation.ts` — it's stateless per-request (no dedicated collection), and its first endpoint (`GET /ai/review-summary/:courseId`) takes no body to validate. It calls `askOpenRouter` (`src/app/util/openRouterClient.ts`) and caches results directly on the `Course` document (`aiReviewSummary`, `aiReviewSummaryReviewCount`) rather than its own collection.
- `src/app/middleware/` — cross-cutting middleware (see below).
- `src/app/util/` — shared helpers: `catchAsync.ts`, `sendResponse.ts`, `SendImageCloudinary.ts` (Multer/Cloudinary storage config for images), `VideoUpload.ts` (video-specific upload config), `sendEmail.ts`.
- `src/app/Error/` — `AppError` class plus normalizers for Zod/Mongoose validation/cast/duplicate-key errors, consumed by `globalErrorHandler`.
- `src/app/config/index.ts` — the single place `process.env` is read (Mongo URI, JWT secret, Cloudinary, Nodemailer, SSLCOMMERZ store credentials/URLs). New code should import `config` rather than reading `process.env` directly.

## Middleware

- `authCheck(...requiredRoles: TUserRole[])` — verifies the `Authorization: Bearer <token>` JWT, attaches the decoded payload to `req.user`. Called with no roles to just require *some* valid token, or specific `UserRole` values to restrict access.
- `ValidateCourseAccess` — used on `CourseEnrollment` routes that serve paid content; requires both a matching `CourseEnrollment` document and a `payment` document with `paymentStatus === Completed` for that user+course, else throws `403`.
- `validateRequest(zodSchema)` — parses/validates `req.body` against a Zod schema, throwing `ZodError` on failure (normalized by `globalErrorHandler`).
- `globalErrorHandler` — normalizes `ZodError`, Mongoose `ValidationError`/`CastError`, MongoDB duplicate-key (`code: 11000`), and `AppError` into one JSON error shape (`{ success: false, message, errorSources, stack }`).

## Auth & Access Model

- Users authenticate via `POST /api/auth/login`, receiving a JWT signed with `config.jwt_secret` and containing at least `userId` and `userRole`.
- Every protected route calls `authCheck(...)` with the roles allowed to hit it.
- Course-content routes additionally require `ValidateCourseAccess` (enrollment + completed payment), independent of role.
- **Resolved gap:** `course.controller.adminStatistics` (`/course/admin-stats`), `moduleController.addModule` (`/module/add-module`), and `videoController.addVideo` (`/video/add-video`) previously had `authCheck(...)` commented out; re-enabled per [`context/specs/05-security-authcheck-and-hardening.md`](specs/05-security-authcheck-and-hardening.md) — `/course/admin-stats` requires `UserRole.admin`, the other two require `UserRole.admin`/`UserRole.instructor`, matching sibling routes in the same files.

## Invariants

1. **Response envelope:** every controller responds via `sendResponse<T>(res, { statusCode, success, message, data, token? })` — don't hand-roll `res.json(...)` in new controllers.
2. **Async error propagation:** every controller/middleware handler that can throw is wrapped in `catchAsync` so errors reach `next(error)` and the global handler, rather than crashing the process or being swallowed.
3. **Validation before controller:** any route accepting a body goes through `validateRequest(schema)` before the controller runs.
4. **Multipart + JSON pattern:** routes that accept a file *and* structured JSON fields (e.g. `add-course`, `update-course`, `add-video`, `update-video`, `update-user`, `register`, `register-instructor`) run `upload.single(...)`/`uploadVideo.single(...)` first, then an inline middleware that does `req.body = JSON.parse(req.body?.data)`, then `validateRequest`. New file-upload endpoints should follow this exact order.
5. **Config centralization:** all environment variables are read once in `src/app/config/index.ts` and imported from there.
6. **Module self-containment:** a new domain resource gets its own `src/app/modules/<name>/` directory following the file split above, registered in `src/app/router/index.ts` — don't bolt unrelated logic onto an existing module.
