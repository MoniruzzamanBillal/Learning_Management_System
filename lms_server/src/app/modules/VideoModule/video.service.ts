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
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This instructor don't exist !!!"
    );
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

// ! for getting individual module video
const getSingleVideo = async (payload: {
  videoId: string;
  moduleId: string;
}) => {
  const { videoId, moduleId } = payload;

  const videoData = await videoModel.findOne({
    _id: videoId,
    module: moduleId,
    isDeleted: false,
  });

  if (!videoData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Video don't exist !!!");
  }

  return videoData;
};

// ! for deleting a video
const deleteModuleVideo = async (payload: {
  videoId: string;
  moduleId: string;
}) => {
  const { videoId, moduleId } = payload;

  const videoData = await videoModel.findOne({
    _id: videoId,
    module: moduleId,
    isDeleted: false,
  });

  if (!videoData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Video don't exist !!!");
  }

  const deleteVideo = await videoModel.findOneAndUpdate(
    {
      _id: videoId,
      module: moduleId,
      isDeleted: false,
    },
    { isDeleted: true },
    { new: true }
  );

  return deleteVideo;
};

// ! for updating a video
const updateVideo = async (payload: Partial<TVideo>, videoId: string) => {
  const videoData = await videoModel.findById(videoId);

  if (!videoData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Video don't exist !!!");
  }

  const updatedData = await videoModel.findByIdAndUpdate(videoId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedData;
};

//

export const videoServices = {
  addVideo,
  getAllVideo,
  getSingleVideo,
  deleteModuleVideo,
  updateVideo,
};
