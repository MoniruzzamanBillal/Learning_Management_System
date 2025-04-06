import { userModel } from "../user/user.model";
import AppError from "../../Error/AppError";
import httpStatus from "http-status";
import { courseModel } from "../course/course.model";
import { sslServices } from "../SSL/SSL.service";
import mongoose from "mongoose";
import { paymentModel } from "../payment/payment.model";
import { courseEnrollmentModel } from "./CourseEnrollment.model";
import { moduleModel } from "../courseModule/module.model";

// ! for enrolling into a course
const enrollInCourse = async (payload: { user: string; course: string }) => {
  const { user, course } = payload;

  const userData = await userModel.findById(user);

  if (!userData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This module don't exist !!!");
  }

  const courseData = await courseModel.findById(course);

  if (!courseData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This module don't exist !!!");
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
      populate: {
        path: "modules",
        model: "Module",
      },
    });

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

  const moduleData = await moduleModel.findOne({
    course: courseId,
    isDeleted: false,
  });

  return moduleData;
};

//
export const courseEnrollmentService = {
  enrollInCourse,
  getUserEnrolledCourse,
  getModuleDataEnrlledCourse,
};
