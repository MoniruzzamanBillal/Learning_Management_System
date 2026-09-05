import Enrollment from "@/components/main/(Admin)/Enrollment/Enrollment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enrollments | Admin Dashboard",
  description: "View and manage student course enrollments.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Enrollment />;
}
