import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { SendImageCloudinary } from "../../util/SendImageCloudinary";
import { userModel } from "../user/user.model";
import { TCourse } from "./course.interface";
import { courseModel } from "./course.model";

// ! for crating a course
const addCourse = async (payload: TCourse, file: any) => {
  const { instructors } = payload;

  if (file) {
    const name = (payload?.name as string).trim();
    const path = (file?.path as string).trim();

    const cloudinaryResponse = await SendImageCloudinary(
      path as string,
      name as string
    );

    const courseCover = cloudinaryResponse?.secure_url as string;
    payload.courseCover = courseCover;
  }

  await Promise.all(
    instructors?.map(async (instructor) => {
      const instructorData = await userModel.findById(instructor);

      if (!instructorData) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Instructor don't exist !!!"
        );
      }
    })
  );

  const result = await courseModel.create(payload);

  return result;
};

// ! for getting all course data
const getAllCourses = async () => {
  const result = await courseModel
    .find({ published: true })
    .populate("instructors", " name email profilePicture ");
  return result;
};

// ! for getting all course data ,admin manage course
const getAllCoursesForAdmin = async () => {
  const result = await courseModel
    .find()
    .populate("instructors", " name email profilePicture _id ");
  return result;
};

// ! for getting all course data with module ( admin and instructor )
const getAllCoursesWithModules = async () => {
  const result = await courseModel
    .find()
    .populate("instructors", " name email profilePicture _id ")
    .populate("modules", " -__v -updatedAt -createdAt ");
  return result;
};

// ! for getting instructor assign courses
const getInstructorsAssignCourses = async (instructorId: string) => {
  const courseData = await courseModel
    .find({ instructors: instructorId })
    .select(" category courseCover name _id published ");

  if (!courseData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Instructor don't assigned for any courses  !!!"
    );
  }

  return courseData;
};

// ! for getting single course data
const getSingleCoureData = async (courseId: string) => {
  const result = await courseModel
    .findOne({ _id: courseId, published: true })
    .populate("instructors", " name email profilePicture _id ");

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  return result;
};

// ! for getting single course data , admin manage course
const getCourseDetailsForAdmin = async (courseId: string) => {
  const result = await courseModel.findOne({ _id: courseId });
  // .populate("instructors", " name email profilePicture _id ");

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  return result;
};

// ! course detail for instructor
const getCourseDetailForInstructor = async (courseId: string) => {
  const result = await courseModel
    .findOne({ _id: courseId })
    .select(" _id name category published modules ");
  // .populate("instructors", " name email profilePicture _id ");

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  return result;
};

// ! for updating course data
const updateCourseData = async (
  payload: Partial<TCourse>,
  file: any,
  courseId: string
) => {
  const courseData = await courseModel.findById(courseId);

  if (!courseData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  if (file) {
    const name = (payload?.name as string).trim();
    const path = (file?.path as string).trim();

    const cloudinaryResponse = await SendImageCloudinary(
      path as string,
      name as string
    );

    const courseCover = cloudinaryResponse?.secure_url as string;
    payload.courseCover = courseCover;
  }

  const updatedResult = await courseModel.findByIdAndUpdate(courseId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedResult;
};

// ! for publishing a course
const publishCourse = async (courseId: string) => {
  const courseData = await courseModel.findById(courseId);

  if (!courseData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  if (courseData?.published) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This Course is already published !!!"
    );
  }

  const result = await courseModel.findByIdAndUpdate(
    courseId,
    { published: true },
    { new: true }
  );

  return result;
};

//
export const courseServices = {
  addCourse,
  getAllCourses,
  getSingleCoureData,
  updateCourseData,
  publishCourse,
  getCourseDetailsForAdmin,
  getAllCoursesForAdmin,
  getInstructorsAssignCourses,
  getAllCoursesWithModules,
  getCourseDetailForInstructor,
};
