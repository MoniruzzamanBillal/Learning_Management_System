# Architecture

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| **Framework** | Next.js 16 (App Router) | Routing, layouts, SSR/CSR, `middleware.ts`. |
| **Language** | TypeScript | Static typing throughout. |
| **Styling** | Tailwind CSS v4 | Utility-first styling, theme via CSS variables in `app/globals.css`. |
| **UI Components** | shadcn/ui (Radix primitives, "new-york" style) | Accessible pre-built components in `components/ui/`. |
| **API Client** | Axios (`lib/axiosInstance.ts`) | Single configured instance with request/response interceptors. |
| **Server State** | TanStack Query (`hooks/useApi.ts`) | Fetching, caching, and mutation of API data. |
| **Client State** | Redux Toolkit (`lib/redux/`) | Auth/filter/permission UI state, not server data. |
| **Forms** | React Hook Form + Zod (colocated `schema/` per feature) | Form state and schema validation. |
| **Rich Text** | Tiptap | Course/module content editing. |
| **Video Playback** | `@mux/mux-player-react` | Course video playback. |
| **Charts** | Recharts | Admin dashboard revenue/enrollment time-series charts. |

## System Boundaries

- `app/(main)/` — public route group: home, courses (list + `[id]` detail), login, sign-up, about-us, contact, faqs, instructors, change-password, and the SSLCOMMERZ payment-outcome pages (`courseEnroll-success`, `courseEnroll-fail`).
- `app/dashboard/` — protected route group with a shared `layout.tsx`, split into `admin/`, `instructor/`, `user/`, and a shared `profile/`. Role-specific pages live under their respective subfolder (see `context/project-overview.md` for the concrete page list). Every `page.tsx` is a thin wrapper rendering a component from `components/main/`; the `components/` folder structure is organized by feature/domain, not mirrored to `app/`'s routes.
- `middleware.ts` (repo root) — Next.js Edge middleware gating `/admin/:path*`, `/user/:path*`, `/login`, and `/`. Reads the `accessToken` cookie, decodes it (`lib/jwt.ts`, `decodedToken`), and redirects based on the decoded `role`. **This is the actual route-protection boundary** — keep its `matcher` and role checks in sync with any new top-level protected route prefix.
- `components/main/<Group>/<Feature>/` — every feature/page component, public and dashboard alike, reorganized per `context/specs/16-frontend-folder-structure-migration.md` to colocate each feature's own files. `<Group>` is a parenthesized, purely-cosmetic grouping folder for role-scoped dashboard features (`(Admin)/`, `(Instructor)/`, `(User)/` — e.g. `components/main/(Admin)/ManageCourse/ManageCourse.tsx`); public pages sit directly under `components/main/` with no group wrapper (e.g. `components/main/Course/CoursePage.tsx`, `components/main/Home/HomePage.tsx`, `components/main/Login/LoginPage.tsx`). Within a feature folder: the page/feature component(s) at the top level, `column/` for `ColumnDef[]` table-column factories (e.g. `ManageCourse/column/CourseColumns.tsx`), `schema/` for that feature's Zod schema, `type/` for its entity type, `functions/` for a single-feature-scoped `*.functions.ts` orchestration file where one exists.
- `components/dashboard/sidebar/` — dashboard nav chrome only (`Sidebar.tsx`, `AdminLinks.tsx`, `InstructorLinks.tsx`, `UserLinks.tsx`); every actual dashboard feature screen lives under `components/main/(Admin|Instructor|User)/` instead, not under `components/dashboard/`.
- `components/shared/` — cross-feature UI split by category: `input/` (`Controlled*.tsx`, `ControlledTipTapTextEditor/`), `table/` (`GenericTableComponent.tsx` and friends), `Modal/` (`BaseModal.tsx`, `DeleteModal.tsx`, `ModalActionButtons.tsx`), `buttons/` (`PrimaryButton.tsx`), `breadcrumb/` (`Breadcrumb.tsx`), `schema/` (`imageSchema.tsx`), `PageHeader/`, plus flat files with no natural category (`Footer.tsx`, `NavBar.tsx`, `Wrapper.tsx`, `FormSubmitLoading.tsx`).
- `hooks/` — `useApi.ts` (TanStack Query wrappers, see below), `useAuth.ts`, `useGetUser.ts`, `useDebounce.ts`.
- `functions/*.functions.ts` — orchestration helpers that call a mutation hook and drive toast + navigation. Single-feature-scoped files are now colocated in that feature's own `functions/` subfolder under `components/main/`: `course.functions.ts` → `(Admin)/ManageCourse/functions/`, `auth.functions.ts` → `(Admin)/ManageInstructor/functions/`, `module.function.ts` → `(Instructor)/ManageModule/functions/`. What remains at the top-level `functions/`: `video.functions.ts` (genuinely spans both `(Admin)/ManageModule` and multiple `(Instructor)` features) plus `user.function.ts`/`review.function.ts`/`courseEnrollment.function.ts` (no current importer found anywhere — flagged dead-code candidates, left in place pending confirmation rather than deleted).
- `lib/` — `axiosInstance.ts`, `api.ts` (thin `apiGet/apiPost/apiPut/apiPatch/apiDelete` wrappers), `auth.service.ts`/`auth.ts` (predate the `useApi`/`functions` pattern and are largely superseded, see Invariants below), `jwt.ts` (`decodedToken`, actively used by `middleware.ts`), `cookiesAction.ts`, `utils.ts` (`cn()`), and `redux/` (`store.ts` — root reducer: `auth`, `filter`, `permission` — plus `features/<slice>/`).
- `providers/` — `QueryProvider.tsx` (TanStack Query client) and `StoreProvider.tsx` (Redux store); both wrap the app in `app/layout.tsx`.
- `schemas/` no longer exists as a top-level folder — Zod schemas for forms are colocated in their single-consuming feature's own `schema/` subfolder (e.g. `components/main/(Admin)/ManageCourse/schema/Course.schemas.ts`, `components/main/(Admin)/ManageInstructor/schema/User.schemas.ts`).
- `types/` — holds only genuinely cross-feature-group TS types: `course.types.ts`, `user.types.ts`, `auth.types.ts`, `ai.types.ts`, `globalTypes.ts`, `module.types.ts` (currently no importer found — flagged, kept global since ownership is unclear). Single-feature types moved into that feature's own `type/` subfolder: `review.types.ts` → `(Admin)/ManageReview/type/`, `video.types.ts` → `(Instructor)/ManageVideo/type/`, `errorLog.types.ts` → `(Admin)/ErrorLogs/type/`, `stat.types.ts` → `(Admin)/Stat/type/`.
- `utils/` — `GetCookies.ts`, `verifyToken.ts`, `constants.ts`, `sharedFunction.ts`, `getChangedFields.ts`, `buildUrl.ts`. (`axiosInstance.ts`/`api.ts` moved to `lib/`; `useDebounce.ts` moved to `hooks/`.)
- `config/envConfig.ts` — `getBaseUrl()`, the single place the API base URL is resolved (`NEXT_PUBLIC_API_BASE_URL` env var, falling back to the deployed backend).
- `constants/storageKey.ts` — cookie key names (`authKey = "accessToken"`, etc.).
- Path alias `@/*` → the `lms_client/` root (see `tsconfig.json`).

