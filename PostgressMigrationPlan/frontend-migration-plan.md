# Frontend Migration Plan — Adapting to the Postgres/Prisma Backend

## Context

The backend migration (see `backend-migration-plan.md`) renames every entity's primary key from Mongo's `_id` to Prisma's idiomatic `id` (typed as a UUID string). The frontend (`lms_client/`) reads `_id` directly in roughly **102 occurrences across 43 files** — types, components, hooks, and one Redux slice — so this is the one piece of frontend work the backend migration forces. There is no other frontend-visible change: ID *values* stay strings (UUIDs instead of Mongo ObjectId strings), so no type changes beyond the field name, no new data-fetching patterns, and no changes to `hooks/useApi.ts`, `lib/axiosInstance.ts`, or `functions/*.functions.ts` orchestration.

**Do this after the backend module rewrites are far enough along that real API responses actually contain `id`, not `_id`** — frontend types must match real output, not a guess. Rewriting frontend types against a still-`_id` backend produces a green build that's wrong the moment the backend catches up.

## Approach: compiler-driven sweep, not blind find-replace

Grepping for the literal string `_id` and replacing it everywhere is unreliable — some matches may be inside unrelated strings/comments, or on objects that aren't backend entities at all. Instead:

1. Rename `_id` → `id` in the three source-of-truth type files (Step 1 below).
2. Run `tsc --noEmit` (or `yarn build`) immediately after.
3. Every typed usage of the old `_id` field now fails to compile — this gives an exhaustive, precise worklist.
4. Fix each compile error by renaming that specific usage to `.id`.
5. Repeat until the build is clean.

This also naturally excludes any `_id`-like text that isn't actually tied to these types (so you don't touch things you shouldn't).

## Step 1 — Rename in source-of-truth types

Confirmed to contain `_id: string` fields (rename to `id: string`):

- `lms_client/types/course.types.ts`
- `lms_client/types/user.types.ts`
- `lms_client/types/module.types.ts`

Confirmed to have **no** `_id` usage — no change needed:

- `lms_client/types/auth.types.ts`
- `lms_client/types/globalTypes.ts`

If any single-feature types living in a feature's own `type/` subfolder (e.g. `components/main/(Admin)/Stat/type/stat.types.ts`) also declare `_id`, catch and rename them here too — the compiler sweep in Step 2 will surface any that were missed.

## Step 2 — Compiler sweep across `components/`, `hooks/`, `functions/`, `lib/`

Run from `lms_client/`:

```bash
yarn build
# or, for a faster iterative loop:
npx tsc --noEmit
```

Fix every resulting error. Known concentration of usages (from prior audit — not exhaustive, just where to expect the bulk of the work):

- **`components/` — ~38 files**, the large majority of occurrences. Patterns to expect:
  - Type/interface fields and destructuring: `const { _id } = course` → `const { id } = course`.
  - React list keys: `key={item._id}` → `key={item.id}`.
  - URL/route building: `` `/courses/${course._id}` `` → `` `/courses/${course.id}` ``.
  - Nested entity access: `rowData?.user?._id`, `rowData?.course?._id` (e.g. `components/main/(User)/Certificates/column/CertificateTableColumn.tsx`) → `.user?.id`, `.course?.id`.
- **`types/` — the 3 files in Step 1.**
- **`lib/` — 2 files**: `lib/redux/features/auth/authSlice.ts`, `lib/redux/features/auth/authTypes.ts`.

## Step 3 — Manually spot-check Redux auth state

`lib/redux/features/auth/authSlice.ts` and `authTypes.ts` decode the JWT client-side (`jwt-decode`) to read fields like `role`. JWT-decode results are sometimes loosely typed (`any`) at the decode boundary — a mismatch there **will not** surface as a `tsc` error even though the compiler sweep in Step 2 covers the rest of the codebase. Manually check:

- Does the decoded JWT payload include the user's ID under `_id`, and does anything in `authSlice.ts` read it that way?
- Does any component read `useSelector` state expecting `state.auth.user._id` or similar?

Fix any found instances even though the compiler didn't flag them.

## Step 4 — Full build verification

```bash
cd lms_client && yarn build
```

Must complete with zero TypeScript errors before this is considered done. A successful build is the actual completion signal for this migration — not "grep shows zero remaining `_id` matches," since that heuristic both over- and under-counts (see Step 2's rationale).

## Out of scope for this migration

- No changes to `hooks/useApi.ts`, `lib/api.ts`, `lib/axiosInstance.ts` — these are ID-format-agnostic (they pass IDs through as opaque strings/URL segments).
- No changes to `functions/*.functions.ts` orchestration files beyond what falls out of the `_id`→`id` rename itself.
- No changes to `middleware.ts` (JWT role-based route gating) — it reads `role` from the decoded JWT, not an entity ID.
- No UI/UX changes — this is a pure field-rename to match the new backend contract, values stay the same shape (strings), just formatted as UUIDs instead of Mongo ObjectIds.

## Documentation updates

- `lms_client/context/progress-tracker.md` — log the `_id` → `id` rename as a completed milestone tied to the backend Postgres/Prisma migration.
- Root `CLAUDE.md` and `lms_client/context/architecture.md` — if either documents `_id` as the entity ID field name anywhere, update to `id`.

## Verification

- `yarn build` passes with zero TypeScript errors (Step 4).
- Manually exercise a few key screens end-to-end against the migrated backend to confirm IDs round-trip correctly: course list → course detail (URL built from `course.id`), enrolled-course list → module/video navigation (keys and route params built from `.id`), and the admin course/module/video management CRUD tables (React table row keys).
- Cross-check against the backend migration's Postman collection updates (`LMS_system.postman_collection.json` at repo root) — confirm the JSON response shapes you're now typing against in the frontend match what Postman shows coming back from the live API.
