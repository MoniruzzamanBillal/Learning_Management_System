import Wrapper from "@/components/shared/Wrapper";
import {
  EnrolledCourseDetailSkeleton,
  ModuleShowData,
  NoVideoPlaceholder,
  VideoLoadingSkeleton,
} from "@/components/ui/user/EnrolledCourseDetail";
import { useGetUserEnrolledCourseDetailQuery } from "@/redux/features/enrollment/enrollment.api";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const EnrolledCourseDetail = () => {
  const { courseId } = useParams();

  // console.log("course id = ", courseId);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoUrlLoading, setVideoLoading] = useState<boolean>(false);

  const { data: enrolledCourseData, isLoading } =
    useGetUserEnrolledCourseDetailQuery(courseId, { skip: !courseId });

  // console.log(enrolledCourseData?.data);
  // console.log(enrolledCourseData?.data?.course?.modules);
  // console.log(videoUrl);

  return (
    <>
      {isLoading && <EnrolledCourseDetailSkeleton />}

      <div className="EnrolledCourseDetailContainer   bg-gray-100 min-h-screen ">
        <Wrapper className="EnrolledCourseDetailWrapper py-5 flex justify-between gap-x-4 ">
          {/* left video section  */}
          <div className="leftVideoSection  w-[60%] ">
            <div className="videoPreviewContainer mt-4">
              {videoUrlLoading && <VideoLoadingSkeleton />}

              {!videoUrl && <NoVideoPlaceholder />}
              {videoUrl && (
                <MuxPlayer
                  playbackId=""
                  streamType="on-demand"
                  src={videoUrl}
                  className="rounded-md"
                  autoPlay={false}
                  style={{ width: "100%", height: "26.5rem" }}
                  forwardSeekOffset={5}
                  backwardSeekOffset={5}
                />
              )}
            </div>

            {/* button section  */}
            {/* <div className="btnSection pt-3  flex justify-end gap-x-4 ">
              <Button className="  ">Previous</Button>
              <Button className=" bg-prime100 hover:bg-prime200 ">Next </Button>
            </div> */}
          </div>
          {/*  */}

          {/* right module section  */}
          <div className="rightSection w-[40%]  ">
            <ModuleShowData
              modules={enrolledCourseData?.data?.course?.modules}
              setVideoUrl={setVideoUrl}
              setVideoLoading={setVideoLoading}
            />
          </div>
          {/*  */}
        </Wrapper>
      </div>
    </>
  );
};

export default EnrolledCourseDetail;
