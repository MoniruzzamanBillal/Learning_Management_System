import CoursePage from "@/components/main/Course/CoursePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MATS Academy | Courses",
};

export default function page() {
  return <CoursePage />;
}
