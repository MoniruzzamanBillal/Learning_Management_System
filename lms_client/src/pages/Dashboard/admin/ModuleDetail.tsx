import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useParams } from "react-router-dom";

const ModuleDetail = () => {
  const { id } = useParams();

  return (
    <div className="ModuleDetailContainer">
      <div className="CourseDetailWrapper bg-gray-100 border border-gray-300  shadow rounded-md p-4">
        <h3 className="brand text-2xl font-medium mb-4 "> Module Detail </h3>

        <div className="moduleDetailBody">
          {/* heading section  */}
          <div className="headingSection mb-8 flex justify-between items-center">
            <div className="headingLeft">
              <h1 className=" font-medium text-xl  ">
                {" "}
                Module Name : module name{" "}
              </h1>
              <h1 className=" font-medium text-xl  "> Module id : #{id} </h1>
            </div>

            {/*  */}
          </div>

          {/* detail body  */}
          <div className="moduleDetailBody">
            <h1 className=" font-medium text-xl mb-2 underline ">Videos :</h1>

            {/*  */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Video title : </AccordionTrigger>
                <AccordionContent>Actual video</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Video title :</AccordionTrigger>
                <AccordionContent>Actual video</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Video title :</AccordionTrigger>
                <AccordionContent>Actual video</AccordionContent>
              </AccordionItem>
            </Accordion>

            {/*  */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
