"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TCourseData } from "@/types/course.types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href={`/dashboard/admin/course-detail/${rowData?._id}`}>
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {!rowData?.published && (
              <DropdownMenuItem>
                <Link href={`/dashboard/admin/update-course/${rowData?._id}`}>
                  Update Course
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
