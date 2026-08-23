"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import TableRowActions from "@/components/shared/table/TableRowActions";

export type TVideo = {
  id: string;
  title: string;
  videoUrl: string;
  videoOrder: number;
  module: {
    id: string;
    title: string;
    course: {
      id: string;
      name: string;
      published: boolean;
    };
  };
};

export const ManageVideoColumns: ColumnDef<TVideo>[] = [
  {
    accessorKey: "module.course.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Course Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "module.title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Module Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Video Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "videoOrder",
    header: "Order",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const video = row.original;
      return (
        <TableRowActions
          actions={[
            {
              label: "View Details",
              icon: Eye,
              href: `/dashboard/instructor/video-detail/${video.id}`,
            },
            {
              label: "Update Video",
              icon: SquarePen,
              href: `/dashboard/instructor/update-video/${video.id}`,
              hidden: video.module?.course?.published,
            },
          ]}
        />
      );
    },
  },
];
