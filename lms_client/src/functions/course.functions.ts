/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleToastResponse } from "@/utils/sharedFunction";
import { toast } from "sonner";

// ! for adding course
export const addCourseFunction = async (
  formData: any,
  addCourse: any,
  navigate: () => void
) => {
  const taostId = toast.loading("Adding Course....");

  try {
    const result = await addCourse(formData);

    await handleToastResponse(result, taostId, navigate);
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while adding course !!!", {
      duration: 1400,
    });
  }
};

// ! for updating a course
export const updateCourseFunction = async (
  courseId: string,
  formData: any,
  updateCourse: any,
  navigate: () => void
) => {
  const taostId = toast.loading("Updating Course....");

  try {
    const result = await updateCourse({ formData, courseId });

    await handleToastResponse(result, taostId, navigate);
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while updating course !!!", {
      duration: 1400,
    });
  }
};

// ! for publishing a course
export const publishCourseFunction = async (
  courseId: string,
  publishCourse: any
) => {
  const taostId = toast.loading("Publishing Course....");

  try {
    const result = await publishCourse(courseId);
    const response = await handleToastResponse(result, taostId);
    return response;
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while publishing course !!!", {
      duration: 1400,
    });
  }
};
