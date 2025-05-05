import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  useLazyGetEnrolledCourseVideoModuleIdQuery,
  useLazyGetEnrolledCourseVideoQuery,
} from "@/redux/features/enrollment/enrollment.api";
import { videoProgressStatusConsts } from "@/utils/constants";
import { CircleCheckBig, Lock, LockOpen } from "lucide-react";
import React, { SetStateAction, useState } from "react";
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
  setVideoUrl: React.Dispatch<SetStateAction<string | null>>;
};

const ModuleShowData = ({ modules, setVideoUrl }: TProps) => {
  const [videoData, setVideoData] = useState<TModuleVideo[] | null>(null);

  const [getModuleVideos, { isLoading }] =
    useLazyGetEnrolledCourseVideoModuleIdQuery();
  const [getVideoData, { isLoading: videoDataFetchLoading }] =
    useLazyGetEnrolledCourseVideoQuery();

  // console.log(modules);

  // ! for getting module video , after clicking a module name
  const handleClickModule = async (module: TModuleType) => {
    // console.log("module id = ", module?._id);

    try {
      const result = await getModuleVideos(module?._id, false);

      // console.log(result?.data?.data);

      if (result?.data?.data) {
        setVideoData(result?.data?.data);
      }
    } catch (error) {
      console.error("Failed to fetch module videos", error);
    }
  };

  // ! for getting video data
  const handleGetVideo = async (video: TVideo) => {
    // console.log("video id = ", video?._id);

    try {
      const result = await getVideoData(video?._id);

      const videoUrl = result?.data?.data?.videoUrl;
      const moduleId = result?.data?.data?.module;

      setVideoUrl(videoUrl);

      console.log(videoUrl);

      const moduleResult = await getModuleVideos(moduleId, false);

      // console.log(moduleResult?.data?.data);

      if (moduleResult?.data?.data) {
        setVideoData(moduleResult?.data?.data);
      }
    } catch (error) {
      console.error("Failed to fetch  video", error);
    }
  };

  console.log(videoData);

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
                    <AccordionContent className=" text-lg py-3 pl-4 font-medium border-y border-y-gray-300 flex items-center gap-x-2 cursor-pointer  ">
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
