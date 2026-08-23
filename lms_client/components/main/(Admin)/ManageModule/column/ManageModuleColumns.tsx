"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import TableRowActions from "@/components/shared/table/TableRowActions";

export const ManageModuleColumns: ColumnDef<any>[] = [
  {
    accessorKey: "course.name",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Course
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "course.published",
    header: "Course Status",
    cell: ({ getValue }) => {
      const isPublished = getValue();
      return (
        <span
          className={` font-semibold ${
            isPublished ? "text-green-600" : "text-red-600"
          } `}
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
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Module Title
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

      return <span> {videoData?.length} </span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row?.original;

      return (
        <TableRowActions
          actions={[
            {
              label: "View Details",
              icon: Eye,
              href: `/dashboard/admin/module-detail/${rowData?.id}`,
            },
          ]}
        />
      );
    },
  },
];
