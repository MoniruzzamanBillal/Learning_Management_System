import AboutUs from "@/components/main/AboutUs/AboutUs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MATS Academy | About Us",
};

export default function page() {
  return <AboutUs />;
}
