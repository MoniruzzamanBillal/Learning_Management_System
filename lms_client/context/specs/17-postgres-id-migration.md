# 17 — `_id` → `id` rename (Postgres/Prisma backend migration)

## Goal

Adapt the frontend to the backend's Postgres/Prisma migration ([`lms_server/context/specs/19-postgres-prisma-migration.md`](../../../lms_server/context/specs/19-postgres-prisma-migration.md), now complete), which renamed every entity's primary key from Mongo's `_id` to Prisma's `id` (still a string, now a UUID instead of a Mongo ObjectId). This is the one piece of frontend work that migration forces — no other frontend-visible change. This spec operationalizes `PostgressMigrationPlan/frontend-migration-plan.md` (repo root) into this app's spec format; that file remains the fuller rationale if anything here needs cross-checking.

## Current State

- Confirmed via fresh grep (matches the root plan's prior-audit numbers exactly, so no drift since it was written): **102 occurrences of `_id` across 43 files** in `lms_client` (excluding `node_modules`/`.next`).
- Three source-of-truth type files declare `_id: string`: `types/course.types.ts` (`TCourseData`), `types/user.types.ts` (`TInstructor` — not `TUser`, which has no `_id`), `types/module.types.ts` (`TModuleData`).
- `types/auth.types.ts` and `types/globalTypes.ts` have no `_id` usage — confirmed, no change needed.
- ID *values* stay strings (UUIDs instead of Mongo ObjectId strings) — no type changes beyond the field name itself, no new data-fetching patterns.

## Approach: compiler-driven sweep, not blind find-replace

Grepping for the literal string `_id` and replacing it everywhere is unreliable — some matches could be inside unrelated strings/comments, or on objects that aren't backend entities at all. Instead:

1. Rename `_id` → `id` in the three source-of-truth type files.
2. Run `yarn build` (or `npx tsc --noEmit` for a faster loop) immediately after.
3. Every typed usage of the old `_id` field now fails to compile — this gives an exhaustive, precise worklist.
4. Fix each compile error by renaming that specific usage to `.id`.
5. Repeat until the build is clean.

This also naturally excludes any `_id`-like text that isn't actually tied to these types.

## Implementation

1. **Rename in the 3 source-of-truth type files** — `TCourseData._id` → `.id`, `TInstructor._id` → `.id`, `TModuleData._id` → `.id`. If any single-feature type living in a feature's own `type/` subfolder also declares `_id` (not confirmed by the current audit, but possible since spec 16 colocated several), catch and rename it here too — the compiler sweep in step 2 will surface any missed.
2. **Compiler sweep** across `components/`, `hooks/`, `functions/`, `lib/` — fix every `tsc`/`yarn build` error. Expected concentration (from the prior audit, not exhaustive): `components/` (~38 files, the large majority) — type/interface fields and destructuring (`const { _id } = course` → `const { id } = course`), React list keys (`key={item._id}` → `key={item.id}`), URL/route building (`` `/courses/${course._id}` `` → `` `/courses/${course.id}` ``), nested entity access (`rowData?.user?._id`, `rowData?.course?._id`, e.g. `components/main/(User)/Certificates/column/CertificateTableColumn.tsx`); `lib/` (2 files) — `lib/redux/features/auth/authSlice.ts`, `lib/redux/features/auth/authTypes.ts`.
3. **Manually spot-check Redux auth state** — `authSlice.ts`/`authTypes.ts` decode the JWT client-side (`jwt-decode`) to read fields like `role`; that decode boundary is loosely typed and a `_id`-shaped mismatch there will **not** surface as a `tsc` error even though the rest of the sweep does. Manually check whether the decoded JWT payload or any `useSelector` read expects `_id` and fix if so, even without a compiler error forcing it.
4. **Full build verification** — `yarn build` must complete with zero TypeScript errors. This is the actual completion signal, not "grep shows zero remaining `_id` matches" (that heuristic both over- and under-counts, per the compiler-driven rationale above).

## Out of Scope

- No changes to `hooks/useApi.ts`, `lib/api.ts`, `lib/axiosInstance.ts` — ID-format-agnostic, pass IDs through as opaque strings/URL segments.
- No changes to `functions/*.functions.ts` orchestration beyond what falls out of the rename itself.
- No changes to `middleware.ts` (JWT role-based route gating) — reads `role`, not an entity ID.
- No UI/UX changes — pure field-rename to match the new backend contract.

## Dependencies

None — no new packages. Requires the `lms_server` dev server actually running against Postgres (already true — see spec 19) for live verification to be meaningful.

## Verify When Done

- [ ] `yarn build` passes with zero TypeScript errors.
- [ ] `yarn lint` clean (or at the established pre-existing baseline).
- [ ] Manually exercise a few key screens end-to-end against the migrated backend: course list → course detail (URL built from `course.id`), enrolled-course list → module/video navigation (keys and route params built from `.id`), admin course/module/video management CRUD tables (React table row keys).
- [ ] `lms_client/context/progress-tracker.md` logs this as a completed milestone tied to the backend migration.
- [ ] Root `CLAUDE.md` and `lms_client/context/architecture.md` — if either documents `_id` as the entity ID field name anywhere, update to `id`.
