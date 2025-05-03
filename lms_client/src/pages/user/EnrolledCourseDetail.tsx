import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { ModuleShowData } from "@/components/ui/user/EnrolledCourseDetail";
import MuxPlayer from "@mux/mux-player-react";
import { useParams } from "react-router-dom";

const videoUrl =
  "https://res.cloudinary.com/dupxfufq9/video/upload/v1744733597/course_videos/AQOFgsKLEGwOyE_i4jmyiNuga7ebu0O6V29HSm9K7UGEm1d2OBRptAV244HuygbzgXrQ84d9Vh6IR1j8xF9W2Pl5.mp4";

const EnrolledCourseDetail = () => {
  const { courseId } = useParams();

  console.log("course id = ", courseId);

  return (
    <div className="EnrolledCourseDetailContainer   bg-gray-100 min-h-screen ">
      <Wrapper className="EnrolledCourseDetailWrapper py-5 flex justify-between gap-x-4 ">
        {/* left video section  */}
        <div className="leftVideoSection  w-[60%] ">
          <div className="videoPreviewContainer mt-4">
            <MuxPlayer
              playbackId=""
              streamType="on-demand"
              src={videoUrl}
              className="rounded-md"
              autoPlay={false}
              style={{ width: "100%", height: "26rem" }}
              forwardSeekOffset={5}
              backwardSeekOffset={5}
            />
          </div>

          {/* button section  */}
          <div className="btnSection pt-3  flex justify-end gap-x-4 ">
            <Button className="  ">Previous</Button>
            <Button className=" bg-prime100 hover:bg-prime200 ">Next </Button>
          </div>
        </div>
        {/*  */}

        {/* right module section  */}
        <div className="rightSection w-[40%]  ">
          <ModuleShowData />
        </div>
        {/*  */}
      </Wrapper>
    </div>
  );
};

export default EnrolledCourseDetail;
