// import { PDFDocument, rgb } from 'pdf-lib';
// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import "./css/exp.css"
// const sanitizeText = (text) => {
//   return text
//     .replace(/[^\x00-\x7F]+/g, '') // Remove non-ASCII characters
//     .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
//     .trim(); // Trim leading and trailing spaces
// };

// const Experience = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { yPosition } = location.state || {};

//   const [experiences, setExperiences] = useState([
//     {
//       companyName: '',
//       designation: '',
//       timePeriod: '',
//       roleDescription: '',
//       projectRole: '',
//       technology: '',
//       projectDescription: ''
//     }
//   ]);

//   const handleInputChange = (index, event) => {
//     const { name, value } = event.target;
//     const newExperiences = [...experiences];
//     newExperiences[index][name] = value;
//     setExperiences(newExperiences);
//   };

//   const handleAddMoreExperience = () => {
//     setExperiences([...experiences, {
//       companyName: '',
//       designation: '',
//       timePeriod: '',
//       roleDescription: '',
//       projectRole: '',
//       technology: '',
//       projectDescription: ''
//     }]);
//   };

//   const handleSkip = () => {
//     // Skip to the next section without changing yPosition
//     navigate('/page/certification', { state: { yPosition, pageIndex: 0 } });
//   };

//   const handleAddTextToPDF = async () => {
//     try {
//       const response = await axios.get('http://localhost:4000/public/resume.pdf', {
//         responseType: 'arraybuffer',
//       });
//       const existingPdfBytes = response.data;
//       const pdfDoc = await PDFDocument.load(existingPdfBytes);
//       let pageIndex = 0;
//       let page = pdfDoc.getPage(pageIndex);
//       const fontBold = await pdfDoc.embedFont('Helvetica-Bold');
//       const fontRegular = await pdfDoc.embedFont('Helvetica');
  
//       const textX = 40;
//       let textY = yPosition - 20;
//       const fontSize = 11;
//       const lineHeight = 15;
//       const pageWidth = page.getWidth();
//       const pageHeight = page.getHeight();
//       const maxWidth = 570;
//       const marginBottom = 40;

//       const addNewPage = () => {
//         const newPage = pdfDoc.addPage([page.getWidth(), pageHeight]);
//         return newPage;
//       };

//       const adjustYPosition = () => {
//         textY -= lineHeight;
//         if (textY < marginBottom) {
//           pageIndex += 1;
//           if (pageIndex < pdfDoc.getPageCount()) {
//             page = pdfDoc.getPage(pageIndex);
//           } else {
//             page = addNewPage();
//           }
//           textY = pageHeight - 40;
//         }
//       };

//       const wrapText = (text, maxWidth, font) => {
//         const words = text.split(' ');
//         let lines = [];
//         let currentLine = '';

//         words.forEach((word, index) => {
//           while (font.widthOfTextAtSize(word, fontSize) > maxWidth) {
//             const part = word.substring(0, Math.floor(maxWidth / fontSize));
//             currentLine += currentLine ? ` ${part}-` : `${part}-`;
//             word = word.substring(part.length);
//           }

//           const testLine = currentLine ? `${currentLine} ${word}` : word;
//           const testWidth = font.widthOfTextAtSize(testLine, fontSize);

//           if (testWidth <= maxWidth) {
//             currentLine = testLine;
//           } else {
//             lines.push(padLine(currentLine, maxWidth, font, fontSize));
//             currentLine = word;
//           }
//         });

//         if (currentLine) {
//           lines.push(currentLine);
//         }

//         return lines;
//       };

//       const padLine = (line, maxWidth, font, fontSize) => {
//         const lineWidth = font.widthOfTextAtSize(line, fontSize);
//         const spacesNeeded = maxWidth - lineWidth;

//         const padding = ' '.repeat(Math.floor(spacesNeeded / fontSize));
//         return line + padding;
//       };

//       if (textY < marginBottom) {
//         page = addNewPage();
//         textY = pageHeight - 40;
//       }

