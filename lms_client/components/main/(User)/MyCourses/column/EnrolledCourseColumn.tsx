"use client";

import { Button } from "@/components/ui/button";
import TableRowActions from "@/components/shared/table/TableRowActions";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import Image from "next/image";

type TCourse = {
  id: string;
  name: string;
  category: string;
  courseCover: string;
};

type TEnrollment = {
  id: string;
  userId: string;
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
    header: "Action",
    cell: ({ row }) => {
      const rowData = row.original;

      return (
        <TableRowActions
          actions={[
            {
              label: "View Details",
              icon: Eye,
              href: `/my-courses/${rowData?.course?.id}`,
            },
          ]}
        />
      );
    },
  },
];
