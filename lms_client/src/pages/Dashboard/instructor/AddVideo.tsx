import { FormSubmitLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addVideoFunction } from "@/functions/video.functions";
import { useAddNewVideoMutation } from "@/redux/features/video/video.api";
import { TAddVideo } from "@/types/video.types";
import { useGetUser } from "@/utils/sharedFunction";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const AddVideo = () => {
  const navigate = useNavigate();

  const { moduleId } = useParams();
  const userInfo = useGetUser();

  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [addNewVideo, { isLoading: videoAddingLoading }] =
    useAddNewVideoMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TAddVideo>();

  const handleNavigate = () => {
    navigate(-1);
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

  //   ! for adding new video
  const handleAddVideo = async (data: TAddVideo) => {
    const payload = {
      module: moduleId,
      instructor: userInfo?.userId,
      title: data?.title,
    };

    const videoFile = data?.video[0];

    const formData = new FormData();

    formData.append("data", JSON.stringify(payload));
    formData.append("video", videoFile);

    await addVideoFunction(formData, addNewVideo, handleNavigate);

    //
  };

  return (
    <>
      {videoAddingLoading && <FormSubmitLoading />}

      <div className="AddVideoContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="AddVideoWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Add Video
          </h1>

          {/* add video form  */}
          <div className="addModuleForm p-1 w-[98%] xsm:w-[92%] sm:w-[85%] md:w-[80%]   m-auto ">
            <form
              onSubmit={handleSubmit(handleAddVideo)}
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
                disabled={isSubmitting}
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base  active:scale-95 duration-500  bg-prime50 hover:bg-prime100 ${
                  isSubmitting
                    ? " cursor-not-allowed bg-gray-600 "
                    : "bg-prime50 hover:bg-prime100  "
                }   `}
              >
                {isSubmitting ? "Adding New Video..." : "Add Video "}
              </Button>
            </form>
          </div>

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default AddVideo;
