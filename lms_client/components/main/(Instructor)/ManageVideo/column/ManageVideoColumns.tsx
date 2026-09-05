"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, SquarePen } from "lucide-react";
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
    header: "Course Name",
  },
  {
    accessorKey: "module.title",
    header: "Module Name",
  },
  {
    accessorKey: "title",
    header: "Video Title",
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
