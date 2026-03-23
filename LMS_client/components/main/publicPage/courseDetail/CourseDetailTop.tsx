import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { usePost } from "@/hooks/useApi";
import { userRoleConts } from "@/utils/constants";
import { format } from "date-fns";
import Image from "next/image";
import { toast } from "sonner";

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
  alreadyEnrolled: boolean;
  userInfo?: {
    userId: string;
    userRole: keyof typeof userRoleConts;
  };
};

const CourseDetailTop = ({
  courseDetails,
  alreadyEnrolled,
  userInfo,
}: TCourseDetailProps) => {
  // console.log(courseDetails);

  // const [enrollInCourse, { isLoading: courseEnrollementLoading }] =
  //   useEnrollInCourseMutation();

  // const userInfo = useGetUser();

  const { mutateAsync: enrollCourseMutaion, isPending } = usePost([
    [`course-${courseDetails?._id}`],
    [`course-detail-${courseDetails?._id}`],
    [`course-review-${courseDetails?._id}`],
    [`review-eligibility-${courseDetails?._id}`],
  ]);

  // ! for enrolling into a course
  const handleEnrollCourse = async (courseId: string) => {
    console.log("course id = ", courseId);
    if (!userInfo?.userId) {
      toast.error("Login to enroll into this course !!!!");
      return;
    }

    const payload = {
      user: userInfo?.userId as string,
      course: courseId,
    };

    console.log("enroll payload = ", payload);

    const result = await enrollCourseMutaion({
      url: `/enroll/enroll-course`,
      payload,
    });

    console.log("course enroll result = ", result);

    //
  };

  return (
    <>
      {/* {courseEnrollementLoading && <FormSubmitLoading />} */}

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
                      <li
                        key={indtructor?._id}
                        className=" pl-3 font-medium text-prime-100 "
                      >
                        {indtructor?.name}
                      </li>
                    ),
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
              <Image
                src={courseDetails?.courseCover}
                height={1280}
                width={1280}
                className=" w-full h-full "
                alt="course_cover"
              />
            </div>

            {/* course price section  */}
            <p className=" py-2 text-2xl font-semibold text-prime-200 ">
              Price : ${courseDetails?.price}
            </p>

            {/* enroll button  */}
            <Button
              disabled={
                alreadyEnrolled ||
                isPending ||
                userInfo?.userRole === userRoleConts.admin ||
                userInfo?.userRole === userRoleConts?.instructor
              }
              onClick={() => handleEnrollCourse(courseDetails?._id)}
              className={`  bg-prime-100 hover:bg-prime-200 cursor-pointer `}
            >
              {alreadyEnrolled ? "Course Enrolled" : "Enroll Now"}
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
