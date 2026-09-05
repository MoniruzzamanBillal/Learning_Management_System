import MyCourses from "@/components/main/MyCourses/MyCourses";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MATS Academy | My Courses",
  description:
    "View and continue the courses you're enrolled in on MATS Academy.",
  robots: { index: false, follow: false },
};

export default function page() {
  return <MyCourses />;
}
