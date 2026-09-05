import GradeAssignment from "@/components/main/(Instructor)/ManageAssignment/GradeAssignment";

export const metadata = {
  title: "Grade Assignment | Instructor Dashboard",
  description: "View and grade student submissions for this module's assignment.",
  robots: { index: false, follow: false },
};

const GradeAssignmentPage = () => {
  return <GradeAssignment />;
};

export default GradeAssignmentPage;
