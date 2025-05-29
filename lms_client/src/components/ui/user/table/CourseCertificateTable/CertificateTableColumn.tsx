import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";

type TUser = {
  name: string;
  _id: string;
};

type TCourse = {
  category: string;
  name: string;
  _id: string;
};

type TData = {
  isReviewed: boolean;
  user: TUser;
  course: TCourse;
  updatedAt: string;
};

const CertificateTableColumn: ColumnDef<TData>[] = [
  {
    accessorFn: (row: TData) => row?.course.name,
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
      return <p>{row.original?.course?.name}</p>;
    },
  },

  {
    accessorFn: (row: TData) => row?.course.category,
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
      return <p>{row.original?.course.category}</p>;
    },
  },

  {
    id: "updatedAt",
    header: () => {
      return <p>Finished On </p>;
    },
    cell: ({ row }) => {
      return <p>{format(new Date(row.original?.updatedAt), "dd-MMM-yyyy")}</p>;
    },
  },

  {
    id: "Certificate",
    header: () => {
      return <p>Certificate </p>;
    },
    cell: ({ row }) => {
      const rowData = row.original;

      return (
        <Button
          onClick={() => console.log(rowData)}
          className=" bg-green-600 hover:bg-green-700 "
        >
          Download
        </Button>
      );
    },
  },
];

export default CertificateTableColumn;
