"use client";

import { toast } from "react-toastify";

export const downloadPdf = (pdfURL: string) => {
  if (pdfURL) {
    const link = document.createElement("a");
    link.href = pdfURL;
    link.download = "cashMemo.pdf";
    link.click();
    URL.revokeObjectURL(pdfURL);
  }
  toast.success("PDF Downloded Successfully!");
  return null;
};
export const handlePrint = async (pdfBlob: Blob) => {
  if (pdfBlob) {
    const url = URL.createObjectURL(pdfBlob);

    const printWindow = window.open(url) as Window;
    printWindow.onload = function () {
      printWindow.print();
    };
  }
};
