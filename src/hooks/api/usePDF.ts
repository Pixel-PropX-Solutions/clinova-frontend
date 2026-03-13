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
 * Main flow: Fetches populated HTML from backend and generates PDF.
 */
export const generatePDF = async (visitId: string, templateId: string = 'default', filename: string = 'parchi.pdf') => {
    try {
        // 1. Fetch populated HTML from FastAPI
        const res = await apiClient.get(`/pdf/content/${visitId}/${templateId}`);
        const html = res.data.html;
        console.log(html)

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
