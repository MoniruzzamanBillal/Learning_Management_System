"use client";

import Wrapper from "@/components/shared/Wrapper";
import { useFetchData } from "@/hooks/useApi";
import { TCourse } from "../course/Course.type";
import CourseCard from "../course/CourseCard";
import CourseCardSkeleton from "../course/CourseCardSkeleton";

export default function PopularCourse() {
  const { data: allCourseData, isLoading: courseDataLoading } = useFetchData(
    ["popular-courses"],
    "/course/all-courses?limit=3",
  );

  let content = null;

  if (courseDataLoading) {
    content = Array.from({ length: 3 })?.map((_, ind) => (
      <CourseCardSkeleton key={ind} />
    ));
  } else if (allCourseData?.data?.data) {
    content = allCourseData?.data?.data?.map((course: TCourse) => (
      <CourseCard key={course?._id} course={course} />
    ));
  }

  return (
    <div className="PopularCourseContainer bg-gray-50 py-8 ">
      <Wrapper className="PopularCourseWrapper">
        <h1 className=" text-center text-prime100 font-medium  text-xl sm:text-2xl md:text-3xl ">
          Our Most Popular Class
        </h1>

        <h2 className=" text-center pt-4 mb-8 font-medium text-lg sm:text-xl md:text-2xl ">
          {`Let's join our famous class, the knowledge provided will definitely be
          useful for you.`}
        </h2>

        <div className="courseSection  mx-auto w-[96%]  sm:w-full  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
          {content}
        </div>
      </Wrapper>
    </div>
  );
}
