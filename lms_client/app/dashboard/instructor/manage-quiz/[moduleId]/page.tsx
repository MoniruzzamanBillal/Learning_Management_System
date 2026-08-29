import ManageQuiz from "@/components/main/(Instructor)/ManageQuiz/ManageQuiz";

export const metadata = {
  title: "Manage Quiz | Instructor Dashboard",
  description: "Create, edit, or delete this module's quiz.",
  robots: { index: false, follow: false },
};

const ManageQuizPage = () => {
  return <ManageQuiz />;
};

export default ManageQuizPage;
