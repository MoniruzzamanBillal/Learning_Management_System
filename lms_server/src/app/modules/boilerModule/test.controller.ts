import httpStatus from "http-status";
import sendResponse from "../../util/sendResponse";
import { Torder } from "./test.interface";
import { orderServices } from "./test.service";
import { orderValidationSchema } from "./test.validation";
import catchAsync from "../../util/catchAsync";

// ! creating order
const createOrder = catchAsync(async (req, res) => {
  const data = req.body;
  const parsedData = orderValidationSchema.parse(data);

  const result = await orderServices.createOrderInDB(parsedData);
  const resultObj = result.toObject();
  const { _id, __v, ...dataWithoutId } = resultObj as Torder;

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "testing !!! ",
    data: dataWithoutId,
  });
});

// ! getting all orders from DB
const getAllOrder = catchAsync(async (req, res) => {
  const userEmail = req.query.email as string | undefined;

  const result = await orderServices.getAllProduct(userEmail);

  const resultObjWithoutId = result.map((res: any) => {
    const result = res.toObject();
    const { _id, __v, ...dataWithoutId } = result as Torder;
    return dataWithoutId;
  });

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully for user email!",
    data: resultObjWithoutId,
  });
});

export const orderController = {
  getAllOrder,
  createOrder,
};
