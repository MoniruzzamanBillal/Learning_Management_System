import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { videoServices } from "./video.service";

// ! for adding a video
const addVideo = catchAsync(async (req, res) => {
  const videoUrl = req?.file?.path as string;

  const result = await videoServices.addVideo(req.body, videoUrl);

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
  const result = await videoServices.getSingleVideo(req?.params?.videoId);

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

// ! for updating a video
const updateVideo = catchAsync(async (req, res) => {
  const videoUrl = req?.file?.path as string;

  const result = await videoServices.updateVideo(
    req?.body,
    req?.params?.id,
    videoUrl
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Video updated successfully !!!",
    data: result,
  });
});

// ! testing video upload
const testVideoUpload = catchAsync(async (req, res) => {
  console.log(req.file);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Video updated successfully !!!",
    data: req.file,
  });
});

// ! for uploading multiple video
const uploadMultipleVideo = catchAsync(async (req, res) => {
  const files = req?.files as Express.Multer.File[];

  const videoUrls = files?.map((file) => file?.path);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Video updated successfully !!!",
    data: videoUrls,
  });
});

//
export const videoController = {
  addVideo,
  getAllVideo,
  getIndividualvideo,
  deleteModuleVideo,
  updateVideo,
  testVideoUpload,
  uploadMultipleVideo,
};
