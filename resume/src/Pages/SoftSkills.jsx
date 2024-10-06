// import { PDFDocument, rgb } from 'pdf-lib';
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import "./css/soft.css"

// const SoftSkills = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   let { yPosition = 0, pageIndex } = location.state || {};

//   const [softSkills, setSoftSkills] = useState([{ name: '', description: '' }]);

//   // Handler for input change
//   const handleInputChange = (index, event) => {
//     const { name, value } = event.target;
//     const newSoftSkills = [...softSkills];
//     newSoftSkills[index][name] = value;
//     setSoftSkills(newSoftSkills);
//   };

//   // Add more soft skill fields
//   const handleAddMoreSkill = () => {
//     setSoftSkills([...softSkills, { name: '', description: '' }]);
//   };

//   // Function to measure text width
//   const measureTextWidth = async (text, font, fontSize) => {
//     return font.widthOfTextAtSize(text, fontSize);
//   };

//   // Function to draw text with wrapping and return the new yPosition
//   const drawWrappedText = async (text, x, y, font, fontSize, maxWidth, page) => {
//     const words = text.split(' ');
//     let currentLine = '';
//     let currentY = y;
//     let lineHeight = 15;

//     for (const word of words) {
//       const testLine = currentLine + word + ' ';
//       const textWidth = await measureTextWidth(testLine, font, fontSize);

//       if (textWidth > maxWidth && currentLine) {
//         // Draw the current line and reset it
//         page.drawText(currentLine, { x, y: currentY, size: fontSize, font, color: rgb(0, 0, 0) });
//         currentLine = word + ' ';
//         currentY -= lineHeight; // Move down for the next line
//       } else {
//         currentLine = testLine;
//       }
//     }

//     // Draw any remaining text
//     if (currentLine) {
//       page.drawText(currentLine, { x, y: currentY, size: fontSize, font, color: rgb(0, 0, 0) });
//     }
    
//     // Return the new yPosition after drawing the text
//     return currentY - lineHeight; // Subtract line height for spacing
//   };

//   // Function to handle PDF modification and save
//   const handleAddSoftSkillsToPDF = async () => {
//     try {
//       const response = await axios.get('http://localhost:4000/public/resume.pdf', {
//         responseType: 'arraybuffer',
//       });
//       const existingPdfBytes = response.data;
//       const pdfDoc = await PDFDocument.load(existingPdfBytes);
//       let page = pdfDoc.getPage(pageIndex);
//       const fontBold = await pdfDoc.embedFont('Helvetica-Bold');
//       const fontRegular = await pdfDoc.embedFont('Helvetica');

//       const textX = 40;
//       let textY = yPosition - 20; // Starting position from the previous section
//       const fontSize = 11;
//       const marginBottom = 40;
//       const rightMargin = 40; // Margin from the right edge of the page
//       const maxWidth = page.getWidth() - textX - rightMargin; // Maximum width for the text

//       // Helper function to add a new page if needed
//       const addNewPage = () => {
//         pageIndex += 1;
//         const newPage = pdfDoc.addPage([page.getWidth(), page.getHeight()]);
//         return newPage;
//       };

//       // Add the Soft Skills heading
//       if (textY < marginBottom) {
//         page = addNewPage();
//         textY = page.getHeight() - 60; // Reset textY for the new page
//       }

//       page.drawText('SOFT SKILLS', {
//         x: textX,
//         y: textY,
//         size: 16,
//         font: fontBold,
//         color: rgb(0.32, 0.32, 0.32),
//       });

//       textY -= 5; // Move down for the line
//       page.drawLine({
//         start: { x: textX, y: textY },
//         end: { x: page.getWidth() - rightMargin, y: textY },
//         thickness: 4.5,
//         color: rgb(0.32, 0.32, 0.32),
//       });

//       // Add each soft skill to the PDF
//       for (const { name, description } of softSkills) {
//          // Move down for the next skill
//         if (textY < marginBottom) {
//           page = addNewPage();
//           textY = page.getHeight() - 60; // Reset textY for the new page
//         }
        
//         // Draw name
//         textY = await drawWrappedText(`${name}: `, textX, textY, fontBold, fontSize, maxWidth, page);
        
//         // Draw description
//         textY = await drawWrappedText(description, textX, textY, fontRegular, fontSize, maxWidth, page);
//       }

//       // Save the updated PDF
//       const pdfBytes = await pdfDoc.save();
//       const blob = new Blob([pdfBytes], { type: 'application/pdf' });
//       const formData = new FormData();
//       formData.append('file', blob, 'resume.pdf');

//       await axios.post('http://localhost:4000/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       navigate("/page/hobbies", { state: { yPosition: textY, pageIndex: pageIndex } });

//     } catch (error) {
//       console.error('Error updating the PDF:', error);
//       alert('Failed to update the resume.');
//     }
//   };

//   return (
//     <div>
//       <h2>Add Soft Skills to Resume</h2>
//       {softSkills.map((skill, index) => (
//         <div key={index} style={{ display: 'flex', marginBottom: '8px' }}>
//           <input
//             type="text"
//             name="name"
//             value={skill.name}
//             placeholder="Skill Name (e.g., Team Collaboration)"
//             onChange={(event) => handleInputChange(index, event)}
//             style={{ marginRight: '8px', width: '200px' }}
//           />
//           <input
//             type="text"
//             name="description"
//             value={skill.description}
//             placeholder="Description (e.g., Experience working in teams)"
//             onChange={(event) => handleInputChange(index, event)}
//             style={{ marginRight: '8px', width: '300px' }}
//           />
//         </div>
//       ))}
//       <button onClick={handleAddMoreSkill}>Add More Skill</button>
//       <button onClick={handleAddSoftSkillsToPDF}>Add Soft Skills to PDF</button>
//     </div>
//   );
// };

