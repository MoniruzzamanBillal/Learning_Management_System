import MyCourseCertificates from "@/components/main/(User)/Certificates/MyCourseCertificates";

export const metadata = {
  title: "My Certificates | User Dashboard",
  description: "View and download your course certificates.",
  robots: { index: false, follow: false },
};

const CourseCertificatesPage = () => {
  return <MyCourseCertificates />;
};

export default CourseCertificatesPage;
