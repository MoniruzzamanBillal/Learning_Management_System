import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import prisma from "../../util/prisma";

type TAddModulePayload = {
  course: string;
  title: string;
  instructor?: string;
};

// ! for crating a module
const addModule = async (payload: TAddModulePayload) => {
  const { course, instructor } = payload;

  const courseData = await prisma.course.findUnique({ where: { id: course } });

  if (!courseData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  if (courseData?.published) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This Course is already published , you can't add new module !!!!"
    );
  }

  // instructorId is a required FK on Module (fixes the old TModule.instructor
  // typing bug where it was incorrectly an optional array — the Mongoose
  // schema itself already enforced a single required instructor at runtime,
  // only the TS interface lied). Validation still allows `instructor` to be
  // omitted, so this check preserves the original's exact error behavior
  // rather than letting Prisma throw an unrelated FK/validation error.
  const instructorData = instructor
    ? await prisma.user.findFirst({ where: { id: instructor, isDeleted: false } })
    : null;

  if (!instructorData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This instructor don't exist !!!"
    );
  }

  // No denormalized Course.modules array to push into anymore — Module is
  // derived automatically via Module.courseId, so this is a single write
  // (the old Mongoose transaction existed only to keep that array in sync).
  const moduleData = await prisma.module.create({
    data: {
      title: payload.title,
      courseId: course,
      instructorId: instructor as string,
    },
  });

  return moduleData;
};

// ! for getting all module
const getAllModuleData = async () => {
  const moduleData = await prisma.module.findMany({
    where: { isDeleted: false },
    include: { course: { select: { id: true, name: true, published: true } } },
  });

  return moduleData;
};

// ! get module data based on course id
const getModuleFromCourseId = async (courseId: string) => {
  const courseData = await prisma.course.findUnique({ where: { id: courseId } });

  if (!courseData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Course don't exist!!!");
  }

  const result = await prisma.module.findMany({
    where: { courseId, isDeleted: false },
    include: { course: { select: { id: true, name: true, published: true } } },
  });

  return result;
};

// ! for getting module data
const getModulData = async (moduleId: string) => {
  // findFirst, not findUnique: combining the unique `id` lookup with
  // `isDeleted: false` isn't allowed on findUnique.
  const moduleData = await prisma.module.findFirst({
    where: { id: moduleId, isDeleted: false },
    include: {
      course: {
        select: { id: true, name: true, description: true, category: true, published: true },
      },
      videos: {
        where: { isDeleted: false },
        select: { id: true, title: true, videoUrl: true },
      },
      instructor: {
        select: { id: true, name: true, email: true, profilePicture: true },
      },
    },
  });

  if (!moduleData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This module don't exist !!!");
  }

  return moduleData;
};

// ! for updating module
const updateModule = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  moduleId: string
) => {
  const moduleData = await prisma.module.findFirst({
    where: { id: moduleId, isDeleted: false },
  });

  if (!moduleData) {
    throw new AppError(httpStatus.BAD_REQUEST, "This module don't exist !!!");
  }

  const updatedData = await prisma.module.update({
    where: { id: moduleId },
    data: payload as Prisma.ModuleUpdateInput,
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
