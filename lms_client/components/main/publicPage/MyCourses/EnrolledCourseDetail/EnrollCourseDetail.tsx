"use client";

import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { useFetchData, usePatch } from "@/hooks/useApi";
import { TApiResponse } from "@/types/globalTypes";
import MuxPlayer from "@mux/mux-player-react";
import { Bookmark } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ModuleShowData from "./ModuleShowData";
import NoVideoPlaceholder from "./NoVideoPlaceholder";
import { TEnrollCourseDetail } from "./type";
import VideoLoadingSkeleton from "./VideoLoadingSkeleton";

type TCompleteEnrollment = {
  _id: string;
  user: string;
  course: string;
  Payment: string;
  completed: boolean;
  isReviewed: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export default function EnrollCourseDetail({ id }: { id: string }) {
  const { data: enrolledCourseData, isLoading } =
    useFetchData<TEnrollCourseDetail>(
      [`enroll-course-detail-${id}`, `enroll-course-${id}`],
      `/enroll/my-enrolled-course/${id}`,
      {
        enabled: !!id,
      },
    );

  const [videoDataObj, setVideoDataObj] = useState<{
    title: string;
    videoUrl: string;
  } | null>(null);
  const [videoUrlLoading, setVideoLoading] = useState<boolean>(false);

  const [courseProgress, setCourseProgress] = useState<number | null>(
    enrolledCourseData?.data?.courseProgressData ?? null,
  );

  if (
    enrolledCourseData?.data?.courseProgressData !== undefined &&
    courseProgress !== enrolledCourseData.data.courseProgressData
  ) {
    setCourseProgress(enrolledCourseData.data.courseProgressData);
  }

  const { mutateAsync, isPending } = usePatch([[`enroll-course-detail-${id}`]]);

  // ! for completing course
  const handleMarkCompleteCourse = async () => {
    try {
      const result = (await mutateAsync({
        url: `/enroll/complete-my-course/${id}`,
        payload: { id },
      })) as TApiResponse<TCompleteEnrollment>;

      if (result?.success) {
        toast.success(result?.message);
      }
    } catch (error) {
      console.log("error = ", error);
    }
  };

  let content = null;

  // ! video content for different state
  if (videoUrlLoading) {
    content = <VideoLoadingSkeleton />;
  } else if (!videoDataObj && !videoUrlLoading && !isLoading) {
    content = <NoVideoPlaceholder />;
  } else if (videoDataObj) {
    content = (
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
    );
  }

  return (
    <div className="EnrolledCourseDetailContainer   bg-gray-100 min-h-screen ">
      <Wrapper className="EnrolledCourseDetailWrapper py-5 flex flex-col sm:flex-row justify-between gap-x-4 ">
        {/* left video section  */}
        <div className="leftVideoSection w-full sm:w-[70%] lg:w-[60%] ">
          <div className="videoPreviewContainer mt-4">
            {videoDataObj && (
              <p className=" text-xl font-medium mb-2 ">
                {videoDataObj?.title}
              </p>
            )}

            {/* video content  */}
            {content}
          </div>
        </div>
        {/*  */}

        {/* right module section  */}
        <div className="rightSection w-full sm:w-[30%] lg:w-[40%]  ">
          {enrolledCourseData?.data?.course?.modules &&
            enrolledCourseData?.data?.course?._id && (
              <ModuleShowData
                modules={enrolledCourseData?.data?.course?.modules}
                setVideoLoading={setVideoLoading}
                courseId={enrolledCourseData?.data?.course?._id}
                setCourseProgress={setCourseProgress}
                setVideoDataObj={setVideoDataObj}
                videoDataObj={videoDataObj}
              />
            )}

          {/* complete course button  */}

          {!enrolledCourseData?.data?.completed && courseProgress === 100 && (
            <Button
              disabled={isPending}
              onClick={() => handleMarkCompleteCourse()}
              className={` mt-2 w-full bg-prime-100 hover:bg-prime-200  `}
            >
              <Bookmark size={48} strokeWidth={2.25} />

              {isPending ? "Marking as complete..." : "Mark as Completed"}
            </Button>
          )}
        </div>
        {/*  */}
      </Wrapper>
    </div>
  );
}
