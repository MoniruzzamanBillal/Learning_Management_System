"use client";

import GenericTableComponent from "@/components/shared/table/GenericTableComponent";
import TableDataLoading from "@/components/shared/TableLoading";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/hooks/useApi";
import { TCourseData } from "@/types/course.types";
import { useRouter } from "next/navigation";
import { CourseColumns } from "./CourseColumns";

const ManageCourse = () => {
  const router = useRouter();

  const { data: allCourseData, isLoading: courseDataLoading } = useFetchData<
    TCourseData[]
  >(["all-courses-admin"], "/course/admin-all-courses");

  let content = null;

  if (courseDataLoading) {
    content = <TableDataLoading />;
  } else if (allCourseData?.data) {
    content = (
      <GenericTableComponent
        columns={CourseColumns}
        data={allCourseData.data}
        showToolbar={false}
      />
    );
  }

  return (
    <div className="ManageCourseContainer">
      <div className="manageCourseWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3 ">
        <h3 className="brand text-2xl font-medium mb-4 "> Manage Course </h3>

        <Button
          onClick={() => router.push("/dashboard/admin/add-course")}
          className="mb-4 bg-prime-100 hover:bg-prime-200 cursor-pointer"
        >
          Add Course
        </Button>

        {/* table section  */}
        <div className="Tablecontainer mx-auto py-10">{content}</div>
      </div>
    </div>
  );
};

export default ManageCourse;
