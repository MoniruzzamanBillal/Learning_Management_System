# Project Overview: MATS Academy (Frontend)

## Overview

MATS Academy's frontend is a Next.js (App Router) application that consumes the `lms_server` REST API to deliver a role-based Learning Management System: a public course catalog + marketing site, and role-scoped dashboards for admin, instructor, and student (user). Originally built as part of the C470 Software Engineering course; currently deployed and live at `devmats.vercel.app`.

## Goals

1. Let visitors browse and enroll in courses, and let enrolled students consume video content and track their progress.
2. Give instructors a content-authoring workflow (modules, videos) scoped to the courses they're assigned.
3. Give admins full oversight: course/instructor creation and approval-style publishing, enrollment/course management.
4. Keep protected routes enforced by role (student can't reach admin pages and vice versa).

## Core User Flows

### Public visitor
1. Browses the course catalog (`app/(main)/courses`), views a course detail page, reads about/contact/instructors/FAQ pages.
2. Signs up (`app/(main)/sign-up`) or logs in (`app/(main)/login`).

### Student (`user` role)
1. Logs in and lands on the public site (not auto-redirected into a dashboard — student-facing "dashboard" pages live under `app/dashboard/user/`, e.g. `my-enrolled-courses`, `course-certificates`).
2. Enrolls in a course and pays via SSLCOMMERZ (`app/(main)/courseEnroll-success` / `courseEnroll-fail` handle the payment redirect outcome).
3. Watches enrolled course videos, with progress tracked server-side; can view/download a certificate once a course is completed.
4. Leaves a review once eligible (eligibility is checked against the backend, see `CourseDetailPage.tsx`).

### Instructor
1. Views assigned courses (`app/dashboard/instructor/assign-courses`, `assign-course-detail`).
2. Manages modules for a course (`add-module`, `manage-module`, `update-module`, `module-detail`) and videos for a module (`add-video`, `manage-video`, `update-video`, `video-detail`).

### Admin
1. Manages courses (`add-course`, `manage-course`, `update-course`, `course-detail`, `publish` action) and instructors (`add-instructor`, `manage-instructor`).
2. Manages modules across courses (`manage-modules`, `module-detail`) and enrollments (`enroll-courses`).
3. Views an admin home/stats view (`app/dashboard/admin/home`).

All three roles share `app/dashboard/profile` for account/profile management and password change (`app/(main)/change-password`).

## Features by Category

- **Auth:** JWT login/registration, role-based route protection.
- **Course catalog & enrollment:** public browsing, enrollment, SSLCOMMERZ payment flow.
- **Video learning:** module/video playback (Mux Player) with per-user watch-progress tracking and course completion.
- **Certificates:** generated/viewable once a course is completed (`course-certificates`, using `jspdf`/`pdf-lib`-backed data from the API).
- **Reviews:** eligibility-gated course reviews and ratings.
- **Content authoring (instructor):** module/video CRUD scoped to assigned courses, rich text via Tiptap.
- **Admin oversight:** course/instructor CRUD, publishing, enrollment management.

## In Scope

- Next.js App Router frontend integrating with the `lms_server` REST API.
- Role-based dashboards (admin, instructor, user) under `app/dashboard/`, plus a public/marketing site under `app/(main)/`.
- Responsive design (desktop + mobile).

## Out of Scope (as currently built)

- No automated test suite (no test runner configured in `lms_client/package.json`).
- No client-side self-service instructor signup (instructors are created by an admin, see backend `context/project-overview.md`).

## Success Criteria

- A student can browse, enroll, pay, watch videos, track progress, and get a certificate on completion.
- An instructor can build out modules/videos for their assigned course(s).
- An admin can create/publish a course and manage instructors and enrollments.
- Role-based route protection correctly restricts `admin`/`user` dashboard areas per `middleware.ts`.
