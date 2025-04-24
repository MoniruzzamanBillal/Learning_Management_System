import DeleteModal from "@/components/shared/DeleteModal";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";

const alertMessage =
  " This action cannot be undone. This will permanently delete the Video .";

const InstructorVideoDetail = () => {
  const { videoId } = useParams();

  // ! for handling video delete
  const handleDeleteVideo = async (videoId: string) => {
    console.log("video deleted !!!!");
    console.log("vide id = ", videoId);
  };

  return (
    <div className="InstructorVideoDetailContainer">
      <div className="InstructorVideoDetailWrapper bg-gray-100 border border-gray-300  shadow rounded-md p-4 ">
        <h3 className="brand text-2xl font-medium mb-6 underline  ">
          Video Detail :
        </h3>

        {/* video detail body  */}
        <div className="videoDetailBody    ">
          <div className=" text-lg flex flex-col gap-y-2">
            {/* course name  */}
            <p className="courseName">
              <span className=" font-bold ">Course name : </span> mastering web
              dev
            </p>

            {/* course published */}
            <p className="courseName">
              <span className=" font-bold ">Course Published : </span> false
            </p>

            {/* course category  */}
            <p className="courseCategory">
              <span className=" font-bold ">Course category : </span> Web
              Development
            </p>

            {/* module name  */}
            <p className="moduleName">
              <span className=" font-bold ">Module name : </span> Introduction
              to HTML
            </p>

            {/* video title  */}
            <p className="videoName">
              <span className=" font-bold ">Video Title : </span>HTML FORM
            </p>
          </div>
        </div>

        {/* video section  */}
        <div className="videoSection mt-8 ">
          <div className="videoSection">
            <h1>actual video </h1>
            <h1>actual video </h1>
            <h1>actual video </h1>
            <h1>actual video </h1>
            <h1>actual video </h1>
          </div>

          <div className="btnSection  flex   gap-x-3 py-4 ">
            <Link to={`/dashboard/instructor/update-video/${videoId}`}>
              <Button className=" bg-green-700/95 hover:bg-green-800/95 ">
                Update Video
              </Button>
            </Link>

            {/*  */}

            <div className="deleteButton">
              <DeleteModal
                id={videoId as string}
                alertMessage={alertMessage}
                handleDeleteFunction={handleDeleteVideo}
                btnText=" Delete Video"
              />
            </div>
          </div>
        </div>

        {/*  */}
      </div>
    </div>
  );
};

export default InstructorVideoDetail;
