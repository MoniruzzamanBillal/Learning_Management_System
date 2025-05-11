import Wrapper from "@/components/shared/Wrapper";
import { useGetAllPublishedCorsesQuery } from "@/redux/features/course/course.api";
import CourseCard, { TCourse } from "../courses/CourseCard";
import CourseCardSkeleton from "../courses/CourseCardSkeleton";

const PopularCourse = () => {
  const { data: allCourseData, isLoading: courseDataLoading } =
    useGetAllPublishedCorsesQuery(undefined);

  return (
    <div className="PopularCourseContainer bg-gray-50 py-8 ">
      <Wrapper className="PopularCourseWrapper">
        <h1 className=" text-center text-prime100 font-medium ">
          Our Most Popular Class
        </h1>

        <h2 className=" text-center pt-4 mb-8 font-medium ">
          Let's join our famous class, the knowledge provided will definitely be
          useful for you.
        </h2>

        <div className="courseSection grid grid-cols-3 gap-x-4 gap-y-6">
          {courseDataLoading &&
            Array.from({ length: 6 })?.map((_, ind) => (
              <CourseCardSkeleton key={ind} />
            ))}

          {allCourseData?.data &&
            allCourseData?.data
              ?.slice(0, 3)
              ?.map((course: TCourse) => (
                <CourseCard key={course?._id} course={course} />
              ))}
        </div>
      </Wrapper>
    </div>
  );
};

export default PopularCourse;
