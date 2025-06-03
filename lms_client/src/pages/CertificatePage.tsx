const CertificatePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-10">
      <div className="bg-white p-10 border-4 border-gray-300 rounded-xl w-full max-w-5xl shadow-xl text-center">
        <h1 className="text-4xl font-bold mb-4">Certificate of Completion</h1>
        <p className="text-lg mb-2">This is to certify that</p>
        <h2 className="text-2xl font-semibold mb-2 text-indigo-600">
          userName
        </h2>
        <p className="mb-4"> USER ID </p>
        <p className="text-lg mb-4">has successfully completed the course</p>
        <h3 className="text-xl font-semibold text-green-600"> courseName </h3>
        <p className="mt-6 text-sm text-gray-500">
          Date: {new Date().toLocaleDateString()}
        </p>
        <p className="mt-2 text-sm text-gray-500">Signature: ___________</p>
      </div>

      <button className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition">
        Download Certificate
      </button>
    </div>
  );
};

export default CertificatePage;
