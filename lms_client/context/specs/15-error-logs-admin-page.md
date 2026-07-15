# 15 — Admin error logs page (proposal)

## Status

## Goal

The backend now persists every error it handles into MongoDB (self-hosted, 30-day auto-expiry, admin-only reads — see `lms_server/context/specs/09-observability-logging-and-error-tracking.md`, already implemented). There is currently no way to view that data except by calling the API directly. Add an admin dashboard page that lists recent errors and lets an admin drill into one for the full stack trace, so errors are actually discoverable and fixable rather than just quietly stored.

## Current State

- Backend exposes `GET /api/error-log` (latest 200, sorted newest-first, `userId` populated with `name email`) and `GET /api/error-log/:id`, both gated by `authCheck(UserRole.admin)` — confirmed live: 401 with no/non-admin token, 200 with an admin token.
- `components/Dashboard/DashbaordLinks/AdminLinks.tsx` holds the admin sidebar's nav list (`Profile`, `Statistics`, `Manage Instructors`, `Manage Courses`, `Manage Modules`, `Enrollment`) — no error-log entry yet.
- Every existing admin list page (`ManageInstructorPage.tsx` is the clearest example, read in full for this proposal) follows the same shape: a thin route under `app/dashboard/admin/<name>/page.tsx` rendering a component under `components/Dashboard/admin/<Name>/`, data via `useFetchData` (TanStack Query), columns as a `ColumnDef[]` built with `useMemo`, rendered through the shared `components/shared/table/GenericTableComponent.tsx` (client-side sorting/pagination via `@tanstack/react-table` — there is no server-driven pagination anywhere in this app today), loading state via `components/shared/TableLoading.tsx`.
- `components/shared/Modal/BaseModal.tsx` is the existing shared dialog wrapper (built on shadcn's `Dialog`) already used elsewhere (e.g. `DeleteModal.tsx`) — the natural fit for a "view full error" detail view.
- No paginated-response type convention exists yet in `types/` (checked `ai.types.ts`, `course.types.ts`, etc.) — not needed here since the backend already caps the list at 200 and this page follows the existing "fetch once, client-paginate" pattern rather than inventing new server-pagination plumbing.

## Implementation

1. **`types/errorLog.types.ts`** (new) — `TErrorLog`: `_id`, `message`, `statusCode`, `errorSources: {path, message}[]`, `stack?`, `method`, `path`, `ip?`, `userId?: {_id, name, email} | null`, `userRole?`, `createdAt`.
2. **`app/dashboard/admin/error-logs/page.tsx`** (new) — thin wrapper, mirrors every other `app/dashboard/admin/<name>/page.tsx`, renders `ErrorLogsPage`.
3. **`components/Dashboard/admin/ErrorLogs/ErrorLogsPage.tsx`** (new) — `useFetchData<TErrorLog[]>(["error-logs"], "/error-log")`; columns via `useMemo`:
   - Time (`createdAt`, formatted, newest first — already sorted server-side)
   - Status (badge: red for 5xx, amber for 4xx)
   - Method
   - Path
   - Message (truncated)
   - User (`userId?.email ?? "—"`)
   - Action column: a "View" icon button opening the detail modal (state: `selectedErrorId`)
     Rendered via `GenericTableComponent` with `showToolbar={false}` (matches `ManageInstructorPage`'s usage), `TableDataLoading` while `isLoading`.
4. **`components/Dashboard/admin/ErrorLogs/ErrorLogDetailModal.tsx`** (new) — wraps `BaseModal`; shows the full `message`, the `errorSources` list, `method`/`path`/`ip`/`userRole`, and the `stack` trace in a `<pre>` block (scrollable, monospace) for readability.
5. **`components/Dashboard/DashbaordLinks/AdminLinks.tsx`** — add one entry:
   ```tsx
   {
     name: "Error Logs",
     path: "/dashboard/admin/error-logs",
     icon: <AlertTriangle className="w-5 h-5" />,
   },
   ```
   (new `AlertTriangle` import from `lucide-react` alongside the file's existing icon imports.)

No `middleware.ts` changes needed — `/dashboard/admin/error-logs` already falls under the existing `/admin/:path*` role-gating pattern shared by every other admin subpage.

## Open question for review

`lms_client/context/specs/11-error-tracking-sentry-frontend.md` (also 📝 Proposed, not implemented) was written as the frontend companion to the _old_ backend spec 09 (which proposed Sentry). Since backend spec 09 has since been rewritten to the self-hosted MongoDB approach instead of Sentry, spec 11 is a different, still-valid idea (client-side JS error tracking — broken renders, unhandled promise rejections) but its "pairs with backend spec 09" framing is now stale. Flagging for awareness, not touched by this proposal.

## Verify When Done (once implementation is requested)

- [ ] `yarn lint` && `yarn build` clean.
- [ ] Browser check as an admin: `/dashboard/admin/error-logs` shows the sidebar entry, lists real error rows, "View" opens the detail modal with the full stack trace.
- [ ] Non-admin/no-token access to the page's underlying API call fails gracefully (401 handled by the existing axios interceptor's force-logout behavior, same as every other admin-only fetch).
