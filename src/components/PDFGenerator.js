import React from 'react';
import jsPDF from 'jspdf';

const PDFGenerator = ({ content, title = 'AI Generated Content' }) => {
  const generatePDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    
    // Add title
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text(title, margin, 30);
    
    // Add date
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    const date = new Date().toLocaleDateString();
    pdf.text(`Generated on: ${date}`, margin, 45);
    
    // Add content
    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(content, maxWidth);
    
    let yPosition = 60;
    const lineHeight = 7;
    
    lines.forEach((line) => {
      if (yPosition + lineHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
    
    // Save the PDF
    pdf.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  return (
    <button 
      onClick={generatePDF} 
      className="btn btn-primary"
      style={{ marginRight: '8px' }}
    >
      📄 Download PDF
    </button>
  );
};

export default PDFGenerator;
