// FILE: downloadReport.js
import html2pdf from 'html2pdf.js';

export function downloadReport() {
  const element = document.getElementById('report-container');
  const opt = {
    margin: 1,
    filename: 'report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true, // Enable cross-origin resource sharing
      logging: true, // Enable logging for debugging
      scrollX: 0, // Ensure the entire content is captured
      scrollY: 0,
      windowWidth: document.documentElement.scrollWidth, // Capture the full width of the content
      windowHeight: document.documentElement.scrollHeight // Capture the full height of the content
    },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().from(element).set(opt).save();
}