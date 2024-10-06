
// import React, { useState } from 'react';
// import { PDFDocument, rgb } from 'pdf-lib';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';
// import "./css/project.css"

// const Project = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   let { yPosition = 0, pageIndex } = location.state || {};

//   const [projects, setProjects] = useState([
//     { name: '', description: '', keyFeatures: '', technologyStack: '' }
//   ]);

//   const handleInputChange = (index, event) => {
//     const { name, value } = event.target;
//     const newProjects = [...projects];
//     newProjects[index][name] = value;
//     setProjects(newProjects);
//   };

//   const handleAddMoreProject = () => {
//     setProjects([...projects, { name: '', description: '', keyFeatures: '', technologyStack: '' }]);
//   };

//   const wrapText = (text, maxWidth, font, fontSize) => {
//     const words = text.split(' ');
//     let lines = [];
//     let currentLine = '';
    
    

//     for (let word of words) {
     
//       const testLine = currentLine ? currentLine + ' ' + word : word;
//       const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    

//       if (testWidth <= maxWidth) {
//         currentLine = testLine;
        
//       } else {
        
//         lines.push(currentLine);
//         currentLine = word;
//       }
//     }
  
//     if (currentLine) {
//       lines.push(currentLine);
//     }
  
//     return lines;
    
   
//   };
 
  

//   const handleAddTextToPDF = async () => {
//     if (projects.some(project => !project.name)) {
//       alert('Please fill in all required fields.');
//       return;
//     }

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
//       const maxWidth = page.getWidth() - 80; // Prevent text from overflowing horizontally
//       let textY = yPosition - 20;
//       const fontSize = 11;
      
//       const lineHeight = 15;
//       const marginBottom = 40;

//       const addNewPage = () => {
//         pageIndex+=1;
//         const newPage = pdfDoc.addPage([page.getWidth(), page.getHeight()]);
//         textY = newPage.getHeight() - 60;
//         return newPage;
//       };

//       if (textY < marginBottom) {
//         page = addNewPage();
//       }

//       // Draw the "PROJECTS" heading
//       page.drawText('PROJECTS', {
//         x: textX,
//         y: textY,
//         size: 16,
//         font: fontBold,
//         color: rgb(0.32, 0.32, 0.32),
//       });

//       textY -= 5;
//       page.drawLine({
//         start: { x: textX, y: textY },
//         end: { x: page.getWidth() - 40, y: textY },
//         thickness: 4.5,
//         color: rgb(0.32, 0.32, 0.32),
//       });

//       textY -= 15;

//       const drawTextLines = (lines, font, textY,color) => {
//         lines.forEach((line) => {
//           if (textY < marginBottom) {
//             page = addNewPage();
//           }
//           page.drawText(line, { x: textX, y: textY, size: fontSize, font, color: color });
//           textY -= lineHeight;
//         });
//         return textY; // Return the updated yPosition
//       };

//       // Draw each project
//       for (const [index, project] of projects.entries()) {
//         const sequenceNumber = index + 1;

//         // Check if the vertical space is about to finish
//         if (textY < marginBottom) {
//           page = addNewPage();
//         }

//         // Wrap and draw project name
//         const projectNameLines = wrapText(`${sequenceNumber}. ${project.name}`, maxWidth, fontBold, fontSize);
//         textY = drawTextLines(projectNameLines, fontBold, textY);

//         // Wrap and draw project description
//         const descriptionLines = wrapText(`Description:`, maxWidth, fontBold, fontSize);
// textY = drawTextLines(descriptionLines, fontBold, textY,rgb(0.34,0.34,0.34));

// const descriptionTextLines = wrapText(project.description, maxWidth, fontRegular, fontSize);
// textY = drawTextLines(descriptionTextLines, fontRegular, textY,rgb(0,0,0));

