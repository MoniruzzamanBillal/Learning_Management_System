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
    const result = await addCourse(formData);

    //  *  for any  error
    if (result?.error) {
      const errorMessage = (result?.error as any)?.data?.message;
      console.log(errorMessage);
      toast.error(errorMessage, {
        id: taostId,
        duration: 1400,
      });
    }

    // * for successful insertion
    if (result?.data) {
      const successMsg = result?.data?.message;

      toast.success(successMsg, {
        id: taostId,
        duration: 1000,
      });

      setTimeout(() => {
        navigate();
      }, 700);
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while adding course !!!", {
      duration: 1400,
    });
  }
};
