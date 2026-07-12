# 09 — Real charts on the admin dashboard

## Goal

`components/Dashboard/admin/Stat/StatPage.tsx` today renders six plain stat cards, one of which (`"Average Course Completion"`) is a **hardcoded string `"78%"`** with no backing data at all. No chart library is installed (`recharts`/`chart.js` absent from `package.json`). Replace the static cards with real, data-driven visuals backed by the new backend analytics endpoint.

## Current State

- `StatPage.tsx` fetches `GET /course/admin-stats` via `useFetchData` and renders `AdminStatCard` × 6 in a `grid md:grid-cols-2 lg:grid-cols-4`. Five of six are real numbers from the API; the sixth is hardcoded.
- Depends on backend spec `12-admin-analytics-api.md` extending `admin-stats` (or adding a new endpoint) with real time-series revenue/enrollment data and a real average-completion figure.

## Design

1. Keep the existing stat cards for simple point-in-time numbers (total courses/students/instructors/published), but replace the hardcoded `"78%"` card with the real value once `12-admin-analytics-api.md` provides it.
2. Add two charts below the stat card grid:
   - **Revenue over time** — line or bar chart (last 30/90 days), from the new time-series data.
   - **Enrollments over time** — same shape, separate chart.
3. `yarn add recharts` (React-native charting lib, integrates cleanly with Tailwind/shadcn-style layouts, widely recognized on a resume — a reasonable default over `chart.js` given the rest of the stack is React-first).
4. Loading state: extend the existing `AdminStatCardSkeleton` pattern with a matching chart skeleton (simple pulsing rectangle placeholder is sufficient, no need for a fake-chart skeleton).

## Implementation Notes

- New chart components live alongside the existing `Stat/` folder, e.g. `components/Dashboard/admin/Stat/RevenueChart.tsx`, `EnrollmentChart.tsx` — reuse the `TData` type extension from the backend spec rather than re-declaring shapes.
- No changes to the `useFetchData(["admin-stat"], "/course/admin-stats")` call site beyond consuming the extended response shape — same query key, same hook.
- Match existing color tokens (`prime-50`/`prime-100`/`prime-200`) for chart series colors, per `context/ui-context.md`, rather than `recharts`' default palette.

## Verify When Done

- [ ] Charts render real data matching the backend's time-series response, verified against a test dataset with known payment/enrollment dates.
- [ ] Average completion card shows a real, changing number (not `"78%"` always).
- [ ] Loading/empty states (e.g. a brand-new deployment with zero payments) render sensibly, not a broken/empty chart.
- [ ] `yarn lint` and `yarn build` pass cleanly.
