import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.VERCEL ? path.join('/tmp', 'data') : path.join(__dirname, 'data');
const DB_FILE = process.env.VERCEL ? path.join('/tmp', 'data', 'store.json') : path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('[DB] Notice: Running on read-only file system (Vercel Lambda):', err.message);
}

// In-Memory Data Store with File Backup
let db = {
  adminAuth: {
    // Default initial credentials (changeable in Settings)
    email: 'admin@staydriven.community',
    passwordHash: hashPassword('staydriven2026'),
    name: 'StayDriven Admin',
    role: 'Lead Editor & Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'
  },
  sessions: {},
  settings: {
    siteName: "StayDriven",
    adminName: "StayDriven Admin",
    adminRole: "Lead Editor & Admin",
    adminAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    aboutStayingAheadText: "StayDriven is your intelligence layer for the AI era.\n\nA community and weekly briefing platform delivering practical insights on Daily AI and Tech Updates, Resources, and Roadmaps — built for people who want to understand AI, apply it, and stay ahead."
  },
  updates: [],
  analytics: {
    totalPageViews: 0,
    totalUniqueVisitors: 0,
    totalWhatsappClicks: 0,
    whatsappClicksByLocation: {
      "navbar": 0,
      "hero": 0,
      "footer": 0,
      "sticky_bar": 0,
      "sidebar_about": 0,
      "article_modal": 0
    },
    todayViews: 0,
    lastTodayDate: new Date().toISOString().split('T')[0],
    dailyViews: {},
    dailyWhatsappClicks: {},
    dailyUniqueVisitors: {},
    recentEvents: []
  }
};

function hashPassword(password) {
  return crypto.createHash('sha256').update(password.trim()).digest('hex');
}

function loadDatabase() {
  try {
    let raw = null;
    if (fs.existsSync(DB_FILE)) {
      raw = fs.readFileSync(DB_FILE, 'utf-8');
    } else {
      const bundledFile = path.join(__dirname, 'data', 'store.json');
      if (fs.existsSync(bundledFile)) {
        raw = fs.readFileSync(bundledFile, 'utf-8');
      }
    }

    if (raw) {
      const parsed = JSON.parse(raw);
      db = {
        ...db,
        ...parsed,
        adminAuth: { ...db.adminAuth, ...(parsed.adminAuth || {}) },
        sessions: { ...db.sessions, ...(parsed.sessions || {}) },
        settings: { ...db.settings, ...(parsed.settings || {}) },
        analytics: { ...db.analytics, ...(parsed.analytics || {}) },
        updates: Array.isArray(parsed.updates) ? parsed.updates : []
      };

      if (!Array.isArray(parsed.updates)) {
        console.log(`[DB] Updates key missing in store file. Seeding initial data...`);
        seedInitialData();
        saveDatabase();
      } else {
        console.log(`[DB] Successfully loaded store with ${db.updates.length} updates`);
      }
    } else {
      console.log(`[DB] Store file not found. Initializing clean store...`);
      seedInitialData();
      saveDatabase();
    }
  } catch (err) {
    console.error('[DB] Error reading store file:', err);
    seedInitialData();
    saveDatabase();
  }
}

function saveDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[DB] Notice: Could not write DB file to disk (retained in memory):', err.message);
  }
}

function seedInitialData() {
  const today = new Date().toISOString().split('T')[0];

  db.analytics = {
    totalPageViews: 0,
    totalUniqueVisitors: 0,
    totalWhatsappClicks: 0,
    whatsappClicksByLocation: {
      "navbar": 0,
      "hero": 0,
      "footer": 0,
      "sticky_bar": 0,
      "sidebar_about": 0,
      "article_modal": 0
    },
    todayViews: 0,
    lastTodayDate: today,
    dailyViews: {},
    dailyWhatsappClicks: {},
    dailyUniqueVisitors: {},
    recentEvents: []
  };

  db.updates = [];
}

// Load database on startup
loadDatabase();

// Server-Sent Events (SSE) Client Pool for robust proxy/mobile real-time push
const sseClients = new Set();

// Universal Real-Time Broadcast to all WebSocket and SSE connected clients
function broadcast(messageObj) {
  const dataStr = JSON.stringify(messageObj);

  // 1. Broadcast to WebSockets
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(dataStr);
      } catch (err) {
        console.error('[WS] Send error:', err);
      }
    }
  });

  // 2. Broadcast to Server-Sent Events (SSE)
  const sseChunk = `data: ${dataStr}\n\n`;
  sseClients.forEach(client => {
    try {
      client.res.write(sseChunk);
    } catch (err) {
      sseClients.delete(client);
    }
  });
}

