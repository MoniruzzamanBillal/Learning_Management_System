import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import prisma from "../../util/prisma";

// ! for getting the caller's own note for a video
const getMyVideoNote = async (userId: string, videoId: string) => {
  const result = await prisma.videoNote.findFirst({
    where: { userId, videoId, isDeleted: false },
  });

  return result;
};

// ! for creating/updating the caller's note for a video
const upsertVideoNote = async (
  userId: string,
  videoId: string,
  content: string,
) => {
  const video = await prisma.video.findFirst({
    where: { id: videoId, isDeleted: false },
    select: { moduleId: true, module: { select: { courseId: true } } },
  });

  if (!video) {
    throw new AppError(httpStatus.NOT_FOUND, "Video not found !!!");
  }

  const result = await prisma.videoNote.upsert({
    where: { userId_videoId: { userId, videoId } },
    create: {
      userId,
      videoId,
      courseId: video.module.courseId,
      moduleId: video.moduleId,
      content,
    },
    update: { content, isDeleted: false },
  });

  return result;
};

// ! for soft-deleting the caller's note for a video
const deleteVideoNote = async (userId: string, videoId: string) => {
  const note = await prisma.videoNote.findFirst({
    where: { userId, videoId, isDeleted: false },
  });

  if (!note) {
    throw new AppError(httpStatus.NOT_FOUND, "Note not found !!!");
  }

  const result = await prisma.videoNote.update({
    where: { id: note.id },
    data: { isDeleted: true },
  });

  return result;
};

//
export const videoNoteServices = {
  getMyVideoNote,
  upsertVideoNote,
  deleteVideoNote,
};
