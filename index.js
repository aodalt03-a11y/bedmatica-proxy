const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const nbt = require('prismarine-nbt');
const bedrock = require('bedrock-protocol');

const app = express();
app.use(cors());
app.use(express.json());

// File upload setup
const upload = multer({ dest: 'uploads/' });

// Root route
app.get('/', (req, res) => {
  res.send('Bedmatica Proxy is running!');
});

// Connect route
app.post('/connect', (req, res) => {
  const { serverIP, serverPort } = req.body;
  if (!serverIP || !serverPort)
    return res.status(400).json({ success: false, message: 'Server IP and Port required' });

  console.log(`Connecting to ${serverIP}:${serverPort}`);
  res.json({ success: true, message: `Connecting to ${serverIP}:${serverPort}` });
});

// Upload schematic route
app.post('/upload-schematic', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  const fileExt = path.extname(req.file.originalname).toLowerCase();
  const allowedExt = ['.litematic', '.schematic', '.schematics'];
  if (!allowedExt.includes(fileExt))
    return res.status(400).json({ success: false, message: 'Invalid file type' });

  console.log('Uploaded file:', req.file.originalname);

  try {
    const fileBuffer = fs.readFileSync(req.file.path);
    console.log('File size:', fileBuffer.length);

    // Try normal NBT parse, fallback to gzip
    let nbtData;
    try {
      nbtData = await nbt.parse(fileBuffer);
    } catch (e) {
      console.log('NBT parse failed, trying gzip parse...');
      nbtData = await nbt.parse(fileBuffer, 'gzip');
    }

    console.log('NBT parsed successfully:', Object.keys(nbtData.parsed.value));

    // Placeholder: convert NBT blocks to Bedrock-compatible array
    const blocks = []; // Example: [{x, y, z, blockName}]

    // Connect to Minecraft Bedrock server
    const client = bedrock.createClient({
  host: serverIP,
  port: parseInt(serverPort),
  offline: true,       // skip authentication if needed
  version: '1.20.10'   // Bedrock version you’re targeting
});
      username: 'BedmaticaBot',
      version: '1.20.10',
    });

    client.on('connect', () => {
      console.log('Connected to Bedrock server');
      // TODO: Send blocks to server
      blocks.forEach(block => {
        // Example pseudo-code:
        // client.sendBlockPlacement({x: block.x, y: block.y, z: block.z, blockName: block.blockName});
      });
      console.log('Block placement attempted');
    });

    client.on('error', err => console.error('MC connection error', err));

    res.json({ success: true, message: `Uploaded ${req.file.originalname}, attempting to place blocks` });
  } catch (err) {
    console.error('Error processing schematic:', err);
    res.status(500).json({ success: false, message: 'Error processing schematic' });
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));


