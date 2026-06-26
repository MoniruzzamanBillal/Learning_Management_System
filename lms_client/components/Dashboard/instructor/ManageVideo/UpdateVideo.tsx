"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateVideoFunction } from "@/functions/video.functions";
import { useFetchData, usePatch } from "@/hooks/useApi";
import { TUpdateVideo } from "@/types/video.types";
import MuxPlayer from "@mux/mux-player-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const UpdateVideo = () => {
  const router = useRouter();
  const { videoId } = useParams();

  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const { data: videoData, isLoading: videoDataLoading } = useFetchData<any>(
    ["video-detail", videoId as string],
    `/video/individual-video/${videoId}`,
    { enabled: !!videoId },
  );

  const updateVideoMutation = usePatch([
    ["video-detail", videoId as string],
    ["all-modules"],
    ["module-detail"],
  ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TUpdateVideo>();

  const handleNavigate = () => {
    router.back();
  };

  const handleChangeVideoUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const videFile = e.target?.files?.[0];

    if (videFile) {
      const previewUrl = URL.createObjectURL(videFile);
      setVideoPreview(previewUrl);
    } else {
      setVideoPreview(null);
    }
  };

  const handleUpdateVideo = async (data: Partial<TUpdateVideo>) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    if (data?.video && data.video.length > 0) {
      const videoFile = data?.video[0];
      formData.append("video", videoFile as Blob);
    }

    await updateVideoFunction(
      formData,
      updateVideoMutation.mutateAsync,
      videoId as string,
      handleNavigate,
    );
  };

  useEffect(() => {
    if (videoData?.data) {
      const video = videoData.data;
      reset({
        title: video?.title,
      });

      if (video?.videoUrl) {
        setVideoPreview(video?.videoUrl);
      }
    }
  }, [videoData?.data, reset]);

  return (
    <>
      {(videoDataLoading || updateVideoMutation.isPending) && (
        <FormSubmitLoading />
      )}

      <div className="UpdatevideoContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="UpdatevideoWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Update Video
          </h1>

          <div className="updateVideoForm p-1 w-[98%] xsm:w-[92%] sm:w-[85%] md:w-[80%] xmd:w-[75%] lg:w-[65%] m-auto">
            <form
              onSubmit={handleSubmit(handleUpdateVideo)}
              className="flex flex-col gap-y-4"
            >
              <div className="titleContainer flex flex-col gap-y-1.5">
                <Label htmlFor="title">Video Title </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter Video Title "
                  {...register("title", {
                    required: "Video Title is required !!!",
                  })}
                />
                {errors?.title && (
                  <span className="text-red-600 text-sm">
                    {errors?.title?.message as string}
                  </span>
                )}
              </div>

              <div className="videoContainer flex flex-col gap-y-1.5">
                <Label htmlFor="video">Video : </Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  placeholder="Enter Video"
                  {...register("video")}
                  onChange={(e) => handleChangeVideoUrl(e)}
                />

                {videoPreview && (
                  <div className="videoPreviewContainer mt-4">
                    <MuxPlayer
                      playbackId=""
                      streamType="on-demand"
                      src={videoPreview}
                      className="rounded-md"
                      autoPlay={false}
                      style={{ width: "100%", height: "26rem" }}
                      forwardSeekOffset={5}
                      backwardSeekOffset={5}
                    />
                  </div>
                )}

                {errors?.video && (
                  <span className="text-red-600 text-sm">
                    {errors?.video?.message as string}
                  </span>
                )}
              </div>

              <Button
                disabled={isSubmitting || updateVideoMutation.isPending}
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base active:scale-95 duration-500 bg-prime-50 hover:bg-prime-100 ${
                  isSubmitting || updateVideoMutation.isPending
                    ? "cursor-not-allowed bg-gray-600"
                    : "bg-prime-50 hover:bg-prime-100"
                }`}
              >
                {isSubmitting || updateVideoMutation.isPending
                  ? "Updating video..."
                  : "Update Video"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateVideo;
