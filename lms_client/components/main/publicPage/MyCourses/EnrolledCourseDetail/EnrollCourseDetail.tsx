"use client";

import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFetchData, usePatch } from "@/hooks/useApi";
import { TApiResponse } from "@/types/globalTypes";
import MuxPlayer from "@mux/mux-player-react";
import { ArrowLeft, Bookmark, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import AiStudyAssistant from "./AiStudyAssistant";
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

  const isCompleted = enrolledCourseData?.data?.completed;

  return (
    <div className="EnrolledCourseDetailContainer bg-gray-100 min-h-screen">
      <Wrapper className="EnrolledCourseDetailWrapper py-8">
        {/* Page header */}
        <div className="mb-6">
          <Link
            href="/my-courses"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-prime-100 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Courses
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              {enrolledCourseData?.data?.course?.category && (
                <p className="text-prime-50 text-xs font-semibold tracking-widest uppercase mb-2">
                  {enrolledCourseData?.data?.course?.category}
                </p>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {enrolledCourseData?.data?.course?.name}
              </h1>
            </div>

            {!isLoading && enrolledCourseData?.data && (
              <div className="w-full sm:w-64 shrink-0 flex items-center gap-3">
                <Progress value={courseProgress ?? 0} className="flex-1" />
                <span className="text-prime-100 font-semibold text-sm shrink-0">
                  {courseProgress ?? 0}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-6">
          {/* left video section  */}
          <div className="leftVideoSection">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-4">
              <div className="videoPreviewContainer">
                {videoDataObj && (
                  <p className=" text-xl font-medium mb-2 ">
                    {videoDataObj?.title}
                  </p>
                )}

                {/* video content  */}
                {content}
              </div>
            </div>
          </div>
          {/*  */}

          {/* right module section  */}
          <div className="rightSection">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
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
            </div>

            {/* completion state  */}
            {isCompleted ? (
              <div className="mt-3 flex items-center justify-center gap-2 bg-green-50 text-green-600 font-semibold text-sm rounded-lg py-3">
                <CheckCircle2 className="h-4 w-4" />
                Course Completed
              </div>
            ) : (
              courseProgress === 100 && (
                <Button
                  disabled={isPending}
                  onClick={() => handleMarkCompleteCourse()}
                  className={` mt-3 w-full bg-prime-100 hover:bg-prime-200  `}
                >
                  <Bookmark size={48} strokeWidth={2.25} />

                  {isPending ? "Marking as complete..." : "Mark as Completed"}
                </Button>
              )
            )}
          </div>
          {/*  */}
        </div>
      </Wrapper>

      {id && <AiStudyAssistant courseId={id} />}
    </div>
  );
}
