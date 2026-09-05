/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

// ! for a student submitting/resubmitting an assignment
export const submitAssignmentFunction = async (
  payload: { url: string; payload: { content: string } },
  submitAssignment: any,
) => {
  const taostId = toast.loading("Submitting Assignment....");

  try {
    const result = await submitAssignment(payload);

    toast.success(result?.message || "Assignment submitted successfully", {
      id: taostId,
      duration: 1000,
    });

    return result;
  } catch (error: any) {
    const errorMessage =
      error?.message ||
      "Something went wrong while submitting the assignment !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
    throw error;
  }
};

// ! for an instructor creating an assignment
export const createAssignmentFunction = async (
  payload: any,
  createAssignment: any,
  navigate: () => void,
) => {
  const taostId = toast.loading("Creating Assignment....");

  try {
    const result = await createAssignment({ url: "/assignment", payload });

    toast.success(result?.message || "Assignment created successfully", {
      id: taostId,
      duration: 1000,
    });

    setTimeout(() => {
      navigate();
    }, 700);
  } catch (error: any) {
    const errorMessage =
      error?.message ||
      "Something went wrong while creating the assignment !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
  }
};

// ! for an instructor updating an assignment
export const updateAssignmentFunction = async (
  payload: any,
  updateAssignment: any,
  assignmentId: string,
  navigate: () => void,
) => {
  const taostId = toast.loading("Updating Assignment....");

  try {
    const result = await updateAssignment({
      url: `/assignment/${assignmentId}`,
      payload,
    });

    toast.success(result?.message || "Assignment updated successfully", {
      id: taostId,
      duration: 1000,
    });

    setTimeout(() => {
      navigate();
    }, 700);
  } catch (error: any) {
    const errorMessage =
      error?.message ||
      "Something went wrong while updating the assignment !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
  }
};

// ! for an instructor deleting an assignment
export const deleteAssignmentFunction = async (
  params: { url: string },
  deleteAssignment: any,
  navigate: () => void,
) => {
  const taostId = toast.loading("Deleting Assignment....");

  try {
    const result = await deleteAssignment(params);

    toast.success(result?.message || "Assignment deleted successfully", {
      id: taostId,
      duration: 1000,
    });

    setTimeout(() => {
      navigate();
    }, 700);
  } catch (error: any) {
    const errorMessage =
      error?.message ||
      "Something went wrong while deleting the assignment !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
  }
};

// ! for an instructor grading a submission
export const gradeSubmissionFunction = async (
  payload: {
    url: string;
    payload: { score: number; feedback?: string };
  },
  gradeSubmission: any,
) => {
  const taostId = toast.loading("Grading Submission....");

  try {
    const result = await gradeSubmission(payload);

    toast.success(result?.message || "Submission graded successfully", {
      id: taostId,
      duration: 1000,
    });

    return result;
  } catch (error: any) {
    const errorMessage =
      error?.message ||
      "Something went wrong while grading the submission !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
    throw error;
  }
};

// ! for an instructor reopening a graded submission
export const reopenSubmissionFunction = async (
  params: { url: string },
  reopenSubmission: any,
) => {
  const taostId = toast.loading("Reopening Submission....");

  try {
    const result = await reopenSubmission(params);

    toast.success(result?.message || "Submission reopened successfully", {
      id: taostId,
      duration: 1000,
    });

    return result;
  } catch (error: any) {
    const errorMessage =
      error?.message ||
      "Something went wrong while reopening the submission !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
    throw error;
  }
};
