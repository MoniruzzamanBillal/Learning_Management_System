import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../Error/AppError";
import { courseEnrollmentModel } from "../CourseEnrollment/CourseEnrollment.model";
import { moduleModel } from "../courseModule/module.model";
import { userModel } from "../user/user.model";
import { addVideoCoursePublish } from "../VideoProgress/videoProgress.functions";
import { TEnrolledCourseUsers } from "../VideoProgress/VideoProgress.interface";
import { TVideo } from "./video.interface";
import { videoModel } from "./video.model";

// ! for adding a video
const addVideo = async (payload: TVideo, videoUrl: string) => {
  const { module, instructor } = payload;

  const moduleData = await moduleModel
    .findOne({ _id: module, instructor })
    .populate("course", " _id published");

  const courseInfo = moduleData?.course as unknown as {
    _id: string;
    published: boolean;
  };

  const courseId = courseInfo?._id?.toString();
  const coursePublished = courseInfo?.published;

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

  const videoCount = await videoModel.countDocuments({ module });

  payload.videoUrl = videoUrl;
  payload.videoOrder = videoCount;

  const enrolledCourseUsers: TEnrolledCourseUsers[] =
    await courseEnrollmentModel.find({
      course: courseId,
    });

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // * create new video
    const videoData = await videoModel.create([payload], { session });

    // * update module data with new video reference
    await moduleModel.findByIdAndUpdate(
      module,
      { $push: { videos: videoData[0]?._id } },
      { session }
    );

    // * insert new video in video progress if course is pulished
    if (coursePublished) {
      await addVideoCoursePublish({
        enrolledCourseUsers,
        courseId,
        videoId: videoData[0]?._id?.toString(),
        videoCount,
        moduleId: module?.toString(),
        session,
      });
    }

    await session.commitTransaction();
    return videoData;
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }

  //
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
const getSingleVideo = async (videoId: string) => {
  const videoData = await videoModel.findOne({
    _id: videoId,

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
const updateVideo = async (
  payload: Partial<TVideo>,
  videoId: string,
  videoUrl: string
) => {
  const videoData = await videoModel.findById(videoId);

  if (!videoData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Video don't exist !!!");
  }

  if (videoUrl) {
    payload.videoUrl = videoUrl;
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