//         // Wrap and draw key features
//         const keyFeaturesLabelLines = wrapText(`Key Features:`, maxWidth, fontBold, fontSize);
//         textY = drawTextLines(keyFeaturesLabelLines, fontBold, textY,rgb(0.34,0.34,0.34));
        
//         const keyFeaturesTextLines = wrapText(project.keyFeatures, maxWidth, fontRegular, fontSize);
//         textY = drawTextLines(keyFeaturesTextLines, fontRegular, textY,rgb(0,0,0));

//         // Wrap and draw technology stack
//         const technologyStackLabelLines = wrapText(`Technology Stack:`, maxWidth, fontBold, fontSize,);
// textY = drawTextLines(technologyStackLabelLines, fontBold, textY,rgb(0.34,0.34,0.34));

// const technologyStackTextLines = wrapText(project.technologyStack, maxWidth, fontRegular, fontSize,rgb(0,0,0));
// textY = drawTextLines(technologyStackTextLines, fontRegular, textY,rgb(0,0,0));

//         // Add extra spacing between projects
        
//       }

//       // Save the updated PDF and send it back to the server
//       const pdfBytes = await pdfDoc.save();
//       const blob = new Blob([pdfBytes], { type: 'application/pdf' });
//       const formData = new FormData();
//       formData.append('file', blob, 'updated_resume.pdf');

//       await axios.post('http://localhost:4000/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       // Navigate to the next page
//       navigate('/page/education', { state: { yPosition: textY, pageIndex } });
//     } catch (error) {
//       console.error('Error updating the PDF:', error);
//       alert('Failed to update the resume. Please try again.');
//     }
//   };

  
  
  
//   return (
//     <div>
//       <h2>Add Projects to Resume</h2>
//       {projects.map((project, index) => (
//         <div key={index} style={{ marginBottom: '20px' }}>
//           <input
//             type="text"
//             name="name"
//             value={project.name}
//             placeholder="Project Name (required)"
//             onChange={(event) => handleInputChange(index, event)}
//             style={{ marginBottom: '8px', width: '300px' }}
//             required
//             aria-label="Project Name"
//           />
//           <textarea
//             type="text"
//             name="description"
//             value={project.description}
//             placeholder="Description"
//             onChange={(event) => handleInputChange(index, event)}
//             style={{ marginBottom: '8px', width: '300px' }}
//             aria-label="Description"
//           />
//           <textarea
//             type="text"
//             name="keyFeatures"
//             value={project.keyFeatures}
//             placeholder="Key Features"
//             onChange={(event) => handleInputChange(index, event)}
//             style={{ marginBottom: '8px', width: '300px' }}
//             aria-label="Key Features"
//           />
//           <input
//             type="text"
//             name="technologyStack"
//             value={project.technologyStack}
//             placeholder="Technology Stack"
//             onChange={(event) => handleInputChange(index, event)}
//             style={{ marginBottom: '16px', width: '300px' }}
//             aria-label="Technology Stack"
//           />
//         </div>
//       ))}

//       <button onClick={handleAddMoreProject}>Add More Project</button>
//       <button onClick={handleAddTextToPDF}>Add Projects to PDF</button>
//     </div>
//   );
// };

// export default Project;


// import React, { useState } from 'react';
// import { PDFDocument, rgb } from 'pdf-lib';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';
// import "./css/project.css";

// const Project = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   let { yPosition = 0, pageIndex } = location.state || {};

//   const [projects, setProjects] = useState([
//     { name: '', description: '', keyFeatures: '', technologyStack: '' }
//   ]);

//   const handleInputChange = (index, event) => {
//     const { name, value } = event.target;
//     const newProjects = [...projects];
//     newProjects[index][name] = value;
//     setProjects(newProjects);
//   };

//   const handleAddMoreProject = () => {
//     setProjects([...projects, { name: '', description: '', keyFeatures: '', technologyStack: '' }]);
//   };

//   const wrapText = (text, maxWidth, font, fontSize) => {
//     const lines = [];
//     const paragraphs = text.split('\n'); // Split by newlines

