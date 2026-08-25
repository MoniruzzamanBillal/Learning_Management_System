import ModuleDetail from "@/components/main/(Admin)/ManageModule/ModuleDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Module Detail | Admin Dashboard",
  description: "View full details and videos for a course module.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ModuleDetail />;
}
