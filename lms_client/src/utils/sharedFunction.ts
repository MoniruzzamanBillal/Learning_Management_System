import { useAppSelector } from "@/redux/hook";
import { verifyToken } from "./verifyToken";
import { TUser } from "@/types/globalTypes";

export const useGetUser = () => {
  const { user } = useAppSelector((state) => state.auth);

  return user;
};

export const GetUserRole = () => {
  const { token } = useAppSelector((state) => state.auth);

  if (!token) {
    return;
  }

  const user = verifyToken(token) as TUser;

  return user?.userRole;
};
