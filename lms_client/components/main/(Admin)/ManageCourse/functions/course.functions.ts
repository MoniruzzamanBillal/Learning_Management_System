/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

// ! for adding course
export const addCourseFunction = async (
  formData: any,
  addCourse: any,
  navigate: () => void
) => {
  const taostId = toast.loading("Adding Course....");

  try {
    const result = await addCourse({
      url: "/course/add-course",
      payload: formData,
    });

    toast.success(result?.message || "Course added successfully", {
      id: taostId,
      duration: 1000,
    });
    setTimeout(() => navigate(), 700);
  } catch (error: any) {
    console.log(error);
    const errorMessage =
      error?.response?.data?.message || "Something went wrong while adding course !!!";
    toast.error(errorMessage, {
      id: taostId,
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
    const result = await updateCourse({
      url: `/course/update-course/${courseId}`,
      payload: formData,
    });

    toast.success(result?.message || "Course updated successfully", {
      id: taostId,
      duration: 1000,
    });
    setTimeout(() => navigate(), 700);
  } catch (error: any) {
    console.log(error);
    const errorMessage =
      error?.response?.data?.message || "Something went wrong while updating course !!!";
    toast.error(errorMessage, {
      id: taostId,
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
    const result = await publishCourse({
      url: `/course/publish-course/${courseId}`,
      payload: {},
    });

    toast.success(result?.message || "Course published successfully", {
      id: taostId,
      duration: 1000,
    });
    return result;
  } catch (error: any) {
    console.log(error);
    const errorMessage =
      error?.response?.data?.message || "Something went wrong while publishing course !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
  }
};
