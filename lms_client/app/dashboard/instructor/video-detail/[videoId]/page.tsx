import InstructorVideoDetail from "@/components/main/(Instructor)/InstructorVideoDetail/InstructorVideoDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Detail | Instructor Dashboard",
  description: "View full details for a course video.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <InstructorVideoDetail />;
}
