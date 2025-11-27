const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nbt = require('prismarine-nbt');
const mc = require('node-minecraft-protocol');

const app = express();
app.use(cors());
app.use(express.json());

// Set up file uploads
const upload = multer({ dest: 'uploads/' });

// Root route
app.get('/', (req, res) => {
  res.send('Bedmatica Proxy is running!');
});

// /connect route
app.post('/connect', (req, res) => {
  const { serverIP, serverPort } = req.body;
  if (!serverIP || !serverPort) return res.status(400).json({ success: false, message: 'Server IP and Port required' });
  console.log(`Connecting to ${serverIP}:${serverPort}`);
  res.json({ success: true, message: `Connecting to ${serverIP}:${serverPort}` });
});

// /upload-schematic route
app.post('/upload-schematic', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  const fileExt = path.extname(req.file.originalname).toLowerCase();
  const allowedExt = ['.litematic', '.schematic', '.schematics'];
  if (!allowedExt.includes(fileExt)) return res.status(400).json({ success: false, message: 'Invalid file type' });

  console.log('Uploaded file:', req.file.originalname);

  try {
    const fileBuffer = fs.readFileSync(req.file.path);

    // Parse NBT
    const nbtData = await nbt.parse(fileBuffer);

    // TODO: Convert NBT data to Bedrock block coordinates
    const blocks = []; // Placeholder: [{x, y, z, blockName}, ...]

    // Connect to Bedrock server
    const client = mc.createClient({
      host: req.body.serverIP,
      port: parseInt(req.body.serverPort),
      username: 'BedmaticaBot',
      version: '1.20.10',
    });

    client.on('connect', () => {
      console.log('Connected to Bedrock server');

      // Placeholder: send blocks
      blocks.forEach(block => {
        // Example pseudo-code:
        // client.sendBlockPlacement({x: block.x, y: block.y, z: block.z, blockName: block.name});
      });

      console.log('Block placement attempted');
    });

    client.on('error', err => console.error('MC connection error', err));

    res.json({ success: true, message: `Uploaded ${req.file.originalname}, attempting to place blocks on server` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error processing schematic' });
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

