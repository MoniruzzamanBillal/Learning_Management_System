import AppError from "../../Error/AppError";
import { userModel } from "../user/user.model";
import { TCourse } from "./course.interface";
import httpStatus from "http-status";
import { courseModel } from "./course.model";

// ! for crating a course
const addCourse = async (payload: TCourse) => {
  const { instructor } = payload;

  const instructorData = await userModel.findById(instructor);

  if (!instructorData) {
    throw new AppError(httpStatus.BAD_REQUEST, "Instructor don't exist !!!");
  }

  const result = await courseModel.create(payload);

  return result;
};

//
export const courseServices = {
  addCourse,
};
