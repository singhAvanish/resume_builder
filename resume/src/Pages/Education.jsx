import { PDFDocument, rgb } from 'pdf-lib';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./css/education.css"

const Education = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { yPosition } = location.state || {};
  let { pageIndex } = location.state || {}; // Initialize pageIndex with 0 if not provided

  const [educations, setEducations] = useState([{ degree: '', institution: '', year: '' }]);

  // Handler for input change
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newEducations = [...educations];
    newEducations[index][name] = value;
    setEducations(newEducations);
  };

  // Add more education fields
  const handleAddMoreEducation = () => {
    setEducations([...educations, { degree: '', institution: '', year: '' }]);
  };

  // Function to handle PDF modification and save
  const handleAddTextToPDF = async () => {
    try {
      const response = await axios.get('http://localhost:4000/public/resume.pdf', {
        responseType: 'arraybuffer',
      });
      const existingPdfBytes = response.data;
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      let page = pdfDoc.getPage(pageIndex);
      const fontBold = await pdfDoc.embedFont('Helvetica-Bold');
      const fontRegular = await pdfDoc.embedFont('Helvetica');

      const textX = 40;
      let textY = yPosition ; // Starting position from the previous page
      const fontSize = 9;
      const lineHeight = 15;
      const marginBottom = 40;

      // Helper function to add a new page if needed
      const addNewPage = () => {
        pageIndex+=1
        const newPage = pdfDoc.addPage([page.getWidth(), page.getHeight()]);
        return newPage;
      };

      // Add the Education heading
      if (textY < marginBottom) {
        
        page = addNewPage();
        textY = page.getHeight() - 60; // Reset textY for the new page
      }

      // Draw Education heading
      page.drawText('EDUCATION', {
        x: textX,
        y: textY,
        size: 16,
        font: fontBold,
        color: rgb(0.32, 0.32, 0.32),
      });

      textY -= 5; // Move down for the line
      page.drawLine({
        start: { x: textX, y: textY },
        end: { x: page.getWidth() - 40, y: textY },
        thickness: 4.5,
        color: rgb(0.32, 0.32, 0.32),
      });

      // Add education entries to the PDF
      educations.forEach((education) => {
        textY -= lineHeight; // Move down for the next education entry
        if (textY < marginBottom) {
          // Add a new page when reaching the margin
          page = addNewPage();
          textY = page.getHeight() - 60; // Reset textY for the new page
        }
        const educationText = `• ${education.degree} (${education.institution}) - ${education.year}`;
        page.drawText(educationText, { x: textX, y: textY, size: fontSize, font: fontRegular, color: rgb(0, 0, 0) });
      });

      // Save the updated PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('file', blob, 'updated_resume.pdf');

      await axios.post('http://localhost:4000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Navigate to the next page, updating pageIndex accordingly
      navigate("/page/soft-skill", { state: { yPosition: textY, pageIndex: pageIndex } });

    } catch (error) {
      console.error('Error updating the PDF:', error);
      alert('Failed to update the resume.');
    }
  };

  return (
    <div className="container-education">
    <h2>Add Education to Resume</h2>
    {educations.map((education, index) => (
      <div key={index} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="degree"
          value={education.degree}
          placeholder="Degree (required)"
          onChange={(event) => handleInputChange(index, event)}
          required
          style={{ marginBottom: '8px', width: '300px' }}
        />
        <input
          type="text"
          name="institution"
          value={education.institution}
          placeholder="Institution (optional)"
          onChange={(event) => handleInputChange(index, event)}
          style={{ marginBottom: '8px', width: '200px' }}
        />
        <input
          type="text"
          name="year"
          value={education.year}
          placeholder="Year (optional)"
          onChange={(event) => handleInputChange(index, event)}
          style={{ marginBottom: '16px', width: '200px' }}
        />
      </div>
    ))}

    <button onClick={handleAddMoreEducation}>Add More Education</button>
    <button onClick={handleAddTextToPDF}>Add Education to PDF</button>
  </div>
  );
};

export default Education;
