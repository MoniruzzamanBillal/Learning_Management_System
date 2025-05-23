import bcrypt from "bcrypt";
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../Error/AppError";
import { SendImageCloudinary } from "../../util/SendImageCloudinary";
import { TUser } from "../user/user.interface";
import { userModel } from "../user/user.model";
import { createToken } from "./auth.util";

// ! crate user
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createUserIntoDB = async (payload: Partial<TUser>, file: any) => {
  if (file) {
    const name = (payload?.name as string).trim();
    const path = (file?.path as string).trim();

    const cloudinaryResponse = await SendImageCloudinary(
      path as string,
      name as string
    );
    const profilePicture = cloudinaryResponse?.secure_url;
    payload.profilePicture = profilePicture;
  }

  const result = await userModel.create({ ...payload });

  return result;
};

// ! for creating an instructor
const createInstructor = async (payload: Partial<TUser>, file: any) => {
  if (file) {
    const name = (payload?.name as string).trim();
    const path = (file?.path as string).trim();

    const cloudinaryResponse = await SendImageCloudinary(
      path as string,
      name as string
    );
    const profilePicture = cloudinaryResponse?.secure_url;
    payload.profilePicture = profilePicture;
  }

  payload.password = "123456";
  payload.needsPasswordChange = true;

  const result = await userModel.create({ ...payload });

  return result;
};

type Tlogin = {
  email: string;
  password: string;
};

// ! for login
const signInFromDb = async (payload: Tlogin) => {
  const userData = await userModel.findOne({ email: payload?.email });

  if (!userData) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User dont exist with this email !!!"
    );
  }

  const isPasswordMatch = await bcrypt.compare(
    payload?.password,
    userData?.password
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, "Password don't match !!");
  }

  const userId = userData?._id?.toHexString();
  const userRole = userData?.userRole;

  const jwtPayload = {
    userId,
    userRole,
  };

  const token = createToken(jwtPayload, config.jwt_secret as string);

  return { userData, token };
};

//
export const authServices = {
  createUserIntoDB,
  signInFromDb,
  createInstructor,
};
