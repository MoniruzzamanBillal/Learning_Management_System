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
  console.log(req?.params?.id);
  console.log(req?.user?.userId);

  const result = await courseEnrollmentService.getUserEnrolledCourse(
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

//
export const CourseEnrollmentController = {
  enrollInCourse,
  getMyCourseEnrollData,
};
