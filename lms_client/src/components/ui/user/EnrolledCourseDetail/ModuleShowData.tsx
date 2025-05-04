import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Lock } from "lucide-react";

type TModuleType = {
  _id: string;
  course: string;
  title: string;
  videos: { _id: string; title: string }[];
};

type TProps = {
  modules: TModuleType[];
};

const ModuleShowData = ({ modules }: TProps) => {
  console.log(modules);

  // ! for getting module video , after clicking a module name
  const handleClickModule = async () => {
    console.log("module clicked !!!");
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
                <AccordionTrigger
                  className=" text-xl "
                  onClick={() => handleClickModule()}
                >
                  {module?.title}
                </AccordionTrigger>

                <AccordionContent className=" text-lg py-3 pl-4 font-medium border-y border-y-gray-300 flex items-center gap-x-2 cursor-pointer  ">
                  <Lock />
                  <p>Yes. It adheres to the WAI-ARIA design pattern.</p>
                </AccordionContent>

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
