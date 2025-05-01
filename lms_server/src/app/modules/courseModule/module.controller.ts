import httpStatus from "http-status";
import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { moduleServices } from "./module.service";

// ! for adding a module
const addModule = catchAsync(async (req, res) => {
  const result = await moduleServices.addModule(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Module added successfully !!!",
    data: result,
  });
});

// ! for getting all module data
const getAllModuleData = catchAsync(async (req, res) => {
  const result = await moduleServices.getAllModuleData();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Module Retrived successfully !!!",
    data: result,
  });
});

// ! for getting module data
const getModuleData = catchAsync(async (req, res) => {
  const result = await moduleServices.getModulData(req?.params?.moduleId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Module retrived successfully !!!",
    data: result,
  });
});

// ! get module data based on course id
const getModuleFromCourseId = catchAsync(async (req, res) => {
  const result = await moduleServices.getModuleFromCourseId(
    req?.params?.courseId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Data retrived successfully !!!",
    data: result,
  });
});

// ! for updating module
const updateModule = catchAsync(async (req, res) => {
  const result = await moduleServices.updateModule(
    req?.body,
    req?.params?.moduleId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Module updated successfully !!!",
    data: result,
  });
});

//

export const moduleController = {
  addModule,
  getModuleData,
  updateModule,
  getAllModuleData,
  getModuleFromCourseId,
};
