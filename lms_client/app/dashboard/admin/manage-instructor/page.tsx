import ManageInstructorPage from "@/components/main/(Admin)/ManageInstructor/ManageInstructorPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Instructors | Admin Dashboard",
  description: "View and manage instructor accounts on MATS Academy.",
  robots: { index: false, follow: false },
};

export default function page() {
  return <ManageInstructorPage />;
}
