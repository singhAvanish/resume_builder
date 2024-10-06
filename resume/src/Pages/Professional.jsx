




// import React, { useState } from 'react';
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './css/professional.css';

// const Professional = () => {
//   const [additionalText, setAdditionalText] = useState('');
//   const navigate = useNavigate(); // Initialize useNavigate

//   const handleChange = (e) => {
//     setAdditionalText(e.target.value);
//   };

//   // Function to sanitize text while maintaining spaces
//   const sanitizeText = (text) => {
//     return text
//       .replace(/[^\x00-\x7F]+/g, '') // Remove non-ASCII characters
//       .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
//       .trim(); // Trim leading and trailing spaces
//   };

//   const drawWrappedText = (page, text, x, y, font, fontSize, maxWidth, lineHeight) => {
//     const words = text.split(' ');
//     let line = '';
//     let lines = [];

//     for (let word of words) {
//       const testLine = line + word + ' ';
//       const testLineWidth = font.widthOfTextAtSize(testLine, fontSize);

//       if (testLineWidth > maxWidth) {
//         lines.push(line.trim());
//         line = word + ' ';
//       } else {
//         line = testLine;
//       }
//     }

//     if (line.trim()) {
//       lines.push(line.trim());
//     }

//     lines.forEach((lineText, index) => {
//       page.drawText(lineText, {
//         x: x,
//         y: y - index * lineHeight,
//         size: fontSize,
//         font: font,
//         color: rgb(0, 0, 0),
//       });
//     });

//     return y - lines.length * lineHeight;
//   };

//   const handleAddTextToPDF = async () => {
//     try {
//       const response = await axios.get('http://localhost:4000/public/resume.pdf', {
//         responseType: 'arraybuffer',
//       });
//       const existingPdfBytes = response.data;

//       const pdfDoc = await PDFDocument.load(existingPdfBytes);
//       const page = pdfDoc.getPage(0);

//       const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
//       const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

//       const textX = 40;
//       const textY = 530; // Initial y position
//       const fontSize = 11;
//       const maxWidth = 530; // Set maximum width for text wrapping
//       const lineHeight = 15; // Line spacing

//       // Sanitize the additionalText to avoid encoding issues
//       const cleanedText = sanitizeText(additionalText);

//       page.drawText('PROFESSIONAL SUMMARY', {
//         x: 40,
//         y: 550,
//         size: 16,
//         font: fontBold,
//         color: rgb(0.32, 0.32, 0.32),
//       });

//       page.drawLine({
//         start: { x: textX, y: 545 },
//         end: { x: 572, y: 545 },
//         thickness: 4.5,
//         color: rgb(0.32, 0.32, 0.32),
//       });

//       const newYPosition = drawWrappedText(page, cleanedText, textX, textY, fontRegular, fontSize, maxWidth, lineHeight);

//       // Save the modified PDF
//       const pdfBytes = await pdfDoc.save();
//       const blob = new Blob([pdfBytes], { type: 'application/pdf' });
//       const formData = new FormData();
//       formData.append('file', blob, 'updated_resume.pdf');

//       await axios.post('http://localhost:4000/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       // Navigate to Core component and send the yPosition as state
//       navigate('/page/core-competency', { state: { yPosition: newYPosition } });

//     } catch (error) {
//       console.error('Error updating the PDF:', error);
//       alert('Failed to update the resume.');
//     }
//   };

//   return (
//     <div className="container-prof">
//       <h2 className="tip-header">Tip: Do not use personal pronouns.</h2>
//       <p className="tip-description">
//         Start with your educational background, then talk about your experience and the technologies you have worked with. Explain how you have utilized those skills.
//       </p>
//       <p className="example-text">
//         Eg: A qualified Computer Engineer with a Master’s in Computer Application and one year of experience as a Programmer Trainee. Proficient in full-stack development and database management, with expertise in React, Node.js, and MongoDB. Capable of creating dynamic websites, data-driven applications, and e-commerce platforms. Skilled at developing scalable solutions, optimizing performance, and enhancing user experiences. Enthusiastic about tackling new challenges and innovating within the tech industry. Committed to learning and applying cutting-edge technologies to deliver impactful results.
//       </p>
//       <h2 className="add-text-header">Add Professional Text to Resume</h2>
//       <textarea
//         className="text-area"
//         value={additionalText}
//         onChange={handleChange}
//         placeholder="Enter the text you want to add"
//         rows="4"
//         cols="50"
//       />
//       <br />
//       <button className="add-text-button" onClick={handleAddTextToPDF}>Add Text to PDF</button>
//     </div>
//   );
// };

