import TableDataLoading from "@/components/shared/TableLoading";
import { Button } from "@/components/ui/button";
import {
  AssignCourseDetailColmn,
  AssignCourseDetailTable,
} from "@/components/ui/instructor/AssignCourseDetailTable";
import { useGetCourseDetailsForInstructorQuery } from "@/redux/features/course/course.api";
import { useGetModuleFromCourseIdQuery } from "@/redux/features/module/module.api";
import { useNavigate, useParams } from "react-router-dom";

const AssignCourseDetail = () => {
  const navigate = useNavigate();

  const { courseId } = useParams();

  if (!courseId) {
    throw new Error("Something went wrong !!!");
  }

  const { data: courseDetail, isLoading: courseDetailLoading } =
    useGetCourseDetailsForInstructorQuery(courseId, { skip: !courseId });

  const { data: courseDetailWithModule, isLoading: moduleDataLoading } =
    useGetModuleFromCourseIdQuery(courseId, {
      skip: !courseId,
      refetchOnMountOrArgChange: true,
    });

  // console.log(courseDetail?.data);
  // console.log(courseDetailWithModule?.data);

  let courseDetailContent = null;
  let moduleContent = null;

  if (courseDetailLoading || moduleDataLoading) {
    courseDetailContent = <TableDataLoading />;
  }
  if (courseDetail) {
    courseDetailContent = (
      <div className="courseDetailBody  flex justify-between  ">
        <div className="bodyLeft text-lg flex flex-col gap-y-2">
          {/* course name  */}
          <p className="courseName">
            <span className=" font-bold ">Course name : </span>{" "}
            {courseDetail?.data?.name}
          </p>

          {/* course published */}
          <p className="coursePublished">
            <span className={` font-bold  `}>Course Published : </span>{" "}
            <span
              className={` ${
                courseDetail?.data?.published
                  ? "text-green-600 "
                  : "text-red-600 "
              } `}
            >
              {courseDetail?.data?.published ? "Published " : "Unpublished "}
            </span>
          </p>

          {/* course category  */}
          <p className="courseCategory">
            <span className=" font-bold  ">Course category : </span>{" "}
            {courseDetail?.data?.category}
          </p>
        </div>

        {/* add  button section  */}
        <div className=" rightSection btnSection   ">
          <Button
            disabled={courseDetail?.data?.published}
            onClick={() =>
              navigate(
                `/dashboard/instructor/add-module?courseId=${courseDetail?.data?._id}`
              )
            }
            className={`    ${
              courseDetail?.data?.published
                ? "bg-gray-700  "
                : " bg-prime100 hover:bg-prime200"
            } `}
          >
            Add New Module
          </Button>
        </div>

        {/*  */}
      </div>
    );
  }
  if (courseDetailWithModule) {
    moduleContent = courseDetailWithModule && courseDetailWithModule?.data && (
      <div className="Tablecontainer mx-auto py-10">
        <AssignCourseDetailTable
          columns={AssignCourseDetailColmn}
          data={courseDetailWithModule?.data}
        />
      </div>
    );
  }

  return (
    <>
      <div className="AssignCourseDetailContainer">
        <div className="AssignCourseDetailWrapper bg-gray-100 border border-gray-300  shadow rounded-md p-4 ">
          <h3 className="brand text-2xl font-medium mb-6 underline  ">
            Course Detail :
          </h3>

          {/* course detail section  */}
          {courseDetailContent}

          {/* module section  */}
          <div className="moduleSection mt-8 ">
            <h3 className="brand text-xl font-medium  underline  ">
              Modules :
            </h3>

            {/* module data  table section  */}
            {moduleContent}
          </div>

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default AssignCourseDetail;
