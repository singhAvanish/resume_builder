import React, { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./css/header.css"

const Header = () => {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    number: '',
    email: '',
    linkedIn: '',
  });

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { name, city, number, email, linkedIn } = formData;
    if (!name || !city || !number || !email || !linkedIn) {
      alert("Please fill in all fields.");
      return;
    }
  
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]);
      const { width, height } = page.getSize();
      const greyColor = rgb(244 / 255, 244 / 255, 244 / 255);
      const darkGreyColor = rgb(0.32, 0.32, 0.32);
      const fontSize = 30;
  
      page.drawRectangle({ x: 0, y: 600, width, height: height / 4, color: greyColor });
      page.drawRectangle({ x: 0, y: 590, width, height: 10, color: darkGreyColor });
      const font = await pdfDoc.embedFont('Helvetica-Bold');
  
      const textX = 40;
      const textY = 700;
      let currentY = textY; // Keep track of Y position
  
      // Function to draw the underline dynamically
      const drawUnderline = (text, x, y, font, size) => {
        const textWidth = font.widthOfTextAtSize(text, size);
        page.drawLine({
          start: { x, y: y - 10 },
          end: { x: x + textWidth, y: y - 10 },
          thickness: 2.5,
          color: rgb(0.34, 0.34, 0.34),
        });
      };
  
      // Function to manually split text based on max width
      const splitTextIntoLines = (text, font, maxWidth, fontSize) => {
        const words = text.split(' ');
        let lines = [];
        let currentLine = words[0];
  
        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const widthOfCurrentLine = font.widthOfTextAtSize(currentLine + " " + word, fontSize);
          if (widthOfCurrentLine < maxWidth) {
            currentLine += " " + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        lines.push(currentLine);
        return lines;
      };
  
      const maxTextWidth = 330; // Set the maximum width for text in one line
      const nameLines = splitTextIntoLines(name, font, maxTextWidth, fontSize);
  
      // Loop through the name lines and draw them
      for (let i = 0; i < nameLines.length; i++) {
        page.drawText(nameLines[i], { x: textX, y: currentY, size: fontSize, font, color: rgb(0.34, 0.34, 0.34) });
        drawUnderline(nameLines[i], textX, currentY, font, fontSize);
        currentY -= 40; // Move Y position down for the next line if needed
      }
  
      const rightMargin = 60;
      const xPosition = width - rightMargin;
      page.drawText(city, {
        x: xPosition - font.widthOfTextAtSize(city, 11),
        y: 750,
        size: 11,
        font,
        color: rgb(0.34, 0.34, 0.34),
      });
      page.drawText(number, {
        x: xPosition - font.widthOfTextAtSize(number, 11),
        y: 720,
        size: 11,
        font,
        color: rgb(0.34, 0.34, 0.34),
      });
      page.drawText(email, {
        x: xPosition - font.widthOfTextAtSize(email, 11),
        y: 690,
        size: 11,
        font,
        color: rgb(0.34, 0.34, 0.34),
      });
      page.drawText(linkedIn, {
        x: xPosition - font.widthOfTextAtSize(linkedIn, 11),
        y: 660,
        size: 11,
        font,
        color: rgb(0.34, 0.34, 0.34),
      });
  
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const uploadFormData = new FormData();
      uploadFormData.append('file', blob, 'resume.pdf');
  
      const response = await axios.post('https://resume-builder-r4hm.onrender.com/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data) {
        alert('Resume saved successfully on the server!');
        navigate('/page/professional-summary'); // Navigate to the professional summary page
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to upload the resume.');
    }
  };
  
  return (
    <div className="form-container">
    <form className="resume-form" onSubmit={handleSubmit}>
      <input 
        className="form-input"
        type="text" 
        name="name" 
        placeholder="Name" 
        value={formData.name} 
        onChange={handleChange} 
      />
      <input 
        className="form-input"
        type="text" 
        name="city" 
        placeholder="City" 
        value={formData.city} 
        onChange={handleChange} 
      />
      <input 
        className="form-input"
        type="number" 
        name="number" 
        placeholder="Phone Number" 
        value={formData.number} 
        onChange={handleChange} 
      />
      <input 
        className="form-input"
        type="email" 
        name="email" 
        placeholder="Email" 
        value={formData.email} 
        onChange={handleChange} 
      />
      <input 
        className="form-input"
        type="text" 
        name="linkedIn" 
        placeholder="LinkedIn Profile" 
        value={formData.linkedIn} 
        onChange={handleChange} 
      />
      <button className="form-button" type="submit">Generate and Save PDF</button>
    </form>
  </div>
  
  );
};

export default Header;
