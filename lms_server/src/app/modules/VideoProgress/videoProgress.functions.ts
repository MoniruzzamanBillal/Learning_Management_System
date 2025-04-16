import { videoProgressStatus } from "./VideoProgress.constants";
import { videoProgressModel } from "./VideoProgress.model";

// ! add video in course progress , if new video added after course is published
export const addVideoCoursePublish = async (
  enrolledCourseUsers,
  courseId,
  videoId,
  videoCount,
  module,
  session
) => {
  const videoProgressPayload = enrolledCourseUsers?.map((enrollment) => ({
    user: enrollment?.user?.toString(),
    course: courseId,
    module,
    video: videoId,
    videoStatus:
      videoCount === 0
        ? videoProgressStatus?.unlocked
        : videoProgressStatus?.locked,
  }));

  await videoProgressModel.insertMany(videoProgressPayload, { session });
};