//       page.drawText('EXPERIENCE', {
//         x: textX,
//         y: textY,
//         size: 16,
//         font: fontBold,
//         color: rgb(0.32, 0.32, 0.32),
//       });

//       textY -= 5;
//       page.drawLine({
//         start: { x: textX, y: textY },
//         end: { x: maxWidth, y: textY },
//         thickness: 4.5,
//         color: rgb(0.32, 0.32, 0.32),
//       });

//       experiences.forEach((experience) => {

//         adjustYPosition();
//         page.drawText(`Company Name: ${experience.companyName}`, { x: textX, y: textY, size: fontSize, font: fontBold, color: rgb(0, 0, 0) });
       
//         adjustYPosition();
//         page.drawText(`Designation: ${experience.designation}  | `, {
//           x: textX,
//           y: textY,
//           size: 10,
//           font: fontBold,
//           color: rgb(0.32, 0.32, 0.32)
//         });

//         const designationWidth = fontBold.widthOfTextAtSize(`Designation: ${experience.designation}`, 10);
//         const paddingBetweenTexts = 20;
      
//         page.drawText(`Time Period: ${experience.timePeriod}`, {
//           x: textX + designationWidth + paddingBetweenTexts,
//           y: textY,
//           size: 10,
//           font: fontBold,
//           color: rgb(0.32, 0.32, 0.32)
//         });
//         const sanitizedExp = sanitizeText(experience.roleDescription);
//         if (experience.roleDescription) {
//           const lines = wrapText(sanitizedExp, maxWidth - textX, fontRegular);
//           lines.forEach((line) => {
//             adjustYPosition();
//             page.drawText(line, { x: textX, y: textY, size: fontSize, font: fontRegular, color: rgb(0, 0, 0) });
//           });
//         }

//         if (experience.projectRole) {
//           adjustYPosition();
//           page.drawText('Project Role:', {
//             x: textX,
//             y: textY,
//             size: fontSize,
//             font: fontBold,
//             color: rgb(0.32, 0.32, 0.32),
//           });

//           const labelWidth = fontBold.widthOfTextAtSize('Project Role:', fontSize);
//           const textXPosition = textX + labelWidth + 5;

//           const lines = wrapText(experience.projectRole, maxWidth - textXPosition, fontRegular);
//           lines.forEach((line) => {
//             page.drawText(line, { x: textXPosition, y: textY, size: fontSize, font: fontRegular, color: rgb(0, 0, 0) });
//           });
//         }
//         const sanitizedTech = sanitizeText(experience.technology);
//         if (experience.technology) {
//           adjustYPosition();
//           page.drawText('Technology:', {
//             x: textX,
//             y: textY,
//             size: fontSize,
//             font: fontBold,
//             color: rgb(0.32, 0.32, 0.32),
//           });

//           const labelWidth = fontBold.widthOfTextAtSize('Technology:', fontSize);
//           const textXPosition = textX + labelWidth + 5;

//           const lines = wrapText(sanitizedTech, maxWidth - textXPosition, fontRegular);
//           lines.forEach((line) => {
//             page.drawText(line, { x: textXPosition, y: textY, size: fontSize, font: fontRegular, color: rgb(0, 0, 0) });
//           });
//         }
//         const sanitizedPD = sanitizeText(experience.projectDescription);
//         if (experience.projectDescription) {
//           const lines = wrapText(sanitizedPD, maxWidth - textX, fontRegular);
//           lines.forEach((line) => {
//             adjustYPosition();
//             page.drawText(line, { x: textX, y: textY, size: fontSize, font: fontRegular, color: rgb(0, 0, 0) });
//           });
//         }

        
//       });

//       const pdfBytes = await pdfDoc.save();
//       const blob = new Blob([pdfBytes], { type: 'application/pdf' });
//       const formData = new FormData();
//       formData.append('file', blob, 'updated_resume.pdf');

//       await axios.post('http://localhost:4000/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       navigate('/page/certification', { state: { yPosition: textY, pageIndex } });
//     } catch (error) {
//       console.error('Error updating the PDF:', error);
//       alert('Failed to update the resume.');
//     }
//   };

