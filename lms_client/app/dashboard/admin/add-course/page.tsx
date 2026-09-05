import AddCourse from "@/components/main/(Admin)/ManageCourse/AddCourse";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Course | Admin Dashboard",
  description: "Create a new course on MATS Academy.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AddCourse />;
}
