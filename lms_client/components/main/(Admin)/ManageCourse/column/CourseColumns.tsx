"use client";

import TableRowActions from "@/components/shared/table/TableRowActions";
import { TCourseData } from "@/types/course.types";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, SquarePen } from "lucide-react";

export const CourseColumns: ColumnDef<TCourseData>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "published",
    header: "Status",
    cell: ({ row }) => {
      const isPublished = row.getValue("published");
      return (
        <span
          className={
            isPublished
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {isPublished ? "Published" : "Unpublished"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <TableRowActions
          actions={[
            {
              label: "View Details",
              icon: Eye,
              href: `/dashboard/admin/course-detail/${rowData?.id}`,
            },
            {
              label: "Update Course",
              icon: SquarePen,
              href: `/dashboard/admin/update-course/${rowData?.id}`,
              hidden: rowData?.published,
            },
          ]}
        />
      );
    },
  },
];
