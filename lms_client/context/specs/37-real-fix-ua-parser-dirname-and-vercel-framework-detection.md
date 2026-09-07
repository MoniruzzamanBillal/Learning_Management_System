# 37 — The real fix: patch Next's ua-parser-js `__dirname` bug + force Vercel framework detection

## Status

✅ Implemented and verified live in production (`devmats.vercel.app`).

## Goal

Spec 36 reverted `proxy.ts` → `middleware.ts` and downgraded Next.js to `16.1.5` on the theory that mirroring the sibling `reiment-l2-client` project's configuration would fix the recurring `MIDDLEWARE_INVOCATION_FAILED` / `ReferenceError: __dirname is not defined` crash. **That theory was wrong.** After deploying spec 36's fix for real (via `vercel --prod` from the actual project directory, not just a local `next start`), production crashed with the identical error. This spec documents the actual investigation, the real root cause (two unrelated bugs), and the real fix — both verified against the real deployed artifact and the live production URL, not local approximations.

## Investigation

### Correcting the comparison to reiment

`reiment-l2-client`'s "working" deployment was never a valid point of comparison. Its middleware only matches `/dashboard/:path*`, `/cart`, `/checkout` (not `/`). Curling its actual production URL revealed its response body is a **Vite/React SPA shell** (`<title>Reiment-Ecommerce</title>`, hashed `assets/index-*.js`), not the migrated Next.js app at all — the live deployment is serving a stale pre-migration build. Its Next.js middleware has, in practice, never been exercised in production. Nothing about its "success" said anything about whether the `__dirname` bug is version- or convention-dependent.

### Root cause #1: a genuine, confirmed upstream Next.js bug

Using `vercel pull` + `vercel build --prod` (Vercel's own local build pipeline, matching what the platform actually deploys) rather than a local `next build`/`next start`, the exact deployed Edge Middleware artifact (`.vercel/output/functions/middleware.func/`) was inspected directly. It ships **unbundled, raw `next/dist/...` source files** as `node_modules` (not a single self-contained bundle) — including `next/dist/compiled/ua-parser-js/ua-parser.js`. That file's ncc-generated wrapper contains:

```js
if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";
```

This line executes **unconditionally at module top level** — merely importing the file crashes on Vercel's Edge (v8-worker) sandbox, which has no `__dirname`. And it always gets imported: `next/dist/server/web/spec-extension/user-agent.js` (part of `next/server`'s core export graph) does `require("next/dist/compiled/ua-parser-js")` at its own top level. So simply importing `NextRequest`/`NextResponse` from `next/server` — which any middleware must do — unconditionally pulls this in, regardless of whether the app ever calls `userAgent()`. This is independent of Turbopack vs. webpack and independent of the Next 16.1.5/16.1.6 patch version (confirmed: both a Turbopack and a `next build --webpack` build shipped the identical broken file via Vercel's build pipeline).

### Root cause #2: an unrelated Vercel project misconfiguration

After patching root cause #1, the deployed site returned `404 NOT_FOUND` for **every** route, including ones with nothing to do with middleware (`/about-us`, `/courses`). `.vercel/output/diagnostics/deploy-manifest.json` showed the build had resolved to the generic `@vercel/node` builder rather than Next.js's own framework integration, and `.vercel/project.json`'s `settings.framework` was `null` — this Vercel project has never had an explicit framework preset configured, and auto-detection was silently choosing the wrong builder (only handling the middleware function, dropping every actual page route). This is entirely unrelated to the `__dirname` bug; it would affect any framework-null Vercel project regardless of the Next.js version or middleware setup.

## Fix

### 1. Patch the actual broken line (`patch-package`)

Added `patch-package` as a dev dependency and a `postinstall: patch-package` script. The patch (`patches/next+16.1.5.patch`) changes:

```diff
- if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";
+ if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab="/";
```

in `node_modules/next/dist/compiled/ua-parser-js/ua-parser.js`. `__nccwpck_require__.ab` is ncc's internal "asset base" path, unused by this particular bundle (it does no dynamic `require`/asset loading) — hardcoding it to `"/"` removes the only `__dirname` reference without changing any UA-parsing behavior. `postinstall` re-applies this automatically after every `yarn install`, including Vercel's own build-time install.

### 2. Force correct framework detection

Added `lms_client/vercel.json`:

```json
{
  "framework": "nextjs"
}
```

This makes Vercel always use the Next.js framework builder for this project regardless of the dashboard project setting (which remains `null` and was left alone — fixing it via a repo-committed file is more robust than relying on dashboard configuration that clearly wasn't being maintained).

## Verify

Both fixes were verified against the **actual Vercel build pipeline**, not a local approximation:

- `vercel pull --yes --environment production` + `vercel build --prod --yes` — inspected `.vercel/output` directly:
  - `functions/middleware.func/` (the only Edge/`v8-worker` function): **0** `__dirname` references anywhere in the tree (confirmed via `grep -rl`).
  - `config.json`: 64 routes, real functions/segments generated for every page (`courses/[id].func`, `about-us.rsc.func`, etc.) — not just the middleware entry.
- Deployed via `vercel --prod --yes` and curled the live production domain directly:
  - `GET https://devmats.vercel.app/` → `200`, real rendered HTML.
  - `GET /login`, `/courses` → `200`.
  - `GET /admin/foo`, `/user/foo` (unauthenticated) → `307` redirect to `/login?callbackUrl=...`, matching the unchanged middleware logic.
- `___next_launcher.cjs` files inside the separate **Node.js** serverless functions (`courses/[id].func`, etc.) do reference `__dirname` — this is expected and harmless, since those run in a real Node.js runtime where `__dirname` is defined; only the Edge-runtime `middleware.func` mattered.

## Lesson for future incidents of this shape

Local `next build`/`next start` cannot validate Edge-runtime-sandbox bugs (a real Node process always provides `__dirname`) or Vercel-platform build/routing behavior (framework detection, builder selection). The only trustworthy verification for a Vercel-specific production issue is `vercel pull` + `vercel build` (to inspect the exact deployed artifact) followed by an actual `vercel --prod` deploy and a live curl of the production domain.
