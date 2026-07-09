# Project Overview: MATS Academy (Backend / API)

## Overview

MATS Academy's backend is a REST API built with Express, TypeScript, and MongoDB (Mongoose) that powers a course-based Learning Management System. It serves the `lms_client` Next.js frontend and handles authentication, course/module/video content, enrollment, SSLCOMMERZ payments, watch-progress tracking, and reviews. Originally built as part of the C470 Software Engineering course; currently deployed and live.

## Goals

1. Provide a role-based content platform where admins publish courses, instructors deliver structured module/video content, and users (students) enroll, pay, and learn.
2. Gate paid course content behind verified enrollment + completed payment.
3. Track per-user video/course progress so completion and certificates can be derived.
4. Support course reviews from users who have actually completed/engaged with a course.

## Roles

Defined in `UserRole` (`src/app/modules/user/user.constants.ts`): `admin`, `instructor`, `user`. Enforced per-route via `authCheck(...roles)` (`src/app/middleware/authCheck.ts`).

## Core Flows

### Admin
1. Registers instructors (`POST /api/auth/register-instructor`, admin-only).
2. Creates and publishes courses (`POST /api/course/add-course`, `PATCH /api/course/publish-course/:id`), uploading a cover image via Cloudinary.
3. Views platform-wide course/enrollment statistics and admin-facing course/module/video listings.

### Instructor
1. Is assigned to a course (assignment is implicit via being set as the course's instructor by an admin).
2. Adds/updates modules under a course (`/api/module/*`) and videos under a module (`/api/video/*`, uploaded via a dedicated video-upload util).
3. Views their assigned courses and course/module detail.

### User (student)
1. Registers (`POST /api/auth/register`) and logs in (`POST /api/auth/login`) to receive a JWT.
2. Browses published courses (`GET /api/course/all-courses`, no auth required).
3. Enrolls in a course (`POST /api/enroll/enroll-course`) and completes payment through SSLCOMMERZ (`/api/payment/*`, `SSL` module).
4. Once enrollment + completed payment both exist (checked by `ValidateCourseAccess` middleware), can access course modules/videos, and their video watch progress is tracked (`VideoProgress` module, consumed internally — not exposed as its own router).
5. Can mark a course complete and view progress percentage.
6. Can leave a review for a course once eligible (`GET /api/review/check-review-eligibility` gates this).

## Features by Category

- **Authentication:** JWT-based login, role-based registration (self-registration for users; admin-only registration for instructors).
- **Course/Module/Video management:** CRUD for courses, modules, and videos with Cloudinary-hosted images and video uploads.
- **Enrollment & Payment:** SSLCOMMERZ payment flow, enrollment gated on completed payment.
- **Progress Tracking:** Per-user, per-video progress feeding course completion percentage.
- **Reviews:** Course review submission/update, average rating, eligibility check.

## In Scope

- Express REST API for the above flows, backing the `lms_client` Next.js app.
- MongoDB/Mongoose as the sole persistence layer.
- Cloudinary for image/video asset storage, SSLCOMMERZ for payments.

## Out of Scope (as currently built)

- No automated test suite (`npm test` in `lms_server/package.json` is a stub that just exits with an error).
- No self-service instructor signup — instructors are only created by an admin via `/auth/register-instructor`.
- No dedicated public router for `VideoProgress` — it is used only as an internal service by the `CourseEnrollment` module.

## Success Criteria

- A user can register, log in, enroll, pay, and watch course videos with progress tracked correctly.
- An admin can create a course, assign/register an instructor, and publish it.
- An instructor can build out modules and videos for a course they're assigned to.
- Paid content is inaccessible without a completed payment record.
