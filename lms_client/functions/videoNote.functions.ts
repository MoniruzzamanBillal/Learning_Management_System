/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

// ! for saving (create/update) a video note
export const saveVideoNoteFunction = async (
  payload: { url: string; payload: { content: string } },
  saveNote: any,
) => {
  const taostId = toast.loading("Saving Note....");

  try {
    const result = await saveNote(payload);

    toast.success(result?.message || "Note saved successfully", {
      id: taostId,
      duration: 1000,
    });

    return result;
  } catch (error: any) {
    const errorMessage =
      error?.message || "Something went wrong while saving note !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
  }
};

// ! for deleting a video note
export const deleteVideoNoteFunction = async (
  params: { url: string },
  deleteNote: any,
) => {
  const taostId = toast.loading("Deleting Note....");

  try {
    const result = await deleteNote(params);

    toast.success(result?.message || "Note deleted successfully", {
      id: taostId,
      duration: 1000,
    });

    return result;
  } catch (error: any) {
    const errorMessage =
      error?.message || "Something went wrong while deleting note !!!";
    toast.error(errorMessage, {
      id: taostId,
      duration: 1400,
    });
  }
};
