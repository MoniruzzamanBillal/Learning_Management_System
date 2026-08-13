"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import jsPDF from "jspdf";

type Props = {
  userName: string;
  courseName: string;
  category?: string;
  completedOn: string;
  userId: string;
  courseId: string;
};

// brand colors (context/ui-context.md)
const PRIME_100: [number, number, number] = [79, 70, 229]; // #4f46e5
const PRIME_50: [number, number, number] = [99, 102, 241]; // #6366f1
const BLACK_100: [number, number, number] = [2, 8, 23]; // #020817
const MUTED_GRAY: [number, number, number] = [107, 114, 128]; // #6b7280

const getCertificateId = (userId: string, courseId: string) =>
  `${userId}${courseId}`.toUpperCase().slice(0, 8);

// shrinks a bold string until it fits maxWidth, returns the font size to use
const fitFontSize = (
  doc: jsPDF,
  text: string,
  maxWidth: number,
  startSize: number,
  minSize: number,
) => {
  let size = startSize;
  doc.setFontSize(size);
  while (doc.getTextWidth(text) > maxWidth && size > minSize) {
    size -= 1;
    doc.setFontSize(size);
  }
  return size;
};

const CertificateDownloadButton = ({
  userName,
  courseName,
  category,
  completedOn,
  userId,
  courseId,
}: Props) => {
  const handleDownload = async () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 297
    const pageHeight = doc.internal.pageSize.getHeight(); // 210
    const centerX = pageWidth / 2;
    const printableWidth = pageWidth - 2 * 24; // stays clear of the border

    // outer border
    doc.setDrawColor(...PRIME_100);
    doc.setLineWidth(2);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

    // inner border
    doc.setDrawColor(...PRIME_50);
    doc.setLineWidth(0.5);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // wordmark
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...PRIME_100);
    doc.text("MATS ACADEMY", centerX, 30, { align: "center" });

    doc.setDrawColor(...PRIME_50);
    doc.setLineWidth(0.3);
    doc.line(centerX - 20, 34, centerX + 20, 34);

    // title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(...BLACK_100);
    doc.text("Certificate of Completion", centerX, 52, { align: "center" });

    // recipient name (largest, most prominent)
    doc.setFont("helvetica", "bold");
    const nameSize = fitFontSize(doc, userName, printableWidth, 40, 22);
    doc.setFontSize(nameSize);
    doc.setTextColor(...BLACK_100);
    doc.text(userName, centerX, 88, { align: "center" });

    doc.setDrawColor(...PRIME_50);
    doc.setLineWidth(0.5);
    doc.line(centerX - 60, 93, centerX + 60, 93);

    // body copy
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(...MUTED_GRAY);
    doc.text("has successfully completed the course", centerX, 106, {
      align: "center",
    });

    doc.setFont("helvetica", "bold");
    const courseNameSize = fitFontSize(doc, courseName, printableWidth, 22, 14);
    doc.setFontSize(courseNameSize);
    doc.setTextColor(...PRIME_100);
    doc.text(courseName, centerX, 120, { align: "center" });

    if (category) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(...MUTED_GRAY);
      doc.text(category, centerX, 128, { align: "center" });
    }

    // footer row
    const footerY = pageHeight - 28;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...MUTED_GRAY);
    doc.text(
      `Completed on ${format(new Date(completedOn), "dd MMM yyyy")}`,
      30,
      footerY,
      { align: "left" },
    );

    doc.setDrawColor(...BLACK_100);
    doc.setLineWidth(0.3);
    doc.line(centerX - 25, footerY, centerX + 25, footerY);
    doc.setFontSize(10);
    doc.text("MATS Academy", centerX, footerY + 5, { align: "center" });

    doc.text(
      `Certificate ID: ${getCertificateId(userId, courseId)}`,
      pageWidth - 30,
      footerY,
      { align: "right" },
    );

    doc.save(`${userName}_certificate.pdf`);
  };

  return (
    <>
      <Button
        onClick={() => handleDownload()}
        size={"sm"}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        Download
      </Button>
    </>
  );
};

export default CertificateDownloadButton;
