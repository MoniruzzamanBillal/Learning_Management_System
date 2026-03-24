import InstructorPage from "@/components/main/publicPage/instructor/Instructor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MATS Academy | Instructor",
};

export default function page() {
  return <InstructorPage />;
}