//   return (
//     <div>
//       <h2>Add Experience to Resume</h2>
//       {experiences.map((experience, index) => (
//         <div key={index}>
//           <label>Company Name</label>
//           <input
//             type="text"
//             name="companyName"
//             value={experience.companyName}
//             placeholder="e.g. Company ABC"
//             onChange={(event) => handleInputChange(index, event)}
//           />

//           <label>Designation</label>
//           <input
//             type="text"
//             name="designation"
//             value={experience.designation}
//             placeholder="e.g. Software Engineer"
//             onChange={(event) => handleInputChange(index, event)}
//           />

//           <label>Time Period</label>
//           <input
//             type="text"
//             name="timePeriod"
//             value={experience.timePeriod}
//             placeholder="e.g. Jan 2020 - Dec 2021"
//             onChange={(event) => handleInputChange(index, event)}
//           />

//           <label>Role Description</label>
//           <textarea
//             name="roleDescription"
//             value={experience.roleDescription}
//             placeholder="Describe your role here..."
//             onChange={(event) => handleInputChange(index, event)}
//           />

//           <label>Project Role</label>
//           <input
//             name="projectRole"
//             value={experience.projectRole}
//             placeholder="Describe your role in the project..."
//             onChange={(event) => handleInputChange(index, event)}
//           />

//           <label>Technology</label>
//           <input
//             name="technology"
//             value={experience.technology}
//             placeholder="e.g. React, Node.js, MongoDB"
//             onChange={(event) => handleInputChange(index, event)}
//           />

//           <label>Project Description</label>
//           <textarea
//             name="projectDescription"
//             value={experience.projectDescription}
//             placeholder="Describe the project..."
//             onChange={(event) => handleInputChange(index, event)}
//           />
//         </div>
//       ))}

//       <button onClick={handleAddMoreExperience}>Add More Experience</button>
//       <button onClick={handleAddTextToPDF}>Next</button>
//       <button onClick={handleSkip}>Skip</button>
//     </div>
//   );
// };

// export default Experience;


// import { PDFDocument, rgb } from 'pdf-lib';
// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import "./css/exp.css";

// const sanitizeText = (text) => {
//   return text
//     .replace(/[^\x00-\x7F]+/g, '') // Remove non-ASCII characters
//     .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
//     .trim(); // Trim leading and trailing spaces
// };

// const drawWrappedText = (pdfDoc, page, text, x, y, font, fontSize, maxWidth, lineHeight) => {
//   text = String(text);
//   const pageWidth = 612;
//   const pageHeight = 792;
//   const bottomMargin = 40;

//   const lines = [];
//   let currentLine = '';
//   let totalWidth = 0;

//   const chars = Array.from(text); // Separate the text into individual characters

//   for (let char of chars) {
//     const charWidth = font.widthOfTextAtSize(char, fontSize);

//     // If adding the next character exceeds the maxWidth, push the current line and reset
//     if (totalWidth + charWidth > maxWidth) {
//       lines.push(currentLine);
//       currentLine = char; // Start a new line with the current character
//       totalWidth = charWidth; // Reset totalWidth to the width of the current character
//     } else {
//       currentLine += char; // Add character to the current line
//       totalWidth += charWidth; // Update the total width of the current line
//     }
//   }

//   if (currentLine) {
//     lines.push(currentLine); // Push the last line if it exists
//   }

//   for (let i = 0; i < lines.length; i++) {
//     const lineText = lines[i];

//     if (y - lineHeight < bottomMargin) {
//       const newPage = pdfDoc.addPage([pageWidth, pageHeight]);
//       page = newPage;
//       y = pageHeight - 40; // Reset y
//     }

//     page.drawText(lineText, { x, y: y - (lineHeight * i), size: fontSize, font, color: rgb(0, 0, 0) });
//   }
// };

// const Experience = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { yPosition } = location.state || {};

