"use client";

import DeleteModal from "@/components/shared/DeleteModal";
import { Button } from "@/components/ui/button";
import { deleteVideoFunction } from "@/functions/video.functions";
import { useFetchData, usePatch } from "@/hooks/useApi";
import MuxPlayer from "@mux/mux-player-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const alertMessage =
  "This action cannot be undone. This will permanently delete the video.";

const InstructorVideoDetail = () => {
  const { videoId } = useParams();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: videoData, isLoading } = useFetchData<any>(
    ["video-detail", videoId as string],
    `/video/individual-video/${videoId}`,
    { enabled: !!videoId }
  );

  const deleteVideoMutation = usePatch([["all-videos"]]);

  const handleDeleteVideo = async (id: string) => {
    const result = await deleteVideoFunction(
      { url: "/video/delete-video", payload: { videoId: id } },
      deleteVideoMutation.mutateAsync
    );
    if (result?.data?.success) {
      router.push("/dashboard/instructor/manage-video");
    }
  };

  const video = videoData?.data;

  if (isLoading) {
    return (
      <div className="p-6 text-gray-500">Loading video details...</div>
    );
  }

  return (
    <div className="InstructorVideoDetailContainer">
      <div className="InstructorVideoDetailWrapper bg-gray-100 border border-gray-300 shadow rounded-md p-4">
        <h3 className="brand text-2xl font-medium mb-6 underline">
          Video Detail:
        </h3>

        <div className="videoDetailBody">
          <div className="text-lg flex flex-col gap-y-2">
            <p>
              <span className="font-bold">Course name: </span>
              {video?.module?.course?.name ?? "—"}
            </p>
            <p>
              <span className="font-bold">Course Published: </span>
              <span
                className={
                  video?.module?.course?.published
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {video?.module?.course?.published ? "Published" : "Unpublished"}
              </span>
            </p>
            <p>
              <span className="font-bold">Module name: </span>
              {video?.module?.title ?? "—"}
            </p>
            <p>
              <span className="font-bold">Video Title: </span>
              {video?.title ?? "—"}
            </p>
            <p>
              <span className="font-bold">Video Order: </span>
              {video?.videoOrder ?? "—"}
            </p>
          </div>
        </div>

        {video?.videoUrl && (
          <div className="videoSection mt-8">
            <MuxPlayer
              streamType="on-demand"
              src={video.videoUrl}
              className="rounded-md"
              autoPlay={false}
              style={{ width: "100%", height: "26rem" }}
              metadata={{ video_title: video.title }}
              forwardSeekOffset={5}
              backwardSeekOffset={5}
            />
          </div>
        )}

        <div className="btnSection flex gap-x-3 py-4 mt-4">
          <Link href={`/dashboard/instructor/update-video/${videoId}`}>
            <Button className="bg-green-700/95 hover:bg-green-800/95">
              Update Video
            </Button>
          </Link>

          <Button
            variant="destructive"
            disabled={video?.module?.course?.published}
            onClick={() => setIsDeleteOpen(true)}
          >
            Delete Video
          </Button>
        </div>

        <DeleteModal
          isOpen={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          id={videoId as string}
          alertMessage={alertMessage}
          handleDeleteFunction={handleDeleteVideo}
          btnText="Delete Video"
        />
      </div>
    </div>
  );
};

export default InstructorVideoDetail;
