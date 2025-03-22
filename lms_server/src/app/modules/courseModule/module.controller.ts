import catchAsync from "../../util/catchAsync";
import sendResponse from "../../util/sendResponse";
import { moduleServices } from "./module.service";
import httpStatus from "http-status";

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

//

export const moduleController = {
  addModule,
};
