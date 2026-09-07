# 36 — Fix recurring `MIDDLEWARE_INVOCATION_FAILED` crash: revert proxy.ts, downgrade Next.js

## Status

✅ Implemented (local verification complete; live Vercel verification pending redeploy — see Verify).

## Goal

The deployed Vercel production link 500s on every route:

```
500: INTERNAL_SERVER_ERROR
Code: MIDDLEWARE_INVOCATION_FAILED
[error] [ReferenceError: __dirname is not defined]
```

This is the same crash documented earlier in `context/progress-tracker.md` and believed fixed by spec 35's `middleware.ts` → `proxy.ts` rename. It was not actually fixed — the crash reproduced on the real Vercel deployment. Goal: make the deployed app stop crashing, for real this time, verified against an actual production deployment rather than a local approximation.

## Design

### Why the previous "fix" didn't hold

Nothing in this project's own code references `__dirname` — `middleware.ts`/`proxy.ts`, `constants/storageKey.ts`, and `lib/jwt.ts` were read in full and confirmed clean. The crash is a known Next.js 16 / Turbopack bundling bug (upstream `vercel/next.js` issues #53968, #86476): Turbopack, now the default bundler for `next build` (not just `next dev`), fails to guard a bare `__dirname` reference inside Next's own internal ncc-compiled dependencies (`next/dist/compiled/cookie`, `next/dist/compiled/ua-parser-js`) that `next/server`'s `NextRequest` pulls in unconditionally. That reference is inert in a real Node.js process (CommonJS auto-provides `__dirname`), but Vercel's Edge Function sandbox strips Node globals entirely — hitting that code path there throws exactly this `ReferenceError`, surfaced by Vercel as `MIDDLEWARE_INVOCATION_FAILED`.

This project hit this bug once before under `middleware.ts` + Next `16.1.6` + plain `next build`, and worked around it by pinning `build` to `next build --webpack`. Spec 35 later renamed `middleware.ts` → `proxy.ts` (purely to silence a `yarn dev` deprecation warning) and, as a follow-up, removed the `--webpack` pin — reasoning that since `proxy.ts` defaults to Next 16's **Node.js runtime** instead of Edge, the Edge-only bug no longer applied. That reasoning was checked only by running `next build && next start` locally and confirming `0 __dirname` references plus no crash.

**That local check was not a valid test.** `next start` always runs as a genuine Node.js process. Even if Turbopack left an unguarded `__dirname` reference in a bundle nominally targeting the Edge runtime, `next start` would never trip a `ReferenceError` from it, because Node auto-injects `__dirname` into every CommonJS module scope regardless of the bundle's intended target. The only environment that actually exercises Vercel's stripped-down Edge/Middleware invocation sandbox is a real Vercel deployment — and that is exactly where the crash resurfaced. Whether the underlying cause is that Vercel isn't yet honoring `proxy.ts`'s Node-runtime default on this project's builder version, or that the Turbopack bug also reaches this code path at `16.1.6` regardless of runtime target, doesn't need to be resolved to fix this — see below.

### Why mirror reiment instead of re-adding the `--webpack` pin

The sibling project `reiment-l2-client` — migrated to Next.js the same way, deployed to Vercel, and confirmed working in production — uses plain `middleware.ts` (standard Edge middleware, never renamed) on `next@16.1.5`, with a plain `next build` (Turbopack) and no workaround. This is a real, currently-running, proven-good configuration, rather than a documented "temporary pin, not a real fix" (the previous incident note's own words). The user chose to fix `lms_client` by mirroring this exact configuration:

- Revert `proxy.ts` → `middleware.ts` (undo spec 35's rename).
- Downgrade `next` (and its matching `eslint-config-next`) from `16.1.6` to `16.1.5`, matching reiment's exact pinned version.
- No `--webpack` build pin — not needed once on the version/convention pair already proven not to hit this bug.

This was chosen over re-adding the `--webpack` pin because it matches a configuration with actual production track record, instead of relying on a webpack-specific workaround for a bug whose exact trigger conditions were never fully pinned down.

## Implementation

1. `git mv lms_client/proxy.ts lms_client/middleware.ts`; renamed the exported `proxy(request: NextRequest)` function back to `middleware(request: NextRequest)`. No other line changed — `config.matcher` (`/login`, `/admin/:path*`, `/user/:path*`, `/`), every import, and every redirect/role-check branch are byte-for-byte identical to before.
2. `lms_client/package.json`: `"next": "16.1.6"` → `"16.1.5"`, `"eslint-config-next": "16.1.6"` → `"16.1.5"`. `build` script left as plain `"next build"`.
3. `yarn install` to resolve the downgraded `next`/`eslint-config-next` and update `yarn.lock`.
4. Reverted every doc that spec 35 had updated to say `proxy.ts`, back to `middleware.ts`, and corrected the now-inaccurate "defaults to Node.js runtime" commentary spec 35 had added:
   - `context/architecture.md` (stack table, System Boundaries entry, `lib/` bullet, Auth & Access Model, Invariants)
   - `context/ai-workflow-rules.md` (Protected Files rule)
   - `context/project-overview.md` (Success Criteria)
   - Root `CLAUDE.md` (Commands section's build note — rewritten to record the full incident history including this fix, not just the disproven "Node runtime fixed it" claim — plus the Frontend architecture and Auth model sections)
5. `context/progress-tracker.md`: added a note correcting the previous "Resolved" status on the original incident entry, and a new spec-status table row for this spec marking spec 35 "⚠️ Reverted".

## Verify

- `yarn install` — `next@16.1.5` resolves cleanly.
- `yarn build` — production build succeeds under the downgraded version.
- `yarn lint` / `npx tsc --noEmit` — clean (rename + identifier + version bump only, no logic change).
- Local manual click-through (`yarn start`): `/`, `/login`, unauthenticated `/admin/*` and `/user/*` (redirect to `/login`), role-mismatched redirects, logged-in visit to `/login` (redirect to `/`) — confirms identical behavior to before the revert.
- **Mandatory, not optional:** deploy to Vercel and visit the actual production URL. Per the Design section above, a local `next start` pass cannot validate this class of bug — only a real Vercel deployment can confirm `/` no longer returns `MIDDLEWARE_INVOCATION_FAILED`. Do not mark this incident closed on local verification alone.
