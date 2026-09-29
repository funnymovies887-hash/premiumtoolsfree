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
const SRC_DATA_DIR = path.join(__dirname, 'src', 'data');
const SRC_DB_FILE = path.join(SRC_DATA_DIR, 'database.json');

app.use(express.json({ limit: '15mb' }));

// Ensure database file exists and reads from primary or source tree
function getDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      if (raw.trim()) {
        return JSON.parse(raw);
      }
    }
    if (fs.existsSync(SRC_DB_FILE)) {
      const raw = fs.readFileSync(SRC_DB_FILE, 'utf-8');
      if (raw.trim()) {
        return JSON.parse(raw);
      }
    }
  } catch (err) {
    console.error('Error reading database file:', err);
  }
  return null;
}

// Persist data simultaneously to /data/database.json and /src/data/database.json for GitHub/repo persistence
function saveDatabase(data: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(SRC_DATA_DIR)) {
      fs.mkdirSync(SRC_DATA_DIR, { recursive: true });
    }
    const payload = {
      ...data,
      updatedAt: Date.now(),
    };
    const jsonString = JSON.stringify(payload, null, 2);
    fs.writeFileSync(DB_FILE, jsonString, 'utf-8');
    fs.writeFileSync(SRC_DB_FILE, jsonString, 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database files:', err);
    return false;
  }
}

// GitHub Sync Helper Function using standard GitHub REST API
async function syncDatabaseToGitHub(githubConfig: {
  token: string;
  owner: string;
  repo: string;
  branch?: string;
}) {
  const { token, owner, repo, branch = 'main' } = githubConfig;
  if (!token || !owner || !repo) {
    throw new Error('GitHub PAT, Owner, and Repository must be configured');
  }

  const cleanToken = token.trim();
  const cleanOwner = owner.trim();
  const cleanRepo = repo.trim();
  const targetBranch = branch.trim() || 'main';

  // Read current database contents
  let dbContent = '';
  if (fs.existsSync(DB_FILE)) {
    dbContent = fs.readFileSync(DB_FILE, 'utf-8');
  } else if (fs.existsSync(SRC_DB_FILE)) {
    dbContent = fs.readFileSync(SRC_DB_FILE, 'utf-8');
  } else {
    throw new Error('Database file not found on server');
  }

  const filesToCommit = [
    { path: 'src/data/database.json', content: dbContent },
    { path: 'data/database.json', content: dbContent },
  ];

  let lastCommitUrl = '';

  for (const item of filesToCommit) {
    let existingSha: string | undefined;
    try {
      const getRes = await fetch(
        `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${item.path}?ref=${targetBranch}`,
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': 'AIStudio-Admin-App',
          },
        }
      );
      if (getRes.ok) {
        const fileData: any = await getRes.json();
        existingSha = fileData.sha;
      }
    } catch (e) {
      console.warn(`Could not check existing file for ${item.path}:`, e);
    }

    const putRes = await fetch(
      `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${item.path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'AIStudio-Admin-App',
        },
        body: JSON.stringify({
          message: `Update ${item.path} via Admin Control Center [skip ci]`,
          content: Buffer.from(item.content).toString('base64'),
          sha: existingSha,
          branch: targetBranch,
        }),
      }
    );

    if (!putRes.ok) {
      const errJson: any = await putRes.json().catch(() => ({ message: putRes.statusText }));
      throw new Error(`Failed to commit ${item.path}: ${errJson.message || putRes.statusText}`);
    }

    const putData: any = await putRes.json();
    if (putData?.commit?.html_url) {
      lastCommitUrl = putData.commit.html_url;
    }
  }

  return {
    success: true,
    message: `Successfully pushed updates to GitHub repository (${cleanOwner}/${cleanRepo} on branch "${targetBranch}")!`,
    timestamp: Date.now(),
    commitUrl: lastCommitUrl || `https://github.com/${cleanOwner}/${cleanRepo}`,
  };
}

