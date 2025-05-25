import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { courseEnrollmentService } from "./CourseEnrollment.service";

// ! for enrolling into a course
const enrollInCourse = catchAsync(async (req, res) => {
  const result = await courseEnrollmentService.enrollInCourse(req?.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course Enrollment processing!!!",
    data: result,
  });
});

// ! for getting my enroll course data
const getMyCourseEnrollData = catchAsync(async (req, res) => {
  const result = await courseEnrollmentService.getUserEnrolledCourse(
    req?.user?.userId,
    req?.params?.courseId
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Enrolled Course retrived successfully!!!",
    data: result,
  });
});

// ! for getting all user enrolled course
const getAllUserEnrolledCourse = catchAsync(async (req, res) => {
  const result = await courseEnrollmentService.getAllUserEnrolledCourse(
    req?.user?.userId
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Users All Enrolled Course retrived successfully!!!",
    data: result,
  });
});

// ! for getting module data for enrolled course
const getModuleDataEnrlledCourse = catchAsync(async (req, res) => {
  const result = await courseEnrollmentService.getModuleDataEnrlledCourse(
    req?.user?.userId,
    req?.params?.courseId
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Enrolled Course retrived successfully!!!",
    data: result,
  });
});

// ! for getting video data for enrolled course
const getVideoDataEnrlledCourse = catchAsync(async (req, res) => {
  const result = await courseEnrollmentService.watchVideo(
    req?.params?.videoId,
    req?.user?.userId
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Video retrived successfully!!!",
    data: result,
  });
});

// ! for getting course progress percentage
const courseProgressPercentage = catchAsync(async (req, res) => {
  const result = await courseEnrollmentService.courseProgressPercentage(
    req?.params?.courseId,
    req?.user?.userId
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course progress result retrived successfully!!!",
    data: result,
  });
});

// ! for getting enrolled course info
const enrollmentsPerCourse = catchAsync(async (req, res) => {
  const result = await courseEnrollmentService.enrollmentsPerCourse();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course Enrollment data retrived successfully!!!",
    data: result,
  });
});

// ! based on module id , find video data for enrolled user
const getUserEnrolledModuleVideos = catchAsync(async (req, res) => {
  const result = await courseEnrollmentService.getUserEnrolledModuleVideos(
    req?.params?.moduleId,
    req?.user?.userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course Enrollment Video data retrived successfully!!!",
    data: result,
  });
});

//  ! for marking course as complete
const markCompleteCourse = catchAsync(async (req, res) => {
  const result = await courseEnrollmentService.markCompleteCourse(
    req?.params?.courseId,
    req?.user?.userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course Completed successfully !!!",
    data: result,
  });
});

// ! for checking user enrolled a coure or not
const checkUserEnrolledInCourse = catchAsync(async (req, res) => {
  const result = await courseEnrollmentService.checkUserEnrolledInCourse(
    req?.params?.courseId,
    req?.user?.userId
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Enrolled Course confirmation retrived successfully!!!",
    data: result,
  });
});

//
export const CourseEnrollmentController = {
  enrollInCourse,
  getMyCourseEnrollData,
  getModuleDataEnrlledCourse,
  getVideoDataEnrlledCourse,
  courseProgressPercentage,
  enrollmentsPerCourse,
  getAllUserEnrolledCourse,
  getUserEnrolledModuleVideos,
  markCompleteCourse,
  checkUserEnrolledInCourse,
};
