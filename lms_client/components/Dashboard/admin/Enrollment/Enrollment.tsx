"use client";

import TableDataLoading from "@/components/shared/TableLoading";
import GenericTableComponent from "@/components/shared/table/GenericTableComponent";
import { useFetchData } from "@/hooks/useApi";
import {
  EnrollmentStudentsColumn,
  TCourseEnrollmentSummary,
} from "./EnrollmentColumns";

const Enrollment = () => {
  const { data: courseEnrollmentData, isLoading } = useFetchData<
    TCourseEnrollmentSummary[]
  >(["enrollment-info"], "/enroll/enrollment-data");

  return (
    <div className="EnrollmentContainer">
      <div className="EnrollmentWrapper  bg-gray-100/90 border border-gray-300  shadow rounded-md p-3">
        <h3 className="brand text-2xl font-medium mb-4 ">Course Enrollments</h3>

        {/* ! showing lodign  */}
        {isLoading && <TableDataLoading />}

        {/* table section  */}
        {courseEnrollmentData?.data && (
          <div className="Tablecontainer mx-auto py-10">
            <GenericTableComponent
              columns={EnrollmentStudentsColumn}
              data={courseEnrollmentData?.data}
              showToolbar={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Enrollment;
