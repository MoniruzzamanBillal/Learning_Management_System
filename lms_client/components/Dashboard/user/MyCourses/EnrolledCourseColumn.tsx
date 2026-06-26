"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type TCourse = {
  _id: string;
  name: string;
  category: string;
  courseCover: string;
};

type TEnrollment = {
  _id: string;
  user: string;
  course: TCourse;
  completed: boolean;
};

export const EnrolledCourseColumn: ColumnDef<TEnrollment>[] = [
  {
    accessorFn: (row: TEnrollment) => row.course?.name,
    id: "name",
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
    cell: ({ row }) => {
      return <p className="font-medium">{row.original?.course?.name}</p>;
    },
  },
  {
    accessorFn: (row: TEnrollment) => row.course?.category,
    id: "category",
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
    cell: ({ row }) => {
      return <p>{row.original?.course?.category}</p>;
    },
  },
  {
    id: "courseCover",
    header: "Cover Image",
    cell: ({ row }) => {
      const coverUrl = row.original?.course?.courseCover;
      return (
        <div className="imgSection size-16 rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
          {coverUrl ? (
            <Image
              src={coverUrl}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              alt={row.original?.course?.name || "Course Cover"}
            />
          ) : (
            <span className="text-xs text-gray-500">No Image</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/user/my-courses/${rowData?.course?._id}`}>
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
