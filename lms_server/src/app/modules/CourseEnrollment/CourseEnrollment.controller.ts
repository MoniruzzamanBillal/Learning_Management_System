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

// ! for getting module data for enrolled course
const getModuleDataEnrlledCourse = catchAsync(async (req, res) => {
  const result = await courseEnrollmentService.getModuleDataEnrlledCourse(
    req?.user?.userId,
    req?.params?.id
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
    req?.params?.id,
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

//
export const CourseEnrollmentController = {
  enrollInCourse,
  getMyCourseEnrollData,
  getModuleDataEnrlledCourse,
  getVideoDataEnrlledCourse,
  courseProgressPercentage,
};