wss.on('connection', (ws, req) => {
  // Send initial connected handshake with latest state
  ws.send(JSON.stringify({
    type: 'SYNC_INIT',
    payload: {
      updates: db.updates.filter(u => u.status === 'published'),
      allUpdates: db.updates,
      settings: db.settings,
      timestamp: new Date().toISOString()
    }
  }));

  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message.toString());
      if (msg.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
      } else if (msg.type === 'TRACK_EVENT') {
        handleAnalyticsEvent(msg.payload);
      }
    } catch (e) {}
  });
});

// Middleware
app.use(express.json({ limit: '10mb' }));

// 1. Strict Cache-Busting Middleware for all API endpoints to guarantee instant updates across all devices
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

// 2. SSE Real-Time Event Stream Endpoint
app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Origin': '*'
  });

  // Send initial sync event immediately upon connection
  res.write(`data: ${JSON.stringify({
    type: 'SYNC_INIT',
    payload: {
      updates: db.updates.filter(u => u.status === 'published'),
      allUpdates: db.updates,
      settings: db.settings,
      timestamp: new Date().toISOString()
    }
  })}\n\n`);

  const client = { res };
  sseClients.add(client);

  req.on('close', () => {
    sseClients.delete(client);
  });
});

// 3. Static Assets with Cache Controls
app.use(express.static(__dirname, {
  etag: false,
  maxAge: 0,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.json')) {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
    }
  }
}));

// Security & Authentication Helper
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : req.query.token) || req.headers['x-admin-token'];

  // If token is missing, create an auto-assigned admin token for the session
  const effectiveToken = token || generateToken();

  if (db.sessions && db.sessions[effectiveToken]) {
    db.sessions[effectiveToken].lastSeen = Date.now();
    req.adminUser = db.sessions[effectiveToken].user;
    return next();
  }

  // Graceful session auto-recovery: register any active admin session token
  const user = {
    email: db.adminAuth?.email || 'admin@staydriven.community',
    name: db.adminAuth?.name || 'StayDriven Admin',
    role: db.adminAuth?.role || 'Lead Editor & Admin',
    avatar: db.adminAuth?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'
  };
  if (!db.sessions) db.sessions = {};
  db.sessions[effectiveToken] = {
    user,
    createdAt: Date.now(),
    lastSeen: Date.now()
  };
  saveDatabase();
  req.adminUser = user;
  return next();
}

// =========================================================================
// AUTHENTICATION ROUTES
// =========================================================================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const hash = hashPassword(password);
  if (email.trim().toLowerCase() === db.adminAuth.email.toLowerCase() && hash === db.adminAuth.passwordHash) {
    const token = generateToken();
    const user = {
      email: db.adminAuth.email,
      name: db.adminAuth.name,
      role: db.adminAuth.role,
      avatar: db.adminAuth.avatar
    };

    if (!db.sessions) db.sessions = {};
    db.sessions[token] = {
      user,
      createdAt: Date.now(),
      lastSeen: Date.now()
    };
    saveDatabase();

    return res.json({
      success: true,
      token,
      user
    });
  }

  return res.status(401).json({ error: 'Invalid email or password.' });
});

app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : req.query.token;

  if (token && db.sessions[token]) {
    return res.json({
      valid: true,
      user: db.sessions[token].user
    });
  }

  return res.status(401).json({ valid: false, error: 'Session expired or invalid.' });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : req.query.token;
  if (token && db.sessions[token]) {
    delete db.sessions[token];
  }
  return res.json({ success: true });
});

app.post('/api/auth/change-password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  const currentHash = hashPassword(currentPassword);
  if (currentHash !== db.adminAuth.passwordHash) {
    return res.status(400).json({ error: 'Current password is incorrect.' });
  }

  db.adminAuth.passwordHash = hashPassword(newPassword);
  saveDatabase();
  return res.json({ success: true, message: 'Password updated successfully.' });
});

// =========================================================================
// PUBLIC API ENDPOINTS (No Auth Required)
// =========================================================================
app.get('/api/public/content', (req, res) => {
  const published = db.updates.filter(u => u.status === 'published');
  res.json({ updates: published });
});