## Storage Model

- **Auth token:** stored in a cookie under `authKey` ("accessToken"), set/read via `js-cookie` / `utils/GetCookies.ts`. Not stored in `localStorage`.
- **Server state cache:** TanStack Query cache, populated via `hooks/useApi.ts`.
- **Client UI/auth state:** Redux Toolkit (`auth`, `filter`, `permission` slices) — for UI-level state, not a substitute for the Query cache.

## Auth & Access Model

- Login (`POST /auth/login`) and registration (`POST /auth/register`) go through the API directly; the JWT is decoded client-side (`jwt-decode` / `lib/jwt.ts`) to read `role` for route/UI gating — there is no server-side session check beyond the token itself.
- `middleware.ts` runs on every matched request: no token + protected route → redirect to `/login`; token present → decode and compare `role` against the route prefix (`admin` vs `user`), redirecting mismatches; logged-in users hitting `/login` are redirected to `/`.
- `lib/axiosInstance.ts` request interceptor attaches `Authorization: Bearer <token>` to every request except the login/`signing` endpoint, and switches `Content-Type` based on whether the payload is `FormData`.
- `lib/axiosInstance.ts` response interceptor: unwraps `{data, meta}`; on `401` clears the cookie, toasts, and redirects to `/login`; on `403` toasts "no permission"; otherwise normalizes the error to `{statusCode, message, errorMessages, errors}`.

## Invariants

1. **No raw Axios/fetch in components.** Use `hooks/useApi.ts` (`useFetchData` for GET, `usePost`/`useUpdateData`/`usePatch`/`useDeleteData` for mutations) — these already wire up TanStack Query caching/invalidation.
2. **Create/update/delete orchestration lives in `functions/*.functions.ts`** (top-level for cross-feature files, colocated in a feature's own `functions/` subfolder under `components/main/` for single-feature ones). These call a mutation hook, drive a `sonner` toast (`loading` → `success`/`error`), and navigate on success. New flows of this shape should follow the same pattern rather than handling toasts ad hoc inside a component.
3. **Don't extend `lib/auth.ts` / `lib/auth.service.ts`.** They're legacy (the `registration` function in `auth.service.ts` is dead/commented-out code — the real signup flow in `app/(main)/sign-up/page.tsx` posts to `/auth/register` directly via `usePost`). New auth-related calls should go through `hooks/useApi.ts` + `components/main/(Admin)/ManageInstructor/functions/auth.functions.ts` instead.
4. **`middleware.ts` is the security boundary for route access** — don't rely solely on client-side conditional rendering for protecting a route; keep the `matcher` and role logic current for any new protected top-level path.
5. **Env vars are centralized** via `config/envConfig.ts` (frontend base URL) — don't read `process.env.NEXT_PUBLIC_*` ad hoc elsewhere.
