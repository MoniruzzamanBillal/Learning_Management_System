import ManageVideo from "@/components/main/(Instructor)/ManageVideo/ManageVideo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Videos | Instructor Dashboard",
  description: "View and manage all videos across your modules.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ManageVideo />;
}
