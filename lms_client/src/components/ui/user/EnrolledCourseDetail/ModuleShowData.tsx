import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Lock } from "lucide-react";

const ModuleShowData = () => {
  return (
    <div className="ModuleShowDataContainer">
      <div className="ModuleShowDataWrapper">
        {/*  */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem
            value="item-1"
            className=" bg-prime50/10 rounded-md border shadow p-2 my-2 "
          >
            <AccordionTrigger className=" text-2xl ">
              Is it accessible?{" "}
            </AccordionTrigger>

            <AccordionContent className=" text-lg py-3 pl-5 font-medium border-y border-y-gray-300 flex items-center gap-x-2 cursor-pointer  ">
              <Lock />
              <p>Yes. It adheres to the WAI-ARIA design pattern.</p>
            </AccordionContent>

            {/*  */}
          </AccordionItem>

          {/*  */}
        </Accordion>
        {/*  */}
      </div>
    </div>
  );
};

export default ModuleShowData;
