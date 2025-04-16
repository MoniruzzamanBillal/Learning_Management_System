import { UserRole } from "./user.constants";
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

//
export const userServices = {
  getAllInstructor,
};
