// hooks/useDownloadPDF.ts
import html2pdf from 'html2pdf.js';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export const useDownloadPDF = () => {
  const downloadPDF = async (elementId: string, fileName = 'document.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found:', elementId);
      return;
    }

    document.body.classList.add('pdf-mode');

    await new Promise((r) => setTimeout(r, 100));
  

    const opt = {
      margin: 0.5,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
      // Android / iOS (Capacitor)
      const blob = await html2pdf().set(opt).from(element).outputPdf('blob');
      const base64 = await blobToBase64(blob);

      await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Documents,
      });

      await Share.share({
        title: 'Download PDF',
        text: 'Download or share your PDF',
        url: fileName,
        dialogTitle: 'Share your PDF',
      });
    } else {
      // Browser
      html2pdf().set(opt).from(element).save();
    }
    // setTimeout(() => {
    //   document.body.classList.remove('pdf-mode');
    // }, 500);
  };

  return { downloadPDF };
};

// helper to convert Blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result?.toString().split(',')[1];
      resolve(base64data || '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
