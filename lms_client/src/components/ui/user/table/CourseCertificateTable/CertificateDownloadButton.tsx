// CertificateDownloadButton.tsx
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

type Props = {
  userName: string;

  courseName: string;
};

const CertificateDownloadButton = ({ userName, courseName }: Props) => {
  // ! for downloading certificate
  const handleDownload = async () => {
    const doc = new jsPDF();

    doc.addImage("/certificate.jpg", "JPEG", 0, 0, 210, 297);

    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(38);
    doc.text(userName, 15, 120);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(24);
    doc.text(`Has completed the course:`, 105, 160, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text(courseName, 105, 176, { align: "center" });

    doc.save(`${userName}_certificate.pdf`);
  };

  return (
    <>
      <Button
        onClick={() => handleDownload()}
        className="bg-green-600 hover:bg-green-700"
      >
        Download
      </Button>
    </>
  );
};

export default CertificateDownloadButton;
