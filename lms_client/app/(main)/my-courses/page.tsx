import MyCourses from "@/components/main/publicPage/MyCourses/MyCourses";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MATS Academy | My Courses",
};

export default function page() {
  return <MyCourses />;
}
