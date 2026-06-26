"use client";

import TableDataLoading from "@/components/shared/TableLoading";
import GenericTableComponent from "@/components/shared/table/GenericTableComponent";
import { useFetchData } from "@/hooks/useApi";
import { useGetUser } from "@/hooks/useGetUser";
import { ManageCourseColumns } from "./ManageCourseColumns";

const ManageAssignCourse = () => {
  const user = useGetUser();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: isntructorAssignedCourses, isLoading } = useFetchData<any>(
    ["instructor-courses", `ins-${user?.userId}`],
    "/course/instructor-courses",
    { enabled: !!user?.userId },
  );

  let content = null;

  if (isLoading) {
    content = <TableDataLoading />;
  } else if (!isLoading && isntructorAssignedCourses) {
    content = isntructorAssignedCourses && isntructorAssignedCourses?.data && (
      <div className="Tablecontainer mx-auto py-10">
        <GenericTableComponent
          columns={ManageCourseColumns}
          data={isntructorAssignedCourses?.data}
        />
      </div>
    );
  }

  return (
    <div className="ManageAssignCourseContainer">
      <div className="ManageAssignCourseWrapper bg-gray-100/90 border border-gray-300 shadow rounded-md p-3">
        <h3 className="brand text-2xl font-medium mb-4">My Assigned Course</h3>
        {/* table section  */}
        {content}
      </div>
    </div>
  );
};

export default ManageAssignCourse;
