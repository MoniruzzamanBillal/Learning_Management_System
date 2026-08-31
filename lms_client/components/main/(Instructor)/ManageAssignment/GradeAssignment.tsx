"use client";

import { useFetchData } from "@/hooks/useApi";
import Link from "next/link";
import { useParams } from "next/navigation";
import SubmissionsTable from "./SubmissionsTable";
import { TAssignmentManage } from "./type/Assignment.type";

const GradeAssignment = () => {
  const { moduleId } = useParams();

  const { data: assignmentData, isLoading } = useFetchData<
    TAssignmentManage | null
  >([`assignment-manage-${moduleId}`], `/assignment/manage/${moduleId}`, {
    enabled: !!moduleId,
  });

  const assignment = assignmentData?.data ?? null;

  if (isLoading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="GradeAssignmentContainer bg-gray-100/90 border border-gray-300 shadow rounded-md p-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="brand text-2xl font-medium">Grade Submissions</h3>

        <Link
          href={`/dashboard/instructor/manage-assignment/${moduleId}`}
          className="text-prime-100 hover:underline text-sm font-medium"
        >
          Edit assignment
        </Link>
      </div>

      {assignment ? (
        <SubmissionsTable assignmentId={assignment.id} />
      ) : (
        <p className="text-gray-500 text-sm">
          No assignment has been created for this module yet.{" "}
          <Link
            href={`/dashboard/instructor/manage-assignment/${moduleId}`}
            className="text-prime-100 hover:underline"
          >
            Create one
          </Link>{" "}
          before submissions can be graded.
        </p>
      )}
    </div>
  );
};

export default GradeAssignment;
