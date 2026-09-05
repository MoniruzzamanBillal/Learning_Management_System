import CoursePage from "@/components/main/Course/CoursePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MATS Academy | Courses",
  description:
    "Browse MATS Academy's full course catalog and find the right course to build your skills.",
};

export default function page() {
  return <CoursePage />;
}
