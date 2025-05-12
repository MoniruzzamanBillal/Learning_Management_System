import Wrapper from "@/components/shared/Wrapper";
import {
  MyCourseCard,
  MyCourseCardSkeleton,
  NoEnrollCourse,
} from "@/components/ui/user/MyCourses";
import { useGetAllUserEnrolledCoursesQuery } from "@/redux/features/enrollment/enrollment.api";

export type TUserEnrolledCourse = {
  _id: string;
  completed: boolean;
  courseProgress: number;
  user: string;

  course: {
    _id: string;
    name: string;
    category: string;
    courseCover: string;
  };
};

const MyCourses = () => {
  const { data: userEnrolledCourse, isLoading } =
    useGetAllUserEnrolledCoursesQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  // console.log(userEnrolledCourse?.data);
  // console.log(userEnrolledCourse?.data?.length);

  return (
    <div className="MyCoursesContainer bg-gray-100 min-h-screen ">
      <Wrapper className="MyCoursesWrapper py-8 ">
        <h3 className="brand text-3xl font-medium mb-8 ">My Courses</h3>

        <div className="courseCardBody flex flex-col gap-y-8 ">
          {isLoading &&
            Array.from({ length: 4 })?.map((_, ind) => (
              <MyCourseCardSkeleton key={ind} />
            ))}

          {userEnrolledCourse?.data?.length === 0 && <NoEnrollCourse />}

          {userEnrolledCourse?.data &&
            userEnrolledCourse?.data?.map(
              (enrolledCourse: TUserEnrolledCourse) => (
                <MyCourseCard courseData={enrolledCourse} />
              )
            )}
        </div>
      </Wrapper>
    </div>
  );
};

export default MyCourses;
