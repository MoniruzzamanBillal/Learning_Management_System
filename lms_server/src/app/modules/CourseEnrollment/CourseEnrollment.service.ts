import axios from "axios";
import config from "../../config";
import { userModel } from "../user/user.model";
import AppError from "../../Error/AppError";
import httpStatus from "http-status";
import { courseModel } from "../course/course.model";

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

  console.log(userData);
  console.log(courseData);

  const transactionId = `TXN-${Date.now()}`;

  const data = {
    store_id: config.STORE_ID,
    store_passwd: config.STORE_PASSWORD,
    total_amount: courseData?.price,
    currency: "BDT",
    tran_id: transactionId,
    success_url: "http://localhost:3030/success",
    fail_url: "http://localhost:3030/fail",
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: courseData?.name,
    product_category: courseData?.category,
    product_profile: "general",
    cus_name: userData?.name,
    cus_email: userData?.email,
    cus_add1: "N/A",
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_state: "N/A",
    cus_postcode: "N/A",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: userData?.name,
    ship_add1: "N/A",
    ship_add2: "N/A",
    ship_city: "N/A",
    ship_state: "N/A",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  const response = await axios({
    method: "post",
    url: config.SSL_PAYMENT_URL,
    data,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return response?.data;

  //
};

//
export const courseEnrollmentService = {
  enrollInCourse,
};
