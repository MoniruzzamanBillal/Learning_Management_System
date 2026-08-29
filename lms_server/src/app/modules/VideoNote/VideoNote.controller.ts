import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { videoNoteServices } from "./VideoNote.service";

// ! for getting the caller's own note for a video
const getMyVideoNote = catchAsync(async (req, res) => {
  const result = await videoNoteServices.getMyVideoNote(
    req?.user?.userId as string,
    req?.params?.videoId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Video note retrieved successfully !!!",
    data: result,
  });
});

// ! for creating/updating the caller's note for a video
const upsertVideoNote = catchAsync(async (req, res) => {
  const result = await videoNoteServices.upsertVideoNote(
    req?.user?.userId as string,
    req?.params?.videoId as string,
    req?.body?.content,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Note saved successfully !!!",
    data: result,
  });
});

// ! for soft-deleting the caller's note for a video
const deleteVideoNote = catchAsync(async (req, res) => {
  const result = await videoNoteServices.deleteVideoNote(
    req?.user?.userId as string,
    req?.params?.videoId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Note deleted successfully !!!",
    data: result,
  });
});

//
export const videoNoteController = {
  getMyVideoNote,
  upsertVideoNote,
  deleteVideoNote,
};
