import { FormSubmitLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateVideoFunction } from "@/functions/video.functions";
import {
  useGetSingleVideoQuery,
  useUpdateVideoMutation,
} from "@/redux/features/video/video.api";
import { TUpdateVideo } from "@/types/video.types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const Updatevideo = () => {
  const navigate = useNavigate();

  const { videoId } = useParams();

  if (!videoId) {
    throw new Error("Something went wrong !!!");
  }

  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const { data: videoData, isLoading: videoDataLoading } =
    useGetSingleVideoQuery(videoId, { skip: !videoId });

  const [updateVideo, { isLoading: updatingDataLoading }] =
    useUpdateVideoMutation();

  // console.log(videoData?.data);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TUpdateVideo>();

  const handleNavigate = () => {
    navigate(`/dashboard/instructor/manage-video`);
  };

  // ! for changing the video preview url
  const handleChangeVideoUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const videFile = e.target?.files?.[0];

    if (videFile) {
      const previewUrl = URL.createObjectURL(videFile);
      setVideoPreview(previewUrl);
    } else {
      setVideoPreview(null);
    }
  };

  //   ! for updating video
  const handleUpdateVideo = async (data: Partial<TUpdateVideo>) => {
    const formData = new FormData();

    formData.append("data", JSON.stringify(data));

    if (data?.video) {
      const videoFile = data?.video[0];
      formData.append("video", videoFile);
    }

    await updateVideoFunction(formData, updateVideo, videoId, handleNavigate);

    //
  };

  // ! for handling the default value
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
  }, [videoData, reset]);

  return (
    <>
      {(videoDataLoading || updatingDataLoading) && <FormSubmitLoading />}

      <div className="UpdatevideoContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="UpdatevideoWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Update Video
          </h1>

          {/* update video form  */}
          <div className="updateVideoForm p-1 w-[98%] xsm:w-[92%] sm:w-[85%] md:w-[80%] xmd:w-[75%] lg:w-[65%] m-auto">
            <form
              onSubmit={handleSubmit(handleUpdateVideo)}
              className=" flex flex-col gap-y-4 "
            >
              {/* video title  */}
              <div className="titleContainer flex flex-col gap-y-1.5">
                <Label htmlFor="title">Video Title </Label>
                <Input
                  id="title"
                  type="text"
                  className="  "
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

              {/* video input  */}
              <div className="videoContainer flex flex-col gap-y-1.5">
                <Label htmlFor="video">Video : </Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  placeholder="Enter Video  "
                  {...register("video")}
                  onChange={(e) => handleChangeVideoUrl(e)}
                />

                {videoPreview && (
                  <div className="videoPreviewContainer mt-4">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full max-h-[400px] rounded-md"
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
                disabled={isSubmitting}
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base  active:scale-95 duration-500  bg-prime50 hover:bg-prime100 ${
                  isSubmitting
                    ? " cursor-not-allowed bg-gray-600 "
                    : "bg-prime50 hover:bg-prime100  "
                }   `}
              >
                {isSubmitting ? "Updating video..." : "Update Video "}
              </Button>
            </form>
          </div>

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default Updatevideo;