//   const [experiences, setExperiences] = useState([{
//     companyName: '',
//     designation: '',
//     timePeriod: '',
//     roleDescription: '',
//     projectRole: '',
//     technology: '',
//     projectDescription: ''
//   }]);

//   const handleInputChange = (index, event) => {
//     const { name, value } = event.target;
//     const newExperiences = [...experiences];
//     newExperiences[index][name] = value;
//     setExperiences(newExperiences);
//   };

//   const handleAddMoreExperience = () => {
//     setExperiences([...experiences, {
//       companyName: '',
//       designation: '',
//       timePeriod: '',
//       roleDescription: '',
//       projectRole: '',
//       technology: '',
//       projectDescription: ''
//     }]);
//   };

//   const handleSkip = () => {
//     navigate('/page/certification', { state: { yPosition, pageIndex: 0 } });
//   };

//   const handleAddTextToPDF = async () => {
//     try {
//       const response = await axios.get('http://localhost:4000/public/resume.pdf', { responseType: 'arraybuffer' });
//       const existingPdfBytes = response.data;
//       const pdfDoc = await PDFDocument.load(existingPdfBytes);
//       let pageIndex = 0;
//       let page = pdfDoc.getPage(pageIndex);
//       const fontBold = await pdfDoc.embedFont('Helvetica-Bold');
//       const fontRegular = await pdfDoc.embedFont('Helvetica');

//       const textX = 40;
//       let textY = yPosition - 20;
//       const fontSize = 9;
//       const lineHeight = 15;
//       const maxWidth = 570;
//       const marginBottom = 40;

//       const addNewPage = () => {
//         const newPage = pdfDoc.addPage([page.getWidth(), page.getHeight()]);
//         return newPage;
//       };

//       const adjustYPosition = () => {
//         textY -= lineHeight;
//         if (textY < marginBottom) {
//           pageIndex += 1;
//           if (pageIndex < pdfDoc.getPageCount()) {
//             page = pdfDoc.getPage(pageIndex);
//           } else {
//             page = addNewPage();
//           }
//           textY = page.getHeight() - 40;
//         }
//       };

//       if (textY < marginBottom) {
//         page = addNewPage();
//         textY = page.getHeight() - 40;
//       }

//       page.drawText('EXPERIENCE', {
//         x: textX,
//         y: textY,
//         size: 16,
//         font: fontBold,
//         color: rgb(0.32, 0.32, 0.32),
//       });

//       textY -= 5;
//       page.drawLine({
//         start: { x: textX, y: textY },
//         end: { x: maxWidth, y: textY },
//         thickness: 4.5,
//         color: rgb(0.32, 0.32, 0.32),
//       });

//       experiences.forEach((experience) => {
//         adjustYPosition();
//         page.drawText(`Company Name: ${experience.companyName}`, { x: textX, y: textY, size: fontSize, font: fontBold, color: rgb(0, 0, 0) });

//         adjustYPosition();
//         page.drawText(`Designation: ${experience.designation}  | `, {
//           x: textX,
//           y: textY,
//           size: 10,
//           font: fontBold,
//           color: rgb(0.32, 0.32, 0.32)
//         });

//         const designationWidth = fontBold.widthOfTextAtSize(`Designation: ${experience.designation}`, 10);
//         const paddingBetweenTexts = 20;

//         page.drawText(`Time Period: ${experience.timePeriod}`, {
//           x: textX + designationWidth + paddingBetweenTexts,
//           y: textY,
//           size: 10,
//           font: fontBold,
//           color: rgb(0.32, 0.32, 0.32)
//         });

//         const sanitizedExp = sanitizeText(experience.roleDescription);
//         if (experience.roleDescription) {
//           adjustYPosition();
//           drawWrappedText(pdfDoc, page, sanitizedExp, textX, textY, fontRegular, fontSize, maxWidth - textX, lineHeight);
          
//         }
//         adjustYPosition();
//         if (experience.projectRole) {
          
//           page.drawText('Project Role:', {
//             x: textX,
//             y: textY,
//             size: fontSize,
//             font: fontBold,
//             color: rgb(0.32, 0.32, 0.32),
//           });

