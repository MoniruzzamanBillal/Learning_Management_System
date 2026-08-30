"use client";

import DeleteModal from "@/components/shared/Modal/DeleteModal";
import { Button } from "@/components/ui/button";
import {
  createAssignmentFunction,
  deleteAssignmentFunction,
  updateAssignmentFunction,
} from "@/functions/assignment.functions";
import { useDeleteData, useFetchData, usePatch, usePost } from "@/hooks/useApi";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import AssignmentForm from "./AssignmentForm";
import SubmissionsTable from "./SubmissionsTable";
import { TAssignmentFormData, TAssignmentManage } from "./type/Assignment.type";

const ManageAssignment = () => {
  const router = useRouter();
  const { moduleId } = useParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const queryKey = [`assignment-manage-${moduleId}`];

  const { data: assignmentData, isLoading } = useFetchData<
    TAssignmentManage | null
  >(queryKey, `/assignment/manage/${moduleId}`, { enabled: !!moduleId });

  const { mutateAsync: createAssignment, isPending: isCreating } = usePost([
    queryKey,
  ]);
  const { mutateAsync: updateAssignment, isPending: isUpdating } = usePatch([
    queryKey,
  ]);
  const { mutateAsync: deleteAssignment, isPending: isDeleting } =
    useDeleteData([queryKey]);

  const assignment = assignmentData?.data ?? null;

  const handleNavigateBack = () => {
    router.push("/dashboard/instructor/manage-module");
  };

  // ! for creating or updating this module's assignment
  const handleSubmit = async (data: TAssignmentFormData) => {
    const payload = {
      title: data.title,
      instructions: data.instructions,
      ...(data.dueDate ? { dueDate: data.dueDate } : {}),
    };

    if (assignment) {
      await updateAssignmentFunction(
        payload,
        updateAssignment,
        assignment.id,
        handleNavigateBack,
      );
    } else {
      await createAssignmentFunction(
        { moduleId: moduleId as string, ...payload },
        createAssignment,
        handleNavigateBack,
      );
    }
  };

  // ! for deleting this assignment
  const handleDelete = async () => {
    if (!assignment) return;
    await deleteAssignmentFunction(
      { url: `/assignment/${assignment.id}` },
      deleteAssignment,
      handleNavigateBack,
    );
  };

  if (isLoading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="ManageAssignmentContainer bg-gray-100/90 border border-gray-300 shadow rounded-md p-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="brand text-2xl font-medium">
          {assignment ? "Edit Assignment" : "Create Assignment"}
        </h3>

        {assignment && (
          <Button
            variant="destructive"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isDeleting}
          >
            Delete Assignment
          </Button>
        )}
      </div>

      <AssignmentForm
        defaultValues={
          assignment
            ? {
                title: assignment.title,
                instructions: assignment.instructions,
                dueDate: assignment.dueDate
                  ? assignment.dueDate.slice(0, 10)
                  : "",
              }
            : undefined
        }
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
        submitLabel={assignment ? "Update Assignment" : "Create Assignment"}
      />

      {assignment && <SubmissionsTable assignmentId={assignment.id} />}

      {assignment && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          handleDeleteFunction={handleDelete}
          id={assignment.id}
          alertMessage="This will permanently delete this assignment. This action cannot be undone."
        />
      )}
    </div>
  );
};

export default ManageAssignment;
