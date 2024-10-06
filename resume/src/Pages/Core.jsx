import { PDFDocument, rgb } from 'pdf-lib';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./css/core.css"

const Core = () => {
  const location = useLocation(); // Get location object
  const navigate = useNavigate();
  const { yPosition } = location.state || {}; // Destructure yPosition from state

  const [skills, setSkills] = useState([{ typeOfSkill: '', techName: '' }]); // State to hold multiple skills

  // Function to handle input changes for dynamically added inputs
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newSkills = [...skills];
    newSkills[index][name] = value;
    setSkills(newSkills);
  };

  // Function to add new input fields for additional skill sets
  const handleAddMoreSkills = () => {
    setSkills([...skills, { typeOfSkill: '', techName: '' }]);
  };

  const handleAddTextToPDF = async () => {
    try {
      const response = await axios.get('https://resume-builder-r4hm.onrender.com/public/resume.pdf', {
        responseType: 'arraybuffer',
      });
      const existingPdfBytes = response.data;
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      let pageIndex=0;
      const page = pdfDoc.getPage(pageIndex);
      const fontBold = await pdfDoc.embedFont('Helvetica-Bold');
      const fontRegular = await pdfDoc.embedFont('Helvetica');

      const textX = 40;
      let textY = yPosition - 5;
      const fontSize = 9;
      const lineHeight = 15;

      // Add the core competency heading
      page.drawText('CORE COMPETENCY', {
        x: textX,
        y: textY,
        size: 16,
        font: fontBold,
        color: rgb(0.32, 0.32, 0.32),
      });

      // Draw a line after the heading
      textY-=5;
      page.drawLine({
        start: { x: textX, y: textY },
        end: { x: 572, y: textY },
        thickness: 4.5,
        color: rgb(0.32, 0.32, 0.32),
      });
       // Adjust Y position after the line

      // Loop through each skill set and add them to the PDF
      skills.forEach(async (skill) => {
        // Get the width of the TypeOfSkill text in bold
        const typeOfSkillWidth = fontBold.widthOfTextAtSize(skill.typeOfSkill + ':', fontSize);
        textY -= lineHeight;
        // Add TypeOfSkill as bold text
        page.drawText(`${skill.typeOfSkill}:`, {
          x: textX,
          y: textY,
          size: fontSize,
          font: fontBold, // Bold for the type of skill
          color: rgb(0.34, 0.34, 0.34),
        });

        // Add Technology Name as regular text, starting after TypeOfSkill
        page.drawText(skill.techName, {
          x: textX + typeOfSkillWidth + 5, // Add some padding (5) to space out techName after TypeOfSkill
          y: textY,
          size: fontSize,
          font: fontRegular, // Regular for the technology name
          color: rgb(0, 0, 0),
        });

         // Adjust Y position after each skill set
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

      navigate('/page/experience', { state: { yPosition: textY,pageIndex:pageIndex } }); // Navigate to the next page with the updated Y position
    } catch (error) {
      console.error('Error updating the PDF:', error);
      alert('Failed to update the resume.');
    }
  };

  return (
    <div className="container-core">
      <h2 className="add-core-header">Add Core Competency to Resume</h2>
      {skills.map((skill, index) => (
        <div className="skill-input-section" key={index}>
          <label className="skill-label">Type of Skill</label>
          <input
            className="skill-input"
            type="text"
            name="typeOfSkill"
            value={skill.typeOfSkill}
            placeholder="e.g. Programming Languages"
            onChange={(event) => handleInputChange(index, event)}
          />
          <label className="tech-label">Technology Name</label>
          <input
            className="tech-input"
            type="text"
            name="techName"
            value={skill.techName}
            placeholder="e.g. JAVA, SQL, JavaScript"
            onChange={(event) => handleInputChange(index, event)}
          />
        </div>
      ))}

      {/* Button to add more skills */}
      <button className="add-more-button" onClick={handleAddMoreSkills}>
        Add More Skills
      </button>
      
      {/* Button to add core competencies to the PDF */}
      <button className="add-core-button" onClick={handleAddTextToPDF}>
        Add Core Competency to PDF
      </button>
    </div>

  );
};

export default Core;