//     for (const paragraph of paragraphs) {
//       const words = paragraph.split(' ');
//       let currentLine = '';

//       for (let word of words) {
//         const testLine = currentLine ? currentLine + ' ' + word : word;
//         const testWidth = font.widthOfTextAtSize(testLine, fontSize);

//         if (testWidth <= maxWidth) {
//           currentLine = testLine;
//         } else {
//           lines.push(currentLine);
//           currentLine = word;
//         }
//       }

//       if (currentLine) {
//         lines.push(currentLine);
//       }
//     }

//     return lines;
//   };

//   const handleAddTextToPDF = async () => {
//     if (projects.some(project => !project.name)) {
//       alert('Please fill in all required fields.');
//       return;
//     }

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
//       const maxWidth = 530; // Prevent text from overflowing horizontally
//       let textY = yPosition - 20;
//       const fontSize = 11;
//       const lineHeight = 15;
//       const marginBottom = 40;

//       const addNewPage = () => {
//         pageIndex += 1;
//         const newPage = pdfDoc.addPage([page.getWidth(), page.getHeight()]);
//         textY = newPage.getHeight() - 60;
//         return newPage;
//       };

//       if (textY < marginBottom) {
//         page = addNewPage();
//       }

//       // Draw the "PROJECTS" heading
//       page.drawText('PROJECTS', {
//         x: textX,
//         y: textY,
//         size: 16,
//         font: fontBold,
//         color: rgb(0.32, 0.32, 0.32),
//       });

//       textY -= 5;
//       page.drawLine({
//         start: { x: textX, y: textY },
//         end: { x: page.getWidth() - 40, y: textY },
//         thickness: 4.5,
//         color: rgb(0.32, 0.32, 0.32),
//       });

//       textY -= 15;

//       const drawTextLines = (lines, font, textY, color) => {
//         lines.forEach((line) => {
//           if (textY < marginBottom) {
//             page = addNewPage();
//           }
//           page.drawText(line, { x: textX, y: textY, size: fontSize, font, color });
//           textY -= lineHeight;
//         });
//         return textY; // Return the updated yPosition
//       };

//       // Draw each project
//       for (const [index, project] of projects.entries()) {
//         const sequenceNumber = index + 1;

//         // Check if the vertical space is about to finish
//         if (textY < marginBottom) {
//           page = addNewPage();
//         }

//         // Wrap and draw project name
//         const projectNameLines = wrapText(`${sequenceNumber}. ${project.name}`, maxWidth, fontBold, fontSize);
//         textY = drawTextLines(projectNameLines, fontBold, textY);

//         // Wrap and draw project description
//         const descriptionLines = wrapText(`Description:`, maxWidth, fontBold, fontSize);
//         textY = drawTextLines(descriptionLines, fontBold, textY, rgb(0.34, 0.34, 0.34));

//         const descriptionTextLines = wrapText(project.description, maxWidth, fontRegular, fontSize);
//         textY = drawTextLines(descriptionTextLines, fontRegular, textY, rgb(0, 0, 0));

//         // Wrap and draw key features
//         const keyFeaturesLabelLines = wrapText(`Key Features:`, maxWidth, fontBold, fontSize);
//         textY = drawTextLines(keyFeaturesLabelLines, fontBold, textY, rgb(0.34, 0.34, 0.34));
        
//         const keyFeaturesTextLines = wrapText(project.keyFeatures, maxWidth, fontRegular, fontSize);
//         textY = drawTextLines(keyFeaturesTextLines, fontRegular, textY, rgb(0, 0, 0));

//         // Wrap and draw technology stack
//         const technologyStackLabelLines = wrapText(`Technology Stack:`, maxWidth, fontBold, fontSize);
//         textY = drawTextLines(technologyStackLabelLines, fontBold, textY, rgb(0.34, 0.34, 0.34));

