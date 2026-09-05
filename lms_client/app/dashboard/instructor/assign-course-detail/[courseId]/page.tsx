import AssignCourseDetail from "@/components/main/(Instructor)/AssignCourse/AssignCourseDetail";

export const metadata = {
  title: "Course Detail | Instructor Dashboard",
  description: "View details of your assigned course.",
  robots: { index: false, follow: false },
};

const AssignCourseDetailPage = () => {
  return <AssignCourseDetail />;
};

export default AssignCourseDetailPage;