// Trigger background GitHub sync if autoSync is enabled
function triggerAutoGitHubSync(currentDb: any) {
  try {
    const gh = currentDb?.siteSettings?.githubSettings;
    if (gh && gh.token && gh.owner && gh.repo && gh.autoSync !== false) {
      syncDatabaseToGitHub(gh)
        .then((res) => {
          console.log('Background GitHub Auto-Sync succeeded:', res.message);
          // Update lastSyncedAt timestamp in database
          currentDb.siteSettings.githubSettings.lastSyncedAt = Date.now();
          currentDb.siteSettings.githubSettings.lastSyncStatus = 'success';
          saveDatabase(currentDb);
        })
        .catch((err) => {
          console.warn('Background GitHub Auto-Sync warning:', err.message);
          if (currentDb?.siteSettings?.githubSettings) {
            currentDb.siteSettings.githubSettings.lastSyncStatus = 'error';
            currentDb.siteSettings.githubSettings.lastSyncMessage = err.message;
            saveDatabase(currentDb);
          }
        });
    }
  } catch (err) {
    console.warn('Could not run triggerAutoGitHubSync:', err);
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

app.post('/api/save', async (req, res) => {
  const { apps, adSettings, siteSettings } = req.body;
  const current = getDatabase() || {};
  const updated = {
    apps: Array.isArray(apps) ? apps : current.apps || [],
    adSettings: adSettings || current.adSettings || {},
    siteSettings: siteSettings || current.siteSettings || {},
  };
  const ok = saveDatabase(updated);
  if (ok) {
    triggerAutoGitHubSync(updated);
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
    triggerAutoGitHubSync(current);
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
    triggerAutoGitHubSync(current);
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
    triggerAutoGitHubSync(current);
    return res.json({ success: true, message: 'Site settings updated successfully' });
  }
  return res.status(500).json({ success: false, error: 'Failed to save site settings' });
});

// GitHub API Test Connection Route
app.post('/api/github/test', async (req, res) => {
  try {
    const { token, owner, repo } = req.body;
    if (!token || !owner || !repo) {
      return res.status(400).json({
        success: false,
        error: 'GitHub Token (PAT), Owner (Username), and Repository name are required.',
      });
    }

    const cleanToken = token.trim();
    const cleanOwner = owner.trim();
    const cleanRepo = repo.trim();

    const response = await fetch(`https://api.github.com/repos/${cleanOwner}/${cleanRepo}`, {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'AIStudio-Admin-App',
      },
    });

    if (response.ok) {
      const data: any = await response.json();
      return res.json({
        success: true,
        message: `Connected successfully to GitHub repo "${data.full_name}" (${data.private ? 'Private' : 'Public'})!`,
        repo: data.full_name,
        defaultBranch: data.default_branch,
      });
    }

    if (response.status === 401) {
      return res.status(401).json({
        success: false,
        error: 'Invalid GitHub PAT (Personal Access Token). Please verify your token has "repo" scope.',
      });
    }

    if (response.status === 404) {
      return res.status(404).json({
        success: false,
        error: `Repository "${cleanOwner}/${cleanRepo}" was not found. Please verify the username and repository name.`,
      });
    }

    const errText = await response.text();
    return res.status(response.status).json({
      success: false,
      error: `GitHub API error (${response.status}): ${errText}`,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Server error testing GitHub connection',
    });
  }
});

// GitHub Direct Manual Sync Route
app.post('/api/github/sync', async (req, res) => {
  try {
    const current = getDatabase() || {};
    const config = req.body?.githubSettings || current?.siteSettings?.githubSettings;

    if (!config || !config.token || !config.owner || !config.repo) {
      return res.status(400).json({
        success: false,
        error: 'GitHub PAT, Owner, and Repo are not configured yet. Please configure them in the GitHub tab.',
      });
    }

    const result = await syncDatabaseToGitHub(config);

    // Save timestamp to database
    if (current.siteSettings) {
      if (!current.siteSettings.githubSettings) {
        current.siteSettings.githubSettings = config;
      }
      current.siteSettings.githubSettings.lastSyncedAt = result.timestamp;
      current.siteSettings.githubSettings.lastSyncStatus = 'success';
      saveDatabase(current);
    }

    return res.json(result);
  } catch (err: any) {
    console.error('GitHub manual sync error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to sync with GitHub',
    });
  }
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
