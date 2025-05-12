import bcrypt from "bcrypt";
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../Error/AppError";
import { SendImageCloudinary } from "../../util/SendImageCloudinary";
import { UserRole } from "./user.constants";
import { TUser } from "./user.interface";
import { userModel } from "./user.model";

// ! for getting all instructor
const getAllInstructor = async () => {
  const result = await userModel
    .find({
      userRole: UserRole?.instructor,
      isDeleted: false,
    })
    .select(" _id name email profilePicture  ");

  return result;
};

// ! for changing password
const changePassword = async (
  payload: { oldPassword: string; newPassword: string },
  userId: string
) => {
  const userData = await userModel.findById(userId);

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User dont exist!!!");
  }

  const isPasswordMatch = await bcrypt.compare(
    payload?.oldPassword,
    userData?.password
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, "Password don't match !!");
  }

  const hashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await userModel.findByIdAndUpdate(
    userId,
    { password: hashedPassword, needsPasswordChange: false },
    { new: true }
  );

  return result;
  //
};

// ! for getting logged in user data
const getLoggedInUser = async (userId: string) => {
  const result = await userModel
    .findById(userId)
    .select(" _id name profilePicture userRole createdAt email ");

  return result;
};

// ! for getting user based on user id
const getSpecificUser = async (userId: string) => {
  const result = await userModel
    .findById(userId)
    .select(" _id name profilePicture userRole createdAt email ");

  return result;
};

// ! for updating a user
const updateUser = async (
  payload: Partial<TUser>,
  file: any,
  userId: string
) => {
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

  const result = await userModel.findByIdAndUpdate(userId, payload, {
    new: true,
  });

  return result;
};

//
export const userServices = {
  getAllInstructor,
  changePassword,
  getLoggedInUser,
  getSpecificUser,
  updateUser,
};