//         const technologyStackTextLines = wrapText(project.technologyStack, maxWidth, fontRegular, fontSize);
//         textY = drawTextLines(technologyStackTextLines, fontRegular, textY, rgb(0, 0, 0));

//         // Add extra spacing between projects
//          // Adjust this value as needed for spacing
//       }

//       // Save the updated PDF and send it back to the server
//       const pdfBytes = await pdfDoc.save();
//       const blob = new Blob([pdfBytes], { type: 'application/pdf' });
//       const formData = new FormData();
//       formData.append('file', blob, 'updated_resume.pdf');

//       await axios.post('http://localhost:4000/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       // Navigate to the next page
//       navigate('/page/education', { state: { yPosition: textY, pageIndex } });
//     } catch (error) {
//       console.error('Error updating the PDF:', error);
//       alert('Failed to update the resume. Please try again.');
//     }
//   };

//   return (
//     <div>
//       <h2>Add Projects to Resume</h2>
//       {projects.map((project, index) => (
//         <div key={index} style={{ marginBottom: '20px' }}>
//           <input
//             type="text"
//             name="name"
//             value={project.name}
//             placeholder="Project Name (required)"
//             onChange={(event) => handleInputChange(index, event)}
//             style={{ marginBottom: '8px', width: '300px' }}
//             required
//             aria-label="Project Name"
//           />
//           <textarea
//             type="text"
//             name="description"
//             value={project.description}
//             placeholder="Description"
//             onChange={(event) => handleInputChange(index, event)}
//             style={{ marginBottom: '8px', width: '300px' }}
//             aria-label="Description"
//           />
//           <textarea
//             type="text"
//             name="keyFeatures"
//             value={project.keyFeatures}
//             placeholder="Key Features"
//             onChange={(event) => handleInputChange(index, event)}
//             style={{ marginBottom: '8px', width: '300px' }}
//             aria-label="Key Features"
//           />
//           <input
//             type="text"
//             name="technologyStack"
//             value={project.technologyStack}
//             placeholder="Technology Stack"
//             onChange={(event) => handleInputChange(index, event)}
//             style={{ marginBottom: '16px', width: '300px' }}
//             aria-label="Technology Stack"
//           />
//         </div>
//       ))}

//       <button onClick={handleAddMoreProject}>Add More Project</button>
//       <button onClick={handleAddTextToPDF}>Add Projects to PDF</button>
//     </div>
//   );
// };

// export default Project;


