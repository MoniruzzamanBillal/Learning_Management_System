# AI Workflow Rules

## Overall Approach

This is a live, already-built codebase (not a greenfield build) — the priority is making correct, minimally-invasive changes that fit the existing module pattern, not re-architecting. Work one endpoint/feature at a time and verify before moving on.

## Scoping Rules

1. **Follow the existing module split.** A new endpoint gets route/controller/service/model/interface/validation/constants files matching the pattern in `context/architecture.md`, inside `src/app/modules/<name>/`. Don't invent a different structure for a new module.
2. **No speculative changes.** Don't refactor unrelated modules, don't "clean up" other modules' commented-out code, don't add scaffolding for hypothetical future features.
3. **Don't add new core libraries/patterns without asking** — e.g. a different validation library instead of Zod, a different ORM, a different auth scheme, a testing framework. The stack in `context/architecture.md` is intentional.

## Handling Missing Requirements

- If a request/response payload shape isn't specified, check `LMS_system.postman_collection.json` (repo root) and the corresponding frontend `types/*.types.ts` in `lms_client` before guessing — the frontend and Postman collection are the source of truth for the actual wire format in use.
- If an edge case is ambiguous (e.g. what happens to enrollment/payment records when a course is unpublished), stop and ask rather than guessing the business rule.

## Protected / Sensitive Areas

- `src/app/config/index.ts` — its shape is read from many modules; changing a key name is a breaking change across the codebase.
- `src/app.ts` — CORS origin allowlist and the middleware/error-handler ordering (`globalErrorHandler` must stay after routes, before the 404 handler). Don't reorder without understanding why.
- `src/app/router/index.ts` — the list of registered module routers; new modules must be added here to be reachable.
- The commented-out `authCheck(...)` calls noted in `context/architecture.md` — don't silently re-enable or strip them; flag and ask.

## Documentation Sync

- If an implementation decision changes something documented in `architecture.md` or `code-standards.md` (a new module, a new invariant, a resolved "known gap"), update that file in the same change.
- Update `context/progress-tracker.md` after each meaningful change.
- **Spec status tracking:** before starting implementation of any `context/specs/*.md` file, mark it **In Progress** in `progress-tracker.md`'s "Spec Implementation Status" table. For specs with multiple implementation steps, work through them in order; the spec stays **In Progress** until all steps (and its Verify-when-done checklist) are done. Once a spec is fully implemented and verified, mark it **Complete** in the same table.

## Verification Checklist Before Moving On

- [ ] `yarn build` (TypeScript compile) succeeds.
- [ ] `yarn lint` is clean (no new errors/warnings).
- [ ] New/changed endpoints manually verified (via Postman collection or a quick curl) against expected request/response shape.
- [ ] If the change affects auth/role gating, confirm the correct `authCheck(...)` roles are applied.
