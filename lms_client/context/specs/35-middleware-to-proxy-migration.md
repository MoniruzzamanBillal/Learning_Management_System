# 35 — Migrate `middleware.ts` to the `proxy` file convention

## Status

✅ Implemented.

## Goal

Running `yarn dev` printed:

```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```

As of Next.js `16.0.0`, the `middleware` file convention is deprecated and renamed to `proxy` (`lms_client` is pinned to `next@16.1.6`, so the new convention is already fully supported). Goal: eliminate the warning by migrating off the deprecated convention, with **zero behavior change** — the route-gating logic itself was not in scope.

## Design

Pure rename, nothing else:

- File: `middleware.ts` → `proxy.ts`.
- Exported function: `middleware(request: NextRequest)` → `proxy(request: NextRequest)`.
- Everything else — the `NextRequest`/`NextResponse` import from `next/server`, the `authKey`/`decodedToken` imports, every route-pattern check, every redirect target, and the trailing `export const config = { matcher: [...] }` block (`/login`, `/admin/:path*`, `/user/:path*`, `/`) — stays byte-for-byte identical.

Next.js ships an automated codemod (`npx @next/codemod@canary middleware-to-proxy .`) for this exact migration, but since this repo has exactly one middleware file with one exported function, a hand-edit was clearer to review than running a canary-tagged automated codemod against the repo — same end result, less risk.

**Follow-up, resolved:** per Next.js's own version history, Proxy defaults to the **Node.js runtime**, whereas Middleware defaulted to the **Edge runtime**. `context/progress-tracker.md` documents a prior production incident (`MIDDLEWARE_INVOCATION_FAILED`, a Turbopack bug bundling `next/server`'s `NextRequest` for the Edge runtime, worked around by pinning `package.json`'s `build` script to `next build --webpack`). Since this rename means `proxy.ts` no longer defaults to Edge, whether that workaround was still necessary was flagged as an open question rather than acted on speculatively.

Investigated as an immediate follow-up (same day): temporarily reverted `build` to plain `next build` (Turbopack), ran a clean build, and checked the bundled proxy output — **0 `__dirname` references** (versus the unguarded reference the original incident found). Ran `next start` on that build and hit every route class the proxy matches (`/`, `/login`, `/admin/foo`, `/user/foo`) — all returned correct responses (200s/307 redirects), no crash. This confirms the bug was specific to the Edge-runtime bundling path and doesn't reproduce under Proxy's Node.js-runtime default. User confirmed removing the pin; `package.json`'s `build` script is back to plain `next build`.

## Implementation

1. `lms_client/middleware.ts` renamed to `lms_client/proxy.ts` (`git mv`); `export function middleware(...)` renamed to `export function proxy(...)`. No other line changed.
2. Every "living" doc that names this file updated from `middleware.ts` to `proxy.ts`:
   - `context/architecture.md` (stack table, System Boundaries, Invariants — 4 spots, plus one factual addition noting the Node.js-vs-Edge runtime default change).
   - `context/ai-workflow-rules.md` (Protected Files rule).
   - `context/progress-tracker.md` (Completed section, the historical `MIDDLEWARE_INVOCATION_FAILED` incident note, and the spec-10 recent-activity note).
   - `context/project-overview.md` (Success Criteria).
   - Root `CLAUDE.md` (Frontend architecture section, Commands section's `--webpack` note, and Auth model section).
3. Older, closed per-feature spec docs that happen to mention `middleware.ts` in passing (specs 08, 10, 15, 16, 17) were left untouched — they're dated historical records of what was true when written, not living documentation.

## Verify

- `yarn dev` — deprecation warning gone, server still starts normally.
- `yarn build` — production build still succeeds (now plain `next build`/Turbopack — the `--webpack` pin was removed as a follow-up, see above).
- `yarn lint` — no new lint errors (rename + identifier change only).
- Manual click-through confirming identical role-gating behavior to before the rename:
  - Unauthenticated visit to `/admin` or `/user` → redirected to `/login`.
  - Authenticated `admin` visiting `/user` → redirected to `/admin`; authenticated `user` visiting `/admin` → redirected to `/`.
  - Visiting `/login` while already logged in → redirected to `/`.
  - Public routes (`/`, `/courses`, etc.) remain freely accessible.
