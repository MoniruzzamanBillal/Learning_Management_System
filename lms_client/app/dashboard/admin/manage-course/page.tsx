import ManageCourse from "@/components/main/(Admin)/ManageCourse/ManageCourse";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Courses | Admin Dashboard",
  description: "View, edit, and publish all courses on MATS Academy.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ManageCourse />;
}
