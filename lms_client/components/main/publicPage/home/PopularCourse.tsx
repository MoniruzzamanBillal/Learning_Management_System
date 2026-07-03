"use client";

import Wrapper from "@/components/shared/Wrapper";
import { useFetchData } from "@/hooks/useApi";
import Link from "next/link";
import { TCourse } from "../course/Course.type";
import CourseCard from "../course/CourseCard";
import CourseCardSkeleton from "../course/CourseCardSkeleton";

export default function PopularCourse() {
  const { data: allCourseData, isLoading: courseDataLoading } = useFetchData<{
    data: TCourse[];
  }>(["popular-courses"], "/course/all-courses?limit=3");

  let content = null;

  if (courseDataLoading) {
    content = Array.from({ length: 3 }).map((_, i) => (
      <CourseCardSkeleton key={i} />
    ));
  } else if (allCourseData?.data?.data) {
    content = allCourseData.data.data.map((course: TCourse) => (
      <CourseCard key={course._id} course={course} />
    ));
  }

  return (
    <section className="bg-gray-50 py-16">
      <Wrapper>
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-prime-50 text-xs font-semibold tracking-widest uppercase mb-2">
              Popular Courses
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              Our Most Popular Classes
            </h2>
          </div>
          <Link
            href="/courses"
            className="text-prime-100 hover:text-prime-200 font-medium text-sm whitespace-nowrap hover:underline transition-colors"
          >
            View All Courses →
          </Link>
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {content}
        </div>
      </Wrapper>
    </section>
  );
}
