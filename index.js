// Import dependencies
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Root route
app.get('/', (req, res) => {
  res.send('Bedmatica Proxy is running!');
});

// /connect route
app.post('/connect', (req, res) => {
  const { serverIP, serverPort } = req.body;
  if (!serverIP || !serverPort) {
    return res.status(400).json({ success: false, message: 'Server IP and Port required' });
  }

  console.log(`Connecting to ${serverIP}:${serverPort}`);
  res.json({ success: true, message: `Connecting to ${serverIP}:${serverPort}` });
});

// /upload-schematic route
app.post('/upload-schematic', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const fileExt = path.extname(req.file.originalname).toLowerCase();
  const allowedExt = ['.litematic', '.schematic', '.schematics'];

  if (!allowedExt.includes(fileExt)) {
    return res.status(400).json({ success: false, message: 'Invalid file type' });
  }

  // Log the uploaded file
  console.log('Uploaded file:', req.file.originalname);

  // TODO: Add schematic import logic here

  res.json({ success: true, message: `Uploaded ${req.file.originalname}` });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

