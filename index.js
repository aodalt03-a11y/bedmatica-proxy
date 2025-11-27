// index.js — Android-friendly Bedmatica Proxy (no bedrock-protocol)

const express = require("express");
const { createClient } = require("@supabase/supabase-js");

// --- Express server ---
const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("Bedmatica Proxy Running (no Bedrock)"));

const PORT = 3000;

// --- Supabase setup ---
const supabase = createClient(
  "https://ewhobxkxmdfmsykdjopg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3aG9ieGt4bWRmbXN5a2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODMzODksImV4cCI6MjA3OTc1OTM4OX0.GyZMLHFs-xeIrJ6QwA4-YPV9q5L9jD-YC7lopbyLeIM"
);

// --- Store build requests in memory (for testing) ---
const buildRequests = [];

// --- Endpoint for Zite to send build requests ---
app.post("/build", async (req, res) => {
  const { username, schematic } = req.body;

  if (!username || !schematic) {
    return res.status(400).send({ error: "Missing username or schematic" });
  }

  console.log(`Received build request from ${username}:`, schematic);

  // Save to Supabase (optional)
  try {
    const { data, error } = await supabase
      .from("builds")
      .insert([{ username, schematic }]);
    if (error) console.log("Supabase insert error:", error);
  } catch (err) {
    console.log("Supabase error:", err.message);
  }

  // Also save locally for quick testing
  buildRequests.push({ username, schematic, timestamp: new Date() });

  res.send({ status: "received" });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Bedmatica Proxy running on port ${PORT}`);
});
