import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

app.use(express.json({ limit: '15mb' }));

// Ensure database file exists
function getDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      if (raw.trim()) {
        return JSON.parse(raw);
      }
    }
  } catch (err) {
    console.error('Error reading database file:', err);
  }
  return null;
}

function saveDatabase(data: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const payload = {
      ...data,
      updatedAt: Date.now(),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
}

// API Routes for Persistent Permanent Storage
app.get('/api/data', (_req, res) => {
  const db = getDatabase();
  if (db) {
    return res.json({ success: true, data: db });
  }
  return res.status(500).json({ success: false, error: 'Failed to read database' });
});

app.post('/api/save', (req, res) => {
  const { apps, adSettings, siteSettings } = req.body;
  const current = getDatabase() || {};
  const updated = {
    apps: Array.isArray(apps) ? apps : current.apps || [],
    adSettings: adSettings || current.adSettings || {},
    siteSettings: siteSettings || current.siteSettings || {},
  };
  const ok = saveDatabase(updated);
  if (ok) {
    return res.json({ success: true, message: 'Saved permanently to server', data: updated });
  }
  return res.status(500).json({ success: false, error: 'Failed to write to database' });
});

app.post('/api/apps', (req, res) => {
  const { apps } = req.body;
  if (!Array.isArray(apps)) {
    return res.status(400).json({ success: false, error: 'Apps must be an array' });
  }
  const current = getDatabase() || {};
  current.apps = apps;
  const ok = saveDatabase(current);
  if (ok) {
    return res.json({ success: true, message: 'Apps updated successfully' });
  }
  return res.status(500).json({ success: false, error: 'Failed to save apps' });
});

app.post('/api/ads', (req, res) => {
  const { adSettings } = req.body;
  const current = getDatabase() || {};
  current.adSettings = { ...current.adSettings, ...adSettings };
  const ok = saveDatabase(current);
  if (ok) {
    return res.json({ success: true, message: 'Ad settings updated successfully' });
  }
  return res.status(500).json({ success: false, error: 'Failed to save ad settings' });
});

app.post('/api/site', (req, res) => {
  const { siteSettings } = req.body;
  const current = getDatabase() || {};
  current.siteSettings = { ...current.siteSettings, ...siteSettings };
  const ok = saveDatabase(current);
  if (ok) {
    return res.json({ success: true, message: 'Site settings updated successfully' });
  }
  return res.status(500).json({ success: false, error: 'Failed to save site settings' });
});

// Full-Stack Dev Server Mounting
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
