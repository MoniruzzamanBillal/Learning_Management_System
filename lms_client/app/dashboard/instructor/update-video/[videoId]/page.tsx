import UpdateVideo from "@/components/main/(Instructor)/ManageVideo/UpdateVideo";

export const metadata = {
  title: "Update Video | Instructor Dashboard",
  description: "Update a video's details or content.",
  robots: { index: false, follow: false },
};

const UpdateVideoPage = () => {
  return <UpdateVideo />;
};

export default UpdateVideoPage;
