import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { courseServices } from "./course.service";

// ! for crating a course
const createCourse = catchAsync(async (req, res) => {
  const result = await courseServices.addCourse(req?.body, req?.file);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course added successfully !!!",
    data: result,
  });
});

// ! for getting all course data
const getAllCourses = catchAsync(async (req, res) => {
  const result = await courseServices.getAllCourses(req?.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course data retrives successfully !!!",
    data: result,
  });
});

// ! for getting all course data for admin
const getAllCoursesForAdmin = catchAsync(async (req, res) => {
  const result = await courseServices.getAllCoursesForAdmin();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course data retrives successfully !!!",
    data: result,
  });
});

// ! for getting all course data with module ( admin and instructor )
const getAllCoursesWithModules = catchAsync(async (req, res) => {
  const result = await courseServices.getAllCoursesWithModules();

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

// ! for getting instructor assign courses
const getInstructorsAssignCourses = catchAsync(async (req, res) => {
  const result = await courseServices.getInstructorsAssignCourses(
    req?.params?.instructorId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Instructor assigned Course data retrives successfully !!!",
    data: result,
  });
});

// ! for getting single course data , admin manage course
const getCourseDetailsForAdmin = catchAsync(async (req, res) => {
  const result = await courseServices.getCourseDetailsForAdmin(
    req?.params?.courseId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course data retrives successfully !!!",
    data: result,
  });
});

// ! get course detail for instructor
const getCourseDetailForInstructor = catchAsync(async (req, res) => {
  const result = await courseServices.getCourseDetailForInstructor(
    req?.params?.courseId
  );

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
    req?.body,
    req?.file,
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
  getCourseDetailsForAdmin,
  getAllCoursesForAdmin,
  getInstructorsAssignCourses,
  getAllCoursesWithModules,
  getCourseDetailForInstructor,
};
