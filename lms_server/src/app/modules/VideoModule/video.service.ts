import { Prisma } from "../../../generated/prisma/client";
import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import prisma from "../../util/prisma";
import { getVideoUploadSignature } from "../../util/VideoUpload";
import { addVideoCoursePublish } from "../VideoProgress/videoProgress.functions";

type TAddVideoPayload = {
  module: string;
  title: string;
  instructor: string;
  videoUrl: string;
};

// ! for adding a video
const addVideo = async (payload: TAddVideoPayload) => {
  const { module, instructor, videoUrl } = payload;

  // findFirst, not findUnique: combining the unique `id` lookup with
  // isDeleted isn't allowed on findUnique.
  const moduleData = await prisma.module.findFirst({
    where: { id: module, isDeleted: false },
    include: { course: { select: { id: true, published: true } } },
  });

  if (!moduleData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This module don't exist !!!");
  }

  // Course-level authorization, not module-creator-only: a course can have
  // multiple instructors (CourseInstructor), and any of them should be able
  // to add videos to any of that course's modules, not just the module's
  // original creator.
  const isAssignedInstructor = await prisma.courseInstructor.findFirst({
    where: { courseId: moduleData.courseId, userId: instructor },
  });

  if (!isAssignedInstructor) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to add a video to this module !!!"
    );
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
  videoId: string
) => {
  const videoData = await prisma.video.findFirst({
    where: { id: videoId, isDeleted: false },
  });

  if (!videoData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Video don't exist !!!");
  }

  const updatedData = await prisma.video.update({
    where: { id: videoId },
    data: payload as Prisma.VideoUpdateInput,
  });

  return updatedData;
};

// ! for getting a signed direct-to-Cloudinary upload credential
const getUploadSignature = () => getVideoUploadSignature();

//

export const videoServices = {
  addVideo,
  getAllVideo,
  getSingleVideo,
  deleteModuleVideo,
  updateVideo,
  getUploadSignature,
};
