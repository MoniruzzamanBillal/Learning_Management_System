# UI Context

All tokens below are pulled directly from `app/globals.css` and `components.json` — this is a record of what's actually defined and in use, not a prescriptive palette invented for this doc.

## Component Library

- **shadcn/ui**, style `new-york`, base color `neutral`, CSS variables enabled, no class prefix (`components.json`).
- Icons: `lucide-react`.
- Components live in `components/ui/` (generated/managed by the shadcn CLI — see `context/ai-workflow-rules.md` on not hand-editing these).

## Brand / Accent Colors

Defined as raw hex custom properties (not part of the shadcn semantic token set), used directly as Tailwind arbitrary/utility values across dashboard components:

| Token | Value | Notes |
| --- | --- | --- |
| `--prime-50` | `#6366f1` | Indigo, lightest of the three — primary brand accent. |
| `--prime-100` | `#4f46e5` | Indigo, mid — hover/emphasis. |
| `--prime-200` | `#4338ca` | Indigo, darkest — active/pressed states. |
| `--black-100` | `#020817` | Darkest navy. |
| `--black-50` | `#070f2b` | Mid navy. |
| `--black-20` | `#040b24` | Navy. |

Confirmed real usage in `components/Dashboard/Sidebar.tsx`, `components/Dashboard/admin/ManageInstructor/AddInstructor.tsx`, `components/Dashboard/admin/ManageCourse/UpdateCourse.tsx`, `components/Dashboard/admin/ManageModule/ModuleDetail.tsx`, `components/Dashboard/user/Certificates/MyCourseCertificates.tsx`.

## Semantic Tokens (shadcn/Tailwind theme, light + `.dark`)

`background`, `foreground`, `card`/`card-foreground`, `popover`/`popover-foreground`, `primary`/`primary-foreground`, `secondary`/`secondary-foreground`, `muted`/`muted-foreground`, `accent`/`accent-foreground`, `destructive`, `border`, `input`, `ring`, `sidebar` and its `-foreground`/`-primary`/`-accent`/`-border`/`-ring` variants, `chart-1` through `chart-5`. All defined as `oklch(...)` values in `:root` and overridden in `.dark` (`app/globals.css`). Use these Tailwind classes (`bg-primary`, `text-muted-foreground`, etc.) for anything that should adapt to light/dark, and the raw `prime-*`/`black-*` tokens only for the fixed brand-accent cases already established.

## Radius Scale

Base `--radius: 0.625rem`, with `--radius-sm/md/lg/xl/2xl/3xl/4xl` derived from it (`calc(var(--radius) ± Npx)`).

## Typography

- **Font family:** Geist Sans (body/UI) and Geist Mono, loaded via `next/font/google` in `app/layout.tsx`, exposed as `--font-geist-sans` / `--font-geist-mono`.

## Breakpoints (custom, in addition to Tailwind defaults)

- `sc-430`: 27rem (432px)
- `sc-500`: 32rem (512px)
- `sc-laptop`: 85.5rem (1368px)
- `2xl`: 100rem

## Conventions

- **Feedback:** `sonner` toasts for async operation feedback (loading → success/error), driven from `functions/*.functions.ts` — not inline banners.
- **Class merging:** use `cn()` from `lib/utils.ts` (clsx + tailwind-merge) instead of manual string concatenation for conditional classes.
- **Rich text:** Tiptap-based editor (`@tiptap/*` packages) for course/module content.
- **Video:** `@mux/mux-player-react` for playback.
