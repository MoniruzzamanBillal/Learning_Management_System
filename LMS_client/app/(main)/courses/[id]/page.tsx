import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "MATS Academy | Course Detail",
};

interface IPageProps {
  params: Promise<{ id: string }>;
}

export default async function page({ params }: IPageProps) {
  const { id } = await params;

  const CourseDetailPage = dynamic(
    () => import("@/components/main/publicPage/courseDetail/CourseDetailPage"),
    {
      loading: () => <p>loading....</p>,
    },
  );

  return <CourseDetailPage id={id} />;
}
