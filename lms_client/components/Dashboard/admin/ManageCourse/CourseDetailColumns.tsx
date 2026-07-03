"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export type TInstructor = {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
};

export const InstructorColumn: ColumnDef<TInstructor>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "profilePicture",
    header: "Profile Image",
    cell: ({ row }) => {
      const img = row.getValue("profilePicture") as string;
      return (
        <img
          src={img}
          alt={row.original.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    },
  },
];

type TModule = {
  _id: string;
  course: string;
  instructor: string;
  title: string;
  videos: string[];
};

export const CourseDetailModuleColumn: ColumnDef<TModule>[] = [
  {
    accessorKey: "title",
    header: "Module Name",
  },
  {
    accessorKey: "videos",
    header: "Videos",
    cell: ({ getValue }) => {
      const videoData = getValue() as string[];

      return <span> {videoData?.length} </span>;
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href={`/dashboard/admin/module-detail/${rowData?._id}`}>
                View Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
