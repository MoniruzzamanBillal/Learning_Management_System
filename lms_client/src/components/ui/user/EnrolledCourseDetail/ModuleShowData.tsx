import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  useLazyGetEnrolledCourseVideoModuleIdQuery,
  useLazyGetEnrolledCourseVideoQuery,
  useLazyGetUserCourseProgressQuery,
} from "@/redux/features/enrollment/enrollment.api";
import { videoProgressStatusConsts } from "@/utils/constants";
import { CircleCheckBig, Lock, LockOpen } from "lucide-react";
import React, { SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import ModuleItemSkeleton from "./ModuleItemSkeleton";

type TVideo = { _id: string; title: string };

type TModuleVideo = {
  _id: string;
  video: TVideo;
  videoStatus: keyof typeof videoProgressStatusConsts;
};

type TModuleType = {
  _id: string;
  title: string;
  videos: string[];
};

type TProps = {
  modules: TModuleType[];
  videoDataObj: { title: string; videoUrl: string } | null;
  setVideoLoading: React.Dispatch<SetStateAction<boolean>>;
  courseId: string;
  setCourseProgress: React.Dispatch<SetStateAction<number | null>>;

  setVideoDataObj: React.Dispatch<
    SetStateAction<{ title: string; videoUrl: string } | null>
  >;
};

const ModuleShowData = ({
  modules,
  setVideoLoading,
  courseId,
  setCourseProgress,
  setVideoDataObj,
  videoDataObj,
}: TProps) => {
  const [videoData, setVideoData] = useState<TModuleVideo[] | null>(null);

  const [getModuleVideos, { isLoading }] =
    useLazyGetEnrolledCourseVideoModuleIdQuery();
  const [getVideoData, { isLoading: videoDataFetchLoading }] =
    useLazyGetEnrolledCourseVideoQuery();
  const [userCourseProgress] = useLazyGetUserCourseProgressQuery();

  // ! for getting module video , after clicking a module name
  const handleClickModule = async (module: TModuleType) => {
    try {
      const result = await getModuleVideos(module?._id, false);

      if (result?.data?.data) {
        setVideoData(result?.data?.data);
      }
    } catch (error) {
      console.error("Failed to fetch module videos", error);
    }
  };

  // ! for getting video data
  const handleGetVideo = async (video: TVideo) => {
    try {
      const result = await getVideoData(video?._id);

      if (result?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (result?.error as any)?.data?.message;
        toast.error(errorMessage, { duration: 1500 });
        return;
      }

      const videoPayload = {
        title: result?.data?.data?.title,
        videoUrl: result?.data?.data?.videoUrl,
      };

      setVideoDataObj(videoPayload);

      const moduleId = result?.data?.data?.module;

      const courseProgressResult = await userCourseProgress(courseId);

      if (courseProgressResult?.data?.data) {
        setCourseProgress(courseProgressResult?.data?.data);
      }

      const moduleResult = await getModuleVideos(moduleId, false);

      if (moduleResult?.data?.data) {
        setVideoData(moduleResult?.data?.data);
      }
    } catch (error) {
      console.error("Failed to fetch  video", error);
    }
  };

  // console.log(videoData);

  // ! effect for setting video loading
  useEffect(() => {
    setVideoLoading(videoDataFetchLoading);
  }, [videoDataFetchLoading]);

  return (
    <div className="ModuleShowDataContainer">
      <div className="ModuleShowDataWrapper">
        {/*  */}
        <Accordion type="single" collapsible className="w-full">
          {modules &&
            modules?.map((module: TModuleType) => (
              //
              <AccordionItem
                value={module?._id}
                className=" bg-prime50/10 rounded-md border shadow p-2 my-5 "
              >
                {/* module name  */}
                <AccordionTrigger
                  className=" text-xl "
                  onClick={() => handleClickModule(module)}
                >
                  {module?.title}
                </AccordionTrigger>

                {/* video name  */}

                {isLoading && <ModuleItemSkeleton />}
                {videoData &&
                  videoData?.map((video: TModuleVideo) => (
                    <AccordionContent
                      className={` text-lg py-3 pl-4 font-medium border-y border-y-gray-300 flex items-center gap-x-2 cursor-pointer   ${
                        video?.video?.title === videoDataObj?.title &&
                        "bg-prime50/25 rounded "
                      }  `}
                    >
                      {video?.videoStatus ===
                        videoProgressStatusConsts?.locked && (
                        <Lock className=" text-red-600 font-bold " />
                      )}

                      {video?.videoStatus ===
                        videoProgressStatusConsts?.watched && (
                        <CircleCheckBig className=" text-green-700 font-bold " />
                      )}

                      {video?.videoStatus ===
                        videoProgressStatusConsts?.unlocked && (
                        <LockOpen className=" text-blue-600 font-bold " />
                      )}

                      <p onClick={() => handleGetVideo(video?.video)}>
                        {video?.video?.title}
                      </p>
                    </AccordionContent>
                  ))}

                {/*  */}
              </AccordionItem>

              //
            ))}

          {/*  */}
        </Accordion>
        {/*  */}
      </div>
    </div>
  );
};

export default ModuleShowData;
