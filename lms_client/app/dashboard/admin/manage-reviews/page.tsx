import ManageReviewPage from "@/components/main/(Admin)/ManageReview/ManageReviewPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Reviews | Admin Dashboard",
  description: "View and moderate course reviews on MATS Academy.",
  robots: { index: false, follow: false },
};

export default function page() {
  return <ManageReviewPage />;
}
