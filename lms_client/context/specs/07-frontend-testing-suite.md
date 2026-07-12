# 07 — Frontend automated testing suite

## Goal

`lms_client/package.json` has no `test` script at all today, and there are zero `*.test.tsx`/`*.spec.tsx` files anywhere in the app. Add a Vitest + React Testing Library suite covering the highest-value, lowest-flake targets: data-layer hooks, form validation schemas, and a couple of presentational components — not full end-to-end coverage.

## Current State

- No test runner configured (`vitest.config`, `jest.config`, `playwright.config`, `cypress.config` all absent).
- `hooks/useApi.ts` wraps `utils/api.ts`'s `apiGet/apiPost/apiPut/apiPatch/apiDelete` around TanStack Query — pure, mockable, no DOM needed for its core logic.
- `schemas/*.ts` — Zod schemas paired with `react-hook-form`, easy to unit test in isolation (`schema.safeParse(input)`).
- Components are mostly `"use client"` + hooks-heavy; RTL + `@testing-library/user-event` is the natural fit given the rest of the stack (React 19, Next.js 16 App Router).

## Implementation

1. `yarn add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react`.
2. `vitest.config.ts` at `lms_client/` root — `environment: "jsdom"`, `setupFiles: ["./vitest.setup.ts"]` (imports `@testing-library/jest-dom`), path alias `@/*` mirrored from `tsconfig.json` so imports resolve identically to the app itself.
3. **Schema tests** — `schemas/*.test.ts` for 2-3 of the more complex schemas (e.g. course creation/update, review submission): valid input passes, missing required field fails with the expected message.
4. **Hook tests** — `hooks/useApi.test.ts`: mock `utils/api.ts`'s functions (`vi.mock`), wrap the hook under test in a `QueryClientProvider` test harness, assert `usePost`/`useFetchData` call the right underlying function with the right args and that `invalidateQueriesKeys` actually triggers `queryClient.invalidateQueries`.
5. **Component tests** — 1-2 presentational components with clear props→output relationships, e.g. `components/main/publicPage/MyCourses/MyCourseCard.tsx` (renders progress/completed state correctly per spec `01-my-courses-list-redesign.md`'s completed-vs-in-progress branching) or `AiStudyAssistant.tsx`'s message-bubble rendering (user right-aligned vs assistant left-aligned, per spec `06-ai-study-assistant-ui.md`).
6. Add `"test": "vitest run"` and `"test:watch": "vitest"` to `lms_client/package.json`.

## Dependencies

- New (dev only): `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `@vitejs/plugin-react`.
- No production dependency changes.

## Verify When Done

- [ ] `yarn test` runs and passes, replacing the current "no test script" gap.
- [ ] `yarn lint` and `yarn build` remain clean with the new test files present.
- [ ] Intentionally break one tested component/schema/hook and confirm its test fails — proves real coverage, not vacuous assertions.
