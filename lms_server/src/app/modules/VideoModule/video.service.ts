import AppError from "../../Error/AppError";
import { moduleModel } from "../courseModule/module.model";
import { userModel } from "../user/user.model";
import { TVideo } from "./video.interface";
import httpStatus from "http-status";
import { videoModel } from "./video.model";
import mongoose from "mongoose";

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

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const videoData = await videoModel.create([payload], { session });

    await moduleModel.findByIdAndUpdate(
      module,
      { $push: { videos: videoData[0]?._id } },
      { session }
    );

    await session.commitTransaction();
    return videoData;
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

// ! for getting all the module video
const getAllVideo = async (moduleId: string) => {
  const moduleData = await moduleModel.findById(moduleId);

  if (!moduleData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This module don't exist !!!");
  }

  const allVideo = await videoModel.find({ module: moduleId });

  return allVideo;
};

//

export const videoServices = { addVideo, getAllVideo };
