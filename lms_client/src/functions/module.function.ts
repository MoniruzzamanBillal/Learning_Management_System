/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

// ! for adding module
export const addModuleFunction = async (
  payload: any,
  AddModule: any,
  navigate: () => void
) => {
  const taostId = toast.loading("Adding New Module....");

  try {
    const result = await AddModule(payload);

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
    toast.error("Something went wrong while adding module !!!", {
      duration: 1400,
    });
  }
};

// ! for updating module
export const updateModuleFunction = async (
  payload: any,
  updateModule: any,
  moduleId: string,
  navigate: () => void
) => {
  const taostId = toast.loading("Updating Module....");

  try {
    const result = await updateModule({ payload, moduleId });

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
    toast.error("Something went wrong while updating module !!!", {
      duration: 1400,
    });
  }
};