//           const labelWidth = fontBold.widthOfTextAtSize('Project Role:', fontSize);
//           const textXPosition = textX + labelWidth + 5;

//           drawWrappedText(pdfDoc, page, experience.projectRole, textXPosition, textY, fontRegular, fontSize, maxWidth - textXPosition, lineHeight);
//           adjustYPosition();
//         }

//         const sanitizedTech = sanitizeText(experience.technology);
//         if (experience.technology) {
//           adjustYPosition();
//           page.drawText('Technology:', {
//             x: textX,
//             y: textY,
//             size: fontSize,
//             font: fontBold,
//             color: rgb(0.32, 0.32, 0.32),
//           });

//           const labelWidth = fontBold.widthOfTextAtSize('Technology:', fontSize);
//           const textXPosition = textX + labelWidth + 5;

//           drawWrappedText(pdfDoc, page, sanitizedTech, textXPosition, textY, fontRegular, fontSize, maxWidth - textXPosition, lineHeight);
//           adjustYPosition();
//         }

//         const sanitizedPD = sanitizeText(experience.projectDescription);
//         if (experience.projectDescription) {
//           drawWrappedText(pdfDoc, page, sanitizedPD, textX, textY, fontRegular, fontSize, maxWidth - textX, lineHeight);
//           adjustYPosition();
//         }
//       });

//       const pdfBytes = await pdfDoc.save();
//       const blob = new Blob([pdfBytes], { type: 'application/pdf' });
//       const formData = new FormData();
//       formData.append('file', blob, 'updated_resume.pdf');

//       await axios.post('http://localhost:4000/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       navigate('/page/certification', { state: { yPosition: textY, pageIndex } });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <h1>Experience</h1>
//       {experiences.map((experience, index) => (
//         <div key={index}>
//           <input
//             name="companyName"
//             value={experience.companyName}
//             onChange={(event) => handleInputChange(index, event)}
//             placeholder="Company Name"
//           />
//           <input
//             name="designation"
//             value={experience.designation}
//             onChange={(event) => handleInputChange(index, event)}
//             placeholder="Designation"
//           />
//           <input
//             name="timePeriod"
//             value={experience.timePeriod}
//             onChange={(event) => handleInputChange(index, event)}
//             placeholder="Time Period"
//           />
//           <textarea
//             name="roleDescription"
//             value={experience.roleDescription}
//             onChange={(event) => handleInputChange(index, event)}
//             placeholder="Role Description"
//           />
//           <input
//             name="projectRole"
//             value={experience.projectRole}
//             onChange={(event) => handleInputChange(index, event)}
//             placeholder="Project Role"
//           />
//           <input
//             name="technology"
//             value={experience.technology}
//             onChange={(event) => handleInputChange(index, event)}
//             placeholder="Technology"
//           />
//           <textarea
//             name="projectDescription"
//             value={experience.projectDescription}
//             onChange={(event) => handleInputChange(index, event)}
//             placeholder="Project Description"
//           />
//         </div>
//       ))}
//       <button onClick={handleAddMoreExperience}>Add More Experience</button>
//       <button onClick={handleAddTextToPDF}>Generate PDF</button>
//       <button onClick={handleSkip}>Skip</button>
//     </div>
//   );
// };

// export default Experience;


import { PDFDocument, rgb } from 'pdf-lib';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./css/exp.css";

const sanitizeText = (text) => {
  return text
    .replace(/[^\x00-\x7F]+/g, '') // Remove non-ASCII characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .trim(); // Trim leading and trailing spaces
};

