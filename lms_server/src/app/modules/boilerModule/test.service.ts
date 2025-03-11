import { Torder } from "./test.interface";
import orderModel from "./test.model";

// ! create order into DBb
const createOrderInDB = async (orderData: Torder) => {
  const response = await orderModel.create(orderData);

  return response;
};

//! getting all data from db
const getAllProduct = async (email: string | undefined) => {
  let query = {};

  if (email) {
    query = { email };
  }

  const result = await orderModel.find(query);

  return result;
};

//
export const orderServices = {
  createOrderInDB,
  getAllProduct,
};
