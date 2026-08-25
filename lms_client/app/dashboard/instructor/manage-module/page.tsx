import ManageModule from "@/components/main/(Instructor)/ManageModule/ManageModule";

export const metadata = {
  title: "Manage Modules | Instructor Dashboard",
  description: "View and manage all modules.",
  robots: { index: false, follow: false },
};

const ManageModulePage = () => {
  return <ManageModule />;
};

export default ManageModulePage;
