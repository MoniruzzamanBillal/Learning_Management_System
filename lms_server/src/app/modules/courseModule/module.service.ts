import mongoose from "mongoose";
import AppError from "../../Error/AppError";
import { courseModel } from "../course/course.model";
import { TModule } from "./module.interface";
import { moduleModel } from "./module.model";
import httpStatus from "http-status";

// ! for crating a module
const addModule = async (payload: TModule) => {
  const { course } = payload;

  const courseData = await courseModel.findById(course);

  if (!courseData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
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

// ! for getting module data

//
export const moduleServices = {
  addModule,
};
