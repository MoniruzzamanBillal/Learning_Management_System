import ManageAssignCourse from "@/components/Dashboard/instructor/AssignCourse/ManageAssignCourse";

export const metadata = {
  title: "Assigned Courses | Instructor Dashboard",
  description: "View and manage your assigned courses.",
};

const AssignCoursesPage = () => {
  return <ManageAssignCourse />;
};

export default AssignCoursesPage;
