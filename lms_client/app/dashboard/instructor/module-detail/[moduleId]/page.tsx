import InstructorModule from "@/components/main/(Instructor)/InstructorModule/InstructorModule";

export const metadata = {
  title: "Module Detail | Instructor Dashboard",
  description: "View details of your assigned module.",
  robots: { index: false, follow: false },
};

const InstructorModulePage = () => {
  return <InstructorModule />;
};

export default InstructorModulePage;
