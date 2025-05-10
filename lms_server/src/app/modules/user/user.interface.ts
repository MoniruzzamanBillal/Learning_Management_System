export type TUserRole = "admin" | "user" | "instructor";

export type TUser = {
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  isDeleted: boolean;
  userRole: TUserRole;
  needsPasswordChange?: boolean;
};
