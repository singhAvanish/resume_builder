import { PDFDocument, rgb } from 'pdf-lib';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./css/acheivement.css";

const Achievement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { yPosition = 0 } = location.state || {}; // Default to 0 if not present
  let { pageIndex = 0 } = location.state || {};

  const [achievements, setAchievements] = useState([
    { name: '', issuer: '', date: '' }
  ]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newAchievements = [...achievements];
    newAchievements[index][name] = value;
    setAchievements(newAchievements);
  };

  const handleAddMoreAchievement = () => {
    setAchievements([...achievements, { name: '', issuer: '', date: '' }]);
  };

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
      let textY = yPosition - 20; // Use yPosition to start from the correct position
      const fontSize = 9;
      const lineHeight = 15; // Space for each line
      const pageHeight = page.getHeight();
      const marginBottom = 40; // Bottom margin threshold

      const addNewPage = () => {
        const newPage = pdfDoc.addPage([page.getWidth(), pageHeight]);
        return newPage;
      };

      // Function to check and adjust Y position
      const adjustYPosition = () => {
        textY -= lineHeight;
        if (textY < marginBottom) {
          pageIndex += 1;
          if (pageIndex < pdfDoc.getPageCount()) {
            page = pdfDoc.getPage(pageIndex); // Move to the next existing page
          } else {
            page = addNewPage(); // Create a new page if we run out of pages
          }
          textY = pageHeight - 60; // Reset textY for the new page
        }
      };

      // Add achievement heading
      if (textY < marginBottom) {
        page = addNewPage();
        textY = pageHeight - 60;
      }

      page.drawText('ACHIEVEMENTS', {
        x: textX,
        y: textY,
        size: 16,
        font: fontBold,
        color: rgb(0.32, 0.32, 0.32),
      });

      textY -= 5;
      page.drawLine({
        start: { x: textX, y: textY },
        end: { x: page.getWidth() - 40, y: textY },
        thickness: 4.5,
        color: rgb(0.32, 0.32, 0.32),
      });

      // Loop through achievements and add to PDF, checking space on each iteration
      achievements.forEach((achievement) => {
        adjustYPosition();
        const achievementText = `• ${achievement.name} ${achievement.issuer ? `(${achievement.issuer})` : ''} ${achievement.date ? `- ${achievement.date}` : ''}`;
        page.drawText(achievementText, { x: textX, y: textY, size: fontSize, font: fontRegular, color: rgb(0, 0, 0) });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('file', blob, 'updated_resume.pdf');

      await axios.post('https://resume-builder-r4hm.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update yPosition when navigating to the next section to track position across pages
      navigate('/page/project', { state: { yPosition: textY, pageIndex } });
    } catch (error) {
      console.error('Error updating the PDF:', error);
      alert('Failed to update the resume.');
    }
  };

  // Function for skipping to the next page without modifying yPosition or pageIndex
  const handleSkip = () => {
    navigate('/page/project', { state: { yPosition, pageIndex }}); // Navigate without changing values
  };

  return (
    <div className="container-achievements">
      <h2>Add Achievements to Resume</h2>
      {achievements.map((achievement, index) => (
        <div key={index}>
          <input
            type="text"
            name="name"
            value={achievement.name}
            placeholder="Achievement Name (required)"
            onChange={(event) => handleInputChange(index, event)}
            required
          />
          
          <input
            type="text"
            name="issuer"
            value={achievement.issuer}
            placeholder="Issuer (optional)"
            onChange={(event) => handleInputChange(index, event)}
          />

          <input
            type="text"
            name="date"
            value={achievement.date}
            placeholder="Date (optional)"
            onChange={(event) => handleInputChange(index, event)}
          />
        </div>
      ))}

      <button onClick={handleAddMoreAchievement}>Add More Achievement</button>
      <button onClick={handleAddTextToPDF}>Add Achievements to PDF</button>
      <button onClick={handleSkip}>Skip</button>
    </div>
  );
};

export default Achievement;