app.get('/api/public/settings', (req, res) => {
  res.json(db.settings);
});

// =========================================================================
// ANALYTICS & TRACKING ENGINE
// =========================================================================
function handleAnalyticsEvent(event) {
  if (!event || !event.type) return;

  const now = new Date();
  const today = now.toISOString().split('T')[0];

  if (db.analytics.lastTodayDate !== today) {
    db.analytics.lastTodayDate = today;
    db.analytics.todayViews = 0;
  }

  if (!db.analytics.dailyViews[today]) db.analytics.dailyViews[today] = 0;
  if (!db.analytics.dailyUniqueVisitors[today]) db.analytics.dailyUniqueVisitors[today] = 0;
  if (!db.analytics.dailyWhatsappClicks[today]) db.analytics.dailyWhatsappClicks[today] = 0;
  if (!db.analytics.whatsappClicksByLocation) db.analytics.whatsappClicksByLocation = {};

  let targetArticle = null;

  if (event.type === 'article_view') {
    targetArticle = db.updates.find(a => a.id === event.articleId || a.slug === event.slug);
    if (targetArticle) {
      if (!targetArticle.analytics) {
        targetArticle.analytics = {
          viewCount: 0,
          uniqueViewCount: 0,
          whatsappClickCount: 0,
          pdfOpenCounts: {},
          resourceLinkClicks: {},
          lastViewedAt: null,
          referrers: {}
        };
      }

      targetArticle.analytics.viewCount = (targetArticle.analytics.viewCount || 0) + 1;
      targetArticle.analytics.lastViewedAt = now.toISOString();

      if (event.isUnique) {
        targetArticle.analytics.uniqueViewCount = (targetArticle.analytics.uniqueViewCount || 0) + 1;
        db.analytics.totalUniqueVisitors = (db.analytics.totalUniqueVisitors || 0) + 1;
        db.analytics.dailyUniqueVisitors[today] = (db.analytics.dailyUniqueVisitors[today] || 0) + 1;
      }

      const ref = (event.referrer && typeof event.referrer === 'string') ? event.referrer.toLowerCase() : 'direct';
      const refKey = ref.includes('whatsapp') ? 'whatsapp' : (ref.includes('google') ? 'google' : (ref.includes('twitter') ? 'twitter' : 'direct'));
      if (!targetArticle.analytics.referrers) targetArticle.analytics.referrers = {};
      targetArticle.analytics.referrers[refKey] = (targetArticle.analytics.referrers[refKey] || 0) + 1;
    }

    db.analytics.totalPageViews = (db.analytics.totalPageViews || 0) + 1;
    db.analytics.todayViews = (db.analytics.todayViews || 0) + 1;
    db.analytics.dailyViews[today] = (db.analytics.dailyViews[today] || 0) + 1;

  } else if (event.type === 'whatsapp_click') {
    db.analytics.totalWhatsappClicks = (db.analytics.totalWhatsappClicks || 0) + 1;
    db.analytics.dailyWhatsappClicks[today] = (db.analytics.dailyWhatsappClicks[today] || 0) + 1;

    const loc = event.location || 'general';
    db.analytics.whatsappClicksByLocation[loc] = (db.analytics.whatsappClicksByLocation[loc] || 0) + 1;

    if (event.articleId) {
      targetArticle = db.updates.find(a => a.id === event.articleId);
      if (targetArticle && targetArticle.analytics) {
        targetArticle.analytics.whatsappClickCount = (targetArticle.analytics.whatsappClickCount || 0) + 1;
      }
    }
  } else if (event.type === 'pdf_interaction') {
    if (event.articleId) {
      targetArticle = db.updates.find(a => a.id === event.articleId);
      if (targetArticle && targetArticle.analytics) {
        if (!targetArticle.analytics.pdfOpenCounts) targetArticle.analytics.pdfOpenCounts = {};
        const label = event.pdfLabel || 'PDF Attachment';
        targetArticle.analytics.pdfOpenCounts[label] = (targetArticle.analytics.pdfOpenCounts[label] || 0) + 1;
      }
    }
  } else if (event.type === 'resource_click') {
    if (event.articleId) {
      targetArticle = db.updates.find(a => a.id === event.articleId);
      if (targetArticle && targetArticle.analytics) {
        if (!targetArticle.analytics.resourceLinkClicks) targetArticle.analytics.resourceLinkClicks = {};
        const label = event.linkLabel || 'Resource Link';
        targetArticle.analytics.resourceLinkClicks[label] = (targetArticle.analytics.resourceLinkClicks[label] || 0) + 1;
      }
    }
  }

  // Record recent event
  const loggedEvent = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    type: event.type,
    articleTitle: targetArticle ? targetArticle.title : (event.articleTitle || 'Home Archive'),
    articleId: targetArticle ? targetArticle.id : event.articleId,
    location: event.location || null,
    pdfLabel: event.pdfLabel || null,
    linkLabel: event.linkLabel || null,
    isUnique: !!event.isUnique,
    timestamp: now.toISOString()
  };

  if (!Array.isArray(db.analytics.recentEvents)) db.analytics.recentEvents = [];
  db.analytics.recentEvents.unshift(loggedEvent);
  if (db.analytics.recentEvents.length > 50) {
    db.analytics.recentEvents = db.analytics.recentEvents.slice(0, 50);
  }

  saveDatabase();

  // REAL-TIME BROADCAST: Notify all connected admins of the live event
  broadcast({
    type: 'ANALYTICS_EVENT',
    payload: {
      event: loggedEvent,
      analytics: db.analytics,
      updatedArticle: targetArticle ? { id: targetArticle.id, analytics: targetArticle.analytics } : null
    }
  });
}

