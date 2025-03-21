import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { courseServices } from "./course.service";
import httpStatus from "http-status";

// ! for crating a course
const createCourse = catchAsync(async (req, res) => {
  const result = await courseServices.addCourse(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course added successfully !!!",
    data: result,
  });
});

//
export const courseController = {
  createCourse,
};
