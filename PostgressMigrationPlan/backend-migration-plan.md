# Backend Migration Plan — MongoDB/Mongoose → PostgreSQL/Prisma

## Context

`lms_server/` currently persists everything in MongoDB via Mongoose across 12 modules (`src/app/modules/*`). This migrates it to PostgreSQL (hosted on Neon) via Prisma. Existing data will be lost — this is a clean schema rebuild, not a data migration/ETL. Rollout is a big-bang single cutover on one branch, not a phased dual-DB rollout. There is no backend test suite today, so verification is manual (Postman collection at repo root: `LMS_system.postman_collection.json`).

Work happens in two stages:
- **Stage 1**: design and stand up the complete Prisma schema for all 9 entities before touching any service code.
- **Stage 2**: rewrite the backend module by module, in FK-dependency order, against the finished schema.

## Decisions (follow exactly, do not re-litigate)

1. **ID field**: Mongo's `_id` → Prisma's `id`, typed as a UUID string, generated as `id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid` uniformly across all models (Postgres-native generation via Neon's built-in `pgcrypto`, works even for rows inserted outside Prisma).
2. **Soft-delete filtering**: no Prisma middleware/extension. Add `isDeleted: false` **explicitly** to every relevant query at each call site. Apply this only to the four models that actually had the Mongoose `pre("find")`/`pre("findOne")` hook — **User, Module, Video, Review**. **CourseEnrollment and Payment never had this hook in Mongo** — do not add the filter to their queries by default; only where the current code manually filtered (verify per call site).
3. **New constraints not present in the current Mongo schema** (confirmed additions, not silent):
   - `VideoProgress`: add `@@unique([userId, videoId])` — service rewrite must use an upsert pattern, not plain `create`.
   - `Review`: add `@@unique([userId, courseId])` — service rewrite needs a friendly mapped error message for the constraint-violation case, not a raw Prisma stack trace.
4. **SSLCommerz-inside-transaction smell**: `CourseEnrollment.service.ts::enrollInCourse` calls the SSLCommerz HTTP API inside the DB transaction today. Leave this ordering exactly as-is — do not "fix" it as part of this migration.
5. **Money fields**: `Course.price` and `Payment.amount` become `Decimal @db.Decimal(10,2)` (not `Float`) for precision in revenue/price math.
6. **Postgres host**: Neon (serverless, pairs with Prisma + Vercel).
7. **errorLog TTL replacement**: Mongo's 30-day TTL index has no Postgres/Prisma equivalent. Replace with a Vercel Cron job hitting a new API route that deletes old rows. Auth via Vercel's built-in cron-request verification (the `Authorization: Bearer <CRON_SECRET>` header Vercel automatically sends on cron invocations), not a custom scheme.

**Preserve as-is, do not "fix" during this migration**: `auth.service.ts::createInstructor`'s hardcoded default password `"123456"` + `needsPasswordChange: true` — documented as a deliberate known gap in `lms_server/context/architecture.md`.

---

## Stage 1 — Full Prisma schema design (do this completely before any module rewrite)

### 1.1 Setup steps, in order

1. `cd lms_server && yarn add -D prisma && yarn add @prisma/client`.
2. **Manual prerequisite (not automatable)**: sign up at neon.tech, create a project/branch, copy both the pooled and direct (non-pooled) connection strings.
3. `npx prisma init` — creates `prisma/schema.prisma`, adds `DATABASE_URL` to `.env`. Note: `DATABASE_URL` is **already** the env var name Mongoose uses today (`src/app/config/index.ts` → `config.database_url`, used in `mongoose.connect(...)` in `src/server.ts`) — its *value* is repurposed from a Mongo URI to the Neon Postgres URI; the var isn't renamed. Also add `DIRECT_URL` for Neon's non-pooled connection string:
   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```
   (Neon's pooled URL for runtime queries, direct URL for running migrations — matters on Vercel serverless.)
4. Author the full `schema.prisma` per Section 1.2 below — every model, before writing any service code.
5. `npx prisma migrate dev --name init` — generates migration SQL against Neon, regenerates the Prisma Client.
6. Hand-edit the generated migration SQL to add the Video partial unique index (Section 1.2, Video model).
7. Add `"postinstall": "prisma generate"` to `lms_server/package.json` scripts — required so Vercel's build step regenerates the client after `yarn install`.
8. Check `schema.prisma`'s `generator client { binaryTargets = [...] }` covers Vercel's Lambda runtime (e.g. `"rhel-openssl-3.0.x"` in addition to `"native"`) — verify against Vercel's current Node runtime docs at implementation time; treat as an explicit deploy-time check, not an assumption.

### 1.2 Model-by-model schema design

Global conventions applied to every model: `id` per decision #1; `createdAt DateTime @default(now())` / `updatedAt DateTime @updatedAt` on every model (all had Mongoose `timestamps: true`); FK columns named `<relation>Id` camelCase (`courseId`, `userId`, `moduleId`, `videoId`, `instructorId`, `paymentId`).

**User**
- `name String`, `email String @unique`, `password String`, `profilePicture String?`, `isDeleted Boolean @default(false)`, `needsPasswordChange Boolean @default(false)`, `userRole UserRole @default(user)`.
- `enum UserRole { admin instructor user }` (from `user.constants.ts`).
- Back-reference relations to every other model (no FK columns on User itself).

**Course**
- `name String @unique`, `description String`, `price Decimal @db.Decimal(10,2)`, `category String`, `published Boolean @default(false)`, `courseCover String?`, `aiReviewSummary String?`, `aiReviewSummaryReviewCount Int?`.
- **No `isDeleted`** — matches today (hard delete only), don't add it.
- `modules Module[]` (one-to-many) and `instructors` via the `CourseInstructor` join model below replace Mongo's denormalized `instructors: [ObjectId]` / `modules: [ObjectId]` arrays — those arrays are dropped entirely, not ported.

**CourseInstructor** (new explicit join model, Course↔User many-to-many, replaces `Course.instructors: [ObjectId]`)
- `courseId String`, `userId String`, synthetic `id`, `@@unique([courseId, userId])`.
- `course Course @relation(fields: [courseId], references: [id])`, `instructor User @relation(fields: [userId], references: [id])`.

**Module** (backend module dir stays `courseModule`)
- `courseId String`, `instructorId String` (single required FK — **fixes** the existing `TModule` interface bug where `instructor` was incorrectly typed as an optional array; when rewriting the service in Stage 2, verify no logic actually depended on that array typing).
- `title String`, `isDeleted Boolean @default(false)`.
- Denormalized `videos: [ObjectId]` array dropped — derive via `Video.moduleId` one-to-many.
- `course Course @relation(fields: [courseId], references: [id])`.
- `instructor User @relation("ModuleInstructor", fields: [instructorId], references: [id])` — named relation, since User has more than one distinct relation to Module-family models.

**Video** (backend module dir stays `VideoModule`)
- `moduleId String`, `title String`, `instructorId String`, `videoUrl String`, `videoOrder Int`, `isDeleted Boolean @default(false)`.
- `module Module @relation(fields: [moduleId], references: [id])`, `instructor User @relation("VideoInstructor", fields: [instructorId], references: [id])`.
- **Partial unique index**: Prisma's schema DSL can't express `WHERE isDeleted = false`. Add a plain index in the schema for query performance:
  ```prisma
  @@index([moduleId, videoOrder])
  ```
  Then, after step 1.1.5 generates the base migration, hand-edit the migration SQL file (`prisma/migrations/<timestamp>_init/migration.sql`) to add:
  ```sql
  CREATE UNIQUE INDEX "Video_moduleId_videoOrder_active_unique" ON "Video"("moduleId","videoOrder") WHERE "isDeleted" = false;
  ```
  This survives future `migrate dev` runs (Prisma treats applied migrations as immutable) but must be manually re-added if this migration is ever reset/replayed (`prisma migrate reset`). Note this caveat in a comment inside the migration file itself, and in `context/architecture.md` during doc updates.

**VideoProgress**
- `userId String`, `courseId String`, `moduleId String`, `videoId String`, `videoStatus VideoStatus?` (`enum VideoStatus { locked unlocked watched }`, nullable, no default — matches today).
- Per decision #3: `@@unique([userId, videoId])`.

**CourseEnrollment**
- `userId String`, `courseId String`, `paymentId String` (normalized from Mongo's capitalized `Payment` field to camelCase), `completed Boolean @default(false)`, `isDeleted Boolean @default(false)` (present in schema, but per decision #2 **not** auto-filtered by default), `isReviewed Boolean @default(false)`.
- Owns the physical FK to Payment (see circular-ref resolution under Payment below).

**Payment**
- `userId String`, `courseId String`, `paymentStatus PaymentStatus @default(Pending)` (`enum PaymentStatus { Completed Pending Failed }`, from `payment.constant.ts`), `amount Decimal @db.Decimal(10,2)`, `transactionId String`, `isDeleted Boolean @default(false)` (same caution as CourseEnrollment — not auto-filtered today).
- **Circular ref resolution**: Mongo has `Payment.CourseEnrollment` (optional) and `CourseEnrollment.Payment` (required) pointing at each other. In Prisma: `CourseEnrollment.paymentId` is the physical FK (a Payment is created first in the real enrollment flow, then CourseEnrollment references it). `Payment.enrollment CourseEnrollment?` is just the inverse accessor Prisma derives — no physical column added to the Payment table. During Stage 2's CourseEnrollment/Payment rewrite, verify against `payment.service.ts` / `CourseEnrollment.service.ts::enrollInCourse` that no code path actually creates a CourseEnrollment before its Payment.

**Review**
- `userId String`, `courseId String`, `rating Int` (Prisma's schema DSL has no native 1–5 range check — keep the existing Zod range validation as the enforcement layer; verify `review.validation.ts` still has it), `comment String`, `isDeleted Boolean @default(false)`.
- Per decision #3: `@@unique([userId, courseId])`.

**ErrorLog**
- `message String`, `statusCode Int`, `errorSources Json` (plain JSON column — write-once/read-rarely diagnostic data never queried by its internal sub-fields, so a related table isn't warranted), `stack String?`, `method String`, `path String`, `ip String?`, `userId String?` (optional FK, `onDelete: SetNull`), `userRole String?`.
- No expiry field — cleanup is entirely the Vercel Cron route (Stage 2, module 9).

**Relation naming**: only `User↔Module` (`ModuleInstructor`) and `User↔Video` (`VideoInstructor`) need explicit `@relation("Name", ...)`, since User has multiple distinct relations to those two models. Every other relation is a single pair and needs no name.

### 1.3 Stage 1 exit criteria

- `schema.prisma` contains all 9 models above plus the `CourseInstructor` join model and the three enums (`UserRole`, `PaymentStatus`, `VideoStatus`).
- `npx prisma migrate dev --name init` has run successfully against Neon.
- The Video partial-unique-index SQL has been hand-added to the generated migration and verified in the Neon database (`\d "Video"` in `psql`, or check via Neon's SQL editor).
- `npx prisma generate` produces a working `@prisma/client` with no schema errors.
- Only after this is fully done should Stage 2 begin.

---

## Stage 2 — Module-by-module implementation (against the finished schema)

Dependency-safe order from the FK graph:

### 2.1 User (`src/app/modules/user/`)
- No dependencies. Rewrite `user.service.ts` to `prisma.user.*`.
- **No Mongoose lifecycle hook exists in Prisma.** Audit *every* create/update path in `user.service.ts` and `auth.service.ts` (not just the ones that already manually hash) to call `bcrypt.hash()` explicitly before `prisma.user.create`/`update`.
- Delete `user.model.ts`. Gut `user.interface.ts`, re-exporting the generated Prisma `User` type as `TUser` to minimize call-site churn elsewhere.

### 2.2 Course (`src/app/modules/course/`)
- Heaviest rewrite in the whole migration:
  - `getAllCourses` currently does `.populate()` on a Mongo aggregation result array — **no Prisma equivalent**. Full rewrite to a single `prisma.course.findMany({ where, include, skip, take })`. Since this is a full rewrite anyway, also fix the pre-existing bug where the paginated query and the separate `countDocuments` call use inconsistent filters — build both from one shared `where` object.
  - `adminStatistics` has 4 sub-aggregations. Evaluate each individually: simple grouping/counting/averaging → Prisma `groupBy`/`aggregate`; anything bucketing by day (Mongo's `$dateToString`) → `prisma.$queryRaw` using Postgres `date_trunc('day', "createdAt")`, tagged-template form only (never string concatenation), with the return shape typed manually since `$queryRaw` isn't auto-typed.

### 2.3 Module/courseModule (`src/app/modules/courseModule/`)
- Depends on Course + User.
- Fix the `TModule.instructor` typing bug (single required FK, not optional array) as part of this rewrite; check `module.controller.ts`/`module.service.ts` for logic that assumed the buggy array typing.

### 2.4 Video/VideoModule (`src/app/modules/VideoModule/`)
- Depends on Module + User.
- After the partial-unique-index SQL is confirmed applied (Stage 1), manually test: two active videos with the same `(moduleId, videoOrder)` → must fail; one soft-deleted + one active with the same order → must succeed.

### 2.5 Payment (`src/app/modules/payment/`)
- Depends on User, Course.
- Rewrite before CourseEnrollment, since CourseEnrollment's `paymentId` FK requires the Payment row to exist first.

### 2.6 CourseEnrollment (`src/app/modules/CourseEnrollment/`)
- Depends on User, Course, Payment.
- Convert `session.startTransaction()` → `prisma.$transaction(async (tx) => {...})` (interactive form — the code reads then writes within the transaction).
- Convert `insertMany` → `createMany` (check whether the current code uses the `insertMany` return value; if so, may need `createManyAndReturn`, Prisma 5+/Postgres).
- `getUserEnrolledCourse`'s 2-level nested populate → nested Prisma `include` (mirror the exact current nesting when rewriting).
- Per decision #4: keep the SSLCommerz HTTP call inside the transaction exactly as today.

### 2.7 Review (`src/app/modules/review/`)
- Depends on User, Course.
- Drop the `mongoose.Types.ObjectId` cast used for aggregation matching — becomes a no-op plain string.
- Rewrite `getAverageReviewOfCourse` (grouping/averaging aggregation → Prisma `aggregate`/`groupBy`).
- Add the friendly unique-constraint error mapping required by the new `@@unique([userId, courseId])` (decision #3).

### 2.8 VideoProgress (`src/app/modules/VideoProgress/`)
- Depends on User, Course, Module, Video.
- Convert `videoProgress.functions.ts::addVideoCoursePublish`'s `insertMany` → `createMany`.
- Implement the upsert pattern required by the new `@@unique([userId, videoId])` (decision #3).

### 2.9 errorLog, ai, SSL, auth-glue (last)
- **errorLog**: drop the Mongo TTL index entirely (already gone from the schema per Stage 1). Implement:
  1. New route (e.g. `GET /api/cron/cleanup-error-logs`, or a new action added to `errorLog.route.ts`) running `prisma.errorLog.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 30*24*60*60*1000) } } })`.
  2. Auth per decision #7: verify the `Authorization: Bearer <CRON_SECRET>` header Vercel's cron invocation automatically sends; add `CRON_SECRET` to `src/app/config/index.ts` and to Vercel env vars.
  3. Edit `lms_server/vercel.json` (currently the legacy `builds`/`routes` format, no `crons` key) to add:
     ```json
     "crons": [{ "path": "/api/cron/cleanup-error-logs", "schedule": "0 3 * * *" }]
     ```
     Confirm at implementation time whether the legacy `builds`/`routes` format still supports a `crons` key alongside it, or whether the file needs modernizing to the `functions`-based schema — check current Vercel docs, and check Hobby-vs-Pro plan cron frequency limits.
- **ai**: no schema of its own — rewrite Course/Module/VideoProgress reads to Prisma calls, keep writing `aiReviewSummary`/`aiReviewSummaryReviewCount` via `prisma.course.update`.
- **SSL**: no model — only calls through the now-migrated Payment service, should need minimal changes.
- **auth**: `auth.model.ts` is confirmed empty (0 bytes) — delete it. Rewrite `auth.service.ts` against `prisma.user.*`. Preserve `createInstructor`'s hardcoded default password exactly (see Decisions above — do not "fix" it).

### 2.10 Validation layer — Mongo ObjectId → UUID (do this pass alongside modules 2.2–2.4)
`course.validation.ts`, `courseModule/module.validation.ts`, and `VideoModule/videol.validation.ts` each hardcode:
```ts
z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid object id !!!" })
```
Change all three to `z.string().uuid({ message: "Invalid id !!!" })` and remove the `mongoose` import from each. At the end of Stage 2, grep `mongoose` across all `*.validation.ts` to confirm no stragglers remain.

### 2.11 DB connection bootstrap (do this first, before 2.1, so `prisma` is importable)
Replace `mongoose.connect(config.database_url as string)` in `src/server.ts` with a Prisma Client singleton in a new `src/app/util/prisma.ts` (co-located with `catchAsync.ts`, `sendResponse.ts`), using the standard serverless-safe singleton pattern: attach to `globalThis` in dev to survive hot-reload without exhausting connections; plain `new PrismaClient()` in prod.

### 2.12 Soft-delete explicit-filter pass (apply while rewriting each of 2.1, 2.3, 2.4, 2.7 — User, Module, Video, Review only)
Walk every service function in those four modules and add `isDeleted: false` to the Prisma `where`. Prisma gotcha to watch for: `findUnique` can't combine a unique-field lookup with extra `where` conditions — any code combining an `id` lookup with `isDeleted: false` (e.g. `ValidateCourseAccess.ts`'s two `findOne` calls) must use `findFirst`, not `findUnique`, even though `id` is unique.

### 2.13 `.select()` exclusion-string conversions (apply as encountered across all modules)
18 confirmed uses; any using Mongo's `-field` exclusion syntax have no Prisma equivalent — convert to explicit inclusion `select: {...}` listing every field except the excluded one(s), cross-referencing the full field list from `schema.prisma`.

---

## Verification (manual — no backend test suite exists)

Use `LMS_system.postman_collection.json` (repo root) as the primary harness; update its request/response bodies (`_id` → `id`) as part of "done," not an afterthought. Verify in this order, matching the module rewrite order:

1. **Auth**: register → confirm password is hashed in Neon (check via `prisma studio` or `psql`, never plaintext); login → confirm JWT issuance; `createInstructor` → confirm default password `"123456"` + `needsPasswordChange: true` unchanged.
2. **Course CRUD**: create/read/update/delete via Postman; verify `published`/`category`/`price` filters, and that paginated results now match `count` results for the same filter set (the bug fix from 2.2).
3. **Module + Video ordering**: create a module, create videos with sequential `videoOrder`; test the partial unique index directly (two active same-order videos → fail; one soft-deleted + one active same order → succeed).
4. **Enrollment + Payment (SSLCommerz sandbox)**: run the full flow (Payment created → SSLCommerz redirect/callback → CourseEnrollment created with `paymentId`); confirm `$transaction` behavior matches expectations with the HTTP call still inside it.
5. **Review**: submit a review, confirm `getAverageReviewOfCourse` returns correct aggregated values; confirm a second review by the same user on the same course is rejected with a friendly error (not a raw Prisma stack trace), validating the new `@@unique([userId, courseId])`.
6. **Video progress**: mark videos watched/unlocked in sequence; confirm the new `@@unique([userId, videoId])` upsert path behaves correctly (no duplicate-row errors on repeat updates).
7. **AI review summary caching**: trigger generation, confirm `aiReviewSummary`/`aiReviewSummaryReviewCount` update correctly and cache-invalidation still reads the right fields.
8. **Admin dashboard aggregations**: exercise all 4 `adminStatistics` sub-aggregations + `enrollmentsPerCourse`; spot-check the `$queryRaw` day-bucketed numbers against a manual `psql` query on a known dataset.
9. **Error log + cleanup cron**: trigger a deliberate error, confirm an `ErrorLog` row is created correctly (including `errorSources` as `Json`); confirm admin-only read works; manually invoke the cron route (with correct `CRON_SECRET`/Authorization header) against a seeded old-dated row to confirm 30-day-old rows delete and recent ones survive; after deploy, check Vercel's cron execution logs to confirm the schedule actually fires.

## Documentation updates (per this repo's own CLAUDE.md convention)

- `lms_server/context/architecture.md` — stack table Mongoose/MongoDB → Prisma/PostgreSQL (Neon); document the new manual-explicit-filter soft-delete pattern (no more `pre(find)` hooks); document the partial-unique-index-via-raw-SQL caveat for Video; document the Vercel Cron replacement for errorLog TTL.
- `lms_server/context/code-standards.md` — replace any Mongoose-specific conventions (schema/hook patterns, `.lean()`, ObjectId handling) with Prisma equivalents (query patterns, `$transaction` usage, the new required explicit-soft-delete-filter convention).
- `lms_server/context/progress-tracker.md` — log the migration as a completed milestone.
- Root `CLAUDE.md` — "Express + TypeScript + Mongoose REST API" → Prisma/PostgreSQL; update the documented soft-delete hook pattern to the new manual-filter convention; re-verify the multipart `JSON.parse(req.body?.data)` file-upload pattern is unaffected (should be, it's DB-layer-independent, but re-verify since CLAUDE.md calls it out as load-bearing).

## Critical files

- `lms_server/prisma/schema.prisma` — new, the entire data model (Stage 1).
- `lms_server/src/app/util/prisma.ts` — new, Prisma Client singleton replacing `mongoose.connect` in `src/server.ts`.
- `lms_server/src/app/modules/course/course.service.ts` — heaviest rewrite (`getAllCourses` aggregate+populate rework, `adminStatistics` raw-SQL day-bucketing).
- `lms_server/src/app/modules/CourseEnrollment/CourseEnrollment.service.ts` — transaction conversion, circular Payment/CourseEnrollment FK resolution.
- `lms_server/src/app/modules/course/course.validation.ts`, `courseModule/module.validation.ts`, `VideoModule/videol.validation.ts` — Mongo ObjectId → UUID Zod validators.
- `lms_server/vercel.json` — add `crons` entry for errorLog cleanup.
