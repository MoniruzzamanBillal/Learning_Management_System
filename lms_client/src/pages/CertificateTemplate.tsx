import React from "react";

type TProps = {
  userName: string;
  userId: string;
  courseName: string;
};

const CertificateTemplate = React.forwardRef<HTMLDivElement, TProps>(
  ({ userName, userId, courseName }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white p-10 border-4 border-gray-300 rounded-xl w-full max-w-4xl text-center text-black"
        style={{ width: "1120px", height: "794px" }} // match A4 size
      >
        <h1 className="text-4xl font-bold mb-4">Certificate of Completion</h1>
        <p className="text-lg mb-2">This is to certify that</p>
        <h2 className="text-2xl font-semibold mb-2 text-indigo-600">
          {userName}
        </h2>
        <p className="mb-4">{userId}</p>
        <p className="text-lg mb-4">has successfully completed the course</p>
        <h3 className="text-xl font-semibold text-green-600">{courseName}</h3>
        <p className="mt-6 text-sm text-gray-500">
          Date: {new Date().toLocaleDateString()}
        </p>
        <p className="mt-2 text-sm text-gray-500">Signature: ___________</p>
      </div>
    );
  }
);

export default CertificateTemplate;
