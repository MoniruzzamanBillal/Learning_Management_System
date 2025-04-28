import TableDataLoading from "@/components/shared/TableLoading";
import {
  CourseColumns,
  ManageCourseTable,
} from "@/components/ui/admin/ManageCourse";
import { Button } from "@/components/ui/button";
import { useGetAllCourseAdminQuery } from "@/redux/features/course/course.api";

import { useNavigate } from "react-router-dom";

const ManageCourse = () => {
  const navigate = useNavigate();

  const { data: allCourseData, isLoading: courseDataLoading } =
    useGetAllCourseAdminQuery(undefined);

  // console.log(allCourseData?.data);

  return (
    <>
      {courseDataLoading && <TableDataLoading />}

      <div className="ManageCourseContainer">
        <div className="manageCourseWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3 ">
          <h3 className="brand text-2xl font-medium mb-4 "> Manage Course </h3>

          <Button
            onClick={() => navigate("/dashboard/admin/add-course")}
            className="mb-4 bg-prime100 hover:bg-prime200 cursor-pointer"
          >
            Add Course
          </Button>

          {/* table section  */}
          <div className="Tablecontainer mx-auto py-10">
            {allCourseData?.data && (
              <ManageCourseTable
                columns={CourseColumns}
                data={allCourseData?.data}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageCourse;
