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
import { Link } from "react-router-dom";

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

const EnrolledCourseColumn: ColumnDef<TEnrollment>[] = [
  {
    accessorFn: (row: TEnrollment) => row.course.name,
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
    accessorFn: (row: TEnrollment) => row.course.category,
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
    accessorKey: "courseCover",
    header: "Cover Image",
    cell: ({ row }) => {
      return (
        <div className="imgSection size-[5rem]  m-auto rounded-md overflow-auto ">
          <img
            src={row.original?.course?.courseCover}
            className=" w-full h-full   "
            alt=""
          />
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
            <DropdownMenuItem>
              <Link
                to={`/dashboard/instructor/assign-course-detail/${rowData?._id}`}
              >
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

export default EnrolledCourseColumn;
