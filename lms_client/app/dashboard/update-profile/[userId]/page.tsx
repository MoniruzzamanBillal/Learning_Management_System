import UpdateProfile from "@/components/main/Profile/UpdateProfile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Profile | MATS Academy",
  description: "Update your MATS Academy account profile details.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <UpdateProfile />;
}
