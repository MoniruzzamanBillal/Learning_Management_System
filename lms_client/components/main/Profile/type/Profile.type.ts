import { userRoleConts } from "@/utils/constants";

export type TuserProfile = {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  userRole: keyof typeof userRoleConts;
  createdAt: string;
};
