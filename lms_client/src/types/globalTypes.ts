import { ReactNode } from "react";

export type TUser = {
  userId: string;
  userRole: string;
  role: string;
  iat: number;
  exp: number;
};

export type TDashboardLinks = {
  name: string;
  path: string;
  icon: ReactNode;
};
