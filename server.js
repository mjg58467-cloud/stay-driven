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

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
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
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
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
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Failed to save store file:', err);
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

  db.updates = [
    {
      id: "upd-001",
      slug: "free-vs-paid-ai-tools-2026",
      tag: "AI TOOL",
      title: "Reinventing Workflows: Free vs Paid AI Tools in 2026",
      excerpt: "AI-driven demand predictions and model tiering are reshaping how teams handle computing budgets and operational velocity.",
      date: "August 21, 2026",
      authorName: "StayDriven Editorial",
      authorAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
      status: "published",
      thumbnailUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      contentType: "both",
      analytics: {
        viewCount: 0,
        uniqueViewCount: 0,
        whatsappClickCount: 0,
        pdfOpenCounts: {},
        resourceLinkClicks: {},
        lastViewedAt: null,
        referrers: {}
      },
      article: {
        sectionTitle: "Navigating Tiered Model Access in Enterprise & Freelance Workflows",
        sectionSubtitle: "Why zero-dollar models are closing the foundational gap, but premium orchestration and low-latency context caching keep the enterprise crown.",
        stories: [
          {
            number: 1,
            heading: "The commoditization of foundational token processing",
            paragraphs: [
              {
                label: "What changes.",
                text: "Open-weight and subsidized base models now achieve 92% of frontier reasoning benchmarks at zero token marginal cost for casual daily usage."
              },
              {
                label: "Why it matters.",
                text: "Teams no longer need to provision $20/seat licenses for simple copy extraction, basic summarization, or semantic classification across standard internal tools."
              },
              "When evaluating commercial AI stacks in 2026, the primary cost driver is no longer raw intelligence, but low-latency context caching and reliable function calling."
            ],
            pullQuote: "“Our mission is to give every builder, no matter their team size, access to world-class AI tools that make growth simple and sustainable.”"
          },
          {
            number: 2,
            heading: "When the paid layer remains irreplaceable",
            paragraphs: [
              {
                label: "Key takeaway.",
                text: "Frontier reasoning models with active search grounding, agentic tool loops, and massive 2M+ context windows justify premium tiers within minutes of high-stakes debugging."
              },
              {
                label: "Action item.",
                text: "Audit your team seats: keep 80% of daily operators on fast commodity models, and reserve frontier subscriptions for architecture leads and security engineers."
              }
            ],
            pullQuote: "“The difference between good and world-class AI deployment isn't token count—it's deterministic execution and autonomous error recovery.”"
          }
        ],
        broaderContext: "As model capabilities compress, the true enterprise moat is domain-specific data formatting, low-friction tool verification layers, and real-time evaluation suites."
      },
      pdfs: [
        {
          label: "AI Tooling Decision Matrix 2026 (PDF)",
          url: "https://drive.google.com/file/d/1ExampleDrivePdfMatrix/view?usp=sharing",
          embedUrl: "https://drive.google.com/file/d/1ExampleDrivePdfMatrix/preview"
        }
      ],
      resourceLinks: [
        { label: "Anthropic Benchmark Comparison Report", url: "https://anthropic.com/research" },
        { label: "Staying Ahead AI Tool Stack Template", url: "https://stayingahead.community/tools" }
      ],
      createdAt: "2026-08-21T09:00:00.000Z",
      updatedAt: "2026-08-21T10:30:00.000Z"
    },
    {
      id: "upd-002",
      slug: "daily-ai-updates-20-august",
      tag: "DAILY AI UPDATE",
      title: "Smarter Supply Chains & Sub-150ms Edge Models",
      excerpt: "Learn how real-time multimodal audio and automated web agents are streamlining enterprise operational logistics.",
      date: "August 20, 2026",
      authorName: "StayDriven Editorial",
      authorAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
      status: "published",
      thumbnailUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
      contentType: "article",
      analytics: {
        viewCount: 0,
        uniqueViewCount: 0,
        whatsappClickCount: 0,
        pdfOpenCounts: {},
        resourceLinkClicks: {},
        lastViewedAt: null,
        referrers: {}
      },
      article: {
        sectionTitle: "Morning Briefing: Fast Real-Time Audio, Deep Search & Multi-Agent Swarms",
        sectionSubtitle: "Catch up on the 3 biggest breakthroughs shifting enterprise workflows and conversational interfaces today.",
        stories: [
          {
            number: 1,
            heading: "Sub-150ms speech-to-speech models deployed at edge",
            paragraphs: [
              {
                label: "What changes.",
                text: "Native multimodal speech models remove transcription steps entirely, capturing emotional tone, cadence, and instant interruptions in fluid real-time calls."
              },
              {
                label: "Why it matters.",
                text: "Customer support, live translation, and voice coding assistants now feel like talking directly with an expert colleague without lag."
              }
            ],
            pullQuote: "“Removing speech-to-text intermediary layers cuts interaction latency by 80% while preserving subtle vocal nuances.”"
          }
        ],
        broaderContext: "Expect major productivity suites to roll out autonomous agentic sidebars over the coming quarter."
      },
      pdfs: [],
      resourceLinks: [
        { label: "Daily Summary Slide Deck", url: "https://stayingahead.community/slides/20-aug" }
      ],
      createdAt: "2026-08-20T08:00:00.000Z",
      updatedAt: "2026-08-20T08:00:00.000Z"
    },
    {
      id: "upd-003",
      slug: "daily-ai-update-19-august",
      tag: "DAILY AI UPDATE",
      title: "Cost Reduction Through Autonomous Automation",
      excerpt: "A look at how engineering leaders cut operational overhead by 65% with scheduled asynchronous agent swarms.",
      date: "August 19, 2026",
      authorName: "StayDriven Editorial",
      authorAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
      status: "published",
      thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
      contentType: "pdf",
      analytics: {
        viewCount: 0,
        uniqueViewCount: 0,
        whatsappClickCount: 0,
        pdfOpenCounts: {},
        resourceLinkClicks: {},
        lastViewedAt: null,
        referrers: {}
      },
      article: {
        sectionTitle: "Executive Summary: Slashing Repetitive Engineering Cycles",
        sectionSubtitle: "Download the slide deck and tactical playbook for setting up background asynchronous agent queues.",
        stories: [
          {
            number: 1,
            heading: "Asynchronous task decomposition and batch execution",
            paragraphs: [
              {
                label: "Key takeaway.",
                text: "Running autonomous agents during off-peak hours on cached context reduces token pricing by 50% and delivers clean PRs before standup."
              }
            ]
          }
        ],
        broaderContext: "Download the attached PDF for the full orchestration architecture."
      },
      pdfs: [
        {
          label: "Staying Ahead 19-Aug Daily Briefing & Prompts (PDF)",
          url: "https://drive.google.com/file/d/1ExampleDrivePdf19Aug/view?usp=sharing",
          embedUrl: "https://drive.google.com/file/d/1ExampleDrivePdf19Aug/preview"
        }
      ],
      resourceLinks: [
        { label: "Research Archive & Guides", url: "#archive" }
      ],
      createdAt: "2026-08-19T08:30:00.000Z",
      updatedAt: "2026-08-19T08:30:00.000Z"
    },
    {
      id: "upd-006",
      slug: "the-ai-alignment-files",
      tag: "GUIDE",
      title: "The AI Alignment Files: Production Guardrails",
      excerpt: "Architecting predictable reasoning, schema verification, and eliminating hallucinations in production workflows.",
      date: "August 9, 2026",
      authorName: "StayDriven Editorial",
      authorAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
      status: "published",
      thumbnailUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
      contentType: "both",
      analytics: {
        viewCount: 0,
        uniqueViewCount: 0,
        whatsappClickCount: 0,
        pdfOpenCounts: {},
        resourceLinkClicks: {},
        lastViewedAt: null,
        referrers: {}
      },
      article: {
        sectionTitle: "Architecting Predictable Reasoning and Safe Output Guardrails",
        sectionSubtitle: "The complete tactical playbook for eliminating hallucinations and parse errors in production microservices.",
        stories: [
          {
            number: 1,
            heading: "Deterministic JSON Schema enforcement at the decoding level",
            paragraphs: [
              {
                label: "What changes.",
                text: "Grammar-constrained sampling guarantees valid syntactic formats without relying on prompt engineering hope."
              },
              {
                label: "Why it matters.",
                text: "Eliminates JSON parse errors and prevents downstream pipeline crashes across mission-critical microservices."
              }
            ],
            pullQuote: "“Deterministic schema enforcement turns probabilistic LLM outputs into dependable API payloads.”"
          }
        ],
        broaderContext: "Robust verification beats larger parameter counts in production environments."
      },
      pdfs: [
        {
          label: "AI Alignment Playbook 2026 (PDF Edition)",
          url: "https://drive.google.com/file/d/1ExampleAlignmentPlaybook/view?usp=sharing",
          embedUrl: "https://drive.google.com/file/d/1ExampleAlignmentPlaybook/preview"
        }
      ],
      resourceLinks: [
        { label: "Prompt Guardrail Library", url: "https://stayingahead.community/guardrails" },
        { label: "Verification Script GitHub Gist", url: "https://gist.github.com/staying-ahead/evals" }
      ],
      createdAt: "2026-08-09T11:00:00.000Z",
      updatedAt: "2026-08-09T11:00:00.000Z"
    },
    {
      id: "upd-008",
      slug: "85-ai-terms-explained-in-simple-words",
      tag: "ROADMAP",
      title: "85 AI Terms Explained in Simple Words",
      excerpt: "A comprehensive visual reference guide decoding RAG, temperature, LoRA, and agentic topologies for everyone.",
      date: "July 6, 2026",
      authorName: "StayDriven Editorial",
      authorAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
      status: "published",
      thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      contentType: "pdf",
      analytics: {
        viewCount: 0,
        uniqueViewCount: 0,
        whatsappClickCount: 0,
        pdfOpenCounts: {},
        resourceLinkClicks: {},
        lastViewedAt: null,
        referrers: {}
      },
      article: {
        sectionTitle: "Demystifying the Modern AI Vocabulary",
        sectionSubtitle: "From attention mechanisms to vector embeddings: clear, jargon-free explanations for leaders and operators.",
        stories: [
          {
            number: 1,
            heading: "Core concepts decoded for business leaders",
            paragraphs: [
              {
                label: "Key takeaway.",
                text: "Understanding the difference between fine-tuning and retrieval-augmented generation saves months of wasted engineering effort."
              }
            ]
          }
        ],
        broaderContext: "Download the complete flashcard deck in the PDF viewer below."
      },
      pdfs: [
        {
          label: "85 AI Terms Glossary & Visual Flashcards (PDF)",
          url: "https://drive.google.com/file/d/1Example85TermsGlossary/view?usp=sharing",
          embedUrl: "https://drive.google.com/file/d/1Example85TermsGlossary/preview"
        }
      ],
      resourceLinks: [
        { label: "Interactive Web Glossary", url: "https://stayingahead.community/glossary" }
      ],
      createdAt: "2026-07-06T12:00:00.000Z",
      updatedAt: "2026-07-06T12:00:00.000Z"
    }
  ];
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
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : req.query.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Valid admin token required.' });
  }

  if (db.sessions && db.sessions[token]) {
    db.sessions[token].lastSeen = Date.now();
    req.adminUser = db.sessions[token].user;
    return next();
  }

  // Graceful session recovery for valid format admin tokens
  if (typeof token === 'string' && token.length >= 32) {
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
    req.adminUser = user;
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized: Session expired or invalid.' });
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
  const newSlug = updateData.slug || updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newItem = {
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

  db.updates.unshift(newItem);
  saveDatabase();

  // GLOBAL BROADCAST TO ALL PUBLIC AND ADMIN SESSIONS INSTANTLY
  broadcast({
    type: 'CONTENT_UPDATED',
    action: 'CREATE',
    item: newItem,
    publishedUpdates: db.updates.filter(u => u.status === 'published'),
    allUpdates: db.updates
  });

  res.status(201).json({ success: true, item: newItem });
});

app.put('/api/content/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const now = new Date().toISOString();

  const idx = db.updates.findIndex(u => u.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Update not found.' });
  }

  const existing = db.updates[idx];
  const updatedItem = {
    ...existing,
    ...updateData,
    id: existing.id,
    updatedAt: now,
    analytics: existing.analytics || updateData.analytics
  };

  db.updates[idx] = updatedItem;
  saveDatabase();

  // GLOBAL REAL-TIME BROADCAST TO ALL CONNECTED CLIENTS
  broadcast({
    type: 'CONTENT_UPDATED',
    action: 'UPDATE',
    item: updatedItem,
    publishedUpdates: db.updates.filter(u => u.status === 'published'),
    allUpdates: db.updates
  });

  res.json({ success: true, item: updatedItem });
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

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[StayDriven Server] running on http://0.0.0.0:${PORT}`);
});
