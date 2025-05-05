import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Lock } from "lucide-react";

type TVideo = { _id: string; title: string };

type TModuleType = {
  _id: string;
  course: string;
  title: string;
  videos: TVideo[];
};

type TProps = {
  modules: TModuleType[];
};

const ModuleShowData = ({ modules }) => {
  // console.log(modules);

  // ! for getting module video , after clicking a module name
  const handleClickModule = async (module: TModuleType) => {
    console.log("module clicked !!!");
    console.log(module);
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
