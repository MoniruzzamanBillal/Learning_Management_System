import Wrapper from "@/components/shared/Wrapper";
import {
  MyCourseCard,
  MyCourseCardSkeleton,
} from "@/components/ui/user/MyCourses";
import { useGetAllUserEnrolledCoursesQuery } from "@/redux/features/enrollment/enrollment.api";

const MyCourses = () => {
  const { data: userEnrolledCourse, isLoading } =
    useGetAllUserEnrolledCoursesQuery(undefined);

  console.log(userEnrolledCourse?.data);

  return (
    <div className="MyCoursesContainer bg-gray-100  ">
      <Wrapper className="MyCoursesWrapper py-8 ">
        <h3 className="brand text-3xl font-medium mb-8 ">My Courses</h3>

        <div className="courseCardBody flex flex-col gap-y-8 ">
          {isLoading && <MyCourseCardSkeleton />}

          <MyCourseCard />
          <MyCourseCard />
          <MyCourseCard />
        </div>
      </Wrapper>
    </div>
  );
};

export default MyCourses;
