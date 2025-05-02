import TableDataLoading from "@/components/shared/TableLoading";
import {
  EnrollmentCourseTable,
  EnrollmentStudentsColumn,
} from "@/components/ui/admin/Enrollment";
import { useGetEnrollmentInfoQuery } from "@/redux/features/enrollment/enrollment.api";

const Enrollment = () => {
  const { data: courseEnrollmentData, isLoading } =
    useGetEnrollmentInfoQuery(undefined);

  // console.log(courseEnrollmentData?.data);

  return (
    <div className="EnrollmentContainer">
      <div className="EnrollmentWrapper  bg-gray-100/90 border border-gray-300  shadow rounded-md p-3">
        <h3 className="brand text-2xl font-medium mb-4 ">
          {" "}
          Course Enrollments{" "}
        </h3>

        {/* ! showing lodign  */}
        {isLoading && <TableDataLoading />}

        {/* table section  */}
        {courseEnrollmentData?.data && (
          <div className="Tablecontainer mx-auto py-10">
            <EnrollmentCourseTable
              columns={EnrollmentStudentsColumn}
              data={courseEnrollmentData?.data}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Enrollment;
