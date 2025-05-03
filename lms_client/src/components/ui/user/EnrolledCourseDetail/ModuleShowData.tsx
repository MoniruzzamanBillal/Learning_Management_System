import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
            <AccordionTrigger className=" text-xl ">
              Is it accessible?{" "}
            </AccordionTrigger>

            <AccordionContent className="  pl-2 font-medium ">
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>

            <AccordionContent className="  pl-2 font-medium ">
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>

          {/*  */}
        </Accordion>
        {/*  */}
      </div>
    </div>
  );
};

export default ModuleShowData;
