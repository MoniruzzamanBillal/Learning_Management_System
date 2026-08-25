import InstructorPage from "@/components/main/Instructor/Instructor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MATS Academy | Instructors",
  description:
    "Meet the instructors teaching courses on MATS Academy and learn about their expertise.",
};

export default function page() {
  return <InstructorPage />;
}
