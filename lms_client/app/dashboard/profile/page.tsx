import ProfilePage from "@/components/main/Profile/ProfilePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile | MATS Academy",
  description: "View and manage your MATS Academy account profile.",
  robots: { index: false, follow: false },
};

export default function page() {
  return <ProfilePage />;
}
