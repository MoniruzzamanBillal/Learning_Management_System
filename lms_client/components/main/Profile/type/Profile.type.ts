import { userRoleConts } from "@/utils/constants";

export type TuserProfile = {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  userRole: keyof typeof userRoleConts;
  createdAt: string;
};
