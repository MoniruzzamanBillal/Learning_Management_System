"use client";

import { ColumnDef } from "@tanstack/react-table";

export type TCourseEnrollmentSummary = {
  courseId: string;
  courseTitle: string;
  totalEnrollments: number;
};

export const EnrollmentStudentsColumn: ColumnDef<TCourseEnrollmentSummary>[] = [
  {
    accessorKey: "courseTitle",
    header: "Course Name",
  },
  {
    accessorKey: "totalEnrollments",
    header: "Enrolled Students",
  },
];
