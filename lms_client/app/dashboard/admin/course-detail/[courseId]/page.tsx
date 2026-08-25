import CourseDetail from "@/components/main/(Admin)/ManageCourse/CourseDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Detail | Admin Dashboard",
  description: "View full details, modules, and videos for a course.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CourseDetail />;
}
