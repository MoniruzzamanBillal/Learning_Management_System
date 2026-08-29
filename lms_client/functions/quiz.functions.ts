/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

// ! for a student submitting a quiz
export const submitQuizFunction = async (
  payload: { url: string; payload: { answers: Record<string, string> } },
  submitQuiz: any,
) => {
  const taostId = toast.loading("Submitting Quiz....");

  try {
    const result = await submitQuiz(payload);

    toast.success(result?.message || "Quiz submitted successfully", {
      id: taostId,
      duration: 1000,
    });

    return result;
  } catch (error: any) {
    const errorMessage =
      error?.message || "Something went wrong while submitting the quiz !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
    throw error;
  }
};

// ! for an instructor creating a quiz
export const createQuizFunction = async (
  payload: any,
  createQuiz: any,
  navigate: () => void,
) => {
  const taostId = toast.loading("Creating Quiz....");

  try {
    const result = await createQuiz({ url: "/quiz", payload });

    toast.success(result?.message || "Quiz created successfully", {
      id: taostId,
      duration: 1000,
    });

    setTimeout(() => {
      navigate();
    }, 700);
  } catch (error: any) {
    const errorMessage =
      error?.message || "Something went wrong while creating the quiz !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
  }
};

// ! for an instructor updating a quiz
export const updateQuizFunction = async (
  payload: any,
  updateQuiz: any,
  quizId: string,
  navigate: () => void,
) => {
  const taostId = toast.loading("Updating Quiz....");

  try {
    const result = await updateQuiz({ url: `/quiz/${quizId}`, payload });

    toast.success(result?.message || "Quiz updated successfully", {
      id: taostId,
      duration: 1000,
    });

    setTimeout(() => {
      navigate();
    }, 700);
  } catch (error: any) {
    const errorMessage =
      error?.message || "Something went wrong while updating the quiz !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
  }
};

// ! for an instructor deleting a quiz
export const deleteQuizFunction = async (
  params: { url: string },
  deleteQuiz: any,
  navigate: () => void,
) => {
  const taostId = toast.loading("Deleting Quiz....");

  try {
    const result = await deleteQuiz(params);

    toast.success(result?.message || "Quiz deleted successfully", {
      id: taostId,
      duration: 1000,
    });

    setTimeout(() => {
      navigate();
    }, 700);
  } catch (error: any) {
    const errorMessage =
      error?.message || "Something went wrong while deleting the quiz !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
  }
};
