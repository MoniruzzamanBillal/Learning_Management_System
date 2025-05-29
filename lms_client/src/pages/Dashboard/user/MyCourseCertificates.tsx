import TableDataLoading from "@/components/shared/TableLoading";
import {
  CertificateTableColumn,
  CourseCertificateTable,
} from "@/components/ui/user/table/CourseCertificateTable";
import { useGetUserFinishCourseQuery } from "@/redux/features/enrollment/enrollment.api";

const MyCourseCertificates = () => {
  const { data: userFinishedCourse, isLoading } =
    useGetUserFinishCourseQuery(undefined);

  // console.log(userFinishedCourse?.data);

  return (
    <div className="MyCourseCertificatesContainer">
      <div className="MyCourseCertificatesWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3 ">
        <h3 className="brand text-2xl font-medium mb-4 ">
          My Course Certificates
        </h3>

        {isLoading && <TableDataLoading />}

        <div className="courseCertificates  ">
          {userFinishedCourse?.data && (
            <div className="Tablecontainer mx-auto py-10">
              <CourseCertificateTable
                columns={CertificateTableColumn}
                data={userFinishedCourse?.data}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCourseCertificates;
