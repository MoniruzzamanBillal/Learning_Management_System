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

//
export const videoController = {
  addVideo,
};
