// StayDriven Admin CMS & Analytics Controller
import { cmsStore, CMSStore } from './cms-store.js';

class AdminController {
  constructor() {
    this.currentRoute = 'dashboard';
    this.editingId = null;
    this.searchQuery = '';
    this.activeTagFilter = 'ALL';
    this.activeStatusFilter = 'ALL';
    this.viewMode = 'table'; // 'table' | 'grid'
    this.selectedIds = new Set();
    this.itemToDeleteId = null;

    // Analytics state
    this.analyticsMetric = 'views'; // 'views' | 'unique' | 'whatsappClicks'
    this.analyticsSortCol = 'views';
    this.analyticsSortAsc = false;
    this.analyticsSearch = '';
    this.analyticsPollingTimer = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.handleRoute();
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('staydriven_cms_change', () => this.refreshCurrentView());
  }

  // =========================================================================
  // ROUTING & AUTH MANAGEMENT
  // =========================================================================
  handleRoute() {
    const rawHash = window.location.hash.replace('#', '') || 'dashboard';
    const [route, queryString] = rawHash.split('?');
    const auth = cmsStore.getAuth();

    // Check if user is logged in
    if (!auth.isAuthenticated && route !== 'login') {
      this.currentRoute = 'login';
      window.location.hash = '#login';
      this.renderView('login');
      return;
    }

    if (auth.isAuthenticated && route === 'login') {
      window.location.hash = '#dashboard';
      return;
    }

    this.currentRoute = route;

    // Check query string for editor id (e.g. #editor?id=upd-001)
    if (route === 'editor') {
      const urlParams = new URLSearchParams(queryString || '');
      this.editingId = urlParams.get('id') || null;
    } else {
      this.editingId = null;
    }

    this.renderView(this.currentRoute);
  }

  renderView(route) {
    // Clear any analytics polling if leaving analytics
    if (route !== 'analytics' && this.analyticsPollingTimer) {
      clearInterval(this.analyticsPollingTimer);
      this.analyticsPollingTimer = null;
    }

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    
    // Update sidebar navigation active state
    document.querySelectorAll('.nav-icon-btn[data-route]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.route === route);
    });

