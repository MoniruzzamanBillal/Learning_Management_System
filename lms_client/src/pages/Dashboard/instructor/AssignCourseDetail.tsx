import { dummyManageModule } from "@/components/TestingTable/DummyData";
import { Button } from "@/components/ui/button";
import {
  ManageModuleColumn,
  ManageModuleTable,
} from "@/components/ui/instructor/ManageModule";
import { useParams } from "react-router-dom";

const AssignCourseDetail = () => {
  const { courseId } = useParams();

  console.log("course id = ", courseId);

  return (
    <div className="AssignCourseDetailContainer">
      <div className="AssignCourseDetailWrapper">
        <h3 className="brand text-2xl font-medium mb-6 underline  ">
          Course Detail :
        </h3>

        <div className="courseDetailBody  flex justify-between  ">
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
          </div>

          {/* add  button section  */}
          <div className=" rightSection btnSection   ">
            <Button className=" bg-prime100 hover:bg-prime200 ">
              Add New Module
            </Button>
          </div>

          {/*  */}
        </div>

        {/* module section  */}
        <div className="moduleSection mt-8 ">
          <h3 className="brand text-xl font-medium  underline  ">Modules :</h3>

          {/* table section  */}
          <div className="Tablecontainer mx-auto py-10">
            <ManageModuleTable
              columns={ManageModuleColumn}
              data={dummyManageModule}
            />
          </div>
        </div>

        {/*  */}
      </div>
    </div>
  );
};

export default AssignCourseDetail;
