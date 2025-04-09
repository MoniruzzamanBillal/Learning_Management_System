import AppError from "../../Error/AppError";
import { userModel } from "../user/user.model";
import { TCourse } from "./course.interface";
import httpStatus from "http-status";
import { courseModel } from "./course.model";

// ! for crating a course
const addCourse = async (payload: TCourse) => {
  const { instructors } = payload;

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
// { published: true }

// ! for getting single course data
const getSingleCoureData = async (courseId: string) => {
  const result = await courseModel
    .findOne({ _id: courseId, published: true })
    .populate("instructors", " name email profilePicture ");

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  return result;
};

// ! for updating course data
const updateCourseData = async (
  payload: Partial<TCourse>,
  courseId: string
) => {
  const courseData = await courseModel.findById(courseId);

  if (!courseData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  const updatedResult = await courseModel.findByIdAndUpdate(courseId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedResult;
};

//
export const courseServices = {
  addCourse,
  getAllCourses,
  getSingleCoureData,
  updateCourseData,
};
