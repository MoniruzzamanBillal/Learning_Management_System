import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { courseEnrollmentService } from "./CourseEnrollment.service";

// ! for enrolling into a course
const enrollInCourse = catchAsync(async (req, res) => {
  const result = await courseEnrollmentService.enrollInCourse();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course Enrolled successfully !!!",
    data: result,
  });
});

//
export const CourseEnrollmentController = {
  enrollInCourse,
};
