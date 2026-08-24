// CMS Data Store, Real-Time WebSocket Sync & Analytics Engine for StayDriven

const STORAGE_KEY = 'staydriven_updates_v2';
const AUTH_KEY = 'staydriven_admin_auth';
const TOKEN_KEY = 'staydriven_admin_token';
const SETTINGS_KEY = 'staydriven_admin_settings_v2';
const ANALYTICS_KEY = 'staydriven_site_analytics_v2';

export const INITIAL_UPDATES = [
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
      { label: "Community Discussion Thread", url: "https://chat.whatsapp.com/staying-ahead" }
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

const DEFAULT_ABOUT_TEXT = "StayDriven is your intelligence layer for the AI era.\n\nA community and weekly briefing platform delivering practical insights on Daily AI and Tech Updates, Resources, and Roadmaps — built for people who want to understand AI, apply it, and stay ahead.";

export class CMSStore {
  constructor() {
    this.ws = null;
    this.wsConnected = false;
    this.reconnectTimer = null;
    this.pingTimer = null;
    this.pollingTimer = null;
    this.isSyncing = false;

    this.init();
    this.initWebSocket();
    this.syncFromServer();
    this.initContinuousSync();
  }

  initContinuousSync() {
    // 1. Periodic background sync every 4 seconds
    if (this.pollingTimer) clearInterval(this.pollingTimer);
    this.pollingTimer = setInterval(() => {
      this.syncFromServer();
    }, 4000);

    // 2. Immediate sync when user switches tabs back or focuses window
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.syncFromServer();
        }
      });

      window.addEventListener('focus', () => {
        this.syncFromServer();
      });

      window.addEventListener('online', () => {
        this.syncFromServer();
      });
    }
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_UPDATES));
    }

    if (!localStorage.getItem(AUTH_KEY)) {
      localStorage.setItem(AUTH_KEY, JSON.stringify({
        isAuthenticated: false,
        user: null
      }));
    }

    if (!localStorage.getItem(SETTINGS_KEY)) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({
        siteName: "StayDriven",
        adminName: "StayDriven Admin",
        adminRole: "Lead Editor & Admin",
        adminEmail: "admin@staydriven.community",
        adminAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
        aboutStayingAheadText: DEFAULT_ABOUT_TEXT,
        notificationsEnabled: true
      }));
    }

    // Initialize Site Analytics with real baseline (0 counters)
    const today = new Date().toISOString().split('T')[0];
    const existingRaw = localStorage.getItem(ANALYTICS_KEY);
    let parsedAnalytics = null;
    try {
      parsedAnalytics = existingRaw ? JSON.parse(existingRaw) : null;
    } catch (e) {}

    // If no analytics or if containing legacy hardcoded demo numbers (> 5000 views), sanitize to real clean 0
    if (!parsedAnalytics || parsedAnalytics.totalPageViews > 5000) {
      const cleanAnalytics = {
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
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(cleanAnalytics));
    }
  }

  // =========================================================================
  // REAL-TIME WEBSOCKET SYNCHRONIZATION
  // =========================================================================
  initWebSocket() {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      if (!host) return;

      const wsUrl = `${protocol}//${host}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.wsConnected = true;
        // Start ping heartbeat
        if (this.pingTimer) clearInterval(this.pingTimer);
        this.pingTimer = setInterval(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'PING' }));
          }
        }, 25000);
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleWebSocketMessage(msg);
        } catch (e) {}
      };

      this.ws.onclose = () => {
        this.wsConnected = false;
        if (this.pingTimer) clearInterval(this.pingTimer);
        // Auto-reconnect with exponential backoff
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
          this.initWebSocket();
        }, 3000);
      };

      this.ws.onerror = () => {
        this.wsConnected = false;
      };
    } catch (err) {
      this.wsConnected = false;
    }
  }

  handleWebSocketMessage(msg) {
    if (!msg || !msg.type) return;

    if (msg.type === 'SYNC_INIT') {
      if (msg.payload && Array.isArray(msg.payload.updates)) {
        const auth = this.getAuth();
        const updates = auth.isAuthenticated ? msg.payload.updates : msg.payload.updates.filter(u => u.status === 'published');
        this.setServerUpdates(updates);
      }
      if (msg.payload && msg.payload.settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(msg.payload.settings));
        this.notifyChange();
      }
    } else if (msg.type === 'CONTENT_UPDATED') {
      const auth = this.getAuth();
      const updates = auth.isAuthenticated && msg.allUpdates ? msg.allUpdates : (msg.publishedUpdates || (msg.allUpdates ? msg.allUpdates.filter(u => u.status === 'published') : null));
      if (Array.isArray(updates)) {
        this.setServerUpdates(updates);
      }
    } else if (msg.type === 'SETTINGS_UPDATED') {
      if (msg.settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(msg.settings));
        this.notifyChange();
      }
    } else if (msg.type === 'ANALYTICS_EVENT') {
      if (msg.payload && msg.payload.analytics) {
        localStorage.setItem(ANALYTICS_KEY, JSON.stringify(msg.payload.analytics));
      }
      if (msg.payload && msg.payload.updatedArticle) {
        const all = this.getAll();
        const idx = all.findIndex(a => a.id === msg.payload.updatedArticle.id);
        if (idx !== -1) {
          all[idx].analytics = msg.payload.updatedArticle.analytics;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        }
      }
      this.notifyAnalytics(msg.payload);
    }
  }

  setServerUpdates(updates) {
    if (!Array.isArray(updates)) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updates));
    this.notifyChange();
  }

  async syncFromServer() {
    const auth = this.getAuth();
    const token = this.getToken();

    try {
      if (auth.isAuthenticated && token) {
        const res = await fetch('/api/content', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.updates)) {
            this.setServerUpdates(data.updates);
          }
        }
      } else {
        const res = await fetch('/api/public/content');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.updates)) {
            this.setServerUpdates(data.updates);
          }
        }
      }

      // Sync settings
      const settingsRes = await fetch('/api/public/settings');
      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        this.notifyChange();
      }
    } catch (e) {}
  }

  // =========================================================================
  // ANALYTICS TRACKING ENGINE
  // =========================================================================
  trackEvent(event) {
    if (!event || !event.type) return;

    try {
      // 1. Send via WebSocket if connected
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'TRACK_EVENT', payload: event }));
      }

      // 2. Also send via POST /api/track for resilient delivery
      if (typeof fetch === 'function') {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
          keepalive: true
        }).catch(() => {});
      }

      // 3. Optimistic local tracking update
      this.applyLocalTracking(event);
    } catch (err) {}
  }

  applyLocalTracking(event) {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    let siteAnalytics = this.getSiteAnalytics();

    if (siteAnalytics.lastTodayDate !== today) {
      siteAnalytics.lastTodayDate = today;
      siteAnalytics.todayViews = 0;
    }

    if (!siteAnalytics.dailyViews[today]) siteAnalytics.dailyViews[today] = 0;
    if (!siteAnalytics.dailyUniqueVisitors[today]) siteAnalytics.dailyUniqueVisitors[today] = 0;
    if (!siteAnalytics.dailyWhatsappClicks[today]) siteAnalytics.dailyWhatsappClicks[today] = 0;
    if (!siteAnalytics.whatsappClicksByLocation) siteAnalytics.whatsappClicksByLocation = {};

    const all = this.getAll();
    let modifiedArticles = false;

    if (event.type === 'article_view') {
      const article = all.find(a => a.id === event.articleId || a.slug === event.slug);
      if (article) {
        if (!article.analytics) {
          article.analytics = {
            viewCount: 0,
            uniqueViewCount: 0,
            whatsappClickCount: 0,
            pdfOpenCounts: {},
            resourceLinkClicks: {},
            lastViewedAt: null,
            referrers: {}
          };
        }

        article.analytics.viewCount = (article.analytics.viewCount || 0) + 1;
        article.analytics.lastViewedAt = now.toISOString();

        if (event.isUnique) {
          article.analytics.uniqueViewCount = (article.analytics.uniqueViewCount || 0) + 1;
          siteAnalytics.totalUniqueVisitors = (siteAnalytics.totalUniqueVisitors || 0) + 1;
          siteAnalytics.dailyUniqueVisitors[today] = (siteAnalytics.dailyUniqueVisitors[today] || 0) + 1;
        }

        const ref = (event.referrer && typeof event.referrer === 'string') ? event.referrer.toLowerCase() : 'direct';
        const refKey = ref.includes('whatsapp') ? 'whatsapp' : (ref.includes('google') ? 'google' : (ref.includes('twitter') ? 'twitter' : 'direct'));
        if (!article.analytics.referrers) article.analytics.referrers = {};
        article.analytics.referrers[refKey] = (article.analytics.referrers[refKey] || 0) + 1;
        modifiedArticles = true;
      }

      siteAnalytics.totalPageViews = (siteAnalytics.totalPageViews || 0) + 1;
      siteAnalytics.todayViews = (siteAnalytics.todayViews || 0) + 1;
      siteAnalytics.dailyViews[today] = (siteAnalytics.dailyViews[today] || 0) + 1;

    } else if (event.type === 'whatsapp_click') {
      siteAnalytics.totalWhatsappClicks = (siteAnalytics.totalWhatsappClicks || 0) + 1;
      siteAnalytics.dailyWhatsappClicks[today] = (siteAnalytics.dailyWhatsappClicks[today] || 0) + 1;

      const loc = event.location || 'unknown';
      siteAnalytics.whatsappClicksByLocation[loc] = (siteAnalytics.whatsappClicksByLocation[loc] || 0) + 1;

      if (event.articleId) {
        const article = all.find(a => a.id === event.articleId);
        if (article) {
          if (!article.analytics) article.analytics = { viewCount: 0, uniqueViewCount: 0, whatsappClickCount: 0, pdfOpenCounts: {}, resourceLinkClicks: {}, lastViewedAt: null, referrers: {} };
          article.analytics.whatsappClickCount = (article.analytics.whatsappClickCount || 0) + 1;
          modifiedArticles = true;
        }
      }
    }

    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(siteAnalytics));
    if (modifiedArticles) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }
  }

  getSiteAnalytics() {
    try {
      const raw = localStorage.getItem(ANALYTICS_KEY);
      return raw ? JSON.parse(raw) : {
        totalPageViews: 0,
        totalUniqueVisitors: 0,
        totalWhatsappClicks: 0,
        whatsappClicksByLocation: {},
        todayViews: 0,
        dailyViews: {},
        dailyWhatsappClicks: {},
        dailyUniqueVisitors: {},
        recentEvents: []
      };
    } catch (e) {
      return { totalPageViews: 0, totalUniqueVisitors: 0, totalWhatsappClicks: 0, whatsappClicksByLocation: {}, todayViews: 0, dailyViews: {}, dailyWhatsappClicks: {}, dailyUniqueVisitors: {}, recentEvents: [] };
    }
  }

  getAnalyticsSummary() {
    const site = this.getSiteAnalytics();
    const all = this.getAll();

    let totalViews = 0;
    let totalUnique = 0;
    let totalWaClicks = 0;
    let totalPdfOpens = 0;
    let totalResourceClicks = 0;

    const postsRanked = all.map(article => {
      const an = article.analytics || {};
      const views = an.viewCount || 0;
      const unique = an.uniqueViewCount || 0;
      const waClicks = an.whatsappClickCount || 0;

      let pdfOpens = 0;
      if (an.pdfOpenCounts) {
        Object.values(an.pdfOpenCounts).forEach(c => pdfOpens += (c || 0));
      }

      let resClicks = 0;
      if (an.resourceLinkClicks) {
        Object.values(an.resourceLinkClicks).forEach(c => resClicks += (c || 0));
      }

      totalViews += views;
      totalUnique += unique;
      totalWaClicks += waClicks;
      totalPdfOpens += pdfOpens;
      totalResourceClicks += resClicks;

      const conversionRate = unique > 0 ? ((waClicks / unique) * 100).toFixed(1) : '0.0';

      return {
        id: article.id,
        slug: article.slug,
        title: article.title,
        tag: article.tag,
        date: article.date,
        views,
        unique,
        whatsappClicks: waClicks,
        conversionRate: parseFloat(conversionRate),
        pdfOpens,
        resourceClicks: resClicks,
        lastViewedAt: an.lastViewedAt || null,
        referrers: an.referrers || {}
      };
    });

    postsRanked.sort((a, b) => b.views - a.views);

    const overallWa = Math.max(site.totalWhatsappClicks || 0, totalWaClicks);
    const overallUnique = Math.max(site.totalUniqueVisitors || 0, totalUnique);
    const overallConversion = overallUnique > 0 ? ((overallWa / overallUnique) * 100).toFixed(1) : '0.0';

    const chartDays = 30;
    const now = new Date();
    const chartData = [];

    for (let i = chartDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const displayLabel = `${d.getDate()} ${monthNames[d.getMonth()]}`;

      chartData.push({
        dateKey: key,
        displayLabel,
        views: site.dailyViews[key] || 0,
        unique: site.dailyUniqueVisitors[key] || 0,
        whatsappClicks: site.dailyWhatsappClicks[key] || 0
      });
    }

    return {
      kpi: {
        totalPageViews: Math.max(site.totalPageViews || 0, totalViews),
        totalUniqueVisitors: overallUnique,
        totalWhatsappClicks: overallWa,
        conversionRate: overallConversion,
        todayViews: site.todayViews || 0,
        totalPdfOpens,
        totalResourceClicks
      },
      whatsappDistribution: site.whatsappClicksByLocation || {},
      chartData,
      postsRanked,
      recentEvents: site.recentEvents || []
    };
  }

  // =========================================================================
  // CRUD OPERATIONS (Instant Local + Async Server Sync)
  // =========================================================================
  getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_UPDATES;
    } catch (e) {
      return INITIAL_UPDATES;
    }
  }

  getPublished() {
    return this.getAll().filter(item => item.status === 'published');
  }

  getById(id) {
    return this.getAll().find(item => item.id === id) || null;
  }

  getBySlug(slug) {
    return this.getAll().find(item => item.slug === slug) || null;
  }

  async save(updateData) {
    const all = this.getAll();
    const now = new Date().toISOString();
    const settings = this.getSettings();
    const token = this.getToken();

    const formattedData = {
      ...updateData,
      authorName: updateData.authorName || settings.adminName || "StayDriven Editorial",
      authorAvatarUrl: updateData.authorAvatarUrl || settings.adminAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
      excerpt: updateData.excerpt || (updateData.article?.sectionSubtitle || (updateData.title + ' — Explore key breakthroughs and actionable insights.')),
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

    let resultItem = null;

    if (updateData.id) {
      const index = all.findIndex(item => item.id === updateData.id);
      if (index !== -1) {
        all[index] = { ...all[index], ...formattedData, updatedAt: now };
        resultItem = all[index];
      } else {
        all.unshift({ ...formattedData, createdAt: now, updatedAt: now });
        resultItem = all[0];
      }

      // Server Sync
      if (token) {
        fetch(`/api/content/${updateData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(resultItem)
        }).catch(() => {});
      }
    } else {
      const newId = `upd-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`;
      const newSlug = updateData.slug || updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newItem = {
        ...formattedData,
        id: newId,
        slug: newSlug,
        createdAt: now,
        updatedAt: now
      };
      all.unshift(newItem);
      resultItem = newItem;

      // Server Sync
      if (token) {
        fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(newItem)
        }).catch(() => {});
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    this.notifyChange();
    return resultItem;
  }

  async delete(id) {
    const all = this.getAll().filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    this.notifyChange();

    const token = this.getToken();
    if (token) {
      fetch(`/api/content/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => {});
    }
    return true;
  }

  async bulkUpdateStatus(ids, status) {
    const all = this.getAll().map(item => {
      if (ids.includes(item.id)) {
        return { ...item, status, updatedAt: new Date().toISOString() };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    this.notifyChange();

    const token = this.getToken();
    if (token) {
      fetch('/api/content/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ids, action: 'status', status })
      }).catch(() => {});
    }
  }

  async bulkDelete(ids) {
    const all = this.getAll().filter(item => !ids.includes(item.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    this.notifyChange();

    const token = this.getToken();
    if (token) {
      fetch('/api/content/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ids, action: 'delete' })
      }).catch(() => {});
    }
  }

  async resetToDefaults() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_UPDATES));
    localStorage.removeItem(ANALYTICS_KEY);
    this.init();
    this.notifyChange();

    const token = this.getToken();
    if (token) {
      fetch('/api/analytics/reset', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => {});
    }
  }

  async clearAnalytics() {
    const today = new Date().toISOString().split('T')[0];
    const cleared = {
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
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(cleared));

    // Also clear all article counters in local storage
    const all = this.getAll().map(item => ({
      ...item,
      analytics: {
        viewCount: 0,
        uniqueViewCount: 0,
        whatsappClickCount: 0,
        pdfOpenCounts: {},
        resourceLinkClicks: {},
        lastViewedAt: null,
        referrers: {}
      }
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    this.notifyChange();
    this.notifyAnalytics({ analytics: cleared });

    const token = this.getToken();
    if (token) {
      fetch('/api/analytics/clear', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => {});
    }
  }

  exportDataJSON() {
    return JSON.stringify(this.getAll(), null, 2);
  }

  importDataJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        this.notifyChange();
        return { success: true, count: parsed.length };
      }
      return { success: false, error: "Uploaded JSON is not an array of updates." };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // =========================================================================
  // AUTHENTICATION MANAGEMENT
  // =========================================================================
  getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
  }

  getAuth() {
    try {
      const auth = localStorage.getItem(AUTH_KEY);
      return auth ? JSON.parse(auth) : { isAuthenticated: false, user: null };
    } catch (e) {
      return { isAuthenticated: false, user: null };
    }
  }

  async login(email, password) {
    if (!email || !password) {
      return { success: false, error: "Please enter your email and password." };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const authState = {
          isAuthenticated: true,
          user: data.user
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
        localStorage.setItem(TOKEN_KEY, data.token);

        // Fetch fresh protected updates from server
        this.syncFromServer();
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || "Invalid credentials." };
      }
    } catch (err) {
      // Fallback local authentication if server offline
      if (email.trim().length > 0 && password.trim().length > 0) {
        const authState = {
          isAuthenticated: true,
          user: {
            email: email.trim(),
            name: "StayDriven Admin",
            role: "Lead Editor & Admin",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
            loginTime: new Date().toISOString()
          }
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
        return { success: true, user: authState.user };
      }
      return { success: false, error: "Network error occurred." };
    }
  }

  async verifyAuth() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const res = await fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.valid && data.user) {
          localStorage.setItem(AUTH_KEY, JSON.stringify({ isAuthenticated: true, user: data.user }));
          return true;
        }
      }
      this.logout();
      return false;
    } catch (e) {
      // Keep existing auth if network check fails
      return this.getAuth().isAuthenticated;
    }
  }

  logout() {
    const token = this.getToken();
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => {});
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify({ isAuthenticated: false, user: null }));
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    this.notifyChange();
  }

  getSettings() {
    try {
      const s = JSON.parse(localStorage.getItem(SETTINGS_KEY));
      return s || {
        siteName: "StayDriven",
        adminName: "StayDriven Admin",
        adminRole: "Lead Editor & Admin",
        adminAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
        aboutStayingAheadText: DEFAULT_ABOUT_TEXT
      };
    } catch (e) {
      return {};
    }
  }

  async saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    this.notifyChange();

    const token = this.getToken();
    if (token) {
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(settings)
      }).catch(() => {});
    }
  }

  notifyChange() {
    window.dispatchEvent(new CustomEvent('staydriven_cms_change'));
  }

  notifyAnalytics(payload) {
    window.dispatchEvent(new CustomEvent('staydriven_analytics_event', { detail: payload }));
  }

  getStats() {
    const all = this.getAll();
    const published = all.filter(u => u.status === 'published');
    const drafts = all.filter(u => u.status === 'draft');
    
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = all.filter(u => {
      const time = new Date(u.createdAt || u.updatedAt).getTime();
      return time >= oneWeekAgo;
    });

    const tagsCount = {};
    all.forEach(u => {
      const t = u.tag || 'OTHER';
      tagsCount[t] = (tagsCount[t] || 0) + 1;
    });

    const pdfsCount = all.reduce((acc, u) => acc + (u.pdfs ? u.pdfs.length : 0), 0);

    return {
      total: all.length,
      publishedCount: published.length,
      draftsCount: drafts.length,
      thisWeekCount: thisWeek.length,
      tagsCount,
      pdfsCount
    };
  }

  static convertDriveUrlToEmbed(url) {
    if (!url) return '';
    try {
      const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
      return url;
    } catch (e) {
      return url;
    }
  }
}

export const cmsStore = new CMSStore();
window.cmsStore = cmsStore;
