import Wrapper from "@/components/shared/Wrapper";
import { enrollInCourseFunction } from "@/functions/courseEnrollment.function";
import { useEnrollInCourseMutation } from "@/redux/features/enrollment/enrollment.api";
import { useGetUser } from "@/utils/sharedFunction";
import { format } from "date-fns";
import { Button } from "../button";
import FormSubmitLoading from "../FormSubmitLoading";

export type InstructorType = {
  _id: string;
  name: string;
};

export type CourseDetailType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  courseCover: string;
  instructors: InstructorType[];
  modules: string[];
  updatedAt: string;
};

type TCourseDetailProps = {
  courseDetails: CourseDetailType;
};

const CourseDetailTop = ({ courseDetails }: TCourseDetailProps) => {
  // console.log(courseDetails);

  const [enrollInCourse, { isLoading: courseEnrollementLoading }] =
    useEnrollInCourseMutation();

  const userInfo = useGetUser();

  // ! for enrolling into a course
  const handleEnrollCourse = async (courseId: string) => {
    const payload = {
      user: userInfo?.userId as string,
      course: courseId,
    };

    await enrollInCourseFunction(payload, enrollInCourse);

    //
  };

  return (
    <>
      {courseEnrollementLoading && <FormSubmitLoading />}

      <div className="courseTopSection  py-8 bg-gray-200  ">
        <Wrapper className="courseNameTopSection   flex justify-between gap-x-4     ">
          {/* course name section  */}
          <div className="courseNameSection  w-[70%] flex flex-col gap-y-4 ">
            {/* course name  */}
            <p className=" text-3xl font-semibold "> {courseDetails?.name} </p>

            <p className=" text-lg font-medium ">
              Course Category : {courseDetails?.category}{" "}
            </p>

            <p className=" text-lg font-medium "> Course Level : Beginner</p>

            {/* course instructors  */}
            <div className="courseInstructors">
              <p className=" text-lg font-semibold ">Course instructors : </p>
              <ul className=" list-inside list-decimal ">
                {courseDetails?.instructors &&
                  courseDetails?.instructors?.map(
                    (indtructor: InstructorType) => (
                      <li className=" pl-3 font-medium text-prime100 ">
                        {indtructor?.name}
                      </li>
                    )
                  )}
              </ul>
            </div>

            {/* modle length  */}
            <p className=" text-lg font-medium ">
              Total Modules : {courseDetails?.modules?.length}{" "}
            </p>

            {/* last update  */}
            <p className=" text-lg font-medium ">
              Last update :{" "}
              {format(new Date(`${courseDetails?.updatedAt}`), "dd-MMM-yyyy")}
            </p>

            {/*  */}
          </div>

          {/* course cover , price  section  */}
          <div className="courseCoverImg  w-[30%] border border-gray-200 rounded bg-gray-50 shadow p-3 flex flex-col gap-y-3 ">
            {/* image section  */}
            <div className="courseCover h-[12rem] rounded-t overflow-auto">
              <img
                src={courseDetails?.courseCover}
                className=" w-full h-full "
                alt="course_cover"
              />
            </div>

            {/* course price section  */}
            <p className=" py-2 text-2xl font-semibold text-prime200 ">
              Price : ${courseDetails?.price}
            </p>

            {/* enroll button  */}
            <Button
              onClick={() => handleEnrollCourse(courseDetails?._id)}
              className="  bg-prime100 hover:bg-prime200 "
            >
              Enroll Now{" "}
            </Button>

            {/*  */}
          </div>

          {/*  */}
        </Wrapper>
      </div>
    </>
  );
};

export default CourseDetailTop;
