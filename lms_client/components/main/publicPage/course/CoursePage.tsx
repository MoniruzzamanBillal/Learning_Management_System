"use client";

import Wrapper from "@/components/shared/Wrapper";
import { Input } from "@/components/ui/input";
import { useFetchData } from "@/hooks/useApi";
import useDebounce from "@/utils/useDebounce";
import { BookOpen, Search } from "lucide-react";
import { useState } from "react";
import CategoryFilter from "./CategoryFilter";
import { TCourse } from "./Course.type";
import CourseCard from "./CourseCard";
import CourseCardSkeleton from "./CourseCardSkeleton";
import AiCourseAdvisor from "./AiCourseAdvisor";

export default function CoursePage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryType, setcategoryType] = useState<string>("");
  const debounceTerm = useDebounce(searchTerm, 400);

  const { data: allCourseData, isLoading: courseDataLoading } = useFetchData<{
    data: TCourse[];
  }>(
    ["all-courses", `${debounceTerm}`, `${categoryType}`],
    `/course/all-courses?searchTerm=${debounceTerm}&category=${categoryType}`,
  );

  let content = null;

  if (courseDataLoading) {
    content = (
      <>
        {Array.from({ length: 6 }).map((_, ind) => (
          <CourseCardSkeleton key={ind} />
        ))}
      </>
    );
  } else if (!allCourseData?.data?.data?.length) {
    content = (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No courses found
        </h2>
        <p className="text-gray-500 text-sm">
          Try a different search term or category.
        </p>
      </div>
    );
  } else if (allCourseData?.data?.data?.length) {
    content = allCourseData.data.data.map((course: TCourse) => (
      <CourseCard key={course._id} course={course} />
    ));
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Wrapper>
        {/* Page header */}
        <div className="text-center mb-8">
          <p className="text-prime-50 text-xs font-semibold tracking-widest uppercase mb-3">
            Courses
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            Explore All Courses
          </h1>
        </div>

        {/* Search bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex items-center gap-2 px-4 py-2">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <Input
              type="text"
              placeholder="Search courses..."
              className="border-none outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none p-0 h-auto bg-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* AI Course Advisor */}
        <AiCourseAdvisor />

        {/* Body */}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Category filter sidebar */}
          <div className="w-full xl:w-56 shrink-0">
            <CategoryFilter
              categoryType={categoryType}
              setcategoryType={setcategoryType}
            />
          </div>

          {/* Course grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {content}
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
