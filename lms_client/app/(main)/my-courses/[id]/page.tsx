import EnrolledCourseDetailSkeleton from "@/components/main/publicPage/MyCourses/EnrolledCourseDetail/EnrolledCourseDetailSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "MATS Academy | My Course",
};

type TpageProps = {
  params: Promise<{ id: string }>;
};

export default async function page({ params }: TpageProps) {
  const { id } = await params;

  const EnrollCourseDetail = dynamic(
    () =>
      import("@/components/main/publicPage/MyCourses/EnrolledCourseDetail/EnrollCourseDetail"),
    {
      loading: () => <EnrolledCourseDetailSkeleton />,
    },
  );

  return <EnrollCourseDetail id={id} />;
}
