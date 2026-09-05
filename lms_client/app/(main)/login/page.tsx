import LoginPage from "@/components/main/Login/LoginPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MATS Academy | Login",
  description: "Log in to your MATS Academy account to access your courses.",
};

export default function page() {
  return <LoginPage />;
}
