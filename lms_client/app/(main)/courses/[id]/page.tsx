import CourseDetailSkeleton from "@/components/main/CourseDetail/CourseDetailSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "MATS Academy | Course Detail",
  description:
    "View course details, curriculum, and instructor information before enrolling on MATS Academy.",
};

type TpageProps = {
  params: Promise<{ id: string }>;
};

export default async function page({ params }: TpageProps) {
  const { id } = await params;

  const CourseDetailPage = dynamic(
    () => import("@/components/main/CourseDetail/CourseDetailPage"),
    {
      loading: () => <CourseDetailSkeleton />,
    },
  );

  return <CourseDetailPage id={id} />;
}
