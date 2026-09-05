import SignUpPage from "@/components/main/SignUp/SignUpPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MATS Academy | Sign Up",
  description:
    "Create your free MATS Academy account to enroll in courses and start learning.",
};

export default function page() {
  return <SignUpPage />;
}
