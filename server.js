import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Lightweight Tracking API Endpoint (Silent & Resilient)
app.post('/api/track', (req, res) => {
  try {
    const event = req.body;
    // Log or acknowledge event silently
    return res.status(200).json({ status: 'ok', receivedAt: new Date().toISOString() });
  } catch (err) {
    return res.status(200).json({ status: 'ignored' });
  }
});

app.get(['/sd-internal-access*', '/admin*'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

