import ManageModule from "@/components/main/(Admin)/ManageModule/ManageModule";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Modules | Admin Dashboard",
  description: "View and manage all course modules on MATS Academy.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ManageModule />;
}
