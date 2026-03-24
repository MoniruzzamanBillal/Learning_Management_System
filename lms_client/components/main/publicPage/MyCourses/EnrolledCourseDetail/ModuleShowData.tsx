import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useFetchData } from "@/hooks/useApi";
import { TApiResponse } from "@/types/globalTypes";
import { apiGet } from "@/utils/api";
import { videoProgressStatusConsts } from "@/utils/constants";
import { CircleCheckBig, Lock, LockOpen } from "lucide-react";
import React, { SetStateAction, useState } from "react";
import { toast } from "sonner";
import ModuleItemSkeleton from "./ModuleItemSkeleton";
import { TModule } from "./type";

type TVideoDetail = {
  _id: string;
  title: string;
  videoUrl: string;
  videoOrder: number;
  module: string;
  instructor: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  __v: number;
};

type TVideo = { _id: string; title: string };

type TModuleVideo = {
  _id: string;
  video: TVideo;
  videoStatus: keyof typeof videoProgressStatusConsts;
};

type TProps = {
  modules: TModule[];
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
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const {
    data: moduleVideosData,
    isLoading: moduleVideosLoading,
    refetch: moduleVideoRefetch,
  } = useFetchData<TModuleVideo[]>(
    [`module-videos-${selectedModuleId}`],
    `/enroll/module-videos/${selectedModuleId}`,
    {
      enabled: !!selectedModuleId,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  );

  // ! for getting module video , after clicking a module name
  const handleClickModule = async (module: TModule) => {
    setSelectedModuleId(module._id);
  };

  // ! for getting video data
  const handleGetVideo = async (videoId: string) => {
    setVideoLoading(true);

    try {
      const result = (await apiGet(
        `/enroll/my-enrolled-course-videos/${videoId}`,
      )) as TApiResponse<TVideoDetail>;

      moduleVideoRefetch();
      setVideoLoading(false);

      const videoPayload = {
        title: result?.data?.title,
        videoUrl: result?.data?.videoUrl,
      };

      setVideoDataObj(videoPayload);

      const courseProgressResult = (await apiGet(
        `/enroll/my-course-progress/${courseId}`,
      )) as TApiResponse<number>;

      if (courseProgressResult?.data) {
        setCourseProgress(courseProgressResult?.data);
      }

      const moduleId = result?.data?.module;

      setSelectedModuleId(moduleId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setVideoLoading(false);

      console.log("Failed to fetch  video", error);
      toast.error(error?.message || "Failed to fetch  video");
    }
  };

  return (
    <div className="ModuleShowDataContainer mt-10  ">
      <div className="ModuleShowDataWrapper">
        {/*  */}
        <Accordion type="single" collapsible className="w-full">
          {modules &&
            modules?.map((module: TModule) => (
              <AccordionItem
                key={module?._id}
                value={module?._id}
                className=" bg-prime-50/10 rounded-md border shadow p-2 my-5 "
              >
                {/* module name  */}
                <AccordionTrigger
                  className=" text-base lg:text-xl  text-left "
                  onClick={() => handleClickModule(module)}
                >
                  {module?.title}
                </AccordionTrigger>

                {/* video name  */}

                {moduleVideosLoading && <ModuleItemSkeleton />}
                {moduleVideosData &&
                  moduleVideosData?.data?.map((video: TModuleVideo) => (
                    <AccordionContent
                      key={video?._id}
                      className={` text-sm lg:text-lg py-3 pl-4 font-medium border-y border-y-gray-300 flex items-center gap-x-2 cursor-pointer   ${
                        video?.video?.title === videoDataObj?.title &&
                        "bg-prime-50/25 rounded "
                      }  `}
                    >
                      {video?.videoStatus ===
                        videoProgressStatusConsts?.locked && (
                        <Lock className=" text-red-600 font-bold  size-5 lg:size-6 " />
                      )}

                      {video?.videoStatus ===
                        videoProgressStatusConsts?.watched && (
                        <CircleCheckBig className=" text-green-700 font-bold size-5 lg:size-6 " />
                      )}

                      {video?.videoStatus ===
                        videoProgressStatusConsts?.unlocked && (
                        <LockOpen className=" text-blue-600 font-bold size-5 lg:size-6 " />
                      )}

                      <p onClick={() => handleGetVideo(video?.video?._id)}>
                        {video?.video?.title}
                      </p>
                    </AccordionContent>
                  ))}
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
};

export default ModuleShowData;
