"use client";

import TableDataLoading from "@/components/shared/TableLoading";
import GenericTableComponent from "@/components/shared/table/GenericTableComponent";
import { useFetchData } from "@/hooks/useApi";
import { CertificateTableColumn, TCertificateData } from "./CertificateTableColumn";

const MyCourseCertificates = () => {
  const { data: userFinishedCourse, isLoading } = useFetchData<any>(
    ["user-finish-course"],
    "/enrollment/user-finish-course"
  );

  let content = null;

  if (isLoading) {
    content = <TableDataLoading />;
  } else if (!userFinishedCourse?.data?.length) {
    content = (
      <h1 className="text-prime-100 text-center py-16 text-xl font-semibold">
        You have not finished any course yet!
      </h1>
    );
  } else {
    content = (
      <div className="Tablecontainer mx-auto py-10">
        <GenericTableComponent
          columns={CertificateTableColumn as any}
          data={userFinishedCourse?.data}
        />
      </div>
    );
  }

  return (
    <div className="MyCourseCertificatesContainer">
      <div className="MyCourseCertificatesWrapper bg-gray-100/90 border border-gray-300 shadow rounded-md p-3">
        <h3 className="brand text-2xl font-medium mb-4">
          My Course Certificates
        </h3>

        <div className="courseCertificates">{content}</div>
      </div>
    </div>
  );
};

export default MyCourseCertificates;
