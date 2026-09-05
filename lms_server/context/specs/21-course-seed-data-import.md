# 21 — Course seed data import (via the real Admin/Instructor UI)

## Goal

Populate the (previously empty, post-Postgres-migration) database with the 5 real courses exported from the old MongoDB collections, sitting as seed markdown at `CourseSeedData/CourseSeedData/*.md` at the repo root. Every course/module/video is created by driving the actual Admin/Instructor UI forms in a real browser (Playwright), not by seeding Prisma directly — so this exercises (and, as a side effect, tested) the real `Add Course`/`Add Module`/`Add Video` flows end-to-end, catching the two bugs documented in specs 20 (this dir) and `lms_client/context/specs/19-error-message-passthrough-fix.md`.

Local dev setup used for all of this: backend `yarn dev` on port 5000, frontend `next dev -p 5173` (both already in the CORS allowlist in `src/app.ts`).

## Source data

`CourseSeedData/CourseSeedData/README.md` indexes 5 courses, each with a `## Course fields` block (name/category/price/description-HTML) and a `## Modules` block (4 modules each, a title + an ordered video-title table per module):

| # | Course | Category | Price | Modules | Videos | Status |
|---|--------|----------|-------|---------|--------|--------|
| 1 | Frontend Development Using React | Web Development | 5000 | 4 | 17 | ✅ Done |
| 2 | Mobile App Development with Kotlin | App Development | 6000 | 4 | 15 | ✅ Done |
| 3 | Introduction to Cybersecurity | Cybersecurity | 6000 | 4 | 16 | ✅ Done |
| 4 | Cross-Platform App Development with React Native | App Development | 7000 | 4 | 16 | ✅ Done |
| 5 | DevOps and CI/CD Essentials | DevOps | 8000 | 4 | 16 | ✅ Done |

**All 5 courses complete: 20 modules, 80 videos.** Verified via `GET /course/admin-course-detail/:courseId` for every course (module/video counts and titles matched exactly against the seed markdown) and visually in the browser (`/dashboard/admin/manage-course` shows all 5 with correct name/category/price).

## Instructors

3 instructor accounts, created via `POST /auth/register-instructor` (password is server-hardcoded to `123456`, `needsPasswordChange: true` — see `auth.service.ts::createInstructor`):

- `instructor1@gmail.com` — pre-existing account from earlier manual testing (real name on record: `instructor 1`), assigned to course 1.
- `instructor2@gmail.com` — created this session, assigned to course 2.
- `instructor3@gmail.com` — created this session, **not yet assigned to any course**.

