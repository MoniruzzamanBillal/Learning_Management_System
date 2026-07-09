# AI Workflow Rules

## Overall Approach

This is a live, already-built codebase — the priority is fitting new work into the existing patterns (`useApi.ts` + `functions/*.functions.ts`, route groups, component organization), not re-architecting. Work one page/feature at a time and verify before moving on.

## Scoping Rules

1. **One feature at a time.** Don't bundle unrelated fixes/refactors into a feature change.
2. **No speculative changes.** Don't refactor unrelated components, don't build placeholder UI for unrequested features, don't touch `services/` (legacy) unless specifically asked to migrate something off it.
3. **Strict boundaries.** Frontend changes should consume the existing API contract (see `lms_server/context/architecture.md` and `LMS_system.postman_collection.json`) rather than assuming a backend change — if a needed endpoint doesn't exist, say so and ask, don't invent client-side workarounds for missing backend behavior.

## Splitting Work

- Split a complex page into smaller pieces the same way the codebase already does (e.g. a data table component, a form component, action handlers in `functions/*.functions.ts`) rather than one large file.

## Handling Missing Requirements

- If a visual design detail isn't specified, follow `context/ui-context.md`'s actual tokens — don't introduce new colors/fonts.
- If an API payload/response shape is ambiguous, check `types/*.types.ts`, the corresponding backend module (`lms_server/src/app/modules/<name>/*.interface.ts` / `*.validation.ts`), and `LMS_system.postman_collection.json` before guessing. Do not guess the payload shape.
- If a UX edge case is unclear (e.g. what a student sees for a course with no published modules), stop and ask.

## Protected Files

- Don't modify `components/ui/*` (shadcn-generated) unless explicitly asked to customize globally.
- Don't alter `middleware.ts`'s matcher or role-redirect logic without confirming — it's the actual route-protection boundary (see `context/architecture.md`).
- Don't add a new global state library — Redux Toolkit (client state) and TanStack Query (server state) already cover this; ask before introducing something else (e.g. Zustand, Jotai).

## Documentation Sync

- If an implementation decision diverges from `context/architecture.md` or `context/code-standards.md`, or establishes a new reusable pattern, update the relevant file in the same change.
- Update `context/progress-tracker.md` after each meaningful change.

## Verification Checklist Before Moving On

- [ ] No TypeScript errors (`npm run build` type-checks as part of the Next.js build).
- [ ] `npm run lint` is clean.
- [ ] The feature is responsive (check mobile and desktop, including the custom `sc-430`/`sc-500`/`sc-laptop` breakpoints where relevant).
- [ ] UI reflects TanStack Query loading/error states, not just the happy path.
- [ ] `npm run build` succeeds locally.
