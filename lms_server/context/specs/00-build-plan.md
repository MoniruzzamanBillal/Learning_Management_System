# Build Plan

Unlike a greenfield project, `lms_server` is already built and live — there is no historical unit-by-unit build sequence to record here.

This file exists so future backend feature work can be planned the same way: when a new feature is scoped, add a numbered spec file here (`01-<feature-name>.md`, `02-<feature-name>.md`, ...) describing its goal, design, and implementation steps, following the same format used in the reference methodology (Goal / Design / Implementation / Dependencies / Verify-when-done). List them below as they're added.

## Units

- [`01-fix-sequential-video-unlock-order.md`](./01-fix-sequential-video-unlock-order.md) — fixes `videoOrder` assignment/unlock-list sorting bugs causing the wrong video to unlock, plus a data backfill for already-corrupted modules.