    const targetSection = document.getElementById(`view-${route}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Toggle sidebar & topbar visibility for login vs dashboard
    const isLogin = route === 'login';
    const sidebar = document.getElementById('adminSidebar');
    const topbar = document.querySelector('.admin-topbar');
    if (sidebar) sidebar.style.display = isLogin ? 'none' : 'flex';
    if (topbar) topbar.style.display = isLogin ? 'none' : 'flex';

    if (!isLogin) {
      this.updateProfileUI();
      this.updateTitles(route);
    }

    // Route specific renders
    switch (route) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'analytics':
        this.renderAnalytics();
        this.startAnalyticsPolling();
        break;
      case 'updates':
        this.renderAllUpdates();
        break;
      case 'editor':
        this.setupEditor(this.editingId);
        break;
      case 'media':
        this.renderMediaLibrary();
        break;
      case 'settings':
        this.renderSettings();
        break;
      case 'login':
        // no extra render needed
        break;
      default:
        this.renderDashboard();
    }
  }

  updateTitles(route) {
    const titles = {
      dashboard: { title: 'Dashboard', sub: 'Overview of library dispatches, metrics, and resources' },
      analytics: { title: 'Analytics & Traffic', sub: 'Real-time anonymous engagement, view counts, and conversion metrics' },
      updates: { title: 'All Updates', sub: 'Browse, filter, edit, and organize all archived cards' },
      editor: { 
        title: this.editingId ? 'Edit Update' : 'New Update', 
        sub: this.editingId ? 'Modify content and public formatting' : 'Create and publish a new AI brief, guide, or PDF resource' 
      },
      media: { title: 'PDFs & Resources', sub: 'Attached slide decks and downloadable assets across all updates' },
      settings: { title: 'Settings & Backup', sub: 'Admin profile preferences, data snapshot export and restore' }
    };

    const info = titles[route] || titles.dashboard;
    const titleEl = document.getElementById('pageHeadingTitle');
    const subEl = document.getElementById('pageHeadingSubtitle');
    if (titleEl) titleEl.textContent = info.title;
    if (subEl) subEl.textContent = info.sub;
  }

  updateProfileUI() {
    const settings = cmsStore.getSettings();
    if (settings) {
      const avatarEl = document.getElementById('topbarAvatar');
      const nameEl = document.getElementById('topbarAdminName');
      const roleEl = document.getElementById('topbarAdminRole');
      if (avatarEl && settings.adminAvatar) avatarEl.src = settings.adminAvatar;
      if (nameEl && settings.adminName) nameEl.textContent = settings.adminName;
      if (roleEl && settings.adminRole) roleEl.textContent = settings.adminRole;
    }
  }

  refreshCurrentView() {
    this.renderView(this.currentRoute);
  }

  // =========================================================================
  // VIEW: DASHBOARD
  // =========================================================================
  renderDashboard() {
    const stats = cmsStore.getStats();
    const allUpdates = cmsStore.getAll();

    // 1. Hero Stat Card
    const heroTotalEl = document.getElementById('heroTotalNumber');
    const heroPublishedEl = document.getElementById('heroPublishedCount');
    const heroDraftsEl = document.getElementById('heroDraftsCount');
    const metricThisWeekEl = document.getElementById('metricThisWeek');
    const metricPdfsEl = document.getElementById('metricPdfs');

    if (heroTotalEl) heroTotalEl.textContent = stats.total;
    if (heroPublishedEl) heroPublishedEl.textContent = stats.publishedCount;
    if (heroDraftsEl) heroDraftsEl.textContent = stats.draftsCount;
    if (metricThisWeekEl) metricThisWeekEl.textContent = stats.thisWeekCount;
    if (metricPdfsEl) metricPdfsEl.textContent = stats.pdfsCount;

    // 2. Category Tabs with Counts
    const categoryPillsContainer = document.getElementById('dashboardCategoryPills');
    if (categoryPillsContainer) {
      const categories = ['AI TOOL', 'DAILY AI UPDATE', 'GUIDE', 'ROADMAP'];
      categoryPillsContainer.innerHTML = categories.map(cat => {
        const count = stats.tagsCount[cat] || 0;
        return `
          <div class="category-stat-pill" data-filter-tag="${cat}">
            <span class="pill-label">${cat}</span>
            <span class="pill-val">${count}</span>
          </div>
        `;
      }).join('');

      categoryPillsContainer.querySelectorAll('.category-stat-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          this.activeTagFilter = pill.dataset.filterTag;
          window.location.hash = '#updates';
        });
      });
    }

    // 3. Recent Updates Table (Top 5)
    const recentTableBody = document.getElementById('dashboardRecentTableBody');
    if (recentTableBody) {
      const recentItems = allUpdates.slice(0, 5);
      if (recentItems.length === 0) {
        recentTableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 24px; color: var(--admin-text-muted);">
              No updates in the database. Click "+ New Update" to create one.
            </td>
          </tr>
        `;
      } else {
        recentTableBody.innerHTML = recentItems.map(item => this.renderTableRow(item)).join('');
      }
    }
  }

  // =========================================================================
  // VIEW: ANALYTICS & TRAFFIC (Admin Only)
  // =========================================================================
  startAnalyticsPolling() {
    if (this.analyticsPollingTimer) clearInterval(this.analyticsPollingTimer);
    this.analyticsPollingTimer = setInterval(() => {
      if (this.currentRoute === 'analytics') {
        this.renderAnalytics(true);
      }
    }, 30000);
  }

  renderAnalytics(isBackgroundRefresh = false) {
    const summary = cmsStore.getAnalyticsSummary();
    if (!summary) return;

    // 1. Update KPI Summary Cards
    const kpiTotalViews = document.getElementById('kpiTotalViews');
    const kpiUniqueVisitors = document.getElementById('kpiUniqueVisitors');
    const kpiWhatsappClicks = document.getElementById('kpiWhatsappClicks');
    const kpiTodayViews = document.getElementById('kpiTodayViews');
    const kpiConversionRate = document.getElementById('kpiConversionRate');
    const kpiViewsTrend = document.getElementById('kpiViewsTrend');
    const lastSyncText = document.getElementById('analyticsLastSyncText');

    if (kpiTotalViews) kpiTotalViews.textContent = Number(summary.totalViews || 0).toLocaleString();
    if (kpiUniqueVisitors) kpiUniqueVisitors.textContent = Number(summary.totalUnique || 0).toLocaleString();
    if (kpiWhatsappClicks) kpiWhatsappClicks.textContent = Number(summary.totalWhatsappClicks || 0).toLocaleString();
    if (kpiTodayViews) kpiTodayViews.textContent = Number(summary.todayViews || 0).toLocaleString();
    if (kpiConversionRate) kpiConversionRate.textContent = `${summary.globalConversionRate} Conv`;
    if (kpiViewsTrend) kpiViewsTrend.textContent = summary.trendVsLastWeek;
    if (lastSyncText) lastSyncText.textContent = `Updated ${new Date().toLocaleTimeString()}`;

    // 2. Render SVG Trend Chart
    this.renderTrendChart(summary.chartData);

    // 3. Render WhatsApp Click Distribution Breakdown
    this.renderWhatsappLocations(summary.whatsappLocations, summary.totalWhatsappClicks);

    // 4. Render Ranked Posts Table
    this.renderAnalyticsRankedTable(summary.postsRanked);

    // 5. Render Live Anonymous Event Stream
    this.renderLiveFeed(summary.recentEvents);
  }

  renderTrendChart(chartData) {
    const container = document.getElementById('analyticsChartContainer');
    if (!container || !chartData || chartData.length === 0) return;

    const metricKey = this.analyticsMetric; // 'views', 'unique', 'whatsappClicks'
    const tooltip = document.getElementById('chartTooltip');

    // Dimensions
    const width = 700;
    const height = 220;
    const padX = 40;
    const padY = 30;
    const plotWidth = width - padX * 2;
    const plotHeight = height - padY * 2;

    const values = chartData.map(d => Number(d[metricKey] || 0));
    const maxVal = Math.max(...values, 10);

    // Build SVG bars and line path
    const barWidth = Math.max(4, Math.floor(plotWidth / chartData.length) - 4);

    let barsHtml = '';
    const points = [];

    chartData.forEach((d, index) => {
      const val = Number(d[metricKey] || 0);
      const x = padX + index * (plotWidth / (chartData.length - 1 || 1));
      const barX = padX + index * (plotWidth / chartData.length) + 2;
      const barHeight = Math.max(2, (val / maxVal) * plotHeight);
      const barY = padY + plotHeight - barHeight;

      points.push(`${x},${barY}`);

      barsHtml += `
        <rect 
          x="${barX}" 
          y="${barY}" 
          width="${barWidth}" 
          height="${barHeight}" 
          rx="2" 
          fill="url(#trendBarGrad)" 
          class="chart-bar-hover"
          data-date="${d.date}" 
          data-views="${d.views}" 
          data-unique="${d.unique}" 
          data-wa="${d.whatsappClicks}"
          data-metric="${metricKey}"
          data-val="${val}"
        />
      `;
    });

    const pathD = `M ${points.join(' L ')}`;
    const areaD = `M ${padX},${padY + plotHeight} L ${points.join(' L ')} L ${padX + plotWidth},${padY + plotHeight} Z`;

    const svg = `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trendBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#d946ef" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.3"/>
          </linearGradient>
          <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#a855f7" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#a855f7" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Grid lines -->
        <line x1="${padX}" y1="${padY}" x2="${width - padX}" y2="${padY}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
        <line x1="${padX}" y1="${padY + plotHeight / 2}" x2="${width - padX}" y2="${padY + plotHeight / 2}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
        <line x1="${padX}" y1="${padY + plotHeight}" x2="${width - padX}" y2="${padY + plotHeight}" stroke="rgba(255,255,255,0.12)" />

        <!-- Area fill & Stroke Line -->
        <path d="${areaD}" fill="url(#areaGrad)" />
        <path d="${pathD}" fill="none" stroke="#f0abfc" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Interactive Bars -->
        ${barsHtml}

        <!-- X Axis Labels -->
        <text x="${padX}" y="${height - 8}" fill="#9ca3af" font-size="10" text-anchor="start">${chartData[0]?.date || ''}</text>
        <text x="${width / 2}" y="${height - 8}" fill="#9ca3af" font-size="10" text-anchor="middle">${chartData[Math.floor(chartData.length / 2)]?.date || ''}</text>
        <text x="${width - padX}" y="${height - 8}" fill="#9ca3af" font-size="10" text-anchor="end">${chartData[chartData.length - 1]?.date || ''}</text>

        <!-- Y Axis Labels -->
        <text x="${padX - 8}" y="${padY + 4}" fill="#6b7280" font-size="9" text-anchor="end">${maxVal}</text>
        <text x="${padX - 8}" y="${padY + plotHeight}" fill="#6b7280" font-size="9" text-anchor="end">0</text>
      </svg>
    `;

    // Retain tooltip element
    container.innerHTML = svg + `<div class="chart-tooltip" id="chartTooltip"></div>`;

    // Tooltip interaction
    const newTooltip = document.getElementById('chartTooltip');
    container.querySelectorAll('.chart-bar-hover').forEach(bar => {
      bar.addEventListener('mouseenter', (e) => {
        const date = bar.dataset.date;
        const val = bar.dataset.val;
        const views = bar.dataset.views;
        const uniq = bar.dataset.unique;
        const wa = bar.dataset.wa;

        if (newTooltip) {
          newTooltip.innerHTML = `
            <div style="font-weight:700; color:#fff; margin-bottom:4px;">${date}</div>
            <div style="color:#f0abfc;">Page Views: <strong>${views}</strong></div>
            <div style="color:#38bdf8;">Unique Visitors: <strong>${uniq}</strong></div>
            <div style="color:#34d399;">WhatsApp Clicks: <strong>${wa}</strong></div>
          `;
          newTooltip.style.display = 'block';
        }
      });

      bar.addEventListener('mousemove', (e) => {
        if (newTooltip) {
          const rect = container.getBoundingClientRect();
          newTooltip.style.left = `${e.clientX - rect.left}px`;
          newTooltip.style.top = `${e.clientY - rect.top}px`;
        }
      });

      bar.addEventListener('mouseleave', () => {
        if (newTooltip) newTooltip.style.display = 'none';
      });
    });
  }

  renderWhatsappLocations(locations, totalWa) {
    const listEl = document.getElementById('whatsappDistList');
    if (!listEl) return;

    const locLabels = {
      'hero_cta': 'Hero Community CTA',
      'navbar_button': 'Header Navigation Pill',
      'sticky_bottom_bar': 'Sticky Bottom Banner',
      'sidebar_widget': 'Article Sidebar Widget',
      'article_footer': 'Article Footer Section'
    };

    const entries = Object.entries(locations || {});
    if (entries.length === 0) {
      listEl.innerHTML = `<div style="font-size:12px; color:var(--admin-text-dim); text-align:center; padding:20px;">No WhatsApp clicks captured yet.</div>`;
      return;
    }

    // Sort descending
    entries.sort((a, b) => b[1] - a[1]);

    const maxCount = Math.max(...entries.map(e => e[1]), 1);

    listEl.innerHTML = entries.map(([locKey, count]) => {
      const label = locLabels[locKey] || locKey.replace(/_/g, ' ');
      const percent = totalWa > 0 ? Math.round((count / totalWa) * 100) : 0;
      const barWidth = Math.round((count / maxCount) * 100);

      return `
        <div class="dist-item">
          <div class="dist-label-row">
            <span class="dist-label-title">${this.escapeHtml(label)}</span>
            <span class="dist-label-val">${count} clicks (${percent}%)</span>
          </div>
          <div class="dist-bar-track">
            <div class="dist-bar-fill" style="width: ${barWidth}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderAnalyticsRankedTable(posts) {
    const tbody = document.getElementById('analyticsRankedTableBody');
    if (!tbody) return;

    let filtered = (posts || []).filter(p => {
      if (!this.analyticsSearch) return true;
      const q = this.analyticsSearch.toLowerCase();
      return p.title.toLowerCase().includes(q) || (p.tag || '').toLowerCase().includes(q);
    });

    // Sort table
    filtered.sort((a, b) => {
      let valA = a[this.analyticsSortCol];
      let valB = b[this.analyticsSortCol];

      if (this.analyticsSortCol === 'conversionRate') {
        valA = a.unique > 0 ? (a.whatsappClicks / a.unique) : 0;
        valB = b.unique > 0 ? (b.whatsappClicks / b.unique) : 0;
      } else if (this.analyticsSortCol === 'title') {
        return this.analyticsSortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      }

      return this.analyticsSortAsc ? (valA - valB) : (valB - valA);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding:30px; color:var(--admin-text-muted);">
            No articles match your search query.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(post => {
      const convRate = post.unique > 0 ? ((post.whatsappClicks / post.unique) * 100).toFixed(1) : "0.0";
      const fillPercent = Math.min(100, Math.round(Number(convRate) * 4)); // scaled for visual bar
      const lastViewDate = post.lastViewedAt ? new Date(post.lastViewedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never';

      const tagClass = post.tag ? post.tag.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'ai-tool';

      return `
        <tr>
          <td>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="tag-badge ${tagClass}" style="font-size: 10px; padding: 2px 6px;">${this.escapeHtml(post.tag)}</span>
                <span style="font-weight: 700; color: #ffffff; font-size: 13.5px;">${this.escapeHtml(post.title)}</span>
              </div>
              <span style="font-size: 11px; color: var(--admin-text-dim);">/${this.escapeHtml(post.slug)}</span>
            </div>
          </td>
          <td style="text-align: right; font-weight: 800; color: #ffffff;">
            ${Number(post.views || 0).toLocaleString()}
          </td>
          <td style="text-align: right; font-weight: 700; color: #38bdf8;">
            ${Number(post.unique || 0).toLocaleString()}
          </td>
          <td style="text-align: right; font-weight: 700; color: #34d399;">
            ${Number(post.whatsappClicks || 0).toLocaleString()}
          </td>
          <td style="text-align: right;">
            <div class="conversion-pill-wrap" style="justify-content: flex-end;">
              <div class="conversion-mini-bar">
                <div class="conversion-mini-fill" style="width: ${fillPercent}%;"></div>
              </div>
              <span style="font-weight: 700; font-size: 12px; color: #34d399;">${convRate}%</span>
            </div>
          </td>
          <td style="text-align: right; font-size: 12px; color: var(--admin-text-muted);">
            <div>PDFs: <strong style="color: #fff;">${post.pdfOpens || 0}</strong></div>
            <div style="font-size: 11px;">Links: <strong style="color: #fff;">${post.resourceClicks || 0}</strong></div>
          </td>
          <td style="text-align: right; font-size: 11.5px; color: var(--admin-text-dim);">
            ${lastViewDate}
          </td>
          <td style="text-align: right;">
            <div style="display: flex; gap: 6px; justify-content: flex-end;">
              <a href="#editor?id=${post.id}" class="table-action-btn" title="Edit Article in CMS">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </a>
              <a href="/?article=${post.slug}" target="_blank" class="table-action-btn" title="View Public Post">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  renderLiveFeed(events) {
    const feedEl = document.getElementById('analyticsLiveFeed');
    if (!feedEl) return;

    if (!events || events.length === 0) {
      feedEl.innerHTML = `<div style="font-size:12px; color:var(--admin-text-dim); text-align:center; padding:20px;">No anonymous events recorded in this session.</div>`;
      return;
    }

    const typeIcons = {
      'article_view': '<span class="activity-dot" style="background:#38bdf8;"></span>',
      'whatsapp_click': '<span class="activity-dot" style="background:#34d399;"></span>',
      'pdf_open': '<span class="activity-dot" style="background:#f59e0b;"></span>',
      'resource_link_click': '<span class="activity-dot" style="background:#d946ef;"></span>'
    };

    feedEl.innerHTML = events.slice(0, 10).map(evt => {
      const dot = typeIcons[evt.type] || '<span class="activity-dot"></span>';
      const timeStr = this.formatRelativeTime(evt.timestamp);

      let text = '';
      if (evt.type === 'article_view') {
        text = `Article <strong>${this.escapeHtml(evt.data?.slug || evt.data?.articleId || 'Dispatch')}</strong> viewed (Anonymous Visitor).`;
      } else if (evt.type === 'whatsapp_click') {
        text = `WhatsApp Community CTA clicked from <strong>${this.escapeHtml(evt.data?.location || 'Hero')}</strong>.`;
      } else if (evt.type === 'pdf_open') {
        text = `PDF Document <strong>${this.escapeHtml(evt.data?.pdfLabel || 'Slide Deck')}</strong> opened.`;
      } else if (evt.type === 'resource_link_click') {
        text = `External resource link clicked: <strong>${this.escapeHtml(evt.data?.linkTitle || 'Resource')}</strong>.`;
      } else {
        text = `User interaction logged (${this.escapeHtml(evt.type)}).`;
      }

      return `
        <div class="activity-item">
          ${dot}
          <div>
            <p class="activity-text">${text}</p>
            <span class="activity-time">${timeStr}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  formatRelativeTime(isoString) {
    if (!isoString) return 'Just now';
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) return 'Just now';
      if (mins === 1) return '1 minute ago';
      if (mins < 60) return `${mins} minutes ago`;
      const hours = Math.floor(mins / 60);
      if (hours === 1) return '1 hour ago';
      if (hours < 24) return `${hours} hours ago`;
      const days = Math.floor(hours / 24);
      return days === 1 ? 'Yesterday' : `${days} days ago`;
    } catch (e) {
      return 'Recently';
    }
  }

  // =========================================================================
  // VIEW: ALL UPDATES
  // =========================================================================
  renderAllUpdates() {
    let items = cmsStore.getAll();

    // 1. Tag Filter
    if (this.activeTagFilter !== 'ALL') {
      items = items.filter(i => i.tag === this.activeTagFilter);
    }

    // 2. Status Filter
    if (this.activeStatusFilter !== 'ALL') {
      items = items.filter(i => i.status === this.activeStatusFilter);
    }

    // 3. Search Filter
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      items = items.filter(i => 
        i.title.toLowerCase().includes(q) || 
        i.excerpt?.toLowerCase().includes(q) ||
        i.tag?.toLowerCase().includes(q)
      );
    }

    // Update Counts on pills
    const allCountEl = document.getElementById('tagCountAll');
    if (allCountEl) allCountEl.textContent = cmsStore.getAll().length;

    // Render Table
    const tableBody = document.getElementById('allUpdatesTableBody');
    if (tableBody) {
      if (items.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 40px; color: var(--admin-text-muted);">
              No updates match the current filter criteria.
            </td>
          </tr>
        `;
      } else {
        tableBody.innerHTML = items.map(item => this.renderTableRow(item, true)).join('');
      }
    }

    // Render Grid
    const gridContainer = document.getElementById('allUpdatesGrid');
    if (gridContainer) {
      if (items.length === 0) {
        gridContainer.innerHTML = `
          <div class="empty-placeholder" style="grid-column: 1 / -1;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            <p style="color: var(--admin-text-muted);">No updates found for this search or filter.</p>
          </div>
        `;
      } else {
        gridContainer.innerHTML = items.map(item => this.renderCardGridItem(item)).join('');
      }
    }

    this.bindTableAndGridEvents();
  }

  renderTableRow(item, withSelection = false) {
    const isSelected = this.selectedIds.has(item.id);
    const tagClass = item.tag ? item.tag.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'ai-tool';
    const isDraft = item.status === 'draft';
    const views = item.analytics?.viewCount || 0;

    return `
      <tr class="${isSelected ? 'selected' : ''}" data-id="${item.id}">
        ${withSelection ? `<td><input type="checkbox" class="row-checkbox" data-id="${item.id}" ${isSelected ? 'checked' : ''}></td>` : ''}
        <td>
          <span class="tag-badge ${tagClass}">${this.escapeHtml(item.tag || 'AI TOOL')}</span>
        </td>
        <td>
          <div style="font-weight: 700; color: #ffffff; margin-bottom: 2px;">
            ${this.escapeHtml(item.title)}
          </div>
          <div style="font-size: 11px; color: var(--admin-text-dim); max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${this.escapeHtml(item.excerpt || '')}
          </div>
        </td>
        <td style="color: var(--admin-text-muted); font-size: 12px; white-space: nowrap;">
          ${this.escapeHtml(item.date || '')}
        </td>
        <td>
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--admin-text-muted);">
            ${item.contentType === 'both' ? 'Article + PDF' : item.contentType === 'pdf' ? 'PDF Resource' : 'Written Article'}
          </span>
        </td>
        <td>
          <span style="font-weight: 700; font-size: 12px; color: #38bdf8;">
            ${views.toLocaleString()}
          </span>
        </td>
        <td>
          <span class="status-pill ${isDraft ? 'draft' : 'published'}">
            ● ${isDraft ? 'Draft' : 'Published'}
          </span>
        </td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 6px; justify-content: flex-end;">
            <a href="#editor?id=${item.id}" class="table-action-btn" title="Edit Update">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </a>
            <button type="button" class="table-action-btn delete-item-btn" data-id="${item.id}" title="Delete Update">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  renderCardGridItem(item) {
    const isDraft = item.status === 'draft';
    const tagClass = item.tag ? item.tag.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'ai-tool';
    const thumb = item.thumbnailUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80';
    const views = item.analytics?.viewCount || 0;

    return `
      <div class="update-grid-card" data-id="${item.id}">
        <div class="card-thumb-wrap">
          <img src="${thumb}" alt="${this.escapeHtml(item.title)}" loading="lazy">
          <span class="tag-badge ${tagClass}" style="position: absolute; top: 12px; left: 12px;">${this.escapeHtml(item.tag)}</span>
        </div>
        <div class="card-body">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11px; color: var(--admin-text-dim);">${this.escapeHtml(item.date)}</span>
            <span class="status-pill ${isDraft ? 'draft' : 'published'}">● ${isDraft ? 'Draft' : 'Live'}</span>
          </div>
          <h4 style="font-size: 14px; font-weight: 700; color: #ffffff; margin-bottom: 6px; line-height: 1.35;">
            ${this.escapeHtml(item.title)}
          </h4>
          <p style="font-size: 12px; color: var(--admin-text-muted); line-height: 1.4; margin-bottom: 12px; flex: 1;">
            ${this.escapeHtml(item.excerpt || '')}
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--admin-border); padding-top: 10px;">
            <span style="font-size: 11px; color: #38bdf8; font-weight: 700;">👁 ${views.toLocaleString()} views</span>
            <div style="display: flex; gap: 6px;">
              <a href="#editor?id=${item.id}" class="table-action-btn" title="Edit">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </a>
              <button type="button" class="table-action-btn delete-item-btn" data-id="${item.id}" title="Delete">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindTableAndGridEvents() {
    // Delete buttons
    document.querySelectorAll('.delete-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openDeleteModal(btn.dataset.id);
      });
    });

    // Row checkboxes
    document.querySelectorAll('.row-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = cb.dataset.id;
        if (cb.checked) {
          this.selectedIds.add(id);
        } else {
          this.selectedIds.delete(id);
        }
        this.updateBulkBar();
      });
    });
  }

  // =========================================================================
  // VIEW: COMPOSER / EDITOR (Structured Article Builder)
  // =========================================================================
  setupEditor(id = null) {
    const form = document.getElementById('updateForm');
    if (!form) return;

    form.reset();
    const storiesContainer = document.getElementById('storiesListContainer');
    const linksContainer = document.getElementById('resourceLinksContainer');
    if (storiesContainer) storiesContainer.innerHTML = '';
    if (linksContainer) linksContainer.innerHTML = '';

    const mainHeading = document.getElementById('editorViewHeading');
    const editIdInput = document.getElementById('updateId');
    const analyticsBox = document.getElementById('editorAnalyticsBox');
    const settings = cmsStore.getSettings();

    if (id) {
      // Edit Mode
      const item = cmsStore.getById(id);
      if (!item) {
        this.showToast('Update not found in library', 'error');
        window.location.hash = '#updates';
        return;
      }

      if (mainHeading) mainHeading.textContent = `Edit: ${item.title}`;
      if (editIdInput) editIdInput.value = item.id;

      // Render per-article analytics widget
      if (analyticsBox) {
        const a = item.analytics || {};
        const v = a.viewCount || 0;
        const u = a.uniqueViewCount || 0;
        const wa = a.whatsappClickCount || 0;
        const pdfTotal = Object.values(a.pdfOpenCounts || {}).reduce((acc, n) => acc + n, 0);
        const linkTotal = Object.values(a.resourceLinkClicks || {}).reduce((acc, n) => acc + n, 0);
        const convRate = u > 0 ? ((wa / u) * 100).toFixed(1) : '0.0';

        analyticsBox.style.display = 'block';
        analyticsBox.innerHTML = `
          <div class="editor-analytics-drilldown">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="live-pulse-badge" style="font-size: 11px; padding: 4px 10px;">
                  <span class="pulse-dot"></span>
                  <span>Post Analytics</span>
                </span>
                <span style="font-size: 13px; font-weight: 700; color: #fff;">Real-Time Engagement for this Article</span>
              </div>
              <a href="#analytics" class="btn-admin-secondary btn-sm" style="font-size: 11px;">View Full Analytics ↗</a>
            </div>

            <div class="editor-analytics-grid">
              <div class="editor-stat-box">
                <span class="editor-stat-num">${v.toLocaleString()}</span>
                <span class="editor-stat-label">Total Views</span>
              </div>
              <div class="editor-stat-box">
                <span class="editor-stat-num" style="color: #38bdf8;">${u.toLocaleString()}</span>
                <span class="editor-stat-label">Unique Readers</span>
              </div>
              <div class="editor-stat-box">
                <span class="editor-stat-num" style="color: #34d399;">${wa}</span>
                <span class="editor-stat-label">WhatsApp Clicks</span>
              </div>
              <div class="editor-stat-box">
                <span class="editor-stat-num" style="color: #34d399;">${convRate}%</span>
                <span class="editor-stat-label">Conversion Rate</span>
              </div>
              <div class="editor-stat-box">
                <span class="editor-stat-num" style="color: #fbbf24;">${pdfTotal}</span>
                <span class="editor-stat-label">PDF Decks Opened</span>
              </div>
              <div class="editor-stat-box">
                <span class="editor-stat-num" style="color: #f0abfc;">${linkTotal}</span>
                <span class="editor-stat-label">Resource Links Clicked</span>
              </div>
            </div>
          </div>
        `;
      }

      // Populate basic metadata
      document.getElementById('updateTag').value = item.tag || 'DAILY AI UPDATE';
      document.getElementById('updateDate').value = item.date || this.formatCurrentDate();
      document.getElementById('updateTitle').value = item.title || '';
      document.getElementById('updateExcerpt').value = item.excerpt || '';
      document.getElementById('updateAuthorName').value = item.authorName || settings.adminName || 'StayDriven Editorial';
      document.getElementById('updateAuthorAvatar').value = item.authorAvatarUrl || settings.adminAvatar || '';
      document.getElementById('updateSlug').value = item.slug || '';
      
      const statusRadio = document.querySelector(`input[name="updateStatus"][value="${item.status || 'published'}"]`);
      if (statusRadio) statusRadio.checked = true;

      // Content format
      const contentType = item.contentType || 'article';
      const typeRadio = document.querySelector(`input[name="contentType"][value="${contentType}"]`);
      if (typeRadio) typeRadio.checked = true;
      this.handleContentTypeChange(contentType);

      // Thumbnail
      document.getElementById('updateThumbnailUrl').value = item.thumbnailUrl || '';
      this.updateThumbPreview(item.thumbnailUrl || '');

      // Article fields
      if (item.article) {
        if (document.getElementById('articleSectionTitle')) {
          document.getElementById('articleSectionTitle').value = item.article.sectionTitle || '';
        }
        if (document.getElementById('articleSectionSubtitle')) {
          document.getElementById('articleSectionSubtitle').value = item.article.sectionSubtitle || '';
        }
        if (document.getElementById('articleBroaderContext')) {
          document.getElementById('articleBroaderContext').value = item.article.broaderContext || '';
        }

        if (item.article.stories && item.article.stories.length > 0) {
          item.article.stories.forEach(story => this.addStoryBlock(story));
        } else {
          this.addStoryBlock();
        }
      } else {
        this.addStoryBlock();
      }

      // PDF fields
      if (item.pdfs && item.pdfs.length > 0) {
        const p = item.pdfs[0];
        document.getElementById('primaryPdfLabel').value = p.label || '';
        document.getElementById('primaryPdfUrl').value = p.url || '';
        this.updatePdfPreview(p.url || '');
      }

      // Resource Links
      if (item.resourceLinks && item.resourceLinks.length > 0) {
        item.resourceLinks.forEach(link => this.addResourceLinkRow(link));
      } else {
        this.addResourceLinkRow();
      }

    } else {
      // New Update Mode
      if (analyticsBox) analyticsBox.style.display = 'none';
      if (mainHeading) mainHeading.textContent = 'Create New Intelligence Briefing';
      if (editIdInput) editIdInput.value = '';

      document.getElementById('updateDate').value = this.formatCurrentDate();
      if (document.getElementById('updateExcerpt')) document.getElementById('updateExcerpt').value = '';
      if (document.getElementById('updateAuthorName')) document.getElementById('updateAuthorName').value = settings.adminName || 'StayDriven Editorial';
      if (document.getElementById('updateAuthorAvatar')) document.getElementById('updateAuthorAvatar').value = settings.adminAvatar || '';
      this.updateThumbPreview('');
      this.updatePdfPreview('');
      this.handleContentTypeChange('article');

      // Add default story block and resource link
      this.addStoryBlock({
        number: 1,
        heading: "Key Development & System Breakthrough",
        paragraphs: [
          { label: "What changes.", text: "Describe the architectural or functional advancement in 1-2 punchy sentences." },
          { label: "Why it matters.", text: "Explain the bottom-line ROI or workflow speedup for teams." }
        ]
      });

      this.addResourceLinkRow({ label: "Official Documentation / Source", url: "https://" });
    }
  }

  handleContentTypeChange(type) {
    document.querySelectorAll('#contentTypePicker label').forEach(lbl => {
      lbl.classList.toggle('active', lbl.dataset.type === type);
    });

    const articleSec = document.getElementById('articleBuilderSection');
    const pdfSec = document.getElementById('pdfResourceSection');

    if (articleSec) articleSec.style.display = (type === 'article' || type === 'both') ? 'flex' : 'none';
    if (pdfSec) pdfSec.style.display = (type === 'pdf' || type === 'both') ? 'flex' : 'none';
  }

  updateThumbPreview(url) {
    const img = document.getElementById('thumbPreviewImg');
    const ph = document.getElementById('thumbPlaceholder');
    if (!img || !ph) return;

    if (url && url.startsWith('http')) {
      img.src = url;
      img.style.display = 'block';
      ph.style.display = 'none';
    } else {
      img.style.display = 'none';
      ph.style.display = 'flex';
    }
  }

  updatePdfPreview(url) {
    const iframe = document.getElementById('pdfPreviewIframe');
    const ph = document.getElementById('pdfEmptyPreview');
    if (!iframe || !ph) return;

    const embedUrl = CMSStore.convertDriveUrlToEmbed(url);
    if (embedUrl && embedUrl.startsWith('http')) {
      iframe.src = embedUrl;
      iframe.style.display = 'block';
      ph.style.display = 'none';
    } else {
      iframe.src = '';
      iframe.style.display = 'none';
      ph.style.display = 'flex';
    }
  }

  addStoryBlock(storyData = null) {
    const container = document.getElementById('storiesListContainer');
    if (!container) return;

    const count = container.querySelectorAll('.story-block-card').length + 1;
    const block = document.createElement('div');
    block.className = 'story-block-card';

    const defaultHeading = storyData?.heading || `Story Point ${count}`;
    let p1Label = "What changes.";
    let p1Text = "";
    let p2Label = "Why it matters.";
    let p2Text = "";
    let extraText = "";

    if (storyData?.paragraphs) {
      storyData.paragraphs.forEach((p, idx) => {
        if (typeof p === 'object') {
          if (idx === 0) { p1Label = p.label || p1Label; p1Text = p.text || ''; }
          else if (idx === 1) { p2Label = p.label || p2Label; p2Text = p.text || ''; }
        } else if (typeof p === 'string') {
          extraText = p;
        }
      });
    }

    block.innerHTML = `
      <div class="story-block-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="story-badge-num">Story ${count}</span>
          <span style="font-size: 13px; font-weight: 700; color: #ffffff;">Section Card</span>
        </div>
        <button type="button" class="table-action-btn remove-story-btn" title="Remove Story Card">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="form-group" style="margin-bottom: 12px;">
        <label class="form-label">Story Headline / Topic</label>
        <input type="text" class="form-input story-heading-input" placeholder="e.g. OpenAI Operator & Deep Research in Workflows" value="${this.escapeHtml(defaultHeading)}">
      </div>

      <div class="form-grid-2" style="margin-bottom: 12px;">
        <div class="form-group">
          <label class="form-label">Callout 1 Label (e.g. "What changes.")</label>
          <input type="text" class="form-input story-p1-label" value="${this.escapeHtml(p1Label)}">
          <textarea class="form-textarea story-p1-text" rows="2" style="margin-top: 6px;" placeholder="Explanation for callout 1...">${this.escapeHtml(p1Text)}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Callout 2 Label (e.g. "Why it matters.")</label>
          <input type="text" class="form-input story-p2-label" value="${this.escapeHtml(p2Label)}">
          <textarea class="form-textarea story-p2-text" rows="2" style="margin-top: 6px;" placeholder="Explanation for callout 2...">${this.escapeHtml(p2Text)}</textarea>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Additional Context / Takeaway Note</label>
        <input type="text" class="form-input story-extra-text" placeholder="Optional closing sentence for this story card..." value="${this.escapeHtml(extraText)}">
      </div>
    `;

    block.querySelector('.remove-story-btn').addEventListener('click', () => {
      block.remove();
      this.reindexStoryBadges();
    });

    container.appendChild(block);
  }

  reindexStoryBadges() {
    const badges = document.querySelectorAll('#storiesListContainer .story-badge-num');
    badges.forEach((b, i) => {
      b.textContent = `Story ${i + 1}`;
    });
  }

  addResourceLinkRow(linkData = null) {
    const container = document.getElementById('resourceLinksContainer');
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'resource-link-row';
    row.style.display = 'flex';
    row.style.gap = '10px';
    row.style.alignItems = 'center';

    row.innerHTML = `
      <input type="text" class="form-input link-label-input" placeholder="Link Title (e.g. Staying Ahead Prompt Pack)" value="${this.escapeHtml(linkData?.label || '')}" style="flex: 1;">
      <input type="url" class="form-input link-url-input" placeholder="https://drive.google.com/..." value="${this.escapeHtml(linkData?.url || '')}" style="flex: 1.5;">
      <button type="button" class="table-action-btn remove-link-btn" title="Remove Link">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    row.querySelector('.remove-link-btn').addEventListener('click', () => row.remove());
    container.appendChild(row);
  }

  gatherFormData() {
    const id = document.getElementById('updateId').value;
    const tag = document.getElementById('updateTag').value;
    const date = document.getElementById('updateDate').value;
    const title = document.getElementById('updateTitle').value;
    const excerpt = document.getElementById('updateExcerpt').value;
    const authorName = document.getElementById('updateAuthorName').value;
    const authorAvatarUrl = document.getElementById('updateAuthorAvatar').value;
    const slug = document.getElementById('updateSlug').value;
    const status = document.querySelector('input[name="updateStatus"]:checked')?.value || 'published';
    const contentType = document.querySelector('input[name="contentType"]:checked')?.value || 'article';
    const thumbnailUrl = document.getElementById('updateThumbnailUrl').value;

    // Gather Stories
    const stories = [];
    document.querySelectorAll('#storiesListContainer .story-block-card').forEach((b, idx) => {
      const heading = b.querySelector('.story-heading-input')?.value || `Story ${idx + 1}`;
      const p1Label = b.querySelector('.story-p1-label')?.value;
      const p1Text = b.querySelector('.story-p1-text')?.value;
      const p2Label = b.querySelector('.story-p2-label')?.value;
      const p2Text = b.querySelector('.story-p2-text')?.value;
      const extra = b.querySelector('.story-extra-text')?.value;

      const paragraphs = [];
      if (p1Label || p1Text) paragraphs.push({ label: p1Label || 'What changes.', text: p1Text || '' });
      if (p2Label || p2Text) paragraphs.push({ label: p2Label || 'Why it matters.', text: p2Text || '' });
      if (extra) paragraphs.push(extra);

      stories.push({
        number: idx + 1,
        heading,
        paragraphs
      });
    });

    const article = {
      sectionTitle: document.getElementById('articleSectionTitle')?.value || title,
      sectionSubtitle: document.getElementById('articleSectionSubtitle')?.value || excerpt,
      stories,
      broaderContext: document.getElementById('articleBroaderContext')?.value || ''
    };

    // Gather PDFs
    const pdfs = [];
    const pdfLabel = document.getElementById('primaryPdfLabel')?.value;
    const pdfUrl = document.getElementById('primaryPdfUrl')?.value;
    if (pdfUrl) {
      pdfs.push({
        label: pdfLabel || `${title} (PDF Document)`,
        url: pdfUrl,
        embedUrl: CMSStore.convertDriveUrlToEmbed(pdfUrl)
      });
    }

    // Gather Links
    const resourceLinks = [];
    document.querySelectorAll('#resourceLinksContainer .resource-link-row').forEach(row => {
      const l = row.querySelector('.link-label-input')?.value;
      const u = row.querySelector('.link-url-input')?.value;
      if (l && u) {
        resourceLinks.push({ label: l, url: u });
      }
    });

    // Retain existing analytics data if editing
    let analytics = undefined;
    if (id) {
      const existing = cmsStore.getById(id);
      if (existing && existing.analytics) {
        analytics = existing.analytics;
      }
    }

    return {
      id: id || undefined,
      tag,
      date,
      title,
      excerpt,
      authorName,
      authorAvatarUrl,
      slug: slug || undefined,
      status,
      contentType,
      thumbnailUrl,
      article,
      pdfs,
      resourceLinks,
      analytics
    };
  }

  // =========================================================================
  // VIEW: MEDIA & PDF LIBRARY
  // =========================================================================
  renderMediaLibrary() {
    const grid = document.getElementById('mediaLibraryGrid');
    if (!grid) return;

    const allUpdates = cmsStore.getAll();
    const itemsWithPdfs = allUpdates.filter(u => u.pdfs && u.pdfs.length > 0);

    if (itemsWithPdfs.length === 0) {
      grid.innerHTML = `
        <div class="empty-placeholder" style="grid-column: 1 / -1;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <p style="color: var(--admin-text-muted);">No PDF decks or Drive files attached to any dispatches.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = itemsWithPdfs.map(item => {
      const pdf = item.pdfs[0];
      const thumb = item.thumbnailUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80';
      const opens = item.analytics?.pdfOpenCounts?.[pdf.label] || 0;

      return `
        <div class="update-grid-card">
          <div class="card-thumb-wrap">
            <img src="${thumb}" alt="${this.escapeHtml(pdf.label)}" loading="lazy">
            <span class="tag-badge guide" style="position: absolute; top: 12px; left: 12px;">PDF ATTACHMENT</span>
          </div>
          <div class="card-body">
            <span style="font-size: 11px; color: var(--admin-text-dim); margin-bottom: 4px;">Parent: ${this.escapeHtml(item.title)}</span>
            <h4 style="font-size: 14px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">
              ${this.escapeHtml(pdf.label)}
            </h4>
            <div style="margin-bottom: 12px; font-size: 11px; color: #fbbf24;">
              Opened ${opens} times by community
            </div>
            <div style="display: flex; gap: 8px; margin-top: auto;">
              <a href="${pdf.url}" target="_blank" class="btn-admin-secondary btn-sm" style="flex: 1; text-align: center; justify-content: center;">
                Open Drive File ↗
              </a>
              <a href="#editor?id=${item.id}" class="btn-admin-primary btn-sm">
                Edit Update
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // VIEW: SETTINGS
  // =========================================================================
  renderSettings() {
    const settings = cmsStore.getSettings();
    if (document.getElementById('settingsAdminName')) {
      document.getElementById('settingsAdminName').value = settings.adminName || 'StayDriven Admin';
    }
    if (document.getElementById('settingsAdminRole')) {
      document.getElementById('settingsAdminRole').value = settings.adminRole || 'Lead Editor & Admin';
    }
    if (document.getElementById('settingsAdminAvatar')) {
      document.getElementById('settingsAdminAvatar').value = settings.adminAvatar || '';
    }
    if (document.getElementById('settingsAboutText')) {
      document.getElementById('settingsAboutText').value = settings.aboutStayingAheadText || '';
    }
  }

  // =========================================================================
  // BULK ACTIONS & MODAL CONTROLS
  // =========================================================================
  updateBulkBar() {
    const bar = document.getElementById('bulkBar');
    const countEl = document.getElementById('bulkSelectedCount');
    if (!bar || !countEl) return;

    if (this.selectedIds.size > 0) {
      bar.style.display = 'flex';
      countEl.textContent = `${this.selectedIds.size} selected`;
    } else {
      bar.style.display = 'none';
    }
  }

  openDeleteModal(id) {
    this.itemToDeleteId = id;
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) modal.classList.add('open');
  }

  executeDelete() {
    if (this.itemToDeleteId) {
      cmsStore.delete(this.itemToDeleteId);
      this.selectedIds.delete(this.itemToDeleteId);
      this.itemToDeleteId = null;
      document.getElementById('deleteConfirmModal').classList.remove('open');
      this.showToast('Update deleted from public library', 'info');
      this.refreshCurrentView();
    }
  }

  // =========================================================================
  // EVENT BINDINGS
  // =========================================================================
  bindEvents() {
    // Navigation routing clicks
    document.querySelectorAll('[data-route]').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.hash = `#${btn.dataset.route}`;
      });
    });

    document.querySelectorAll('[data-navigate]').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.hash = `#${btn.dataset.navigate}`;
      });
    });

    // Global Search Header
    const searchInput = document.getElementById('globalAdminSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        if (this.currentRoute !== 'updates') {
          window.location.hash = '#updates';
        } else {
          this.renderAllUpdates();
        }
      });
    }

    // Analytics Metric Tabs Switching
    document.querySelectorAll('#chartMetricTabs .chart-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#chartMetricTabs .chart-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.analyticsMetric = btn.dataset.metric;
        const summary = cmsStore.getAnalyticsSummary();
        if (summary) this.renderTrendChart(summary.chartData);
      });
    });

    // Analytics Post Search
    const analyticsSearchInput = document.getElementById('analyticsPostSearch');
    if (analyticsSearchInput) {
      analyticsSearchInput.addEventListener('input', (e) => {
        this.analyticsSearch = e.target.value.trim();
        const summary = cmsStore.getAnalyticsSummary();
        if (summary) this.renderAnalyticsRankedTable(summary.postsRanked);
      });
    }

    // Analytics Table Column Sorting
    document.querySelectorAll('#analyticsRankedTable th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.sort;
        if (this.analyticsSortCol === col) {
          this.analyticsSortAsc = !this.analyticsSortAsc;
        } else {
          this.analyticsSortCol = col;
          this.analyticsSortAsc = false; // default descending for metrics
        }
        const summary = cmsStore.getAnalyticsSummary();
        if (summary) this.renderAnalyticsRankedTable(summary.postsRanked);
      });
    });

    // Analytics Manual Refresh
    const refreshAnalyticsBtn = document.getElementById('refreshAnalyticsBtn');
    if (refreshAnalyticsBtn) {
      refreshAnalyticsBtn.addEventListener('click', () => {
        this.renderAnalytics();
        this.showToast('Analytics refreshed with latest live events', 'success');
      });
    }

    // Analytics CSV Export
    const exportCsvBtn = document.getElementById('exportAnalyticsCsvBtn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        const summary = cmsStore.getAnalyticsSummary();
        if (!summary) return;

        let csv = 'Article Title,Category,Slug,Total Views,Unique Visitors,WhatsApp Clicks,Conversion Rate %,PDF Opens,Resource Link Clicks,Last Viewed\n';
        summary.postsRanked.forEach(p => {
          const conv = p.unique > 0 ? ((p.whatsappClicks / p.unique) * 100).toFixed(1) : '0.0';
          csv += `"${p.title.replace(/"/g, '""')}","${p.tag}","${p.slug}",${p.views},${p.unique},${p.whatsappClicks},${conv}%,${p.pdfOpens},${p.resourceClicks},"${p.lastViewedAt || 'N/A'}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `staydriven-analytics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Analytics CSV exported', 'success');
      });
    }

    // Filter Buttons in Updates view
    document.querySelectorAll('#updatesFilterPills .filter-btn-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#updatesFilterPills .filter-btn-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTagFilter = btn.dataset.tag;
        this.renderAllUpdates();
      });
    });

    // Status Filter Select
    const statusSelect = document.getElementById('statusFilterSelect');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        this.activeStatusFilter = e.target.value;
        this.renderAllUpdates();
      });
    }

    // View Mode Table vs Grid
    const tableBtn = document.getElementById('viewModeTableBtn');
    const gridBtn = document.getElementById('viewModeGridBtn');
    if (tableBtn && gridBtn) {
      tableBtn.addEventListener('click', () => {
        tableBtn.classList.add('active');
        gridBtn.classList.remove('active');
        document.getElementById('allUpdatesTableCard').style.display = 'block';
        document.getElementById('allUpdatesGrid').style.display = 'none';
      });
      gridBtn.addEventListener('click', () => {
        gridBtn.classList.add('active');
        tableBtn.classList.remove('active');
        document.getElementById('allUpdatesTableCard').style.display = 'none';
        document.getElementById('allUpdatesGrid').style.display = 'grid';
      });
    }

    // Master Checkbox
    const masterCb = document.getElementById('masterCheckbox');
    if (masterCb) {
      masterCb.addEventListener('change', (e) => {
        const allCbs = document.querySelectorAll('.row-checkbox');
        allCbs.forEach(cb => {
          cb.checked = masterCb.checked;
          const id = cb.dataset.id;
          if (masterCb.checked) this.selectedIds.add(id);
          else this.selectedIds.delete(id);
        });
        this.updateBulkBar();
      });
    }

    // Bulk Actions
    const bulkPublishBtn = document.getElementById('bulkPublishBtn');
    const bulkDraftBtn = document.getElementById('bulkDraftBtn');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');

    if (bulkPublishBtn) {
      bulkPublishBtn.addEventListener('click', () => {
        cmsStore.bulkUpdateStatus(Array.from(this.selectedIds), 'published');
        this.selectedIds.clear();
        this.updateBulkBar();
        this.showToast('Selected items published to public site', 'success');
        this.refreshCurrentView();
      });
    }

    if (bulkDraftBtn) {
      bulkDraftBtn.addEventListener('click', () => {
        cmsStore.bulkUpdateStatus(Array.from(this.selectedIds), 'draft');
        this.selectedIds.clear();
        this.updateBulkBar();
        this.showToast('Selected items converted to draft', 'info');
        this.refreshCurrentView();
      });
    }

    if (bulkDeleteBtn) {
      bulkDeleteBtn.addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete ${this.selectedIds.size} updates?`)) {
          cmsStore.bulkDelete(Array.from(this.selectedIds));
          this.selectedIds.clear();
          this.updateBulkBar();
          this.showToast('Selected items deleted', 'info');
          this.refreshCurrentView();
        }
      });
    }

    // Editor Content Type picker
    document.querySelectorAll('#contentTypePicker input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.handleContentTypeChange(e.target.value);
      });
    });

    // Editor Form Submit (Publish)
    const updateForm = document.getElementById('updateForm');
    if (updateForm) {
      updateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = this.gatherFormData();
        cmsStore.save(data);
        this.showToast('Update published to public archive successfully!', 'success');
        window.location.hash = '#updates';
      });
    }

    // Save Draft Button
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    if (saveDraftBtn) {
      saveDraftBtn.addEventListener('click', () => {
        const data = this.gatherFormData();
        data.status = 'draft';
        cmsStore.save(data);
        this.showToast('Draft saved successfully', 'info');
        window.location.hash = '#updates';
      });
    }

    // Thumbnail input change
    const thumbInput = document.getElementById('updateThumbnailUrl');
    if (thumbInput) {
      thumbInput.addEventListener('input', (e) => this.updateThumbPreview(e.target.value));
    }

    // Curated quick image buttons
    document.querySelectorAll('[data-quick-img]').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.quickImg;
        if (thumbInput) {
          thumbInput.value = url;
          this.updateThumbPreview(url);
        }
      });
    });

    // PDF URL input change
    const pdfUrlInput = document.getElementById('primaryPdfUrl');
    if (pdfUrlInput) {
      pdfUrlInput.addEventListener('input', (e) => this.updatePdfPreview(e.target.value));
    }

    // Story Builder buttons
    const addStoryBtn = document.getElementById('addStoryBlockBtn');
    if (addStoryBtn) {
      addStoryBtn.addEventListener('click', () => this.addStoryBlock());
    }

    const addResourceLinkBtn = document.getElementById('addResourceLinkBtn');
    if (addResourceLinkBtn) {
      addResourceLinkBtn.addEventListener('click', () => this.addResourceLinkRow());
    }

    // Delete modal confirmation actions
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteActionBtn');
    if (cancelDeleteBtn) {
      cancelDeleteBtn.addEventListener('click', () => {
        document.getElementById('deleteConfirmModal').classList.remove('open');
      });
    }
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', () => this.executeDelete());
    }

    // Profile Settings Form
    const profileForm = document.getElementById('adminProfileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newSettings = {
          ...cmsStore.getSettings(),
          adminName: document.getElementById('settingsAdminName').value.trim(),
          adminRole: document.getElementById('settingsAdminRole').value.trim(),
          adminAvatar: document.getElementById('settingsAdminAvatar').value.trim(),
          aboutStayingAheadText: document.getElementById('settingsAboutText')?.value.trim() || ''
        };
        cmsStore.saveSettings(newSettings);
        this.updateProfileUI();
        this.showToast('Profile & Settings updated successfully', 'success');
      });
    }

    // Export Data JSON
    const exportBtn = document.getElementById('exportDataBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const json = cmsStore.exportDataJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `staydriven-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Backup JSON exported successfully', 'success');
      });
    }

    // Import Data JSON
    const importInput = document.getElementById('importJsonInput');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const res = cmsStore.importDataJSON(event.target.result);
            if (res.success) {
              this.showToast(`Imported ${res.count} updates from backup!`, 'success');
              this.refreshCurrentView();
            } else {
              this.showToast(`Import failed: ${res.error}`, 'error');
            }
          };
          reader.readAsText(file);
        }
      });
    }

    // Reset Defaults
    const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');
    if (resetDefaultsBtn) {
      resetDefaultsBtn.addEventListener('click', () => {
        if (confirm('Reset all CMS content to initial sample dataset? Your custom edits will be replaced.')) {
          cmsStore.resetToDefaults();
          this.showToast('Reset to default seed data successfully', 'success');
          this.refreshCurrentView();
        }
      });
    }

    // Quick Actions on Dashboard
    document.querySelectorAll('[data-action^="quick-"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const act = btn.dataset.action;
        window.location.hash = '#editor';
        setTimeout(() => {
          if (act === 'quick-ai-tool') {
            document.getElementById('updateTag').value = 'AI TOOL';
            const radio = document.querySelector('input[name="contentType"][value="article"]');
            if (radio) { radio.checked = true; this.handleContentTypeChange('article'); }
          } else if (act === 'quick-daily-update') {
            document.getElementById('updateTag').value = 'DAILY AI UPDATE';
            const radio = document.querySelector('input[name="contentType"][value="article"]');
            if (radio) { radio.checked = true; this.handleContentTypeChange('article'); }
          } else if (act === 'quick-guide-pdf') {
            document.getElementById('updateTag').value = 'GUIDE';
            const radio = document.querySelector('input[name="contentType"][value="both"]');
            if (radio) { radio.checked = true; this.handleContentTypeChange('both'); }
          }
        }, 50);
      });
    });

    // Login Form
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const res = cmsStore.login(email, password);
        if (res.success) {
          this.showToast(`Welcome back, ${res.user.name}!`, 'success');
          window.location.hash = '#dashboard';
        } else {
          this.showToast(res.error, 'error');
        }
      });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        cmsStore.logout();
        this.showToast('Signed out successfully', 'success');
        window.location.hash = '#login';
      });
    }
  }

  // Toast Notification
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
      <span>${this.escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  formatCurrentDate() {
    const d = new Date();
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const nth = (day > 3 && day < 21) ? 'th' : (day % 10 === 1 ? 'st' : (day % 10 === 2 ? 'nd' : (day % 10 === 3 ? 'rd' : 'th')));
    return `${day}${nth} ${month}, ${year}`;
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Instantiate Admin App Controller
document.addEventListener('DOMContentLoaded', () => {
  new AdminController();
});
