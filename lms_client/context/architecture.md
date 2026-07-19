# Architecture

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| **Framework** | Next.js 16 (App Router) | Routing, layouts, SSR/CSR, `middleware.ts`. |
| **Language** | TypeScript | Static typing throughout. |
| **Styling** | Tailwind CSS v4 | Utility-first styling, theme via CSS variables in `app/globals.css`. |
| **UI Components** | shadcn/ui (Radix primitives, "new-york" style) | Accessible pre-built components in `components/ui/`. |
| **API Client** | Axios (`utils/axiosInstance.ts`) | Single configured instance with request/response interceptors. |
| **Server State** | TanStack Query (`hooks/useApi.ts`) | Fetching, caching, and mutation of API data. |
| **Client State** | Redux Toolkit (`lib/redux/`) | Auth/filter/permission UI state, not server data. |
| **Forms** | React Hook Form + Zod (`schemas/`) | Form state and schema validation. |
| **Rich Text** | Tiptap | Course/module content editing. |
| **Video Playback** | `@mux/mux-player-react` | Course video playback. |
| **Charts** | Recharts | Admin dashboard revenue/enrollment time-series charts. |

## System Boundaries

- `app/(main)/` — public route group: home, courses (list + `[id]` detail), login, sign-up, about-us, contact, faqs, instructors, change-password, and the SSLCOMMERZ payment-outcome pages (`courseEnroll-success`, `courseEnroll-fail`).
- `app/dashboard/` — protected route group with a shared `layout.tsx`, split into `admin/`, `instructor/`, `user/`, and a shared `profile/`. Role-specific pages live under their respective subfolder (see `context/project-overview.md` for the concrete page list).
- `middleware.ts` (repo root) — Next.js Edge middleware gating `/admin/:path*`, `/user/:path*`, `/login`, and `/`. Reads the `accessToken` cookie, decodes it (`services/jwt.ts`, `decodedToken`), and redirects based on the decoded `role`. **This is the actual route-protection boundary** — keep its `matcher` and role checks in sync with any new top-level protected route prefix.
- `components/` — UI, split into `components/ui/` (shadcn primitives) and feature/domain components (e.g. `components/Dashboard/<role>/<Feature>/...`).
- `hooks/` — `useApi.ts` (TanStack Query wrappers, see below), `useAuth.ts`, `useGetUser.ts`.
- `functions/*.functions.ts` — one file per domain (`course.functions.ts`, `video.functions.ts`, `module.function.ts`, `user.function.ts`, `review.function.ts`, `courseEnrollment.function.ts`, `auth.functions.ts`) — orchestration helpers that call a mutation hook and drive toast + navigation.
- `services/` — `auth.service.ts`, `auth.ts`, `jwt.ts`. `auth.service.ts`/`auth.ts` predate the `useApi`/`functions` pattern and are largely superseded (see Invariants below); `jwt.ts`'s `decodedToken` is still actively used by `middleware.ts` and elsewhere.
- `lib/redux/` — `store.ts` (root reducer: `auth`, `filter`, `permission`), `features/<slice>/`, `provider/StoreProvider.tsx`.
- `app/QueryProvider.tsx` — TanStack Query client provider; wraps the app alongside `StoreProvider` in `app/layout.tsx`.
- `schemas/` — Zod schemas for forms (`Course.schemas.ts`, `User.schemas.ts`).
- `types/` — per-domain TS types (`course.types.ts`, `video.types.ts`, `module.types.ts`, `user.types.ts`, `auth.types.ts`, `globalTypes.ts`).
- `utils/` — `axiosInstance.ts`, `api.ts` (thin `apiGet/apiPost/apiPut/apiPatch/apiDelete` wrappers), `GetCookies.ts`, `verifyToken.ts`, `constants.ts`, `sharedFunction.ts`, `getChangedFields.ts`, `useDebounce.ts`.
- `config/envConfig.ts` — `getBaseUrl()`, the single place the API base URL is resolved (`NEXT_PUBLIC_API_BASE_URL` env var, falling back to the deployed backend).
- `constants/storageKey.ts` — cookie key names (`authKey = "accessToken"`, etc.).
- Path alias `@/*` → the `lms_client/` root (see `tsconfig.json`).

## Storage Model

- **Auth token:** stored in a cookie under `authKey` ("accessToken"), set/read via `js-cookie` / `utils/GetCookies.ts`. Not stored in `localStorage`.
- **Server state cache:** TanStack Query cache, populated via `hooks/useApi.ts`.
- **Client UI/auth state:** Redux Toolkit (`auth`, `filter`, `permission` slices) — for UI-level state, not a substitute for the Query cache.

## Auth & Access Model

- Login (`POST /auth/login`) and registration (`POST /auth/register`) go through the API directly; the JWT is decoded client-side (`jwt-decode` / `services/jwt.ts`) to read `role` for route/UI gating — there is no server-side session check beyond the token itself.
- `middleware.ts` runs on every matched request: no token + protected route → redirect to `/login`; token present → decode and compare `role` against the route prefix (`admin` vs `user`), redirecting mismatches; logged-in users hitting `/login` are redirected to `/`.
- `utils/axiosInstance.ts` request interceptor attaches `Authorization: Bearer <token>` to every request except the login/`signing` endpoint, and switches `Content-Type` based on whether the payload is `FormData`.
- `utils/axiosInstance.ts` response interceptor: unwraps `{data, meta}`; on `401` clears the cookie, toasts, and redirects to `/login`; on `403` toasts "no permission"; otherwise normalizes the error to `{statusCode, message, errorMessages, errors}`.

## Invariants

1. **No raw Axios/fetch in components.** Use `hooks/useApi.ts` (`useFetchData` for GET, `usePost`/`useUpdateData`/`usePatch`/`useDeleteData` for mutations) — these already wire up TanStack Query caching/invalidation.
2. **Create/update/delete orchestration lives in `functions/*.functions.ts`.** These call a mutation hook, drive a `sonner` toast (`loading` → `success`/`error`), and navigate on success. New flows of this shape should follow the same pattern rather than handling toasts ad hoc inside a component.
3. **Don't extend `services/auth.ts` / `services/auth.service.ts`.** They're legacy (the `registration` function in `auth.service.ts` is dead/commented-out code — the real signup flow in `app/(main)/sign-up/page.tsx` posts to `/auth/register` directly via `usePost`). New auth-related calls should go through `hooks/useApi.ts` + `functions/auth.functions.ts` instead.
4. **`middleware.ts` is the security boundary for route access** — don't rely solely on client-side conditional rendering for protecting a route; keep the `matcher` and role logic current for any new protected top-level path.
5. **Env vars are centralized** via `config/envConfig.ts` (frontend base URL) — don't read `process.env.NEXT_PUBLIC_*` ad hoc elsewhere.
