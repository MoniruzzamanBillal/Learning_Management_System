import { SendImageCloudinary } from "../../util/SendImageCloudinary";
import { TUser } from "../user/user.interface";
import { userModel } from "../user/user.model";

// ! crate user
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

//
export const authServices = {
  createUserIntoDB,
};
