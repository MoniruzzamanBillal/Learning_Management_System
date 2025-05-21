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
        <h1 className=" text-center text-prime100 font-medium  text-xl xsm:text-2xl md:text-3xl">
          Our Most Popular Class
        </h1>

        <h2 className=" text-center pt-4 mb-8 font-medium text-lg xsm:text-xl md:text-2xl ">
          Let's join our famous class, the knowledge provided will definitely be
          useful for you.
        </h2>

        <div className="courseSection  m-auto  w-[88%] xsm:w-[70%]  sm:w-full  grid grid-cols-1 sm:grid-cols-2 xmd:grid-cols-3 gap-x-4 gap-y-6">
          {courseDataLoading &&
            Array.from({ length: 3 })?.map((_, ind) => (
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
