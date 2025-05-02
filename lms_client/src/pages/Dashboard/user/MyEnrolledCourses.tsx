import TableDataLoading from "@/components/shared/TableLoading";
import {
  EnrolledCourseColumn,
  EnrolledCourseTable,
} from "@/components/ui/user/table/EnrolledCourseTable";
import { useGetAllUserEnrolledCoursesQuery } from "@/redux/features/enrollment/enrollment.api";

const MyEnrolledCourses = () => {
  const { data: allEnrolledCourse, isLoading } =
    useGetAllUserEnrolledCoursesQuery(undefined);

  // console.log(allEnrolledCourse?.data);

  return (
    <div className="MyCoursesContainer">
      <div className="MyCoursesWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3">
        <h3 className="brand text-2xl font-medium mb-4 ">
          My Enrolled Courses
        </h3>

        {isLoading && <TableDataLoading />}

        <div className="enrolledCourseData">
          {allEnrolledCourse?.data && (
            <div className="Tablecontainer mx-auto py-10">
              <EnrolledCourseTable
                columns={EnrolledCourseColumn}
                data={allEnrolledCourse?.data}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyEnrolledCourses;
