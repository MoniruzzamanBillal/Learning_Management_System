"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import CertificateDownloadButton from "../CertificateDownloadButton";

type TUser = {
  name: string;
  id: string;
};

type TCourse = {
  category: string;
  name: string;
  id: string;
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
    header: "Course Name",
    cell: ({ row }) => {
      return <p className="font-medium">{row.original?.course?.name}</p>;
    },
  },

  {
    accessorFn: (row: TCertificateData) => row?.course?.category,
    id: "category",
    header: "Category",
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
          category={rowData?.course?.category}
          completedOn={rowData?.updatedAt}
          userId={rowData?.user?.id}
          courseId={rowData?.course?.id}
        />
      );
    },
  },
];
