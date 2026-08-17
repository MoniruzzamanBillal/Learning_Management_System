import { Prisma } from "@prisma/client";
import { videoProgressStatus } from "./VideoProgress.constants";

type TaddVideoCoursePublish = {
  enrolledCourseUsers: { userId: string }[];
  courseId: string;
  videoId: string;
  videoCount: number;
  moduleId: string;
  tx: Prisma.TransactionClient;
};

// ! add video in course progress , if new video added after course is published
export const addVideoCoursePublish = async ({
  enrolledCourseUsers,
  courseId,
  videoId,
  videoCount,
  moduleId,
  tx,
}: TaddVideoCoursePublish): Promise<void> => {
  if (!enrolledCourseUsers.length) {
    return;
  }

  await tx.videoProgress.createMany({
    data: enrolledCourseUsers.map((enrollment) => ({
      userId: enrollment.userId,
      courseId,
      moduleId,
      videoId,
      videoStatus:
        videoCount === 0
          ? videoProgressStatus.unlocked
          : videoProgressStatus.locked,
    })),
  });
};
