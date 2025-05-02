import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";
import { Button } from "../../button";

type TCourseEnrollmentSummary = {
  courseId: string;
  courseTitle: string;
  totalEnrollments: number;
};

const EnrollmentStudentsColumn: ColumnDef<TCourseEnrollmentSummary>[] = [
  {
    accessorKey: "courseTitle",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Course Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "totalEnrollments",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Enrolled Students
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];

export default EnrollmentStudentsColumn;
