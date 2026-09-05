import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import prisma from "../../util/prisma";
import { sslServices } from "../SSL/SSL.service";
import { videoProgressStatus } from "../VideoProgress/VideoProgress.constants";

// ! for enrolling into a course
const enrollInCourse = async (payload: { user: string; course: string }) => {
  const { user, course } = payload;

  const userData = await prisma.user.findFirst({
    where: { id: user, isDeleted: false },
  });

  if (!userData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This user don't exist !!!");
  }

  const courseData = await prisma.course.findUnique({ where: { id: course } });

  if (!courseData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This course don't exist !!!");
  }

  if (!courseData?.published) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This course is not published yet!!!",
    );
  }

  const previousEnrolledData = await prisma.courseEnrollment.findFirst({
    where: { userId: user, courseId: course, isDeleted: false },
  });

  if (previousEnrolledData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This course is already enrolled by the user !!!",
    );
  }

  const transactionId = `TXN-${Date.now()}`;

  // Per spec decision #4: keep the SSLCommerz HTTP call inside the DB
  // transaction exactly as today — a documented smell, not something to fix
  // as part of this migration.
  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        userId: user,
        courseId: course,
        amount: courseData.price,
        transactionId,
      },
    });

    // Payment has no physical FK back to CourseEnrollment (see spec Stage
    // 1.2, Payment model, circular-ref resolution) — CourseEnrollment.paymentId
    // is the only physical FK, set once at creation. No follow-up
    // payment-record update is needed here, unlike the old Mongoose version.
    await tx.courseEnrollment.create({
      data: {
        userId: user,
        courseId: course,
        paymentId: payment.id,
      },
    });

    const modules = await tx.module.findMany({
      where: { isDeleted: false, courseId: course },
      select: { id: true },
    });

    const moduleIds = modules.map((m) => m.id);

    const videos = await tx.video.findMany({
      where: { isDeleted: false, moduleId: { in: moduleIds } },
      orderBy: { videoOrder: "asc" },
    });

    if (videos.length) {
      await tx.videoProgress.createMany({
        data: videos.map((video) => ({
          userId: user,
          courseId: course,
          moduleId: video.moduleId,
          videoId: video.id,
          videoStatus:
            video.videoOrder === 0
              ? videoProgressStatus.unlocked
              : videoProgressStatus.locked,
        })),
      });
    }

    const paymentRequestData = {
      price: Number(courseData.price),
      transactionId,
      productName: courseData.name,
      productCategory: courseData.category,
      userName: userData.name,
      userEmail: userData.email,
    };

    return sslServices.initPayment(paymentRequestData);
  });

  return result;

  //
};

// ! for getting all user's enrolled course
const getAllUserEnrolledCourse = async (userId: string) => {
  const courseEnrolledData = await prisma.courseEnrollment.findMany({
    where: { userId, isDeleted: false },
    select: {
      id: true,
      userId: true,
      completed: true,
      isReviewed: true,
      course: {
        select: { id: true, name: true, category: true, courseCover: true },
      },
    },
  });

  const progressResult = await Promise.all(
    courseEnrolledData.map(async (enrollmentData) => {
      const progressData = await courseProgressPercentage(
        enrollmentData.course.id,
        userId,
      );

      return {
        ...enrollmentData,
        courseProgress: progressData,
      };
    }),
  );

  return progressResult;
};

// ! for checking user enrolled a coure or not
const checkUserEnrolledInCourse = async (
  courseId: string,
  userId: string | undefined,
) => {
  const userData = userId
    ? await prisma.user.findFirst({ where: { id: userId, isDeleted: false } })
    : null;

  if (!userData) {
    return {
      enrolledIncourse: false,
    };
  }

  const courseData = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!courseData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This course don't exist !!!");
  }

  if (!courseData?.published) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This course is not published yet!!!",
    );
  }

  const previousEnrolledData = await prisma.courseEnrollment.findFirst({
    where: { userId, courseId, isDeleted: false },
  });

  return { enrolledIncourse: !!previousEnrolledData };
};

// ! get user single enrolled  course data
const getUserEnrolledCourse = async (userId: string, courseId: string) => {
  const result = await prisma.courseEnrollment.findFirst({
    where: { userId, courseId, isDeleted: false },
    select: {
      id: true,
      userId: true,
      courseId: true,
      paymentId: true,
      completed: true,
      course: {
        select: {
          id: true,
          name: true,
          category: true,
          modules: {
            where: { isDeleted: false },
            select: {
              id: true,
              title: true,
              videos: { where: { isDeleted: false }, select: { id: true } },
              quiz: { where: { isDeleted: false }, select: { id: true } },
              assignment: {
                where: { isDeleted: false },
                select: { id: true },
              },
            },
          },
        },
      },
    },
  });

  if (!result) {
    throw new Error("Enrollment not found");
  }

  const courseProgressData = await courseProgressPercentage(courseId, userId);

  return {
    ...result,
    course: {
      ...result.course,
      modules: result.course.modules.map((m) => ({
        ...m,
        videos: m.videos.map((v) => v.id),
      })),
    },
    courseProgressData,
  };
};

