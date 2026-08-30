import ManageAssignment from "@/components/main/(Instructor)/ManageAssignment/ManageAssignment";

export const metadata = {
  title: "Manage Assignment | Instructor Dashboard",
  description: "Create, edit, or delete this module's assignment.",
  robots: { index: false, follow: false },
};

const ManageAssignmentPage = () => {
  return <ManageAssignment />;
};

export default ManageAssignmentPage;