import React, { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import "./css/project.css";

const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let { yPosition = 0, pageIndex } = location.state || {};

  const [projects, setProjects] = useState([
    { name: '', description: '', keyFeatures: '', technologyStack: '' }
  ]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newProjects = [...projects];
    newProjects[index][name] = value;
    setProjects(newProjects);
  };

  const handleAddMoreProject = () => {
    setProjects([...projects, { name: '', description: '', keyFeatures: '', technologyStack: '' }]);
  };
  const sanitizeText = (text) => {
    return text
      .replace(/[^\x00-\x7F]+/g, '') // Remove non-ASCII characters
      .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
      .trim(); // Trim leading and trailing spaces
  };


  const wrapText = (text, maxWidth, font, fontSize) => {
    const lines = [];
    let currentLine = '';
    const characters = text.split('');

    for (let char of characters) {
      const testLine = currentLine + char;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = char; // Start a new line with the current character
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  const handleAddTextToPDF = async () => {
    if (projects.some(project => !project.name)) {
      alert('Please fill in all required fields.');
      return;
    }

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
      const maxWidth = 530; // Prevent text from overflowing horizontally
      let textY = yPosition - 20;
      const fontSize = 9;
      const lineHeight = 15;
      const marginBottom = 40;

      const addNewPage = () => {
        pageIndex += 1;
        const newPage = pdfDoc.addPage([page.getWidth(), page.getHeight()]);
        textY = newPage.getHeight() - 60;
        return newPage;
      };

      // Draw the "PROJECTS" heading
      if (textY < marginBottom) {
        page = addNewPage();
      }
      page.drawText('PROJECTS', {
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

      textY -= 15;

      const drawTextLines = (lines, font, textY, color) => {
        lines.forEach((line) => {
          if (textY < marginBottom) {
            page = addNewPage();
            textY = page.getHeight() - 60; // Reset Y position after adding new page
          }
          page.drawText(line, { x: textX, y: textY, size: fontSize, font, color });
          textY -= lineHeight;
        });
        return textY; // Return the updated yPosition
      };

      // Draw each project
      for (const [index, project] of projects.entries()) {
        const sequenceNumber = index + 1;

        // Wrap and draw project name
        const projectNameLines = wrapText(`${sequenceNumber}. ${project.name}`, maxWidth, fontBold, fontSize);
        textY = drawTextLines(projectNameLines, fontBold, textY);

        // Wrap and draw project description
        
        const descriptionLines = wrapText(`Description:`, maxWidth, fontBold, fontSize);
        textY = drawTextLines(descriptionLines, fontBold, textY);
        
        let sanitizeDES=sanitizeText(project.description)
        
        const descriptionTextLines = wrapText(sanitizeDES, maxWidth, fontRegular, fontSize);
        textY = drawTextLines(descriptionTextLines, fontRegular, textY);

        // Wrap and draw key features
        const keyFeaturesLabelLines = wrapText(`Key Features:`, maxWidth, fontBold, fontSize);
        textY = drawTextLines(keyFeaturesLabelLines, fontBold, textY);
        
        let sanitizeKF=sanitizeText(project.keyFeatures)
        const keyFeaturesTextLines = wrapText(sanitizeKF, maxWidth, fontRegular, fontSize);
        textY = drawTextLines(keyFeaturesTextLines, fontRegular, textY);

        // Wrap and draw technology stack
        const technologyStackLabelLines = wrapText(`Technology Stack:`, maxWidth, fontBold, fontSize);
        textY = drawTextLines(technologyStackLabelLines, fontBold, textY);
        let sanitizeTS=sanitizeText(project.technologyStack)
        const technologyStackTextLines = wrapText(sanitizeTS, maxWidth, fontRegular, fontSize);
        textY = drawTextLines(technologyStackTextLines, fontRegular, textY);

        // Add extra spacing between projects
        textY -= 5; // Adjust this value for spacing between projects
      }

      // Save the updated PDF and send it back to the server
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('file', blob, 'updated_resume.pdf');

      await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Navigate to the next page
      navigate('/page/education', { state: { yPosition: textY, pageIndex } });
    } catch (error) {
      console.error('Error updating the PDF:', error);
      alert('Failed to update the resume. Please try again.');
    }
  };

  return (
    <div className="container-projects">
    <h2>Add Projects to Resume</h2>
    {projects.map((project, index) => (
      <div key={index} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="name"
          value={project.name}
          placeholder="Project Name (required)"
          onChange={(event) => handleInputChange(index, event)}
          required
          aria-label="Project Name"
        />
        <p>Explain what you have built with this project and the purpose it serves.</p>
        <textarea
          name="description"
          value={project.description}
          placeholder="Description"
          onChange={(event) => handleInputChange(index, event)}
          aria-label="Description"
        />
        <p>What features have you built into this project, and how do they help achieve better results for its purpose? </p>
        <textarea
          name="keyFeatures"
          value={project.keyFeatures}
          placeholder="Key Features"
          onChange={(event) => handleInputChange(index, event)}
          aria-label="Key Features"
        />
        <input
          type="text"
          name="technologyStack"
          value={project.technologyStack}
          placeholder="Technology Stack"
          onChange={(event) => handleInputChange(index, event)}
          aria-label="Technology Stack"
        />
      </div>
    ))}

    <button onClick={handleAddMoreProject}>Add More Project</button>
    <button onClick={handleAddTextToPDF}>Add Projects to PDF</button>
  </div>
  );
};

export default Project;
