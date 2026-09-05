# 34. "Edit assignment" / "Create one" links on Grade Submissions bypass the post-publish content lock

## Goal

Found during a full-system Playwright QA pass (admin/instructor/student, all three roles) requested ahead of merging `postgressMigration` into `master`. Documented as a decision-pending finding, then resolved once the user picked a direction — see Resolution below.

## What happened

Spec [`33-split-assignment-manage-and-grade-pages.md`](33-split-assignment-manage-and-grade-pages.md) (commit `0c02fee3`) restored `hidden: isPublished` on the "Manage Assignment" (edit/create) row action in both `ManageModule.tsx` and `AssignCourseDetailColmn.tsx`, explicitly to match "Update Module"/"Add New Video"/"Manage Quiz"'s post-publish content lock, while keeping "Grade Assignment" (`GradeAssignment.tsx`) reachable regardless of publish state.

Live-verified this works correctly for the row actions themselves: on a published course (`Frontend Development Using React`), a module with no assignment showed only "View Details" and "Grade Assignment" — "Manage Assignment" was correctly hidden. On an unpublished course (`Cross-Platform App Development with React Native`), all actions including "Manage Assignment" were visible, as expected.

However, `GradeAssignment.tsx` itself (the page "Grade Assignment" links to) always renders an unconditional link straight to the supposedly-hidden edit page, with no publish-state check at all:

```tsx
// components/main/(Instructor)/ManageAssignment/GradeAssignment.tsx
<Link href={`/dashboard/instructor/manage-assignment/${moduleId}`}>
  Edit assignment
</Link>
...
{assignment ? (
  <SubmissionsTable assignmentId={assignment.id} />
) : (
  <p>
    No assignment has been created for this module yet.{" "}
    <Link href={`/dashboard/instructor/manage-assignment/${moduleId}`}>Create one</Link>{" "}
    before submissions can be graded.
  </p>
)}
```

Reproduced live: on the published course's module with no assignment yet, navigating Grade Assignment → clicking "Create one" lands directly on `ManageAssignment.tsx`'s create form — the exact page the row action hides for this same module on this same course. `ManageAssignment.tsx` itself (`components/main/(Instructor)/ManageAssignment/ManageAssignment.tsx`) also has no publish-state check of its own, and the backend (`assignment.service.ts::createAssignment`/`updateAssignment`) has no publish-based restriction either — so the create/update would succeed if submitted, not just render.

## Root cause

The post-publish "lock" on assignment content editing has only ever been a navigation-hiding convention (no server-side enforcement, matching every other post-publish-locked action in this codebase — Update Module/Add Video/Manage Quiz work the same way). Commit `0c02fee3` correctly re-hid the *primary* entry point (the row action) but didn't account for the *secondary* entry point it introduced in the same change — `GradeAssignment.tsx`'s own "Edit assignment"/"Create one" links, which by design must stay reachable on published courses (that's the whole point of the split) but were left unconditional rather than reflecting the same lock.

## Impact

Low severity — this isn't a security hole (the backend never enforced this restriction either, and any instructor with a shell/curl could always call the API directly), but it does mean the just-shipped "lock structural edits once published" UX guarantee for assignments specifically is trivially bypassable through a path the product explicitly kept open (Grade Assignment). An instructor clicking around published-course grading will see a working "Edit assignment" link that the row-action design intended to hide.

## Suggested directions (not decided)

- Pass `isPublished` down to `GradeAssignment.tsx` (would need `/assignment/manage/:moduleId` or a sibling call to expose the module's course's publish state, since this page currently has no course-level data) and conditionally hide/disable the "Edit assignment"/"Create one" links once published — mirroring the row action's own `hidden: isPublished`.
- Or, decide this bypass is fine (grading pages reasonably need a way to fix a typo'd assignment even post-publish) and instead relax the row action's own `hidden: isPublished` back to always-visible, accepting that assignment editing was never really locked — simpler, but reopens the exact readability gap spec 33 was trying to close by splitting the pages in the first place.
- Or, distinguish "edit existing assignment" (arguably safe post-publish, minor a wording tweak with existing submissions on file) from "create a brand-new assignment" (arguably should stay locked, since students can't have been expecting one yet) — only gate the "Create one" empty-state link, not "Edit assignment" on an existing one.

## Resolution

User picked the second suggested direction: drop the post-publish edit lock for assignments entirely rather than plug the `GradeAssignment.tsx` bypass. Reasoning implied by the choice: since the lock was only ever a navigation-hiding convention with no server-side enforcement (see Impact above), and `GradeAssignment.tsx` needed an always-reachable edit path anyway, keeping a partial/inconsistent lock on just the row action added confusion without adding real protection.

Implemented by removing the `hidden: isPublished` line from the "Manage Assignment" action only (added by commit `0c02fee3`) in both `ManageModule.tsx` and `AssignCourseDetailColmn.tsx`. "Manage Assignment" is now always visible from both entry points, matching `GradeAssignment.tsx`'s own unconditional "Edit assignment"/"Create one" links — no more inconsistency between the two paths. "Update Module"/"Add New Video"/"Manage Quiz" keep their own `hidden: isPublished` locks untouched; this decision was scoped to assignments only, per spec 33's original problem statement.

## Verify-when-done

- ✅ `yarn lint` — same pre-existing baseline (28 errors/17 warnings), no new issues in either touched file.
- Manual/Playwright re-check owed before next deploy: on a published course's module, both the row action's "Manage Assignment" and `GradeAssignment.tsx`'s "Edit assignment"/"Create one" now lead to the same reachable edit form — confirm no other component still assumes assignment editing is publish-locked.
