import { useState } from "react";
import { toast } from "react-toastify";

export default function useHandleform() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleform = async (e: any) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(e),
      });

      if (!res.ok) throw new Error("Failed to submit form");

      const pdfUint8Array = new Uint8Array(await res.arrayBuffer());
      const pdfBlob = new Blob([pdfUint8Array], { type: "application/pdf" });
      const pdfURL = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfURL);
      toast.success("Form submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit form");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

 

  return { handleform, isLoading, pdfUrl };
}