const drawWrappedText = (pdfDoc, page, text, x, y, font, fontSize, maxWidth, lineHeight) => {
  text = String(text);
  const lines = [];
  let currentLine = '';
  let totalWidth = 0;

  const chars = Array.from(text); // Separate the text into individual characters

  for (let char of chars) {
    const charWidth = font.widthOfTextAtSize(char, fontSize);

    // If adding the next character exceeds the maxWidth, push the current line and reset
    if (totalWidth + charWidth > maxWidth) {
      lines.push(currentLine);
      currentLine = char; // Start new line with current character
      totalWidth = charWidth; // Reset totalWidth to current character's width
    } else {
      currentLine += char; // Add character to current line
      totalWidth += charWidth; // Update totalWidth
    }
  }

  // Push the last line if it's not empty
  if (currentLine) {
    lines.push(currentLine);
  }

  // Draw lines on the PDF
  lines.forEach((line, index) => {
    page.drawText(line, {
      x,
      y: y - index * lineHeight,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  });

  return y - lines.length * lineHeight; // Return the new y position after drawing
};

const Experience = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { yPosition } = location.state || {};

  const [experiences, setExperiences] = useState([{
    companyName: '',
    designation: '',
    timePeriod: '',
    roleDescription: '',
    projectRole: '',
    technology: '',
    projectDescription: ''
  }]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newExperiences = [...experiences];
    newExperiences[index][name] = value;
    setExperiences(newExperiences);
  };

  const handleAddMoreExperience = () => {
    setExperiences([...experiences, {
      companyName: '',
      designation: '',
      timePeriod: '',
      roleDescription: '',
      projectRole: '',
      technology: '',
      projectDescription: ''
    }]);
  };

  const handleSkip = () => {
    navigate('/page/certification', { state: { yPosition, pageIndex: 0 } });
  };

  const handleAddTextToPDF = async () => {
    try {
      const response = await axios.get('http://localhost:4000/public/resume.pdf', { responseType: 'arraybuffer' });
      const existingPdfBytes = response.data;
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      let pageIndex = 0;
      let page = pdfDoc.getPage(pageIndex);
      const fontBold = await pdfDoc.embedFont('Helvetica-Bold');
      const fontRegular = await pdfDoc.embedFont('Helvetica');
  
      const textX = 40;
      let textY = yPosition - 20;
      const fontSize = 9;
      const lineHeight = 15;
      const maxWidth = 530;

      const adjustYPosition = () => {
        textY -= lineHeight;
        if (textY < 40) { // Adjust to add a new page if necessary
          pageIndex += 1;
          if (pageIndex < pdfDoc.getPageCount()) {
            page = pdfDoc.getPage(pageIndex);
          } else {
            page = pdfDoc.addPage([612,792]);
          }
          textY = page.getHeight() - 40; // Reset y position to top of the new page
        }
      };

      page.drawText('EXPERIENCE', {
        x: textX,
        y: textY,
        size: 16,
        font: fontBold,
        color: rgb(0.32, 0.32, 0.32),
      });
      textY -= 5;
      page.drawLine({
        start: { x: textX, y: textY },
        end: { x: 572, y: textY },
        thickness: 4.5,
        color: rgb(0.32, 0.32, 0.32),
      });

      experiences.forEach((experience) => {
        // Adjust Y Position and Draw Company Name in Bold


// Draw Company Name in Regular Font
adjustYPosition();
textY = drawWrappedText(pdfDoc, page, `${experience.companyName}`, textX, textY, fontBold, fontSize, maxWidth, lineHeight-15);

// Adjust Y Position and Draw Designation in Bold


// Draw Designation in Regular Font
// Adjust Y Position
adjustYPosition();

let sanitizeDes=sanitizeText(experience.designation)
let sanitizePeriod=sanitizeText(experience.timePeriod)
// Prepare the text to draw both Designation and Time Period in one line
const combinedText = `${sanitizeDes}   |   ${sanitizePeriod}`;

// Draw the combined text in Regular Font
textY = drawWrappedText(pdfDoc, page, combinedText, textX, textY, fontBold, fontSize, maxWidth, lineHeight-15);

let sanitizeRole=sanitizeText(experience.roleDescription)
// Adjust Y Position
adjustYPosition();
textY=drawWrappedText(pdfDoc,page,`${sanitizeRole}`,textX,textY,fontRegular,fontSize,maxWidth,lineHeight)

textY+=15
// Draw "Project Role:" in Bold
// Adjust Y Position

adjustYPosition();

// Draw "Project Role:" in Bold
textY = drawWrappedText(pdfDoc, page, `Project Role:`, textX, textY, fontBold, fontSize, maxWidth, lineHeight - 15);

// Fixed padding for spacing
let padding = 10; // Adjust this value as needed

// Adjust X Position for the regular text
const projectRoleX = textX + 60 + padding; // Set a fixed width (90) for the label

// Draw the project role in Regular Font
let sanitizePR=sanitizeText(experience.projectRole)
textY = drawWrappedText(pdfDoc, page, `${sanitizePR}`, projectRoleX, textY, fontRegular, fontSize, maxWidth, lineHeight - 15);




// Adjust Y Position


// Draw "Technology:" in Bold
// Adjust Y Position
adjustYPosition();

// Draw "Technology:" in Bold
textY = drawWrappedText(pdfDoc, page, `Technology:`, textX, textY, fontBold, fontSize, maxWidth, lineHeight-15);

// Fixed padding for spacing
const projectTechX = textX + 50 + padding; // You can adjust this value
let sanitizeTech=sanitizeText(experience.technology)

// Draw the technology in Regular Font
textY = drawWrappedText(pdfDoc, page, `${sanitizeTech}`, projectTechX, textY, fontRegular, fontSize, maxWidth, lineHeight-15);





// Draw Time Period in Regular Font
adjustYPosition();
let sanitizePDS=sanitizeText(experience.projectDescription)
textY = drawWrappedText(pdfDoc, page, `${sanitizePDS}`, textX, textY, fontRegular, fontSize, maxWidth, lineHeight);
textY+=15
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('file', blob, 'updated_resume.pdf');

      await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/page/certification', { state: { yPosition: textY, pageIndex } });
    } catch (error) {
      console.error('Error updating the PDF:', error);
      alert('Failed to update the resume.');
    }
  };

  return (
    <div className="container-experience">
      <h2>Add Experience to Resume</h2>
      {experiences.map((experience, index) => (
        <div key={index}>
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={experience.companyName}
            placeholder="e.g. Company ABC"
            onChange={(event) => handleInputChange(index, event)}
          />
          
          <label>Designation</label>
          <input
            type="text"
            name="designation"
            value={experience.designation}
            placeholder="e.g. Software Engineer"
            onChange={(event) => handleInputChange(index, event)}
          />
          
          <label>Time Period</label>
          <input
            type="text"
            name="timePeriod"
            value={experience.timePeriod}
            placeholder="e.g. Jan 2020 - Dec 2021"
            onChange={(event) => handleInputChange(index, event)}
          />
          <p>Talk about the technologies you were trained in, how much you scored in the company's assessments, and your role within the company.</p>
          <label>Role Description</label>
          
          <textarea
            name="roleDescription"
            value={experience.roleDescription}
            placeholder="Describe your role here..."
            onChange={(event) => handleInputChange(index, event)}
          />

          <label>Project Role</label>
          <input
            type="text"
            name="projectRole"
            value={experience.projectRole}
            placeholder="Describe your role in the project..."
            onChange={(event) => handleInputChange(index, event)}
          />

          <label>Technology</label>
          <input
            type="text"
            name="technology"
            value={experience.technology}
            placeholder="e.g. React, Node.js, MongoDB"
            onChange={(event) => handleInputChange(index, event)}
          />
          <p>Describe your role in the project, how much work you contributed, any teamwork involved, and the achievements you accomplished while working on the project.</p>
          <label>Project Description</label>
          <textarea
            name="projectDescription"
            value={experience.projectDescription}
            placeholder="Describe the project..."
            onChange={(event) => handleInputChange(index, event)}
          />
        </div>
      ))}

      <button onClick={handleAddMoreExperience}>Add More Experience</button>
      <button onClick={handleAddTextToPDF}>Next</button>
      <button onClick={handleSkip}>Skip</button>
    </div>
  );
};

export default Experience;
