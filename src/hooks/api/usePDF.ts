import { apiClient } from '@/lib/api-client';
import { toast } from 'react-toastify';
import axios from 'axios';

/**
 * Sends HTML content to Next.js API to get a PDF Blob.
 */
export const getPDFBlob = async (html: string) => {
    const res = await axios.post('/api/pdf', { html }, { responseType: 'blob' });
    return new Blob([res.data], { type: 'application/pdf' });
};

/**
 * Generates a PDF from HTML and triggers a browser download.
 */
export const downloadPDF = async (html: string, filename: string) => {
    try {
        const blob = await getPDFBlob(html);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
        console.error('PDF Generation Error:', error);
        toast.error('Failed to generate PDF');
    }
};

/**
 * Prints HTML content directly so browser opens the native print dialog.
 * Returns a promise that resolves when the print dialog is closed.
 */
export const printPDF = async (html: string, printWindow?: Window | null): Promise<void> => {
    return new Promise((resolve) => {
        try {
            // If a window was opened during the submit click, reuse it.
            // This keeps print behavior tied to a user gesture in strict browsers.
            if (printWindow && !printWindow.closed) {
                printWindow.document.open();
                printWindow.document.write(html);
                printWindow.document.close();

                printWindow.onload = () => {
                    printWindow.focus();
                    printWindow.print();

                    // Detect when print dialog closes by checking window state
                    const checkPrintDialogClosed = setInterval(() => {
                        if (printWindow.closed) {
                            clearInterval(checkPrintDialogClosed);
                            resolve();
                        }
                    }, 500);

                    // Fallback timeout in case the window doesn't properly close
                    setTimeout(() => {
                        clearInterval(checkPrintDialogClosed);
                        if (!printWindow.closed) {
                            printWindow.close();
                        }
                        resolve();
                    }, 30000); // 30 second max timeout
                };

                return;
            }

            // Fallback: print using a hidden iframe without opening a new tab.
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.srcdoc = html;
            document.body.appendChild(iframe);

            iframe.onload = () => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();

                // Detect when print dialog closes
                const checkPrintDialogClosed = setInterval(() => {
                    try {
                        // If we can't access the iframe anymore, the dialog likely closed
                        if (!document.body.contains(iframe)) {
                            clearInterval(checkPrintDialogClosed);
                            resolve();
                        }
                    } catch {
                        clearInterval(checkPrintDialogClosed);
                        resolve();
                    }
                }, 500);

                // Cleanup iframe and object URL after a delay.
                // Wait long enough for the print dialog to initialize.
                setTimeout(() => {
                    clearInterval(checkPrintDialogClosed);
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe);
                    }
                    resolve();
                }, 30000); // 30 second max timeout
            };
        } catch (error: any) {
            console.error('PDF Print Error:', error);
            toast.error('Failed to prepare print');
            if (printWindow && !printWindow.closed) {
                printWindow.close();
            }
            resolve();
        }
    });
};

/**
 * Main flow: Fetches populated HTML from backend and generates PDF.
 */
export const generatePDF = async (visitId: string, templateId: string = 'default', filename: string = 'parchi.pdf') => {
    try {
        // 1. Fetch populated HTML from FastAPI
        const res = await apiClient.get(`/pdf/content/${visitId}/${templateId}`);
        const html = res.data.html;
        // console.log(html)

        if (!html) {
            toast.error('Could not fetch template content');
            return;
        }

        // 2. Generate and download PDF
        await downloadPDF(html, filename);
    } catch (error: any) {
        console.error('Fetch HTML Error:', error);
        toast.error('Failed to prepare PDF content');
    }
};

/**
 * Main flow: Fetches populated HTML from backend and opens print dialog.
 */
export const generateAndPrintPDF = async (
    visitId: string,
    templateId: string = 'default',
    printWindow?: Window | null,
) => {
    try {
        // 1. Fetch populated HTML from FastAPI
        const res = await apiClient.get(`/pdf/content/${visitId}/${templateId}`);
        const html = res.data.html;

        if (!html) {
            toast.error('Could not fetch template content');
            return;
        }

        // 2. Open print dialog
        await printPDF(html, printWindow);
    } catch (error: any) {
        console.error('Fetch HTML Error:', error);
        toast.error('Failed to prepare PDF content');
        if (printWindow && !printWindow.closed) {
            printWindow.close();
        }
    }
};
