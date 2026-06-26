"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import CertificateDownloadButton from "./CertificateDownloadButton";

type TUser = {
  name: string;
  _id: string;
};

type TCourse = {
  category: string;
  name: string;
  _id: string;
};

export type TCertificateData = {
  isReviewed: boolean;
  user: TUser;
  course: TCourse;
  updatedAt: string;
};

export const CertificateTableColumn: ColumnDef<TCertificateData>[] = [
  {
    accessorFn: (row: TCertificateData) => row?.course?.name,
    id: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Course Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p className="font-medium">{row.original?.course?.name}</p>;
    },
  },

  {
    accessorFn: (row: TCertificateData) => row?.course?.category,
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
    id: "updatedAt",
    header: () => {
      return <p className="font-medium px-4 text-left">Finished On</p>;
    },
    cell: ({ row }) => {
      return (
        <p className="px-4">
          {format(new Date(row.original?.updatedAt), "dd-MMM-yyyy")}
        </p>
      );
    },
  },

  {
    id: "Certificate",
    header: () => {
      return <p className="font-medium">Certificate</p>;
    },
    cell: ({ row }) => {
      const rowData = row.original;

      return (
        <CertificateDownloadButton
          userName={rowData?.user?.name}
          courseName={rowData?.course?.name}
        />
      );
    },
  },
];
