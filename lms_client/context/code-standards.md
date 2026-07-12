# Code Standards

## TypeScript & Next.js Patterns

- `page.tsx`/`layout.tsx` files are generally left as server components; interactivity (state, hooks, event handlers) is pushed into imported client components marked `"use client"`. The codebase is not strictly server-first everywhere — many feature components (forms, tables, dashboard views) are client components by necessity (they use TanStack Query hooks, Redux, or form state) — but keep new top-level `page.tsx` files as server shells where the page itself doesn't need interactivity, matching the existing pattern.
- Use React Hook Form + Zod (`schemas/*.schemas.ts`, `@hookform/resolvers`) for all form handling and validation — don't hand-roll form state.

## File Organization & Naming

- **Pages:** `app/[route]/page.tsx`; **Layouts:** `app/[route]/layout.tsx`.
- **Feature components:** PascalCase, grouped by role/feature under `components/Dashboard/<role>/<Feature>/` (e.g. `components/Dashboard/admin/ManageCourse/AddCourse.tsx`).
- **Generic UI components:** `components/ui/` (shadcn-generated).
- **Hooks:** camelCase, prefixed `use` (`hooks/useApi.ts`, `hooks/useAuth.ts`).
- **Data orchestration:** `functions/<domain>.functions.ts` (or `.function.ts` — both suffixes exist in the codebase; match whichever the target domain file already uses rather than introducing a third variant).
- **Types:** `types/<domain>.types.ts`.

## Data Fetching & Mutations

- Reads: `useFetchData<TData>(queryKey, endpoint, options?)` from `hooks/useApi.ts`.
- Writes: `usePost`/`useUpdateData`/`usePatch`/`useDeleteData` from the same file, called with `{ url, payload }` (or `{ url }` for delete) and an optional array of query keys to invalidate on success.
- Multi-step create/update/delete flows (toast while pending, success/error toast, navigate on success) belong in `functions/*.functions.ts`, following the existing `addCourseFunction`/`updateCourseFunction`/`publishCourseFunction` shape in `functions/course.functions.ts`.

## Styling Rules

- Tailwind CSS for all styling; avoid new `.css` files unless there's a genuine need (complex animation, third-party override).
- Use `cn()` (`lib/utils.ts`) for conditional/merged class names.
- Use the semantic shadcn tokens (`bg-primary`, `text-muted-foreground`, etc.) for anything theme-adaptive; use the `prime-*`/`black-*` brand tokens only where the existing brand-accent usage already does (see `context/ui-context.md`).

## Error Handling

- `utils/axiosInstance.ts` already normalizes API errors to `{statusCode, message, errorMessages, errors}` and handles `401`/`403` globally — don't duplicate that logic per-component.
- Surface errors/success via `sonner` toast (`toast.loading(...)` → `toast.success/error(...)`), matching the pattern in `functions/*.functions.ts`.

## Linting

`lms_client/eslint.config.mjs` uses the flat `eslint-config-next` (`core-web-vitals` + `typescript`) config. Run `yarn lint` before considering frontend work done.

## Testing

No automated test suite is configured. "Verification" means a clean `yarn lint`, a successful `yarn build` (which also type-checks), and manual verification in the browser (see `context/ai-workflow-rules.md`).
