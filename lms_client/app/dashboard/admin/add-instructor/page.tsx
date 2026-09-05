import AddInstructor from "@/components/main/(Admin)/ManageInstructor/AddInstructor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Instructor | Admin Dashboard",
  description: "Create a new instructor account on MATS Academy.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AddInstructor />;
}
