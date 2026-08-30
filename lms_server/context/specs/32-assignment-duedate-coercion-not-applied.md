# 32. Assignment `dueDate` — Zod coercion discarded by `validateRequest`

## Goal

Fix a real bug found while live-verifying [`31-assignment.md`](31-assignment.md): `POST /api/assignment` (and `PATCH /api/assignment/:assignmentId`) 500s whenever a caller sends a bare `"YYYY-MM-DD"` `dueDate` — the exact shape the spec's own Design section says the frontend's native `<input type="date">` will send, and the exact shape `z.coerce.date()` was chosen specifically to handle.

## Root cause

`src/app/middleware/validateRequest.ts`:

```ts
const validateRequest = (Schema: AnyZodObject) => {
  return catchAsync(async (req, res, next) => {
    await Schema.parseAsync(req.body);
    next();
  });
};
```

`Schema.parseAsync(req.body)` runs the schema and returns a **new** parsed object — for `z.coerce.date()`, that returned object's `dueDate` field is a real `Date` instance. But the return value is never assigned back to `req.body`; the middleware just awaits it and calls `next()`. `req.body` reaching the controller/service is therefore untouched — still the raw JSON, where `dueDate` is the original string `"2026-09-15"`.

This was never visible before because `assignment.validation.ts` is the **first** validation schema in the codebase to use `z.coerce.date()` (or any `.transform`/coercion that changes a value's type/shape). Every prior schema (`createQuizSchema`, `updateModuleSchema`, etc.) only asserted shape/format on values that were already the right runtime type, so silently discarding the parsed copy never mattered — `req.body` already matched what the schema would have produced.

Symptom, reproduced live: `POST /api/assignment` with `{"dueDate":"2026-09-15", ...}` as an authorized, owning instructor returns `500`:

```
Invalid value for argument `dueDate`: premature end of input. Expected ISO-8601 DateTime.
```

`prisma.assignment.create()` receives the raw string `"2026-09-15"`, which Prisma's `DateTime` field rejects because it isn't a full ISO-8601 datetime (no time component) — the exact case `z.coerce.date()` was supposed to have already normalized via `new Date(...)`.

## Design

Fix `validateRequest.ts` to actually use the parsed/coerced result:

```ts
const validateRequest = (Schema: AnyZodObject) => {
  return catchAsync(async (req, res, next) => {
    req.body = await Schema.parseAsync(req.body);
    next();
  });
};
```

This is a one-line, behavior-preserving-for-everyone-else fix: for every existing schema (no `.coerce`/`.transform`), the parsed output is structurally identical to the input (Zod doesn't strip/rename fields these schemas don't touch, and none of them use `.strip()`/`.transform()` beyond plain type assertions), so no other endpoint's request-handling behavior changes. Only schemas that actually coerce/transform a value (currently just `assignment.validation.ts`'s `dueDate`) start behaving as originally designed.

**Scope check:** grepped every `*.validation.ts` in the codebase for `.coerce`/`.transform` — `assignment.validation.ts` is the only file using either. No other endpoint's behavior is affected by this fix.

## Implementation

1. `src/app/middleware/validateRequest.ts` — assign `Schema.parseAsync(req.body)`'s result back onto `req.body`.
2. Re-verify `POST /api/assignment` and `PATCH /api/assignment/:assignmentId` with a bare `"YYYY-MM-DD"` `dueDate` succeed and the stored value round-trips correctly via a following `GET /api/assignment/manage/:moduleId`.
3. Spot-check one or two other already-passing validated endpoints (e.g. quiz create) still work unchanged, confirming no regression from now assigning `req.body`.
4. `yarn build` / `yarn lint` clean.

## Verify-when-done

- [ ] `POST /api/assignment` with `{"moduleId": ..., "title": ..., "instructions": ..., "dueDate": "2026-09-15"}` → `201`, no Prisma error.
- [ ] Following `GET /api/assignment/manage/:moduleId` shows `dueDate` as a real stored timestamp for `2026-09-15` (midnight UTC).
- [ ] `PATCH /api/assignment/:assignmentId` with a new bare-date `dueDate` also succeeds and updates the value.
- [ ] Omitting `dueDate` entirely still works (`optional()` unaffected).
- [ ] An unrelated already-validated endpoint (e.g. `POST /api/quiz`) still behaves identically before/after the fix.
- [ ] `yarn build` / `yarn lint` clean.
