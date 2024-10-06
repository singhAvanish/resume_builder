const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Construct the path to the 'public' folder in the 'resume' directory
    const resumePublicPath = path.join(__dirname, '../resume/public');
    cb(null, resumePublicPath); // Save files in the 'public' folder
  },
  filename: (req, file, cb) => {
    cb(null, 'resume.pdf'); // Always save the file as 'resume.pdf'
  },
});

// Initialize upload
const upload = multer({ storage });

// Function to delete the existing PDF file
const deleteExistingPdf = () => {
  const filePath = path.join(__dirname, '../resume/public/resume.pdf');
  
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting existing PDF:', err);
      } else {
        console.log('Previous PDF deleted successfully.');
      }
    });
  }
};

// Define a route to handle file uploads
app.post('/upload', (req, res) => {
  // Delete the existing file before uploading a new one
  deleteExistingPdf();

  // Proceed with the file upload
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(500).send('Error uploading file.');
    }
    res.send('File uploaded successfully!');
  });
});
app.delete('/delete',(req,res)=>{
    deleteExistingPdf();
})

// Serve the static files from the 'public' directory
app.use('/resume', express.static(path.join(__dirname, '../resume/public')));

// Define a GET route to download or access the uploaded file
app.get('/public/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../resume/public', filename);

  // Send the file as a response
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('File not found:', err);
      res.status(404).send('File not found');
    }
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
