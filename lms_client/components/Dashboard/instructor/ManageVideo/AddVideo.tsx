"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addVideoFunction } from "@/functions/video.functions";
import { usePost } from "@/hooks/useApi";
import { useGetUser } from "@/hooks/useGetUser";
import { TAddVideo } from "@/types/video.types";
import MuxPlayer from "@mux/mux-player-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const AddVideo = () => {
  const router = useRouter();
  const { moduleId } = useParams();
  const userInfo = useGetUser();

  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const addNewVideoMutation = usePost([
    ["module-detail", moduleId as string],
    ["all-modules"],
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TAddVideo>();

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

  const handleAddVideo = async (data: TAddVideo) => {
    const payload = {
      module: moduleId,
      instructor: userInfo?.userId,
      title: data?.title,
    };

    const videoFile = data?.video[0];

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    if (videoFile) {
      formData.append("video", videoFile);
    }

    await addVideoFunction(
      formData,
      addNewVideoMutation.mutateAsync,
      handleNavigate,
    );
  };

  return (
    <>
      {addNewVideoMutation.isPending && <FormSubmitLoading />}

      <div className="AddVideoContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="AddVideoWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Add Video
          </h1>

          <div className="addModuleForm p-1 w-[98%] xsm:w-[92%] sm:w-[85%] md:w-[80%] m-auto">
            <form
              onSubmit={handleSubmit(handleAddVideo)}
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
                  {...register("video", {
                    required: "video is required !!!",
                  })}
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
                disabled={isSubmitting || addNewVideoMutation.isPending}
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base active:scale-95 duration-500 bg-prime-50 hover:bg-prime-100 ${
                  isSubmitting || addNewVideoMutation.isPending
                    ? "cursor-not-allowed bg-gray-600"
                    : "bg-prime-50 hover:bg-prime-100"
                }`}
              >
                {isSubmitting || addNewVideoMutation.isPending
                  ? "Adding New Video..."
                  : "Add Video"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddVideo;
