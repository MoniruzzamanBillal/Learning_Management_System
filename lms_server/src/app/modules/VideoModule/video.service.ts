import AppError from "../../Error/AppError";
import { moduleModel } from "../courseModule/module.model";
import { userModel } from "../user/user.model";
import { TVideo } from "./video.interface";
import httpStatus from "http-status";
import { videoModel } from "./video.model";

// ! for adding a video
const addVideo = async (payload: TVideo) => {
  const { module, instructor } = payload;

  const moduleData = await moduleModel.findById(module);

  if (!moduleData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This module don't exist !!!");
  }

  const instructorData = await userModel.findById(instructor);

  if (!instructorData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This module don't exist !!!");
  }

  const videoData = await videoModel.create(payload);

  return videoData;
};

//

export const videoServices = { addVideo };
