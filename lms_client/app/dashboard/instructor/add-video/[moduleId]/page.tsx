import AddVideo from "@/components/main/(Instructor)/ManageVideo/AddVideo";

export const metadata = {
  title: "Add Video | Instructor Dashboard",
  description: "Upload a new video to a module.",
  robots: { index: false, follow: false },
};

const AddVideoPage = () => {
  return <AddVideo />;
};

export default AddVideoPage;
