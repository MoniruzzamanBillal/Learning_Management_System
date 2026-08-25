import ManageAssignCourse from "@/components/main/(Instructor)/AssignCourse/ManageAssignCourse";

export const metadata = {
  title: "Assigned Courses | Instructor Dashboard",
  description: "View and manage your assigned courses.",
  robots: { index: false, follow: false },
};

const AssignCoursesPage = () => {
  return <ManageAssignCourse />;
};

export default AssignCoursesPage;
