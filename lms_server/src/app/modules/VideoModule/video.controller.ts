import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { videoServices } from "./video.service";

// ! for adding a video
const addVideo = catchAsync(async (req, res) => {
  const result = await videoServices.addVideo(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Video added successfully !!!",
    data: result,
  });
});

// ! for getting all video
const getAllVideo = catchAsync(async (req, res) => {
  const result = await videoServices.getAllVideo(req?.body?.moduleId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Video Retrived successfully !!!",
    data: result,
  });
});

// ! for getting single vidoe
const getIndividualvideo = catchAsync(async (req, res) => {
  const result = await videoServices.getSingleVideo(req?.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Video Retrived successfully !!!",
    data: result,
  });
});

// ! for deleting a video
const deleteModuleVideo = catchAsync(async (req, res) => {
  const result = await videoServices.deleteModuleVideo(req?.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Video deleted successfully !!!",
    data: result,
  });
});

//
export const videoController = {
  addVideo,
  getAllVideo,
  getIndividualvideo,
  deleteModuleVideo,
};
