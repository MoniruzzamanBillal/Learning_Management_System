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
    const result = await AddModule({ url: "/module/add-module", payload });

    toast.success(result?.message || "Module added successfully", {
      id: taostId,
      duration: 1000,
    });

    setTimeout(() => {
      navigate();
    }, 700);
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "Something went wrong while adding module !!!";
    toast.error(errorMessage, {
      id: taostId,
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
    const result = await updateModule({ url: `/module/update-module/${moduleId}`, payload });

    toast.success(result?.message || "Module updated successfully", {
      id: taostId,
      duration: 1000,
    });

    setTimeout(() => {
      navigate();
    }, 700);
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "Something went wrong while updating module !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
  }
};
