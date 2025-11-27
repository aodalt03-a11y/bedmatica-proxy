const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Bedmatica Proxy is running!');
});

// /connect route
app.post('/connect', (req, res) => {
  const { serverIP, serverPort } = req.body;
  console.log(`Connecting to ${serverIP}:${serverPort}`);
  res.json({ success: true, serverIP, serverPort });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