// export default SoftSkills;


import { PDFDocument, rgb } from 'pdf-lib';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./css/soft.css";

const SoftSkills = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let { yPosition = 0, pageIndex } = location.state || {};

  const [softSkills, setSoftSkills] = useState([{ name: '', description: '' }]);

  // Handler for input change
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newSoftSkills = [...softSkills];
    newSoftSkills[index][name] = value;
    setSoftSkills(newSoftSkills);
  };

  // Add more soft skill fields
  const handleAddMoreSkill = () => {
    setSoftSkills([...softSkills, { name: '', description: '' }]);
  };

  // Function to measure text width
  const measureTextWidth = async (text, font, fontSize) => {
    return font.widthOfTextAtSize(text, fontSize);
  };

  // Function to draw text with wrapping and return the new yPosition
  const drawWrappedText = async (text, x, y, font, fontSize, maxWidth, page) => {
    const words = text.split(' ');
    let currentLine = '';
    let currentY = y;
    let lineHeight = 15;

    for (const word of words) {
      const testLine = currentLine + word + ' ';
      const textWidth = await measureTextWidth(testLine, font, fontSize);

      if (textWidth > maxWidth && currentLine) {
        // Draw the current line and reset it
        page.drawText(currentLine, { x, y: currentY, size: fontSize, font, color: rgb(0, 0, 0) });
        currentLine = word + ' ';
        currentY -= lineHeight; // Move down for the next line
      } else {
        currentLine = testLine;
      }
    }

    // Draw any remaining text
    if (currentLine) {
      page.drawText(currentLine, { x, y: currentY, size: fontSize, font, color: rgb(0, 0, 0) });
    }
    
    // Return the new yPosition after drawing the text
    return currentY - lineHeight; // Subtract line height for spacing
  };

  // Function to handle PDF modification and save
  const handleAddSoftSkillsToPDF = async () => {
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
      let textY = yPosition - 20; // Starting position from the previous section
      const fontSize = 9;
      const marginBottom = 40;
      const rightMargin = 40; // Margin from the right edge of the page
      const maxWidth = page.getWidth() - textX - rightMargin; // Maximum width for the text

      // Helper function to add a new page if needed
      const addNewPage = () => {
        pageIndex += 1;
        const newPage = pdfDoc.addPage([page.getWidth(), page.getHeight()]);
        return newPage;
      };

      // Add the Soft Skills heading
      if (textY < marginBottom) {
        page = addNewPage();
        textY = page.getHeight() - 60; // Reset textY for the new page
      }

      page.drawText('SOFT SKILLS', {
        x: textX,
        y: textY,
        size: 16,
        font: fontBold,
        color: rgb(0.32, 0.32, 0.32),
      });

      textY -= 5; // Move down for the line
      page.drawLine({
        start: { x: textX, y: textY },
        end: { x: page.getWidth() - rightMargin, y: textY },
        thickness: 4.5,
        color: rgb(0.32, 0.32, 0.32),
      });
textY-=15
      // Add each soft skill to the PDF
      for (const { name, description } of softSkills) {
        // Move down for the next skill
        if (textY < marginBottom) {
          page = addNewPage();
          textY = page.getHeight() - 60; // Reset textY for the new page
        }
        
        // Draw name with specified color and bold font
        const skillNameText = `${name}: `;
        textY = await drawWrappedText(skillNameText, textX, textY, fontBold, fontSize, maxWidth, page);

        // Draw description in regular font
        const skillDescriptionText = description;
        textY = await drawWrappedText(skillDescriptionText, textX + await measureTextWidth(skillNameText, fontBold, fontSize), textY+15, fontRegular, fontSize, maxWidth - await measureTextWidth(skillNameText, fontBold, fontSize), page);
      }

      // Save the updated PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('file', blob, 'resume.pdf');

      await axios.post('http://localhost:4000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate("/page/hobbies", { state: { yPosition: textY, pageIndex: pageIndex } });

    } catch (error) {
      console.error('Error updating the PDF:', error);
      alert('Failed to update the resume.');
    }
  };

  return (
    <div className="soft-skills-container">
      <h2 className="soft-skills-title">Add Soft Skills to Resume</h2>
      {softSkills.map((skill, index) => (
        <div key={index} className="soft-skill-input">
          <input
            type="text"
            name="name"
            value={skill.name}
            placeholder="Skill Name (e.g., Team Collaboration)"
            onChange={(event) => handleInputChange(index, event)}
            className="skill-input"
          />
          <input
            type="text"
            name="description"
            value={skill.description}
            placeholder="Description (e.g., Experience working in teams)"
            onChange={(event) => handleInputChange(index, event)}
            className="description-input"
          />
        </div>
      ))}
      <button onClick={handleAddMoreSkill} className="add-skill-button">Add More Skill</button>
      <button onClick={handleAddSoftSkillsToPDF} className="add-skill-button">Add Soft Skills to PDF</button>
    </div>
  );
};

export default SoftSkills;
