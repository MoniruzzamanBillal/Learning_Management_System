import { userModel } from "../user/user.model";
import AppError from "../../Error/AppError";
import httpStatus from "http-status";
import { courseModel } from "../course/course.model";
import { sslServices } from "../SSL/SSL.service";
import mongoose from "mongoose";
import { paymentModel } from "../payment/payment.model";
import { courseEnrollmentModel } from "./CourseEnrollment.model";
import { moduleModel } from "../courseModule/module.model";
import { videoModel } from "../VideoModule/video.model";
import { videoStatus } from "../VideoModule/video.constants";

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

// ! get user enrolled course data
const getUserEnrolledCourse = async (userId: string, courseId: string) => {
  const result = await courseEnrollmentModel
    .findOne({ user: userId, course: courseId, isDeleted: false })
    .populate({
      path: "course",
      select: " _id name category modules ",
      populate: {
        path: "modules",
        model: "Module",
        select: "_id course title videos",
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

// ! get video data for enrolled course
const getVideoDataEnrlledCourse = async (videoId: string) => {
  const videoData = await videoModel.findById(videoId);

  if (!videoData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your requested content don't exists!!!"
    );
  }

  return videoData;
};

// ! watch video
const watchVideo = async (videoId: string) => {
  const videoData = await videoModel.findOne({
    _id: videoId,
    isDeleted: false,
  });

  if (!videoData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Video don't exist !!!");
  }

  if (videoData?.videoStatus === videoStatus.locked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This video is locked , complete previous video to unlock this video !!!"
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updatedVideoData = await videoModel.findByIdAndUpdate(
      videoId,
      { videoStatus: videoStatus.watched },
      { new: true, session }
    );

    const nextVideo = await videoModel.findOne({
      module: videoData?.module,
      videoOrder: videoData?.videoOrder + 1,
    });

    if (nextVideo) {
      await videoModel.findByIdAndUpdate(
        nextVideo?._id,
        { videoStatus: videoStatus.unlocked },
        { session }
      );
    }

    await session.commitTransaction();

    await session.endSession();
    return updatedVideoData;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    console.log(error);

    throw new Error(error);
  }
};

//
export const courseEnrollmentService = {
  enrollInCourse,
  getUserEnrolledCourse,
  getModuleDataEnrlledCourse,
  getVideoDataEnrlledCourse,
  watchVideo,
};
