"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TCourseData = {
  _id: string;
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/instructor/assign-course-detail/${rowData?._id}`}
              >
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {!isPublished && (
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/instructor/add-module?courseId=${rowData?._id}`}
                >
                  Add New Module
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