// ! get module data for enrolled course
const getModuleDataEnrlledCourse = async (userId: string, courseId: string) => {
  const previousEnrolledData = await prisma.courseEnrollment.findFirst({
    where: { userId, courseId, isDeleted: false },
  });

  if (!previousEnrolledData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have no access of this course content!!!",
    );
  }

  const moduleData = await prisma.module.findMany({
    where: { courseId, isDeleted: false },
    select: {
      id: true,
      courseId: true,
      title: true,
      videos: {
        where: { isDeleted: false },
        select: { id: true, moduleId: true, title: true, videoUrl: true },
      },
    },
  });

  return moduleData;
};

// ! watch video
const watchVideo = async (videoId: string, userId: string) => {
  const videoData = await prisma.video.findFirst({
    where: {
      id: videoId,
      isDeleted: false,
    },
  });

  if (!videoData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Video don't exist !!!");
  }

  const currentProgressData = await prisma.videoProgress.findFirst({
    where: { userId, videoId },
  });

  if (!currentProgressData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Video progress not found for this user!",
    );
  }

  if (currentProgressData?.videoStatus === videoProgressStatus?.locked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This video is locked , complete previous video to unlock this video !!!",
    );
  }

  await prisma.$transaction(async (tx) => {
    // * update current video status to watched
    await tx.videoProgress.update({
      where: { id: currentProgressData.id },
      data: { videoStatus: videoProgressStatus.watched },
    });

    // * Find next video by order
    const nextVideo = await tx.video.findFirst({
      where: {
        moduleId: videoData.moduleId,
        videoOrder: videoData.videoOrder + 1,
        isDeleted: false,
      },
    });

    if (nextVideo) {
      const nextProgress = await tx.videoProgress.findFirst({
        where: { userId, videoId: nextVideo.id },
      });

      // * change the video status if status is locked
      if (nextProgress?.videoStatus === videoProgressStatus?.locked) {
        await tx.videoProgress.update({
          where: { id: nextProgress.id },
          data: { videoStatus: videoProgressStatus.unlocked },
        });
      }
    }
  });

  return videoData;
};

// ! for tracking course progress
const courseProgressPercentage = async (courseId: string, userId: string) => {
  const totalContent = await prisma.videoProgress.count({
    where: { userId, courseId },
  });

  const watchedVideo = await prisma.videoProgress.count({
    where: { userId, courseId, videoStatus: videoProgressStatus?.watched },
  });

  const progressPercentage = Math.round((watchedVideo / totalContent) * 100);

  return progressPercentage;
};

// ! for getting enrolled course info
const enrollmentsPerCourse = async () => {
  const grouped = await prisma.courseEnrollment.groupBy({
    by: ["courseId"],
    where: { isDeleted: false },
    _count: { _all: true },
  });

  const courses = await prisma.course.findMany({
    where: { id: { in: grouped.map((g) => g.courseId) } },
    select: { id: true, name: true },
  });

  const courseNameById = new Map(courses.map((c) => [c.id, c.name]));

  return grouped.map((g) => ({
    courseId: g.courseId,
    courseTitle: courseNameById.get(g.courseId),
    totalEnrollments: g._count._all,
  }));

  //
};

// ! based on module id , find video data for enrolled user
const getUserEnrolledModuleVideos = async (
  moduleId: string,
  userId: string,
) => {
  const videoData = await prisma.videoProgress.findMany({
    where: { moduleId, userId },
    select: {
      id: true,
      videoStatus: true,
      video: { select: { id: true, title: true, videoOrder: true } },
    },
  });

  videoData.sort((a, b) => a.video.videoOrder - b.video.videoOrder);

  return videoData;
};

//  ! for marking course as complete
const markCompleteCourse = async (courseId: string, userId: string) => {
  const userData = await prisma.user.findFirst({
    where: { id: userId, isDeleted: false },
  });

  if (!userData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This user don't exist !!!");
  }

  const courseData = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!courseData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This course don't exist !!!");
  }

  if (!courseData?.published) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This course is not published yet!!!",
    );
  }

  const previousEnrolledData = await prisma.courseEnrollment.findFirst({
    where: { userId, courseId, isDeleted: false },
  });

  if (!previousEnrolledData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You did not enrolled into this course !!!",
    );
  }

  const coursePercentageProgress = await courseProgressPercentage(
    courseId,
    userId,
  );

  if (coursePercentageProgress !== 100) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You did not complete the full course !!!",
    );
  }

  const result = await prisma.courseEnrollment.update({
    where: { id: previousEnrolledData.id },
    data: { completed: true },
  });

  return result;

  //
};

// ! get user's finished course
const usersFinishedCourses = async (userId: string) => {
  const userData = await prisma.user.findFirst({
    where: { id: userId, isDeleted: false },
  });

  if (!userData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This user don't exist !!!");
  }

  const result = await prisma.courseEnrollment.findMany({
    where: { userId, completed: true, isDeleted: false },
    select: {
      id: true,
      isReviewed: true,
      updatedAt: true,
      user: { select: { id: true, name: true } },
      course: { select: { id: true, name: true, category: true } },
    },
  });

  return result;
};

//
export const courseEnrollmentService = {
  enrollInCourse,
  getUserEnrolledCourse,
  getModuleDataEnrlledCourse,
  watchVideo,
  courseProgressPercentage,
  enrollmentsPerCourse,
  getAllUserEnrolledCourse,
  getUserEnrolledModuleVideos,
  markCompleteCourse,
  checkUserEnrolledInCourse,
  usersFinishedCourses,
};
