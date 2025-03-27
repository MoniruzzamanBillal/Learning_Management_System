import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";

// ! for enrolling into a course
const enrollInCourse = catchAsync(async (req, res) => {
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course Enrolled successfully !!!",
    data: "result",
  });
});

//
export const CourseEnrollmentController = {
  enrollInCourse,
};
