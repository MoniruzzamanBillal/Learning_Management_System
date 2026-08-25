import UpdateCourse from "@/components/main/(Admin)/ManageCourse/UpdateCourse";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Course | Admin Dashboard",
  description: "Edit an existing course's details on MATS Academy.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <UpdateCourse />;
}
