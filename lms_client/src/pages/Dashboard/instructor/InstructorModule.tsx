import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";

const InstructorModule = () => {
  const { moduleId } = useParams();

  console.log("module id = ", moduleId);

  return (
    <div className="InstructorModuleContainer">
      <div className="InstructorModuleWrapper bg-gray-100 border border-gray-300  shadow rounded-md p-4 ">
        <h3 className="brand text-2xl font-medium mb-6 underline  ">
          Module Detail :
        </h3>

        {/* module detail body  */}
        <div className="moduleDetailBody flex justify-between  ">
          <div className="bodyLeft text-lg flex flex-col gap-y-2">
            {/* course name  */}
            <p className="courseName">
              <span className=" font-bold ">Course name : </span> Mastering
              Frontend Development with js
            </p>

            {/* course published */}
            <p className="courseName">
              <span className=" font-bold ">Course Published : </span> false
            </p>

            {/* course category  */}
            <p className="courseCategory">
              <span className=" font-bold ">Course category : </span> Web
              Development
            </p>

            {/* module name  */}
            <p className="moduleName">
              <span className=" font-bold ">Module name : </span> Introduction
              to Html
            </p>
          </div>

          {/* add , update button section  */}
          <div className=" rightSection btnSection  flex justify-between  gap-x-3 ">
            <Link to={`/dashboard/instructor/update-module/${moduleId}`}>
              <Button className=" bg-prime100 hover:bg-prime200 ">
                Update Module
              </Button>
            </Link>

            {/*  */}
            <Link to={`/dashboard/instructor/add-video/${moduleId}`}>
              <Button className=" bg-green-700/95 hover:bg-green-800/95 ">
                Add New Video
              </Button>
            </Link>

            {/*  */}
          </div>
        </div>

        {/* video section  */}
        <div className="videoSection mt-8 ">
          <h3 className="brand text-xl font-medium  underline  ">Videos :</h3>

          <div className="videoDetails">
            <Accordion type="single" collapsible className="w-full">
              {/*  */}
              <AccordionItem value="item-1">
                <AccordionTrigger>Video Title : </AccordionTrigger>
                <AccordionContent>
                  <div className="videoContent  ">
                    <h1>video </h1>
                    <h1>video </h1>
                    <h1>video </h1>
                    <h1>video </h1>
                    <h1>video </h1>
                  </div>
                  <div className="btnSection  flex   gap-x-3 py-4 ">
                    <Link to={`/dashboard/instructor/update-video/:videoId`}>
                      <Button className=" bg-green-700/95 hover:bg-green-800/95 ">
                        Update Video
                      </Button>
                    </Link>
                    {/*  */}
                    <Button className="  bg-red-600 hover:bg-red-700 ">
                      Delete Video
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              {/*  */}
            </Accordion>
          </div>
        </div>

        {/*  */}
      </div>
    </div>
  );
};

export default InstructorModule;
