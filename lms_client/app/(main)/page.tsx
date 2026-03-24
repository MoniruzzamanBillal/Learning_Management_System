import HomePage from "@/components/main/publicPage/home/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MATS Academy | Home",
};

export default function Home() {
  return <HomePage />;
}
