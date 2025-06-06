// CertificateDownloadButton.tsx
import { Button } from "@/components/ui/button";
import { CertificateTemplate } from "@/pages";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

type Props = {
  userName: string;
  userId: string;
  courseName: string;
};

const CertificateDownloadButton = ({ userName, userId, courseName }: Props) => {
  const certificateRef = useRef(null);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${userName}_certificate.pdf`);
  };

  return (
    <>
      <Button
        onClick={handleDownload}
        className="bg-green-600 hover:bg-green-700"
      >
        Download
      </Button>

      {/* Hidden rendered certificate */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: "0",
          width: "1120px",
          height: "794px",
        }}
      >
        <CertificateTemplate
          ref={certificateRef}
          userName={userName}
          userId={userId}
          courseName={courseName}
        />
      </div>
    </>
  );
};

export default CertificateDownloadButton;
