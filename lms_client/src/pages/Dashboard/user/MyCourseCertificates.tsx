import TableDataLoading from "@/components/shared/TableLoading";
import { useGetUserFinishCourseQuery } from "@/redux/features/enrollment/enrollment.api";

const MyCourseCertificates = () => {
  const { data: userFinishedCourse, isLoading } =
    useGetUserFinishCourseQuery(undefined);

  let content = null;

  if (!userFinishedCourse?.data?.length && !isLoading) {
    content = (
      <h1 className=" text-prime100 text-center  py-16 ">
        User did not finished any course yet!!!
      </h1>
    );
  } else if (userFinishedCourse?.data?.length) {
    content = (
      <div className="Tablecontainer mx-auto py-10">
        {/* <CourseCertificateTable
          columns={CertificateTableColumn}
          data={userFinishedCourse?.data}
        /> */}
        <h1 className=" text-prime100 text-center  py-16 ">
          Working in progress !!!
        </h1>
      </div>
    );
  }

  return (
    <div className="MyCourseCertificatesContainer">
      <div className="MyCourseCertificatesWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3 ">
        <h3 className="brand text-2xl font-medium mb-4 ">
          My Course Certificates
        </h3>

        {isLoading && <TableDataLoading />}

        <div className="courseCertificates  ">{content}</div>
      </div>
    </div>
  );
};

export default MyCourseCertificates;
