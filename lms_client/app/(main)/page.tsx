import HomePage from "@/components/main/Home/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MATS Academy | Home",
  description:
    "Learn in-demand skills with expert-led courses on MATS Academy — browse our catalog, enroll, and start learning today.",
};

export default function Home() {
  return <HomePage />;
}
