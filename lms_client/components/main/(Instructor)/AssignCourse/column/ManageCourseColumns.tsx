"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TableRowActions from "@/components/shared/table/TableRowActions";

type TCourseData = {
  id: string;
  name: string;
  category: string;
  courseCover: string;
  published: boolean;
};

export const ManageCourseColumns: ColumnDef<TCourseData>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "published",
    header: "Status",
    cell: ({ getValue }) => {
      const isPublished = getValue() as boolean;

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
    accessorKey: "courseCover",
    header: "Cover Image",
    cell: ({ getValue }) => {
      const imgUrl = getValue() as string;
      return (
        <div className="flex items-center space-x-2">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt="Course Cover"
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <span>No Cover</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      const isPublished = rowData?.published;

      return (
        <TableRowActions
          actions={[
            {
              label: "View Details",
              icon: Eye,
              href: `/dashboard/instructor/assign-course-detail/${rowData?.id}`,
            },
            {
              label: "Add New Module",
              icon: Plus,
              href: `/dashboard/instructor/add-module?courseId=${rowData?.id}`,
              hidden: isPublished,
            },
          ]}
        />
      );
    },
  },
];
