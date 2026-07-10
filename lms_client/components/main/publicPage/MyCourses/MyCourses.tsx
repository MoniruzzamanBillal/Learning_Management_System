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
    <div className="bg-gray-50 min-h-screen">
      <Wrapper className="py-10">
        <div className="mb-8">
          <p className="text-prime-50 text-xs font-semibold tracking-widest uppercase mb-2">
            My Learning
          </p>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {isLoading &&
            Array.from({ length: 4 }).map((_, ind) => (
              <MyCourseCardSkeleton key={ind} />
            ))}

          {userEnrolledCourse?.data?.length === 0 && (
            <div className="col-span-full">
              <NoEnrollCourse />
            </div>
          )}

          {userEnrolledCourse?.data &&
            userEnrolledCourse.data.map(
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
