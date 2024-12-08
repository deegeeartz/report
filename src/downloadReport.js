// FILE: downloadReport.js
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function downloadReport() {
  const element = document.getElementById('report-container');
  
  // Hide video elements to avoid tainting issues
  const videos = element.querySelectorAll('video');
  videos.forEach(video => {
    video.style.display = 'none';
  });

  html2canvas(element, { scale: 2 }).then((canvas) => {
    // Restore video elements
    videos.forEach(video => {
      video.style.display = '';
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let position = 0;

    while (position < imgHeight) {
      const canvasPage = document.createElement('canvas');
      canvasPage.width = canvas.width;
      canvasPage.height = pdfHeight * (canvas.width / pdfWidth);

      const ctx = canvasPage.getContext('2d');
      ctx.drawImage(canvas, 0, position * (canvas.width / pdfWidth), canvas.width, canvasPage.height, 0, 0, canvas.width, canvasPage.height);

      const imgPageData = canvasPage.toDataURL('image/png');
      pdf.addImage(imgPageData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      position += canvasPage.height / (canvas.width / pdfWidth);
      if (position < imgHeight) {
        pdf.addPage();
      }
    }

    // Add clickable URLs for images and videos
    const links = element.querySelectorAll('a');
    links.forEach(link => {
      const rect = link.getBoundingClientRect();
      const x = rect.left * (pdfWidth / canvas.width);
      const y = rect.top * (imgHeight / canvas.height);
      const width = rect.width * (pdfWidth / canvas.width);
      const height = rect.height * (imgHeight / canvas.height);
      pdf.link(x, y, width, height, { url: link.href });
    });

    pdf.save('report.pdf');
  });
}