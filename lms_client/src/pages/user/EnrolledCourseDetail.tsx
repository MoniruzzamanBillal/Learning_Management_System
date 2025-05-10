import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import {
  EnrolledCourseDetailSkeleton,
  ModuleShowData,
  NoVideoPlaceholder,
  VideoLoadingSkeleton,
} from "@/components/ui/user/EnrolledCourseDetail";
import {
  useGetUserEnrolledCourseDetailQuery,
  useMarkCompleteCourseMutation,
} from "@/redux/features/enrollment/enrollment.api";
import MuxPlayer from "@mux/mux-player-react";
import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EnrolledCourseDetail = () => {
  const { courseId } = useParams();

  // console.log("course id = ", courseId);

  const [videoDataObj, setVideoDataObj] = useState<{
    title: string;
    videoUrl: string;
  } | null>(null);
  const [videoUrlLoading, setVideoLoading] = useState<boolean>(false);
  const [courseProgress, setCourseProgress] = useState<number | null>(null);

  const { data: enrolledCourseData, isLoading } =
    useGetUserEnrolledCourseDetailQuery(courseId, { skip: !courseId });

  const [markCompleteCourse, { isLoading: courseMarkCompleteLoading }] =
    useMarkCompleteCourseMutation();

  // console.log(enrolledCourseData?.data);
  // console.log(enrolledCourseData?.data?.course?.modules);
  // console.log(videoUrl);

  // console.log("course progress = ", courseProgress);

  // ! for completing course
  const handleMarkCompleteCourse = async () => {
    console.log("course completed !!!!");
  };

  // ! for handling the value of course progress
  useEffect(() => {
    if (enrolledCourseData?.data?.courseProgressData) {
      setCourseProgress(enrolledCourseData?.data?.courseProgressData);
    }
  }, [enrolledCourseData]);

  return (
    <>
      {isLoading && <EnrolledCourseDetailSkeleton />}

      <div className="EnrolledCourseDetailContainer   bg-gray-100 min-h-screen ">
        <Wrapper className="EnrolledCourseDetailWrapper py-5 flex justify-between gap-x-4 ">
          {/* left video section  */}
          <div className="leftVideoSection  w-[60%] ">
            <div className="videoPreviewContainer mt-4">
              {videoDataObj && (
                <p className=" text-xl font-medium mb-2 ">
                  {videoDataObj?.title}
                </p>
              )}

              {videoUrlLoading && <VideoLoadingSkeleton />}

              {!videoDataObj && <NoVideoPlaceholder />}

              {videoDataObj && (
                <MuxPlayer
                  playbackId=""
                  streamType="on-demand"
                  src={videoDataObj?.videoUrl}
                  className="rounded-md"
                  autoPlay={false}
                  style={{ width: "100%", height: "26.5rem" }}
                  forwardSeekOffset={5}
                  backwardSeekOffset={5}
                />
              )}
            </div>
          </div>
          {/*  */}

          {/* right module section  */}
          <div className="rightSection w-[40%]  ">
            <ModuleShowData
              modules={enrolledCourseData?.data?.course?.modules}
              setVideoLoading={setVideoLoading}
              courseId={enrolledCourseData?.data?.course?._id}
              setCourseProgress={setCourseProgress}
              setVideoDataObj={setVideoDataObj}
              videoDataObj={videoDataObj}
            />

            {/* complete course button  */}

            {!enrolledCourseData?.data?.completed && courseProgress === 100 && (
              <Button
                disabled={courseMarkCompleteLoading}
                onClick={() => handleMarkCompleteCourse()}
                className={` mt-2 w-full bg-prime100 hover:bg-prime200  `}
              >
                <Bookmark size={48} strokeWidth={2.25} />

                {courseMarkCompleteLoading
                  ? "Marking as complete..."
                  : "Mark as Completed"}
              </Button>
            )}
          </div>
          {/*  */}
        </Wrapper>
      </div>
    </>
  );
};

export default EnrolledCourseDetail;
