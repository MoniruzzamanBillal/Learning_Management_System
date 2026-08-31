"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ClipboardCheck,
  ClipboardList,
  Eye,
  HelpCircle,
  Plus,
  SquarePen,
} from "lucide-react";
import TableRowActions from "@/components/shared/table/TableRowActions";

export type TModule = {
  id: string;
  title: string;
  course: {
    id: string;
    name: string;
    published: boolean;
  };
  instructorId: string;
  videos: string[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

export const AssignCourseDetailColmn: ColumnDef<TModule>[] = [
  {
    accessorKey: "course.published",
    header: "Course Status",
    cell: ({ getValue }) => {
      const isPublished = getValue() as boolean;
      return (
        <span
          className={`font-semibold ${
            isPublished ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPublished ? "Published" : "Unpublished"}
        </span>
      );
    },
  },

  {
    accessorKey: "title",
    header: "Module Name",
  },

  {
    accessorKey: "videos",
    header: "Videos",
    cell: ({ getValue }) => {
      const videoData = getValue() as string[];

      return <span> {videoData?.length || 0} </span>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;
      const isPublished = rowData?.course?.published;

      return (
        <TableRowActions
          actions={[
            {
              label: "View Details",
              icon: Eye,
              href: `/dashboard/instructor/module-detail/${rowData?.id}`,
            },
            {
              label: "Update Module",
              icon: SquarePen,
              href: `/dashboard/instructor/update-module/${rowData?.id}`,
              hidden: isPublished,
            },
            {
              label: "Add New Video",
              icon: Plus,
              href: `/dashboard/instructor/add-video/${rowData?.id}`,
              hidden: isPublished,
            },
            {
              label: "Manage Quiz",
              icon: HelpCircle,
              href: `/dashboard/instructor/manage-quiz/${rowData?.id}`,
              hidden: isPublished,
            },
            {
              label: "Manage Assignment",
              icon: ClipboardList,
              href: `/dashboard/instructor/manage-assignment/${rowData?.id}`,
              hidden: isPublished,
            },
            {
              label: "Grade Assignment",
              icon: ClipboardCheck,
              href: `/dashboard/instructor/grade-assignment/${rowData?.id}`,
            },
          ]}
        />
      );
    },
  },
];
