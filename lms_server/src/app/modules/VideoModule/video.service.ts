import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import prisma from "../../util/prisma";
import { addVideoCoursePublish } from "../VideoProgress/videoProgress.functions";

type TAddVideoPayload = {
  module: string;
  title: string;
  instructor: string;
};

// ! for adding a video
const addVideo = async (payload: TAddVideoPayload, videoUrl: string) => {
  const { module, instructor } = payload;

  // findFirst, not findUnique: combining the unique `id` lookup with
  // instructorId/isDeleted isn't allowed on findUnique.
  const moduleData = await prisma.module.findFirst({
    where: { id: module, instructorId: instructor, isDeleted: false },
    include: { course: { select: { id: true, published: true } } },
  });

  if (!moduleData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This module don't exist !!!");
  }

  const instructorData = await prisma.user.findFirst({
    where: { id: instructor, isDeleted: false },
  });

  if (!instructorData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This instructor don't exist !!!"
    );
  }

  // videoOrder derived from max(existing active videoOrder) + 1, per the fix
  // in specs/01-fix-sequential-video-unlock-order.md — carried forward here.
  const maxOrder = await prisma.video.aggregate({
    where: { moduleId: module, isDeleted: false },
    _max: { videoOrder: true },
  });
  const nextOrder = (maxOrder._max.videoOrder ?? -1) + 1;

  const courseId = moduleData.course.id;
  const coursePublished = moduleData.course.published;

  const enrolledCourseUsers = coursePublished
    ? await prisma.courseEnrollment.findMany({
        where: { courseId },
        select: { userId: true },
      })
    : [];

  // No denormalized Module.videos array to push into anymore — Video is
  // derived automatically via Video.moduleId.
  const video = await prisma.$transaction(async (tx) => {
    const createdVideo = await tx.video.create({
      data: {
        title: payload.title,
        moduleId: module,
        instructorId: instructor,
        videoUrl,
        videoOrder: nextOrder,
      },
    });

    if (coursePublished) {
      await addVideoCoursePublish({
        enrolledCourseUsers,
        courseId,
        videoId: createdVideo.id,
        videoCount: nextOrder,
        moduleId: module,
        tx,
      });
    }

    return createdVideo;
  });

  // Matches the original's response shape exactly: Mongoose's array-form
  // `.create([payload], { session })` (required for transaction support)
  // returned a 1-element array, which the controller passed straight
  // through as the response body.
  return [video];

  //
};

// ! for getting all the module video
const getAllVideo = async (moduleId: string) => {
  const moduleData = await prisma.module.findFirst({
    where: { id: moduleId, isDeleted: false },
  });

  if (!moduleData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This module don't exist !!!");
  }

  const allVideo = await prisma.video.findMany({
    where: { moduleId, isDeleted: false },
  });

  return allVideo;
};

// ! for getting individual module video
const getSingleVideo = async (videoId: string) => {
  const videoData = await prisma.video.findFirst({
    where: {
      id: videoId,
      isDeleted: false,
    },
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

  const videoData = await prisma.video.findFirst({
    where: {
      id: videoId,
      moduleId,
      isDeleted: false,
    },
  });

  if (!videoData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Video don't exist !!!");
  }

  const deleteVideo = await prisma.video.update({
    where: { id: videoId },
    data: { isDeleted: true },
  });

  return deleteVideo;
};

// ! for updating a video
const updateVideo = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  videoId: string,
  videoUrl: string
) => {
  const videoData = await prisma.video.findFirst({
    where: { id: videoId, isDeleted: false },
  });

  if (!videoData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Video don't exist !!!");
  }

  if (videoUrl) {
    payload.videoUrl = videoUrl;
  }

  const updatedData = await prisma.video.update({
    where: { id: videoId },
    data: payload as Prisma.VideoUpdateInput,
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
