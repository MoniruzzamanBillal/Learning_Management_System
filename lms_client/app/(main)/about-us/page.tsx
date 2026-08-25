import AboutUs from "@/components/main/AboutUs/AboutUs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MATS Academy | About Us",
  description:
    "Learn about MATS Academy's mission, values, and the team behind our online learning platform.",
};

export default function page() {
  return <AboutUs />;
}
