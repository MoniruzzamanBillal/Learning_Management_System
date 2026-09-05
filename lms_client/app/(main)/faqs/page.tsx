import FAQPage from "@/components/main/FAQPage/FAQPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MATS Academy | FAQ",
  description:
    "Find answers to frequently asked questions about courses, enrollment, and payments on MATS Academy.",
};

export default function page() {
  return <FAQPage />;
}
