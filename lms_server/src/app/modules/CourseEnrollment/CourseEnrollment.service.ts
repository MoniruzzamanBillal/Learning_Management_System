import axios from "axios";
import config from "../../config";
import { userModel } from "../user/user.model";
import AppError from "../../Error/AppError";
import httpStatus from "http-status";
import { courseModel } from "../course/course.model";
import { sslServices } from "../SSL/SSL.service";

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

  const transactionId = `TXN-${Date.now()}`;

  const paymentData = {
    price: courseData?.price,
    transactionId,
    productName: courseData?.name,
    productCategory: courseData?.category,
    userName: userData?.name,
    userEmail: userData?.email,
  };

  const result = await sslServices.initPayment(paymentData);

  return result;

  //
};

//
export const courseEnrollmentService = {
  enrollInCourse,
};
