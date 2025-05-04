import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { ModuleShowData } from "@/components/ui/user/EnrolledCourseDetail";
import MuxPlayer from "@mux/mux-player-react";
import { useParams } from "react-router-dom";

const videoUrl =
  "https://res.cloudinary.com/dupxfufq9/video/upload/v1744733597/course_videos/AQOFgsKLEGwOyE_i4jmyiNuga7ebu0O6V29HSm9K7UGEm1d2OBRptAV244HuygbzgXrQ84d9Vh6IR1j8xF9W2Pl5.mp4";

const enrolledCourseData = {
  _id: "681447181aedd939ccb2a2eb",
  user: "67d023a41a4a5455a78432b6",
  Payment: "681447181aedd939ccb2a2e9",
  completed: false,
  course: {
    _id: "681051cc5265f916112b34f2",
    name: "tesing for publish ",
    category: "App Development",
    modules: [
      {
        _id: "681360874e56159731c53f9d",
        course: "681051cc5265f916112b34f2",
        title: "Module 1 : Introduction ",
        videos: [
          {
            _id: "681360ac4e56159731c53fa8",
            title: "Introduction to HTML",
          },
          {
            _id: "681361644e56159731c53fc5",
            title: "introduction 2",
          },
        ],
      },
      {
        _id: "6813617d4e56159731c53fd9",
        course: "681051cc5265f916112b34f2",
        title: "Module 2 ",
        videos: [
          {
            _id: "681361a14e56159731c53fe7",
            title: "Introduction ",
          },
        ],
      },
    ],
  },
};

const EnrolledCourseDetail = () => {
  const { courseId } = useParams();

  // console.log("course id = ", courseId);

  // console.log(enrolledCourseData);
  // console.log(enrolledCourseData?.course?.modules);

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
          <ModuleShowData modules={enrolledCourseData?.course?.modules} />
        </div>
        {/*  */}
      </Wrapper>
    </div>
  );
};

export default EnrolledCourseDetail;
