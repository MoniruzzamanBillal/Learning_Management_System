import { videoProgressStatus } from "./VideoProgress.constants";
import { TEnrolledCourseUsers } from "./VideoProgress.interface";
import { videoProgressModel } from "./VideoProgress.model";

type TaddVideoCoursePublish = {
  enrolledCourseUsers: TEnrolledCourseUsers[];
  courseId: string;
  videoId: string;
  videoCount: number;
  moduleId: string;
  session: any;
};

// ! add video in course progress , if new video added after course is published
export const addVideoCoursePublish = async ({
  enrolledCourseUsers,
  courseId,
  videoId,
  videoCount,
  moduleId,
  session,
}: TaddVideoCoursePublish): Promise<void> => {
  const videoProgressPayload = enrolledCourseUsers?.map((enrollment) => ({
    user: enrollment?.user?.toString(),
    course: courseId,
    module: moduleId,
    video: videoId,
    videoStatus:
      videoCount === 0
        ? videoProgressStatus?.unlocked
        : videoProgressStatus?.locked,
  }));

  await videoProgressModel.insertMany(videoProgressPayload, { session });
};
