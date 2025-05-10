/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleToastResponse } from "@/utils/sharedFunction";
import { toast } from "sonner";

type TenrollCourse = {
  user: string;
  course: string;
};

// ! for enrolling into a course
export const enrollInCourseFunction = async (
  payload: TenrollCourse,
  enrollInCourse: any
) => {
  const taostId = toast.loading("Purchasing Course....");

  try {
    const result = await enrollInCourse(payload);

    // console.log(result?.data?.data);

    if (result?.error) {
      const errorMessage = (result?.error as any)?.data?.message;
      console.log(errorMessage);
      toast.error(errorMessage, {
        id: taostId,
        duration: 1400,
      });
    }

    if (result?.data) {
      const successMsg = result?.data?.message;
      const paymentUrl = result?.data?.data;

      toast.success(successMsg, {
        id: taostId,
        duration: 2000,
      });

      window.location.href = paymentUrl;
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while purchasing the course !!!", {
      duration: 1400,
    });
  }
};

//  ! for marking course as complete
export const markCompleteCourseFunction = async (
  courseId: string,
  markCompleteCourse: any
) => {
  const taostId = toast.loading("Marking course complete...");

  try {
    const result = await markCompleteCourse(courseId);

    const responseResult = handleToastResponse(result, taostId);
    return responseResult;
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while completing course !!!", {
      duration: 1400,
    });
  }
};
