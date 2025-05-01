import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../Error/AppError";
import { courseModel } from "../course/course.model";
import { userModel } from "../user/user.model";
import { TModule } from "./module.interface";
import { moduleModel } from "./module.model";

// ! for crating a module
const addModule = async (payload: TModule) => {
  const { course, instructor } = payload;

  const courseData = await courseModel.findById(course);

  if (!courseData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  if (courseData?.published) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This Course is already published , you can't add new module !!!!"
    );
  }

  const instructorData = await userModel.findById(instructor);

  if (!instructorData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This instructor don't exist !!!"
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const moduleData = await moduleModel.create([payload], { session });

    await courseModel.findByIdAndUpdate(
      course,
      {
        $push: { modules: moduleData[0]?._id },
      },
      { session }
    );

    await session.commitTransaction();
    return moduleData;
  } catch (error: any) {
    console.log(error);
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

// ! for getting all module
const getAllModuleData = async () => {
  const moduleData = await moduleModel
    .find({ isDeleted: false })
    .populate("course", " _id name published ");

  return moduleData;
};

// ! get module data based on course id
const getModuleFromCourseId = async (courseId: string) => {
  const courseData = await courseModel.findById(courseId);

  if (!courseData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  const result = await moduleModel
    .find({ course: courseId })
    .populate("course", " _id name published ");

  return result;
};

// ! for getting module data
const getModulData = async (moduleId: string) => {
  const moduleData = await moduleModel
    .findById(moduleId)
    .populate("course", "name description category ")
    .populate("videos", "title  videoUrl")
    .populate("instructor", " name email profilePicture");

  if (!moduleData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This module don't exist !!!");
  }

  return moduleData;
};

// ! for updating module
const updateModule = async (payload: Partial<TModule>, moduleId: string) => {
  const moduleData = await moduleModel.findById(moduleId);

  if (!moduleData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This module don't exist !!!");
  }

  const updatedData = await moduleModel.findByIdAndUpdate(moduleId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedData;
};

//
export const moduleServices = {
  addModule,
  getModulData,
  updateModule,
  getAllModuleData,
  getModuleFromCourseId,
};
