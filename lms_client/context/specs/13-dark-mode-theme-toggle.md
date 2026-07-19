# 13 — Dark mode toggle (stretch)

## Goal

Cheap, visible polish item. No dark mode exists today (`next-themes` absent from `package.json`, no theme-provider/toggle component anywhere) despite the shadcn/ui setup (`components.json`) and Tailwind v4 theme tokens (`app/globals.css`) already being structured to support it — `ui-context.md` documents that semantic tokens are defined "in `:root` and overridden in `.dark`" already, meaning the CSS-side dark values likely already exist from the shadcn scaffold and just aren't toggled anywhere.

## Current State

- `app/globals.css` — per `context/ui-context.md`, semantic tokens (`background`, `foreground`, `card`, etc.) are already defined for both `:root` and `.dark` — confirm this at implementation time; if true, this spec is almost entirely toggle-wiring, not new CSS.
- No `next-themes` dependency, no `ThemeProvider`, no toggle button anywhere in the component tree.
- `app/layout.tsx` wraps the app in `StoreProvider` (Redux) and `QueryProvider` (TanStack Query) — a `ThemeProvider` would nest alongside these.

## Implementation

1. `yarn add next-themes`.
2. Wrap `app/layout.tsx`'s children in `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>` (from `next-themes`), matching the `.dark` class-based toggling that Tailwind v4 + shadcn already expect.
3. Add a toggle component (`components/shared/ThemeToggle.tsx`) — a simple icon button (sun/moon, `lucide-react`) using `useTheme()` from `next-themes`, placed in `components/shared/NavBar.tsx` (already handles a `mounted` state via `useEffect`/`setMounted` per prior lint findings — reuse that same hydration-safe pattern to avoid a flash-of-wrong-theme on first render, since `next-themes` requires client-only rendering of the toggle's current state).
4. Spot-check every page/component that uses raw Tailwind color utilities instead of semantic tokens (e.g. `bg-white`, `text-gray-900` hardcoded rather than `bg-background`/`text-foreground`) — these won't respond to dark mode. Given `ui-context.md` notes the raw `prime-*`/`black-*` brand tokens are intentionally fixed (not meant to flip in dark mode), but plain Tailwind grays used as ad-hoc surface colors throughout the dashboard/public pages likely need auditing; this is the bulk of the real work in this spec, not the toggle itself.

## Dependencies

- New: `next-themes`.

## Verify When Done

- [ ] Toggle switches between light/dark instantly, no flash-of-unstyled-content on page load/refresh.
- [ ] System preference (`prefers-color-scheme`) is respected by default before any manual toggle.
- [ ] Spot-check the dashboard, course catalog, and course detail pages in dark mode — flag (don't necessarily fix in this pass) any component still hardcoded to light-only colors that reads as broken/illegible in dark mode.
- [ ] `yarn lint` and `yarn build` pass cleanly.
