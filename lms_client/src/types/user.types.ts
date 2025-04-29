// * instructor type
export type TInstructor = {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
};

export type TUserRole = "admin" | "user" | "instructor";

export type TUser = {
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  isDeleted: boolean;
  userRole: TUserRole;
};
