import bcrypt from "bcrypt";
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../Error/AppError";
import { SendImageCloudinary } from "../../util/SendImageCloudinary";
import prisma from "../../util/prisma";
import { UserRole } from "./user.constants";
import { TUser } from "./user.interface";

// ! for getting all instructor
const getAllInstructor = async () => {
  const result = await prisma.user.findMany({
    where: {
      userRole: UserRole.instructor,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
    },
  });

  return result;
};

// ! for changing password
const changePassword = async (
  payload: { oldPassword: string; newPassword: string },
  userId: string
) => {
  // findFirst, not findUnique: combining the unique `id` lookup with
  // `isDeleted: false` isn't allowed on findUnique.
  const userData = await prisma.user.findFirst({
    where: { id: userId, isDeleted: false },
  });

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

  const result = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword, needsPasswordChange: false },
  });

  return result;
  //
};

// ! for getting logged in user data
const getLoggedInUser = async (userId: string) => {
  const result = await prisma.user.findFirst({
    where: { id: userId, isDeleted: false },
    select: {
      id: true,
      name: true,
      profilePicture: true,
      userRole: true,
      createdAt: true,
      email: true,
    },
  });

  return result;
};

// ! for getting user based on user id
const getSpecificUser = async (userId: string) => {
  const result = await prisma.user.findFirst({
    where: { id: userId, isDeleted: false },
    select: {
      id: true,
      name: true,
      profilePicture: true,
      userRole: true,
      createdAt: true,
      email: true,
    },
  });

  return result;
};

// ! for updating a user
const updateUser = async (
  payload: Partial<TUser>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const result = await prisma.user.update({
    where: { id: userId },
    data: payload,
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
