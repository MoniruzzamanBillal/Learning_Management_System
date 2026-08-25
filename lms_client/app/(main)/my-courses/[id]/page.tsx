import EnrolledCourseDetailSkeleton from "@/components/main/MyCourses/EnrolledCourseDetail/EnrolledCourseDetailSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "MATS Academy | My Course",
  description: "Continue watching your enrolled course content on MATS Academy.",
  robots: { index: false, follow: false },
};

type TpageProps = {
  params: Promise<{ id: string }>;
};

export default async function page({ params }: TpageProps) {
  const { id } = await params;

  const EnrollCourseDetail = dynamic(
    () =>
      import("@/components/main/MyCourses/EnrolledCourseDetail/EnrollCourseDetail"),
    {
      loading: () => <EnrolledCourseDetailSkeleton />,
    },
  );

  return <EnrollCourseDetail id={id} />;
}
