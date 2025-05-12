import Wrapper from "@/components/shared/Wrapper";
import { CategoryFilter, CourseCard } from "@/components/ui/courses";
import { TCourse } from "@/components/ui/courses/CourseCard";
import CourseCardSkeleton from "@/components/ui/courses/CourseCardSkeleton";
import { Input } from "@/components/ui/input";
import { useGetAllPublishedCorsesQuery } from "@/redux/features/course/course.api";
import { useState } from "react";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryType, setcategoryType] = useState("");

  const { data: allCourseData, isLoading: courseDataLoading } =
    useGetAllPublishedCorsesQuery(undefined);

  return (
    <div className="CoursesContainer bg-gray-100 py-8 min-h-screen ">
      <Wrapper className="CoursesWrapper">
        {/* search section   */}
        <div className="searchSection bg-white border border-gray-300  w-[50%] m-auto py-1 px-5 rounded-full flex justify-center items-center mb-8  ">
          <Input
            type="text"
            placeholder="Looking for...."
            className=" border-none outline-none "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* main body section starts  */}
        <div className="mainBody flex flex-col xl:flex-row justify-between  gap-x-6 gap-y-8">
          {/* left category section  */}
          <div className="categorySection  w-full xl:w-[16%] ">
            <CategoryFilter
              categoryType={categoryType}
              setcategoryType={setcategoryType}
            />
          </div>

          {/* right course section   */}
          <div className="courseSection w-full xl:w-[84%]">
            {/* course card section  */}
            <div className="courseCard  grid grid-cols-3 gap-x-4 gap-y-6  ">
              {courseDataLoading &&
                Array.from({ length: 6 })?.map((_, ind) => (
                  <CourseCardSkeleton key={ind} />
                ))}

              {allCourseData?.data &&
                allCourseData?.data?.map((course: TCourse) => (
                  <CourseCard key={course?._id} course={course} />
                ))}
            </div>
          </div>

          {/*  */}
        </div>
      </Wrapper>
    </div>
  );
};

export default Courses;
