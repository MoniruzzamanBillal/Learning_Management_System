import MyCourseCertificates from "@/components/Dashboard/user/Certificates/MyCourseCertificates";

export const metadata = {
  title: "My Certificates | User Dashboard",
  description: "View and download certificates for completed courses.",
};

const CertificatesPage = () => {
  return <MyCourseCertificates />;
};

export default CertificatesPage;
