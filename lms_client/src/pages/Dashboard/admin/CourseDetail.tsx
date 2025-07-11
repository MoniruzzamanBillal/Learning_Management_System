import TableDataLoading from "@/components/shared/TableLoading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CourseDetailModuleColumn,
  CourseDetailModuleTable,
  InstructorColumn,
  InstructorTable,
} from "@/components/ui/admin/courseDetail";
import { Button } from "@/components/ui/button";
import { publishCourseFunction } from "@/functions/course.functions";
import {
  useGetCourseDetailsForAdminQuery,
  usePublishCourseMutation,
} from "@/redux/features/course/course.api";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
  const navigate = useNavigate();

  const { courseId } = useParams();

  if (!courseId) {
    throw new Error("Something went wrong !!!!");
  }

  const [publishCourse, { isLoading: coursepublishingLoading }] =
    usePublishCourseMutation();

  const {
    data: courseData,
    isLoading: courseDataLoading,
    refetch: courseDataRefetch,
  } = useGetCourseDetailsForAdminQuery(courseId, {
    skip: !courseId,
  });

  // ! for publishing a course
  const publishAdminCourse = async () => {
    const result = await publishCourseFunction(courseId, publishCourse);

    if (result?.data?.success) {
      courseDataRefetch();
    }
  };

  let courseDetailContent = null;
  let instructorTableSection = null;
  let moduleTableSection = null;

  if (courseDataLoading) {
    courseDetailContent = <TableDataLoading />;
  }
  if (courseData) {
    courseDetailContent = (
      <div className="courseDetailSection">
        {/* heading section  */}
        <div className="headingSection mb-8 flex justify-between items-center">
          <div className="headingLeft">
            <h1 className=" font-medium text-xl  ">
              {" "}
              Course id : #{courseId}{" "}
            </h1>
          </div>

          <div className=" rightSection btnSection flex justify-between items-center gap-x-4  ">
            {!courseData?.data?.published && (
              <Button
                disabled={coursepublishingLoading}
                className=" bg-prime100 hover:bg-prime200 "
                onClick={() => publishAdminCourse()}
              >
                {coursepublishingLoading
                  ? "Publishing course..."
                  : " Publish Course"}
              </Button>
            )}

            <Button
              disabled={courseData?.data?.published}
              onClick={() =>
                navigate(
                  `/dashboard/admin/update-course/${courseData?.data?._id}`
                )
              }
              className={`    ${
                courseData?.data?.published
                  ? "bg-gray-700  "
                  : " bg-green-600 hover:bg-green-700"
              } `}
            >
              Update Course
            </Button>
          </div>

          {/*  */}
        </div>

        {/* course detail body  */}
        <div className="detailBody text-lg ">
          {/* course name  */}
          <p className="courseName">
            <span className=" font-bold ">Course name : </span>{" "}
            {courseData?.data?.name}
          </p>

          {/* course category  */}
          <p className="courseCategory">
            <span className=" font-bold ">Course category : </span>{" "}
            {courseData?.data?.category}
          </p>

          {/* course price */}
          <p className="coursePrice">
            <span className=" font-bold ">Course price : </span>{" "}
            {courseData?.data?.price}
          </p>

          {/* course published */}
          <p className="coursePublished">
            <span className={` font-bold  `}>Course Published : </span>{" "}
            <span
              className={` ${
                courseData?.data?.published
                  ? "text-green-600 "
                  : "text-red-600 "
              } `}
            >
              {courseData?.data?.published ? "Published " : "Unpublished "}
            </span>
          </p>

          {/* course detail */}

          <div className="courseDetail">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className=" font-bold ">
                  Course details
                </AccordionTrigger>
                <AccordionContent>
                  <div
                    className="  courseDetail "
                    dangerouslySetInnerHTML={{
                      __html: courseData?.data?.description,
                    }}
                  ></div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/*  */}
        </div>
      </div>
    );

    // instructor table section
    instructorTableSection = (
      <div className="instructorsTable pt-8 ">
        <h1 className=" font-medium text-xl mb-2 underline ">Instructors :</h1>

        {courseData?.data?.instructors && (
          <div className="TableContainer mx-auto mt-2">
            <InstructorTable
              columns={InstructorColumn}
              data={courseData?.data?.instructors}
            />
          </div>
        )}
      </div>
    );

    moduleTableSection = (
      <div className="modulesTable pt-8 ">
        <h1 className=" font-medium text-xl mb-2 underline ">Modules :</h1>

        {courseData?.data?.modules && (
          <div className="TableContainer mx-auto mt-2">
            <CourseDetailModuleTable
              columns={CourseDetailModuleColumn}
              data={courseData?.data?.modules}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="CourseDetailContainer">
      <div className="CourseDetailWrapper bg-gray-100 border border-gray-300  shadow rounded-md p-3 ">
        <h3 className="brand text-3xl font-medium mb-4 underline  ">
          Course Detail :
        </h3>

        <div className="courseDetailBody">
          {/* detail section  */}
          {courseDetailContent}

          {/* instructor table section  */}
          {instructorTableSection}

          {/* module table  */}
          {moduleTableSection}

          {/*  */}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