For the 3 remaining courses, reuse these same 3 accounts (round-robin, since 3 instructors / 5 courses doesn't divide evenly) rather than creating new ones:

- Course 3 (Cybersecurity) → `instructor3@gmail.com` (first use)
- Course 4 (React Native) → `instructor1@gmail.com` (second course)
- Course 5 (DevOps) → `instructor2@gmail.com` (second course)

Each course's `AddCourse` form instructor multi-select must be matched by the instructor's **real current display name** (fetched live from `/dashboard/admin/manage-instructor`, not assumed) — `instructor 1`'s name doesn't match any name a fresh script might guess, which is exactly what broke the first run this session (see "Issues found" below).

## Video content

No real video files exist for any of the 5 courses (seed data is titles/order only). Per explicit user decision, every video upload reuses one real placeholder file already present in the repo working tree:

```
CourseSeedData/reference video /Hornet 2.0 কেনার আগে যেসব বিষয় জানা জরুরি! - 2Wheels Vlogs (240p, h264).mp4
```

(≈22MB, 240p — small enough that 48 more Cloudinary uploads stay reasonable.) The video's title in the DB still comes from the real seed data per row; only the underlying file content is the shared placeholder.

## Implementation approach (proven working this session)

A Python Playwright script (`seed_courses.py`, currently sitting in this session's scratchpad — **not yet committed to the repo**, since it's a one-off data-entry tool rather than app code; move it into e.g. `lms_server/scripts/` first if it should be reusable/committed) drives the real browser UI:

1. **Admin phase** (one browser context, logged in as `abc@d.com`):
   - `add_instructor(name, email)` — idempotent: submits the form, reads the resulting Sonner toast (`[data-sonner-toast]`), treats `"already exists"` as a non-fatal skip and `"successfully"` as success, raises on anything else.
   - `get_instructor_name_map()` — navigates to `/dashboard/admin/manage-instructor`, reads the real `{email: name}` mapping from the table (never assume a name — see Issues below).
   - `add_course(course, instructor_name_map)` — fills `#name`/`#price`, pastes the seed HTML description into TipTap (see technique below), picks category + instructor via `react-select` (see technique below), submits, waits for the success toast.
   - `get_course_id(name)` — navigates to `/dashboard/admin/manage-course`, finds the table row by course name, reads the courseId out of the `View Details` link's `href` (`a[aria-label="View Details"]`) rather than calling any API directly.

2. **Per-course instructor phase** (fresh browser context per course, logged in as that course's assigned instructor):
   - `add_module(courseId, title)` — navigates to `/dashboard/instructor/add-module?courseId=<id>` (the form's `useSearchParams` + `reset()` auto-selects the course), fills `#title`, submits.
   - `get_module_ids(courseId, titles)` — navigates to `/dashboard/instructor/assign-course-detail/<courseId>`, matches each module's title in its table row, reads the moduleId out of that row's `Add New Video` link href.
   - `add_video(moduleId, title)` — navigates to `/dashboard/instructor/add-video/<moduleId>`, fills `#title`, `page.set_input_files("#video", VIDEO_PATH)`, submits, waits for the success toast with a long timeout (video upload can take real time — used 180s).

### Two non-obvious technique notes (reusable for course 3/4/5)

- **Pasting HTML into the TipTap description editor**: `page.fill()` doesn't work on a ProseMirror `contenteditable` div. Click into `.descriptionContainer .ProseMirror` to focus it, then `page.evaluate` a synthetic paste:
  ```js
  const dt = new DataTransfer();
  dt.setData('text/html', html);
  const ev = new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true });
  el.dispatchEvent(ev);
  ```
  This works without any real OS clipboard/permissions since the `DataTransfer` is constructed purely in JS — ProseMirror's own `paste` listener picks it up and parses the HTML.
- **`react-select` dropdowns** (course category, course instructors): click `.<container-class> .react-select__control` to open + focus it, `page.keyboard.type(...)` a few characters to filter, then click the matching `.react-select__option` by text. Container classes to target: `.categoryContainer` and `.instructorsContainer` (from `AddCourse.tsx`'s own wrapper `<div>` class names).
- **Button selector ambiguity**: don't select submit buttons by `button:has-text(...)` alone — every dashboard page's navbar also renders a "Sign in"/"Sign In"-adjacent button, and Playwright's `page.click()` on an ambiguous locator silently clicks the wrong (first) match with no error. Always scope to `page.locator("form button", has_text="...")`.

## Issues found and fixed while running this against courses 1 & 2

Both documented as their own specs (cross-referenced above) — summarizing here for continuity:

1. **`lms_server/context/specs/20-friendly-duplicate-email-error.md`** — `createUserIntoDB`/`createInstructor` (`auth.service.ts`) let a duplicate-email `PrismaClientKnownRequestError` (`P2002`) bubble up as a raw 500 with a leaked stack trace/file path, instead of a friendly `400`. Fixed by wrapping both `prisma.user.create()` calls in try/catch, mirroring the existing `review.service.ts::addReview` pattern. **Fixed and verified this session.**
2. **`lms_client/context/specs/19-error-message-passthrough-fix.md`** — Even after fix #1, the friendly backend message never reached the toast: `lib/axiosInstance.ts`'s response interceptor rejects with a flattened `{statusCode, message, errorMessages, errors}` object (no `.response` property), but 12 call sites across 5 `*.functions.ts` files still read the pre-interceptor Axios shape `error?.response?.data?.message` — always `undefined` on what they actually receive, so every specific backend error silently fell back to a generic string. Fixed by changing all 12 sites to `error?.message`. **Fixed and verified this session** (both via direct Playwright toast-text assertion and live in the seeding run).
3. **Instructor name assumption bug (script-only, not an app bug)** — the first script draft picked an invented instructor name (`"Instructor One"`) to search for in the course form's instructor `react-select`, but `instructor1@gmail.com` already existed from earlier manual testing under the real name `instructor 1` — the dropdown never had an option matching the invented name. Fixed by adding `get_instructor_name_map()`, which reads real names live from `/dashboard/admin/manage-instructor` instead of assuming them. **Not an app bug** — flagging only so course 3/4/5's script run doesn't repeat the same assumption for any other pre-existing account.
4. **`lms_client/context/specs/20-file-input-onchange-override-bug.md` — the big one.** Every real `Add Video` submission was 500ing (`Argument videoUrl is missing`) even with a file visibly selected in the browser (Mux preview rendered correctly). Root cause: `AddVideo.tsx`'s file `<Input>` spreads `{...register("video", {...})}` (which includes RHF's own `onChange`, the only thing that updates RHF's internal form value) and then a separate `onChange={(e) => handleChangeVideoUrl(e)}` prop immediately after it **silently replaces** that RHF `onChange` (later JSX prop wins) — so RHF's `data.video` was always empty at submit, no matter what the user picked. The exact same pattern (register + a later separate onChange, for a local preview) existed in **6 places total**: `AddVideo.tsx`/`UpdateVideo.tsx` (video — the required one that crashes), `AddCourse.tsx`/`UpdateCourse.tsx` (course cover — silent), `AddInstructor.tsx` (profile picture — silent), `UpdateProfile.tsx` (avatar — silent). Fixed identically in all 6: capture `register(...)`'s result in a local variable, then call its real `.onChange`/`.ref` from inside the wrapping handler instead of letting the wrapping handler replace it. **This was the actual blocker for adding any real video** — confirmed by re-running the exact same "Add Video" submission after the fix: real ~20s Cloudinary upload, `"Video added successfully !!!"`, real `videoUrl` on the created row. **Fixed and verified this session** (both via a standalone Playwright reproduction and live in the seeding run itself).
5. **Script-only, not an app bug — `add_module`/`add_video` weren't idempotent.** Restarting the script after the fixes above (which required stopping/restarting the run several times) re-submitted "Add Module" for a course that already had all 4 real modules from a prior partial run, creating one duplicate ("Module 1: Getting Started..." appeared twice for the React course) before being caught and stopped. Cleaned up the one duplicate row directly (soft-deleted via `isDeleted: true` — no delete-module endpoint exists in this app to do it through the UI/API). Fixed the script itself by adding `get_existing_module_titles()`/`get_existing_video_titles()` (read-only `GET` calls, reusing the already-authenticated session's JWT) that check what already exists before calling `add_module`/`add_video`, skipping anything already present by title — matching the pattern `add_instructor`/`add_course` already had.

## Implementation (courses 3, 4, 5) — done

`seed_courses.py`'s `COURSES` list was extended with all 3 remaining courses (name/category/price/description HTML/modules+videos, transcribed directly from the seed markdown files) and the round-robin instructor assignment above, then rerun end-to-end. By this point `add_course`/`add_module`/`add_video` were all idempotent (title-based existence checks via read-only API calls before creating), so the same script also re-verified courses 1 & 2 were untouched (all skipped as already-existing) in the same run.

**One environmental issue hit, not a code bug:** partway through course 3's first video upload, the local `lms_server` dev process (`ts-node-dev`) died with no exception/stack trace in its log — plain process termination, cause unconfirmed (no OOM evidence found, no crash trace; most likely a transient dev-environment issue from many consecutive large multipart uploads through `ts-node-dev`'s watch/respawn wrapper, not a bug in the reviewed application code). Restarting the backend (`yarn dev`) and rerunning the already-idempotent script picked up cleanly exactly where it left off, with no data loss or duplication.

Total real run time for the 3 new courses: a few minutes of setup plus ~48 video uploads at ~15–20s each.

## Verify When Done

- [x] Courses 1 & 2 (React, Kotlin) created with all 4 modules and all real video titles/order each, videos playable (placeholder content) in the instructor's module/video detail views.
- [x] Courses 3, 4, 5 (Cybersecurity, React Native, DevOps) created the same way. Verified via `GET /course/admin-course-detail/:courseId` for all 5 courses: every course has exactly 4 modules and the exact video count/titles from its seed markdown (17+15+16+16+16 = 80 videos, 20 modules total, matching the source data exactly).
- [x] Spot-checked the admin dashboard in the browser (`/dashboard/admin/manage-course`) — all 5 courses render with correct name/category/price/status. (Public catalog/course-detail page not separately spot-checked — these 5 courses are unpublished, so they don't appear there yet; see the open item below.)
- [ ] Decide whether to publish these courses (`publish-course/:id`, admin-only) — not decided yet, flagging for the user's call before publishing anything. All 5 remain unpublished as created.
