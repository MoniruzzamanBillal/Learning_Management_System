import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../Error/AppError";
import { courseModel } from "../course/course.model";
import { moduleModel } from "../courseModule/module.model";

import { paymentModel } from "../payment/payment.model";
import { sslServices } from "../SSL/SSL.service";
import { userModel } from "../user/user.model";
import { videoStatus } from "../VideoModule/video.constants";
import { videoModel } from "../VideoModule/video.model";
import { videoProgressStatus } from "../VideoProgress/VideoProgress.constants";
import { videoProgressModel } from "../VideoProgress/VideoProgress.model";
import { courseEnrollmentModel } from "./CourseEnrollment.model";

// ! for enrolling into a course
const enrollInCourse = async (payload: { user: string; course: string }) => {
  const { user, course } = payload;

  const userData = await userModel.findById(user);

  if (!userData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This user don't exist !!!");
  }

  const courseData = await courseModel.findById(course);

  if (!courseData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This course don't exist !!!");
  }

  if (!courseData?.published) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This course is not published yet!!!"
    );
  }

  const previousEnrolledData = await courseEnrollmentModel.findOne({
    user,
    course,
    isDeleted: false,
  });

  if (previousEnrolledData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This course is already enrolled by the user !!!"
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const transactionId = `TXN-${Date.now()}`;

    const paymentData = {
      user,
      course,
      amount: courseData?.price,
      transactionId,
    };

    // * create payment record
    const paymentRecord = await paymentModel.create([paymentData], { session });

    const courseEnrollmentData = {
      user,
      course,
      Payment: paymentRecord[0]?._id,
    };

    // * create course enrollment record
    const courseEnrollmentRecord = await courseEnrollmentModel.create(
      [courseEnrollmentData],
      { session }
    );

    // * update payment record
    await paymentModel.findByIdAndUpdate(
      paymentRecord[0]?._id,
      { CourseEnrollment: courseEnrollmentRecord[0]?._id },
      { session }
    );

    const modules = await moduleModel
      .find({ isDeleted: false, course })
      .select("_id");

    const moduleIds = modules.map((m) => m?._id?.toString());

    // * create video progress data
    const videoDatas = await videoModel
      .find({ isDeleted: false, module: { $in: moduleIds } })
      .sort({ videoOrder: 1 });

    // console.log(videoDatas);

    const videoProgressData = videoDatas?.map((video) => ({
      user,
      course,
      module: (video?.module as unknown as { _id: string })?._id.toString(),
      video: video?._id?.toString(),
      videoStatus:
        video?.videoOrder === 0
          ? videoProgressStatus?.unlocked
          : videoProgressStatus?.locked,
    }));

    // console.log(videoProgressData);

    // * create video progress record
    await videoProgressModel.insertMany(videoProgressData, { session });

    const paymentRequestData = {
      price: courseData?.price,
      transactionId,
      productName: courseData?.name,
      productCategory: courseData?.category,
      userName: userData?.name,
      userEmail: userData?.email,
    };

    const result = await sslServices.initPayment(paymentRequestData);

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    console.error("Error during enrolling into the course : ", error);
    throw new Error("Failed to enroll into the course!!");
  }

  //
};

// ! for getting all user's enrolled course
const getAllUserEnrolledCourse = async (userId: string) => {
  const courseEnrolledData = await courseEnrollmentModel
    .find({
      user: userId,
      isDeleted: false,
    })
    .populate("course", " _id name category courseCover ")
    .select(" -Payment -isDeleted -createdAt -updatedAt -__v ");

  const progressResult = await Promise.all(
    courseEnrolledData.map(async (enrollmentData) => {
      const progressData = await courseProgressPercentage(
        enrollmentData?.course?._id,
        userId
      );

      return {
        ...enrollmentData.toObject(),
        courseProgress: progressData,
      };
    })
  );

  return progressResult;
};

// ! get user single enrolled  course data
const getUserEnrolledCourse = async (userId: string, courseId: string) => {
  const result = await courseEnrollmentModel
    .findOne({ user: userId, course: courseId, isDeleted: false })
    .populate({
      path: "course",
      select: " _id name category modules ",
      populate: {
        path: "modules",
        model: "Module",
        select: "_id  title videos",
      },
    })
    .select(" _id user course Payment completed ");

  return result;
};

// ! get module data for enrolled course
const getModuleDataEnrlledCourse = async (userId: string, courseId: string) => {
  const previousEnrolledData = await courseEnrollmentModel.findOne({
    user: userId,
    course: courseId,
    isDeleted: false,
  });

  if (!previousEnrolledData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have no access of this course content!!!"
    );
  }

  const moduleData = await moduleModel
    .find({
      course: courseId,
      isDeleted: false,
    })
    .populate({
      path: "videos",
      model: "Video",
      select: " _id module title videoUrl ",
    })
    .select(" _id course title videos ");

  return moduleData;
};

// ! watch video
const watchVideo = async (videoId: string, userId: string) => {
  const videoData = await videoModel.findOne({
    _id: videoId,
    isDeleted: false,
  });

  if (!videoData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Video don't exist !!!");
  }

  const currentProgressData = await videoProgressModel.findOne({
    user: userId,
    video: videoId,
  });

  if (!currentProgressData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Video progress not found for this user!"
    );
  }

  if (currentProgressData?.videoStatus === videoProgressStatus?.locked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This video is locked , complete previous video to unlock this video !!!"
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // * update current video status to watched
    currentProgressData.videoStatus = videoProgressStatus?.watched;
    await currentProgressData.save({ session });

    // * Find next video by order

    const nextVideo = await videoModel.findOne({
      module: videoData?.module,
      videoOrder: videoData?.videoOrder + 1,
    });

    if (nextVideo) {
      const videoProgressData = await videoProgressModel.findOne({
        user: userId,
        video: nextVideo?._id?.toString(),
      });

      // * change the video status if status is locked
      if (videoProgressData?.videoStatus === videoStatus?.locked) {
        await videoProgressModel.findOneAndUpdate(
          { user: userId, video: nextVideo?._id?.toString() },
          { videoStatus: videoProgressStatus?.unlocked },
          { session }
        );
      }
    }

    await session.commitTransaction();

    await session.endSession();

    return videoData;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    console.log(error);

    throw new Error(error);
  }
};

// ! for tracking course progress
const courseProgressPercentage = async (courseId: string, userId: string) => {
  const totalContent = await videoProgressModel.countDocuments({
    user: userId,
    course: courseId,
  });

  const watchedVideo = await videoProgressModel.countDocuments({
    user: userId,
    course: courseId,
    videoStatus: videoProgressStatus?.watched,
  });

  const progressPercentage = Math.round((watchedVideo / totalContent) * 100);

  return progressPercentage;
};

// ! for getting enrolled course info
const enrollmentsPerCourse = async () => {
  const result = await courseEnrollmentModel.aggregate([
    {
      $match: {
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$course",
        totalEnrollments: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "courseInfo",
      },
    },
    {
      $unwind: "$courseInfo",
    },
    {
      $project: {
        _id: 0,
        courseId: "$courseInfo._id",
        courseTitle: "$courseInfo.name",
        totalEnrollments: 1,
      },
    },
  ]);

  //
  return result;
};

// ! based on module id , find video data for enrolled user
const getUserEnrolledModuleVideos = async (
  moduleId: string,
  userId: string
) => {
  const videoData = await videoProgressModel
    .find({
      module: moduleId,
      user: userId,
    })
    .populate("video", " _id title ")
    .select("  _id  videoStatus ");

  return videoData;
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
};
