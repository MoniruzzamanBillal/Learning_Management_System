"use client";

import Wrapper from "@/components/shared/Wrapper";
import { useFetchData } from "@/hooks/useApi";
import MyCourseCard from "./MyCourseCard";
import MyCourseCardSkeleton from "./MyCourseCardSkeleton";
import NoEnrollCourse from "./NoEnrollCourse";
import { TUserEnrolledCourse } from "./type";

export default function MyCourses() {
  const { data: userEnrolledCourse, isLoading } = useFetchData<
    TUserEnrolledCourse[]
  >([`user-enroll-courses`], `/enroll/user-all-enrolled-couses`);

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
                <MyCourseCard
                  key={enrolledCourse?._id}
                  courseData={enrolledCourse}
                />
              ),
            )}
        </div>
      </Wrapper>
    </div>
  );
}
