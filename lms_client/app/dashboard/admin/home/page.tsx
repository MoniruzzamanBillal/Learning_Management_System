import StatPage from "@/components/main/(Admin)/Stat/StatPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
  description: "Overview of platform statistics for MATS Academy admins.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <StatPage />;
}
