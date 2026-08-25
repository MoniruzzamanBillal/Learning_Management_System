import ErrorLogsPage from "@/components/main/(Admin)/ErrorLogs/ErrorLogsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error Logs | Admin Dashboard",
  description: "Review application error logs for MATS Academy.",
  robots: { index: false, follow: false },
};

export default function page() {
  return <ErrorLogsPage />;
}
