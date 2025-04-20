import { dummyEnrollmentData } from "@/components/TestingTable/DummyData";
import {
  EnrollmentCourseTable,
  EnrollmentStudentsColumn,
} from "@/components/ui/admin/Enrollment";

const Enrollment = () => {
  return (
    <div className="EnrollmentContainer">
      <div className="EnrollmentWrapper  bg-gray-100/90 border border-gray-300  shadow rounded-md p-3">
        <h3 className="brand text-2xl font-medium mb-4 ">
          {" "}
          Course Enrollments{" "}
        </h3>

        {/* table section  */}
        <div className="Tablecontainer mx-auto py-10">
          <EnrollmentCourseTable
            columns={EnrollmentStudentsColumn}
            data={dummyEnrollmentData}
          />
        </div>
      </div>
    </div>
  );
};

export default Enrollment;
