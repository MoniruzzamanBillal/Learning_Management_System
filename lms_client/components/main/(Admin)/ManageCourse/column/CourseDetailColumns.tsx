"use client";

import TableRowActions from "@/components/shared/table/TableRowActions";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

export type TInstructor = {
  id: string;
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
  id: string;
  courseId: string;
  instructorId: string;
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
