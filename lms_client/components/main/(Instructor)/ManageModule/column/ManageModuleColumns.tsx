"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, SquarePen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export const ManageModuleColumns: ColumnDef<TModule>[] = [
  {
    accessorKey: "course.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Course Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Module Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "videos",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Videos
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
          ]}
        />
      );
    },
  },
];