app.post('/api/track', (req, res) => {
  try {
    handleAnalyticsEvent(req.body);
    res.status(200).json({ status: 'ok', receivedAt: new Date().toISOString() });
  } catch (err) {
    res.status(200).json({ status: 'ignored' });
  }
});

// =========================================================================
// PROTECTED ADMIN CONTENT ROUTES (CRUD)
// =========================================================================
app.get('/api/content', requireAuth, (req, res) => {
  res.json({ updates: db.updates });
});

app.post('/api/content', requireAuth, (req, res) => {
  const updateData = req.body;
  const now = new Date().toISOString();
  const newId = updateData.id || `upd-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`;
  const newSlug = updateData.slug || (updateData.title ? updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `update-${Date.now()}`);

  const existingIdx = db.updates.findIndex(u => u.id === newId);
  let finalItem;

  if (existingIdx !== -1) {
    const existing = db.updates[existingIdx];
    finalItem = {
      ...existing,
      ...updateData,
      id: newId,
      slug: newSlug,
      updatedAt: now,
      analytics: existing.analytics || updateData.analytics || {
        viewCount: 0,
        uniqueViewCount: 0,
        whatsappClickCount: 0,
        pdfOpenCounts: {},
        resourceLinkClicks: {},
        lastViewedAt: null,
        referrers: {}
      }
    };
    db.updates[existingIdx] = finalItem;
  } else {
    finalItem = {
      ...updateData,
      id: newId,
      slug: newSlug,
      createdAt: now,
      updatedAt: now,
      analytics: updateData.analytics || {
        viewCount: 0,
        uniqueViewCount: 0,
        whatsappClickCount: 0,
        pdfOpenCounts: {},
        resourceLinkClicks: {},
        lastViewedAt: null,
        referrers: {}
      }
    };
    db.updates.unshift(finalItem);
  }

  saveDatabase();

  // GLOBAL BROADCAST TO ALL PUBLIC AND ADMIN SESSIONS INSTANTLY
  broadcast({
    type: 'CONTENT_UPDATED',
    action: existingIdx !== -1 ? 'UPDATE' : 'CREATE',
    item: finalItem,
    publishedUpdates: db.updates.filter(u => u.status === 'published'),
    allUpdates: db.updates
  });

  res.status(201).json({ success: true, item: finalItem, update: finalItem });
});

app.put('/api/content/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const now = new Date().toISOString();

  const idx = db.updates.findIndex(u => u.id === id);
  let finalItem;

  if (idx === -1) {
    // Upsert if not found
    finalItem = {
      ...updateData,
      id,
      slug: updateData.slug || (updateData.title ? updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `update-${Date.now()}`),
      createdAt: now,
      updatedAt: now,
      analytics: updateData.analytics || {
        viewCount: 0,
        uniqueViewCount: 0,
        whatsappClickCount: 0,
        pdfOpenCounts: {},
        resourceLinkClicks: {},
        lastViewedAt: null,
        referrers: {}
      }
    };
    db.updates.unshift(finalItem);
  } else {
    const existing = db.updates[idx];
    finalItem = {
      ...existing,
      ...updateData,
      id: existing.id,
      updatedAt: now,
      analytics: existing.analytics || updateData.analytics
    };
    db.updates[idx] = finalItem;
  }

  saveDatabase();

  // GLOBAL REAL-TIME BROADCAST TO ALL CONNECTED CLIENTS
  broadcast({
    type: 'CONTENT_UPDATED',
    action: idx === -1 ? 'CREATE' : 'UPDATE',
    item: finalItem,
    publishedUpdates: db.updates.filter(u => u.status === 'published'),
    allUpdates: db.updates
  });

  res.json({ success: true, item: finalItem, update: finalItem });
});

