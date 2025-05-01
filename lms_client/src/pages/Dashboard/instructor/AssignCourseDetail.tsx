import TableDataLoading from "@/components/shared/TableLoading";
import { Button } from "@/components/ui/button";
import {
  AssignCourseDetailColmn,
  AssignCourseDetailTable,
} from "@/components/ui/instructor/AssignCourseDetailTable";
import { useGetCourseDetailsForInstructorQuery } from "@/redux/features/course/course.api";
import { useGetModuleFromCourseIdQuery } from "@/redux/features/module/module.api";
import { Link, useParams } from "react-router-dom";

const AssignCourseDetail = () => {
  const { courseId } = useParams();

  if (!courseId) {
    throw new Error("Something went wrong !!!");
  }

  const { data: courseDetail, isLoading: courseDetailLoading } =
    useGetCourseDetailsForInstructorQuery(courseId, { skip: !courseId });

  const { data: courseDetailWithModule, isLoading: moduleDataLoading } =
    useGetModuleFromCourseIdQuery(courseId, { skip: !courseId });

  // console.log(courseDetail?.data);
  console.log(courseDetailWithModule?.data);

  return (
    <>
      {moduleDataLoading && <TableDataLoading />}

      <div className="AssignCourseDetailContainer">
        <div className="AssignCourseDetailWrapper bg-gray-100 border border-gray-300  shadow rounded-md p-4 ">
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
              <p className="coursePublished">
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
              <Link to={"/dashboard/instructor/add-module"}>
                <Button className=" bg-prime100 hover:bg-prime200 ">
                  Add New Module
                </Button>
              </Link>
            </div>

            {/*  */}
          </div>

          {/* module section  */}
          <div className="moduleSection mt-8 ">
            <h3 className="brand text-xl font-medium  underline  ">
              Modules :
            </h3>

            {/* table section  */}
            {courseDetailWithModule?.data && (
              <div className="Tablecontainer mx-auto py-10">
                <AssignCourseDetailTable
                  columns={AssignCourseDetailColmn}
                  data={courseDetailWithModule?.data}
                />
              </div>
            )}
          </div>

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default AssignCourseDetail;
