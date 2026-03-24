import ContactUs from "@/components/main/publicPage/ContactUs/ContactUs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MATS Academy | Contact Us",
};

export default function page() {
  return <ContactUs />;
}