// export default Professional;


import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/professional.css';

const Professional = () => {
  const [additionalText, setAdditionalText] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setAdditionalText(e.target.value);
  };

  // Function to sanitize text while maintaining spaces
  const sanitizeText = (text) => {
    return text
      .replace(/[^\x00-\x7F]+/g, '') // Remove non-ASCII characters
      .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
      .trim(); // Trim leading and trailing spaces
  };

  const drawWrappedText = (pdfDoc, page, text, x, y, font, fontSize, maxWidth, lineHeight) => {
    text = String(text);
    const pageWidth = 612;
    const pageHeight = 792;
    const bottomMargin = 40;
  
    const lines = [];
    let currentLine = '';
    let totalWidth = 0;
  
    const chars = Array.from(text); // Separate the text into individual characters
  
    for (let char of chars) {
      const charWidth = font.widthOfTextAtSize(char, fontSize);
  
      // If adding the next character exceeds the maxWidth, push the current line and reset
      if (totalWidth + charWidth > maxWidth) {
        lines.push(currentLine);
        currentLine = char; // Start a new line with the current character
        totalWidth = charWidth; // Reset totalWidth to the width of the current character
      } else {
        currentLine += char; // Add character to the current line
        totalWidth += charWidth; // Update the total width of the current line
      }
    }
  
    if (currentLine) {
      lines.push(currentLine); // Push the last line if it exists
    }
  
    for (let i = 0; i < lines.length; i++) {
      const lineText = lines[i];
  
      if (y - lineHeight < bottomMargin) {
        const newPage = pdfDoc.addPage([pageWidth, pageHeight]);
        page = newPage;
        y = pageHeight - 40; // Reset y to the top margin
      }
  
      page.drawText(lineText, {
        x: x,
        y: y,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
  
      y -= lineHeight; // Move down for the next line
    }
  
    return y; // Return the updated y position
  };
  

  const handleAddTextToPDF = async () => {
    try {
      const response = await axios.get('http://localhost:4000/public/resume.pdf', {
        responseType: 'arraybuffer',
      });
      const existingPdfBytes = response.data;

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      let page = pdfDoc.getPage(0); // Make sure this is 'let', so you can modify it later

      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const textX = 40;
      const textY = 530; // Initial y position
      const fontSize = 9;
      const maxWidth = 530; // Set maximum width for text wrapping
      const lineHeight = 15; // Line spacing

      // Sanitize the additionalText to avoid encoding issues
      const cleanedText = sanitizeText(additionalText);

      page.drawText('PROFESSIONAL SUMMARY', {
        x: 40,
        y: 550,
        size: 16,
        font: fontBold,
        color: rgb(0.32, 0.32, 0.32),
      });

      page.drawLine({
        start: { x: textX, y: 545 },
        end: { x: 572, y: 545 },
        thickness: 4.5,
        color: rgb(0.32, 0.32, 0.32),
      });

      const newYPosition = drawWrappedText(pdfDoc, page, cleanedText, textX, textY, fontRegular, fontSize, maxWidth, lineHeight);

      // Save the modified PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('file', blob, 'updated_resume.pdf');

      await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Navigate to Core component and send the yPosition as state
      navigate('/page/core-competency', { state: { yPosition: newYPosition } });

    } catch (error) {
      console.error('Error updating the PDF:', error);
      alert('Failed to update the resume.');
    }
  };

  return (
    <div className="full-width-container">
    <div className="container-prof">
      <h2 className="tip-header">Tip: Do not use personal pronouns.</h2>
      <p className="tip-description">
        Start with your educational background, then talk about your experience and the technologies you have worked with. Explain how you have utilized those skills.
      </p>
      <p className="example-text">
        Eg: A qualified Computer Engineer with a Master’s in Computer Application and one year of experience as a Programmer Trainee. Proficient in full-stack development and database management, with expertise in React, Node.js, and MongoDB. Capable of creating dynamic websites, data-driven applications, and e-commerce platforms. Skilled at developing scalable solutions, optimizing performance, and enhancing user experiences. Enthusiastic about tackling new challenges and innovating within the tech industry. Committed to learning and applying cutting-edge technologies to deliver impactful results.
      </p>
      <h2 className="add-text-header">Add Professional Summary to Resume</h2>
      <textarea
        className="text-area"
        value={additionalText}
        onChange={handleChange}
        placeholder="Enter the text you want to add"
        rows="4"
        cols="50"
      />
      <br />
      <button className="add-text-button" onClick={handleAddTextToPDF}>
        Add Text to PDF
      </button>
    </div>
  </div>
  );
};

export default Professional;

