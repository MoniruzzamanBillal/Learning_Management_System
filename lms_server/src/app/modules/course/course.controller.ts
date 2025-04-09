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

// ! for getting all course data
const getAllCourses = catchAsync(async (req, res) => {
  const result = await courseServices.getAllCourses();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course data retrives successfully !!!",
    data: result,
  });
});

// ! for getting single course
const getSingleCourse = catchAsync(async (req, res) => {
  const result = await courseServices.getSingleCoureData(req?.params?.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course data retrives successfully !!!",
    data: result,
  });
});

// ! for updating a course
const updateCourse = catchAsync(async (req, res) => {
  const result = await courseServices.updateCourseData(
    req.body,
    req?.params?.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course data updated successfully !!!",
    data: result,
  });
});

// ! for publishing a course
const publishCourse = catchAsync(async (req, res) => {
  const result = await courseServices.publishCourse(req?.params?.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course published successfully !!!",
    data: result,
  });
});

//
export const courseController = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  publishCourse,
};
