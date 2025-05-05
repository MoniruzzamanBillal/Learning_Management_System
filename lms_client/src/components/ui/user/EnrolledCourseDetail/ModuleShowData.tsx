import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLazyGetEnrolledCourseVideoModuleIdQuery } from "@/redux/features/enrollment/enrollment.api";
import { Lock } from "lucide-react";
import { useState } from "react";
import ModuleItemSkeleton from "./ModuleItemSkeleton";

type TVideo = { _id: string; title: string };

type TModuleType = {
  _id: string;
  title: string;
  videos: string[];
};

type TProps = {
  modules: TModuleType[];
};

const ModuleShowData = ({ modules }: TProps) => {
  const [videoData, setVideoData] = useState(null);

  const [trigger, { isLoading }] = useLazyGetEnrolledCourseVideoModuleIdQuery();

  // console.log(modules);

  // ! for getting module video , after clicking a module name
  const handleClickModule = async (module: TModuleType) => {
    console.log("module clicked !!!");
    // console.log(module);
    console.log("module id = ", module?._id);

    try {
      const result = await trigger(module?._id);

      console.log(result?.data?.data);
    } catch (error) {
      console.error("Failed to fetch module videos", error);
    }
  };

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
                {module?.videos &&
                  module?.videos?.map((video: TVideo) => (
                    <AccordionContent className=" text-lg py-3 pl-4 font-medium border-y border-y-gray-300 flex items-center gap-x-2 cursor-pointer  ">
                      <Lock />
                      {/* <p> {video?.title} </p> */}
                      <p>video title </p>
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
