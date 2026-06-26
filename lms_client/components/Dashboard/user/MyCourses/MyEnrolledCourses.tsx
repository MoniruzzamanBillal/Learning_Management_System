"use client";

import TableDataLoading from "@/components/shared/TableLoading";
import GenericTableComponent from "@/components/shared/table/GenericTableComponent";
import { useFetchData } from "@/hooks/useApi";
import { EnrolledCourseColumn } from "./EnrolledCourseColumn";

const MyEnrolledCourses = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allEnrolledCourse, isLoading } = useFetchData<any>(
    ["user-enrolled-courses"],
    "/enroll/user-all-enrolled-couses",
  );

  return (
    <div className="MyCoursesContainer">
      <div className="MyCoursesWrapper bg-gray-100/90 border border-gray-300 shadow rounded-md p-3">
        <h3 className="brand text-2xl font-medium mb-4">My Enrolled Courses</h3>

        {isLoading ? (
          <TableDataLoading />
        ) : (
          <div className="enrolledCourseData">
            {allEnrolledCourse?.data && (
              <div className="Tablecontainer mx-auto py-10">
                <GenericTableComponent
                  columns={EnrolledCourseColumn}
                  data={allEnrolledCourse?.data}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnrolledCourses;
