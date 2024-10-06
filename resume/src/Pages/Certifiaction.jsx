import { PDFDocument, rgb } from 'pdf-lib';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./css/certification.css"
const Certification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { yPosition} = location.state || {};
  let {pageIndex=0}=location.state || {};

  const [certifications, setCertifications] = useState([{ name: '', issuer: '', date: '' }]);

  // Handler for input change
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newCertifications = [...certifications];
    newCertifications[index][name] = value;
    setCertifications(newCertifications);
  };

  // Add more certification fields
  const handleAddMoreCertification = () => {
    setCertifications([...certifications, { name: '', issuer: '', date: '' }]);
  };

  // Function to handle PDF modification and save
  const handleAddTextToPDF = async () => {
    try {
      const response = await axios.get('https://resume-builder-r4hm.onrender.com/public/resume.pdf', {
        responseType: 'arraybuffer',
      });
      const existingPdfBytes = response.data;
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      let page = pdfDoc.getPage(pageIndex);
      const fontBold = await pdfDoc.embedFont('Helvetica-Bold');
      const fontRegular = await pdfDoc.embedFont('Helvetica');
  
      const textX = 40;
      let textY = yPosition - 20; // Starting position from the Experience page
      const fontSize = 9;
      const lineHeight = 15;
      const marginBottom = 40;
  
      // Helper function to add a new page if needed
      const addNewPage = () => {
        const newPage = pdfDoc.addPage([page.getWidth(), page.getHeight()]);
        return newPage;
      };
  
      // Add the Certification heading
      if (textY < marginBottom) {
        page = addNewPage();
        textY = page.getHeight() - 60; // Reset textY for the new page
      }
  
      // Draw Certification heading
      page.drawText('CERTIFICATION', {
        x: textX,
        y: textY,
        size: 16,
        font: fontBold,
        color: rgb(0.32, 0.32, 0.32),
      });
  
      textY -= 5; // Move down for the line
      page.drawLine({
        start: { x: textX, y: textY },
        end: { x: page.getWidth() - 40, y: textY }, // Updated to use dynamic page width
        thickness: 4.5,
        color: rgb(0.32, 0.32, 0.32),
      });
  
      // Add certifications to the PDF
      certifications.forEach((certification) => {
        textY -= lineHeight; // Move down for the next certification
        if (textY < marginBottom) {
          // Add a new page when reaching the margin
          page = addNewPage();
          textY = page.getHeight() - 60; // Reset textY for the new page
        }
        const certificationText = `• ${certification.name} ${certification.issuer ? `(${certification.issuer})` : ''} ${certification.date ? `- ${certification.date}` : ''}`;
        page.drawText(certificationText, { x: textX, y: textY, size: fontSize, font: fontRegular, color: rgb(0, 0, 0) });
      });
  
      // Save the updated PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('file', blob, 'updated_resume.pdf');
  
      await axios.post(' https://resume-builder-r4hm.onrender.com/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      navigate("/page/acheivement", { state: { yPosition: textY ,pageIndex:pageIndex}  });
  
    } catch (error) {
      console.error('Error updating the PDF:', error);
      alert('Failed to update the resume.');
    }
  };
  

  return (
    <div className="container-certification">
      <h2>Add Certification to Resume</h2>
      {certifications.map((certification, index) => (
        <div key={index}>
          <input
            type="text"
            name="name"
            value={certification.name}
            placeholder="Certification Name (required)"
            onChange={(event) => handleInputChange(index, event)}
          />
          
          <input
            type="text"
            name="issuer"
            value={certification.issuer}
            placeholder="Issuer (optional)"
            onChange={(event) => handleInputChange(index, event)}
          />

          <input
            type="text"
            name="date"
            value={certification.date}
            placeholder="Date (optional)"
            onChange={(event) => handleInputChange(index, event)}
          />
        </div>
      ))}

      <button onClick={handleAddMoreCertification}>Add More Certification</button>
      <button onClick={handleAddTextToPDF}>Add Certification to PDF</button>
    </div>
  );
};

export default Certification;