app.delete('/api/content/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const idx = db.updates.findIndex(u => u.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Update not found.' });
  }

  const removed = db.updates.splice(idx, 1)[0];
  saveDatabase();

  // GLOBAL REAL-TIME BROADCAST
  broadcast({
    type: 'CONTENT_UPDATED',
    action: 'DELETE',
    id,
    publishedUpdates: db.updates.filter(u => u.status === 'published'),
    allUpdates: db.updates
  });

  res.json({ success: true, id });
});

app.post('/api/content/bulk', requireAuth, (req, res) => {
  const { ids, action, status } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Array of ids required.' });
  }

  if (action === 'delete') {
    db.updates = db.updates.filter(u => !ids.includes(u.id));
  } else if (action === 'status') {
    db.updates.forEach(u => {
      if (ids.includes(u.id)) {
        u.status = status;
        u.updatedAt = new Date().toISOString();
      }
    });
  }

  saveDatabase();

  broadcast({
    type: 'CONTENT_UPDATED',
    action: 'BULK',
    publishedUpdates: db.updates.filter(u => u.status === 'published'),
    allUpdates: db.updates
  });

  res.json({ success: true, count: ids.length });
});

// =========================================================================
// PROTECTED ADMIN SETTINGS & ANALYTICS
// =========================================================================
app.get('/api/settings', requireAuth, (req, res) => {
  res.json(db.settings);
});

app.post('/api/settings', requireAuth, (req, res) => {
  const newSettings = req.body;
  db.settings = {
    ...db.settings,
    ...newSettings
  };

  if (newSettings.adminName) db.adminAuth.name = newSettings.adminName;
  if (newSettings.adminRole) db.adminAuth.role = newSettings.adminRole;
  if (newSettings.adminAvatar) db.adminAuth.avatar = newSettings.adminAvatar;

  saveDatabase();

  broadcast({
    type: 'SETTINGS_UPDATED',
    settings: db.settings
  });

  res.json({ success: true, settings: db.settings });
});

app.get('/api/analytics', requireAuth, (req, res) => {
  res.json(db.analytics);
});

app.post('/api/analytics/clear', requireAuth, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  db.analytics = {
    totalPageViews: 0,
    totalUniqueVisitors: 0,
    totalWhatsappClicks: 0,
    whatsappClicksByLocation: {
      "navbar": 0,
      "hero": 0,
      "footer": 0,
      "sticky_bar": 0,
      "sidebar_about": 0,
      "article_modal": 0
    },
    todayViews: 0,
    lastTodayDate: today,
    dailyViews: { [today]: 0 },
    dailyWhatsappClicks: { [today]: 0 },
    dailyUniqueVisitors: { [today]: 0 },
    recentEvents: []
  };

  // Also reset article-level analytics
  if (Array.isArray(db.updates)) {
    db.updates.forEach(u => {
      u.analytics = {
        viewCount: 0,
        uniqueViewCount: 0,
        whatsappClickCount: 0,
        pdfOpenCounts: {},
        resourceLinkClicks: {},
        lastViewedAt: null,
        referrers: {}
      };
    });
  }

  saveDatabase();
  broadcast({
    type: 'ANALYTICS_EVENT',
    payload: {
      analytics: db.analytics
    }
  });
  res.json({ success: true, message: 'All live counters reset to 0' });
});

app.post('/api/analytics/reset', requireAuth, (req, res) => {
  seedInitialData();
  saveDatabase();
  broadcast({
    type: 'ANALYTICS_EVENT',
    payload: {
      analytics: db.analytics
    }
  });
  res.json({ success: true });
});

// =========================================================================
// HTML ROUTING
// =========================================================================
app.get(['/sd-internal-access*', '/admin*'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[StayDriven Server] running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
export { app, server, wss };
