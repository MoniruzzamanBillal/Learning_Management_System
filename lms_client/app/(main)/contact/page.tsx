import ContactUs from "@/components/main/ContactUs/ContactUs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MATS Academy | Contact Us",
  description:
    "Get in touch with MATS Academy — reach out with questions, feedback, or support requests.",
};

export default function page() {
  return <ContactUs />;
}
