import FAQPage from "@/components/main/publicPage/FAQPage/FAQPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MATS Academy | FAQ",
};

export default function page() {
  return <FAQPage />;
}
