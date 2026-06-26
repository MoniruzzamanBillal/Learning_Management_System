import MyEnrolledCourses from "@/components/Dashboard/user/MyCourses/MyEnrolledCourses";

export const metadata = {
  title: "My Courses | User Dashboard",
  description: "View and manage your enrolled courses.",
};

const MyCoursesPage = () => {
  return <MyEnrolledCourses />;
};

export default MyCoursesPage;
