"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { deleteVideoFunction } from "@/functions/video.functions";
import { useFetchData, usePatch } from "@/hooks/useApi";
import { useGetUser } from "@/hooks/useGetUser";
import { userRoleConts } from "@/utils/constants";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type TVideo = {
  _id: string;
  title: string;
  videoUrl: string;
};

const InstructorModule = () => {
  const userInfo = useGetUser();
  const userRole = userInfo?.userRole;

  let content = null;
  const router = useRouter();
  const { moduleId } = useParams();

  const { data: moduleData, isLoading: moduleDataLoading } = useFetchData<any>(
    ["module-detail", moduleId as string],
    `/module/module-detail/${moduleId}`,
    { enabled: !!moduleId },
  );

  const deleteVideoMutation = usePatch([["module-detail", moduleId as string]]);

  const handleDeleteVideo = async (videoData: TVideo) => {
    const payload = {
      videoId: videoData?._id,
      moduleId,
    };

    await deleteVideoFunction(
      { url: "/video/delete-video", payload },
      deleteVideoMutation.mutateAsync,
    );
  };

  if (!moduleData?.data?.videos?.length) {
    content = (
      <p className="mt-4 text-lg text-red-600 font-semibold">
        No Video found for this module !!!
      </p>
    );
  } else {
    content = (
      <div className="videoDetails">
        <Accordion type="single" collapsible className="w-full">
          {moduleData?.data?.videos &&
            moduleData?.data?.videos?.map((videoData: TVideo) => (
              <AccordionItem key={videoData?._id} value={videoData?._id}>
                <AccordionTrigger> {videoData?.title} : </AccordionTrigger>
                <AccordionContent>
                  <div className="videoPreviewContainer mt-4">
                    <MuxPlayer
                      playbackId=""
                      streamType="on-demand"
                      src={videoData.videoUrl}
                      className="rounded-md"
                      autoPlay={false}
                      style={{ width: "100%", height: "26rem" }}
                      metadata={{
                        video_title: `${videoData?.title}`,
                      }}
                      forwardSeekOffset={5}
                      backwardSeekOffset={5}
                    />
                  </div>

                  <div className="btnSection py-4">
                    {userRole === userRoleConts?.instructor && (
                      <div className="btnGroup flex gap-x-3">
                        <Link
                          href={`/dashboard/instructor/update-video/${videoData?._id}`}
                        >
                          <Button className="bg-green-700/95 hover:bg-green-800/95">
                            Update Video
                          </Button>
                        </Link>

                        <Button
                          disabled={
                            moduleData?.data?.course?.published ||
                            deleteVideoMutation.isPending
                          }
                          onClick={() => handleDeleteVideo(videoData)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {deleteVideoMutation.isPending
                            ? "Deleting..."
                            : "Delete Video"}
                        </Button>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    );
  }

  return (
    <>
      {(deleteVideoMutation.isPending || moduleDataLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Loader2 className="w-10 h-10 animate-spin text-white" />
        </div>
      )}

      <div className="InstructorModuleContainer">
        <div className="InstructorModuleWrapper bg-gray-100 border border-gray-300 shadow rounded-md p-4">
          <h3 className="brand text-2xl font-medium mb-6 underline">
            Module Detail :
          </h3>

          {/* module detail body  */}
          <div className="moduleDetailBody flex justify-between">
            <div className="bodyLeft text-lg flex flex-col gap-y-2">
              {/* course name  */}
              <p className="courseName">
                <span className="font-bold">Course name : </span>{" "}
                {moduleData?.data?.course?.name}
              </p>

              {/* course published */}
              <p className="coursePublished">
                <span className="font-bold">Course Published : </span>{" "}
                <span
                  className={`${
                    moduleData?.data?.course?.published
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {moduleData?.data?.course?.published
                    ? "Published"
                    : "Unpublished"}
                </span>
              </p>

              {/* course category  */}
              <p className="courseCategory">
                <span className="font-bold">Course category : </span>
                {moduleData?.data?.course?.category}
              </p>

              {/* module name  */}
              <p className="moduleName">
                <span className="font-bold">Module name : </span>
                {moduleData?.data?.title}
              </p>
            </div>

            {/* add, update button section  */}
            <div className="rightBtnSection">
              {userRole === userRoleConts?.instructor && (
                <div className="btnSection flex justify-between gap-x-3">
                  <Button
                    disabled={moduleData?.data?.course?.published}
                    className="bg-prime-100 hover:bg-prime-200"
                    onClick={() =>
                      router.push(
                        `/dashboard/instructor/update-module/${moduleId}`,
                      )
                    }
                  >
                    Update Module
                  </Button>

                  <Button
                    disabled={moduleData?.data?.course?.published}
                    className="bg-green-700/95 hover:bg-green-800/95 text-white"
                    onClick={() =>
                      router.push(`/dashboard/instructor/add-video/${moduleId}`)
                    }
                  >
                    Add New Video
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* video section  */}
          <div className="videoSection mt-10">
            <h3 className="brand text-2xl font-medium underline">Videos :</h3>
            {content}
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorModule;
