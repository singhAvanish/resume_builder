import { PDFDocument, rgb } from 'pdf-lib';
import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate} from 'react-router-dom';
import "./css/hobby.css";

const Hobbies = () => {
  const [hobbies, setHobbies] = useState([{ hobby: '' }]);
  const location = useLocation();
  const navigate=useNavigate()
  // Hook for navigation
  
  let { yPosition = 0, pageIndex = 0 } = location.state || {};

  // Handler for input change
  const handleInputChange = (index, event) => {
    const { value } = event.target;
    const newHobbies = [...hobbies];
    newHobbies[index].hobby = value;
    setHobbies(newHobbies);
  };

  // Add more hobby fields
  const handleAddMoreHobby = () => {
    setHobbies([...hobbies, { hobby: '' }]);
  };

  // Function to handle PDF modification and save
  const handleAddHobbiesToPDF = async () => {
    try {
      const response = await axios.get('https://resume-builder-r4hm.onrender.com/public/resume.pdf', {
        responseType: 'arraybuffer',
      });
      const existingPdfBytes = response.data;
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const page = pdfDoc.getPage(pageIndex);
      const fontBold = await pdfDoc.embedFont('Helvetica-Bold');
      const fontRegular = await pdfDoc.embedFont('Helvetica');

      const textX = 40;
      let textY = yPosition - 5; // Starting Y position; adjust based on layout
      const fontSize = 9;
      const lineHeight = 15;
      const maxWidth = 570; // Maximum width for text wrapping

      // Add the Hobbies heading
      page.drawText('HOBBIES', {
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

      textY -= 15; // Move down after heading

      // Add hobbies to the PDF
      hobbies.forEach((hobby) => {
        if (hobby.hobby) { // Check if hobby input is not empty
          const hobbyText = `• ${hobby.hobby}`;
          // Draw text with maxWidth for wrapping
          page.drawText(hobbyText, {
            x: textX,
            y: textY,
            size: fontSize,
            font: fontRegular,
            color: rgb(0, 0, 0),
            maxWidth: maxWidth,
          });
          // Update textY based on line height and current text height
          textY -= lineHeight; // Move down for the next hobby
        }
      });

      // Save the updated PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      // Initiate download of the PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Send the updated PDF to the server
      const formData = new FormData();
      formData.append('file', blob, 'resume.pdf');

      await axios.post('https://resume-builder-r4hm.onrender.com/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Delete the original resume from the server
      await axios.delete('https://resume-builder-r4hm.onrender.com/delete');

      // Navigate to the next page
      navigate('/')
      // Replace with your desired next page URL

    } catch (error) {
      console.error('Error updating the PDF:', error);
    }
  };

  // Function for skipping to the next page


  return (
    <div className="hobbies-container">
      <h2 className="hobbies-title">Add Hobbies to Resume</h2>
      {hobbies.map((hobby, index) => (
        <div key={index} className="hobby-input-container">
          <input
            type="text"
            value={hobby.hobby}
            placeholder="Enter Hobby"
            onChange={(event) => handleInputChange(index, event)}
            className="hobby-input"
          />
        </div>
      ))}
      <button onClick={handleAddMoreHobby} className="add-hobby-button">Add More Hobby</button>
      <button onClick={handleAddHobbiesToPDF} className="add-hobby-button">Add Hobbies to PDF</button>
      <button onClick={()=>navigate("/")}>Home</button>
    </div>
  );
};

export default Hobbies;
