import { Prisma } from "../../../generated/prisma/client";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../Error/AppError";
import { SendImageCloudinary } from "../../util/SendImageCloudinary";
import prisma from "../../util/prisma";
import { TUser } from "../user/user.interface";
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

  // No Mongoose pre("save") hook in Prisma — hash explicitly.
  const hashedPassword = await bcrypt.hash(
    payload?.password as string,
    Number(config.bcrypt_salt_rounds)
  );

  try {
    const result = await prisma.user.create({
      data: {
        ...payload,
        password: hashedPassword,
      } as Prisma.UserCreateInput,
    });

    return result;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "A user with this email already exists !!!"
      );
    }
    throw error;
  }
};

// ! for creating an instructor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // No Mongoose pre("save") hook in Prisma — hash explicitly (preserves
  // existing behavior exactly: the hardcoded default password is still
  // stored hashed, same as the old pre-save hook did).
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  try {
    const result = await prisma.user.create({
      data: {
        ...payload,
        password: hashedPassword,
      } as Prisma.UserCreateInput,
    });

    return result;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "A user with this email already exists !!!"
      );
    }
    throw error;
  }
};

type Tlogin = {
  email: string;
  password: string;
};

// ! for login
const signInFromDb = async (payload: Tlogin) => {
  // findFirst, not findUnique: combining the unique `email` lookup with
  // `isDeleted: false` isn't allowed on findUnique.
  const userData = await prisma.user.findFirst({
    where: { email: payload?.email, isDeleted: false },
  });

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

  const userId = userData.id;
  const userRole = userData.userRole;

  const jwtPayload = {
    userId,
    userRole,
    profileImage: userData?.profilePicture,
  };

  const token = createToken(jwtPayload, config.jwt_secret as string);

  return { userData, token };
};

// ! for update password
const updatePassword = async (payload: Tlogin) => {
  const userData = await prisma.user.findFirst({
    where: { email: payload?.email, isDeleted: false },
  });

  if (!userData) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User dont exist with this email !!!"
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload?.password,
    Number(config.bcrypt_salt_rounds)
  );

  await prisma.user.update({
    where: { id: userData.id },
    data: { password: hashedPassword },
  });
};

//
export const authServices = {
  createUserIntoDB,
  signInFromDb,
  createInstructor,
  updatePassword,
};
