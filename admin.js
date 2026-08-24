import { cmsStore, CMSStore } from './cms-store.js';

class AdminController {
  constructor() {
    this.currentRoute = 'dashboard';
    this.activeTagFilter = 'ALL';
    this.activeStatusFilter = 'ALL';
    this.searchQuery = '';
    this.selectedIds = new Set();
    this.itemToDeleteId = null;
    this.currentViewMode = 'table'; // 'table' | 'grid'
    
    // Analytics state
    this.analyticsMetric = 'views';
    this.analyticsSearch = '';
    this.analyticsSortCol = 'views';
    this.analyticsSortAsc = false;

    this.init();
  }

  async init() {
    // 1. Initial Auth Check
    const isAuth = cmsStore.getAuth().isAuthenticated;
    const currentHash = window.location.hash.replace('#', '').split('?')[0] || 'dashboard';

    if (!isAuth && currentHash !== 'login') {
      window.location.hash = '#login';
    } else if (isAuth && currentHash === 'login') {
      window.location.hash = '#dashboard';
    }

    // 2. Verify Session with Server in background
    if (isAuth) {
      cmsStore.verifyAuth().then(valid => {
        if (!valid && window.location.hash.replace('#', '') !== 'login') {
          window.location.hash = '#login';
        }
      });
    }

    // 3. Bind UI & Route Handlers
    this.bindEvents();
    this.updateProfileUI();
    this.handleRoute();

    // 4. Listen for Route Changes
    window.addEventListener('hashchange', () => this.handleRoute());

    // 5. Listen for Global Real-Time Content Sync
    window.addEventListener('staydriven_cms_change', () => {
      this.refreshCurrentView();
    });

    // 6. Listen for Real-Time Live Analytics Events
    window.addEventListener('staydriven_analytics_event', (e) => {
      this.handleLiveAnalyticsEvent(e.detail);
    });
  }

  // =========================================================================
  // ROUTING & VIEW CONTROLLER
  // =========================================================================
  handleRoute() {
    const rawHash = window.location.hash.replace('#', '') || 'dashboard';
    const [route, queryString] = rawHash.split('?');
    const auth = cmsStore.getAuth();

    // Route Guard
    if (!auth.isAuthenticated && route !== 'login') {
      window.location.hash = '#login';
      return;
    }

    if (auth.isAuthenticated && route === 'login') {
      window.location.hash = '#dashboard';
      return;
    }

    this.currentRoute = route;
    const adminApp = document.getElementById('adminApp');

    if (route === 'login') {
      if (adminApp) adminApp.classList.add('is-login-mode');
    } else {
      if (adminApp) adminApp.classList.remove('is-login-mode');
    }

    // Update active state on sidebar navigation
    document.querySelectorAll('.nav-icon-btn[data-route]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.route === route);
    });

    // Toggle View Sections
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const activeSection = document.getElementById(`view-${route}`);
    if (activeSection) {
      activeSection.classList.add('active');
    }

    // Update Topbar Headings
    this.updateHeadings(route);

    // Route specific initializers
    if (route === 'dashboard') {
      this.renderDashboard();
    } else if (route === 'analytics') {
      this.renderAnalytics();
    } else if (route === 'updates') {
      this.renderAllUpdates();
    } else if (route === 'editor') {
      const urlParams = new URLSearchParams(queryString || '');
      const editId = urlParams.get('id');
      this.renderEditor(editId);
    } else if (route === 'media') {
      this.renderMediaLibrary();
    } else if (route === 'settings') {
      this.renderSettings();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateHeadings(route) {
    const titleEl = document.getElementById('pageHeadingTitle');
    const subEl = document.getElementById('pageHeadingSubtitle');
    if (!titleEl || !subEl) return;

    const headings = {
      dashboard: { title: 'Dashboard', sub: 'Overview of library dispatches, stats and quick actions' },
      analytics: { title: 'Analytics & Traffic', sub: 'Real-time engagement, page views, click attribution & community growth' },
      updates: { title: 'All Intelligence Dispatches', sub: 'Manage, filter, search and publish StayDriven updates' },
      editor: { title: 'Dispatch Composer', sub: 'Craft structured intelligence briefings and attach Drive PDFs' },
      media: { title: 'PDFs & Drive Media Library', sub: 'Browse and inspect all connected slide decks and resources' },
      settings: { title: 'Settings & Security', sub: 'Configure admin identity, public about text, and credentials' },
      login: { title: 'Admin Login', sub: 'Sign in to access your intelligence control center' }
    };

    const h = headings[route] || headings.dashboard;
    titleEl.textContent = h.title;
    subEl.textContent = h.sub;
  }

  updateProfileUI() {
    const settings = cmsStore.getSettings();
    const auth = cmsStore.getAuth();

    const name = auth.user?.name || settings.adminName || 'StayDriven Admin';
    const role = auth.user?.role || settings.adminRole || 'Lead Editor & Admin';
    const email = auth.user?.email || 'admin@staydriven.community';
    const avatar = auth.user?.avatar || settings.adminAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80';

    const topName = document.getElementById('topbarAdminName');
    const topRole = document.getElementById('topbarAdminRole');
    const topAvatar = document.getElementById('topbarAvatar');
    const dropName = document.getElementById('dropdownUserName');
    const dropEmail = document.getElementById('dropdownUserEmail');

    if (topName) topName.textContent = name;
    if (topRole) topRole.textContent = role;
    if (topAvatar) topAvatar.src = avatar;
    if (dropName) dropName.textContent = name;
    if (dropEmail) dropEmail.textContent = email;
  }

  refreshCurrentView() {
    if (this.currentRoute === 'dashboard') this.renderDashboard();
    else if (this.currentRoute === 'analytics') this.renderAnalytics();
    else if (this.currentRoute === 'updates') this.renderAllUpdates();
    else if (this.currentRoute === 'media') this.renderMediaLibrary();
  }

  // =========================================================================
  // VIEW: DASHBOARD
  // =========================================================================
  renderDashboard() {
    const stats = cmsStore.getStats();
    const analytics = cmsStore.getAnalyticsSummary();

    const totalEl = document.getElementById('dashStatTotal');
    const pubEl = document.getElementById('dashStatPublished');
    const draftEl = document.getElementById('dashStatDrafts');
    const viewsEl = document.getElementById('dashStatViews');

    if (totalEl) totalEl.textContent = stats.total;
    if (pubEl) pubEl.textContent = stats.publishedCount;
    if (draftEl) draftEl.textContent = stats.draftsCount;
    if (viewsEl) viewsEl.textContent = analytics.kpi.totalPageViews.toLocaleString();

    // Render Recent Table (5 items)
    const recentTableBody = document.getElementById('recentUpdatesTableBody');
    if (recentTableBody) {
      const recent = cmsStore.getAll().slice(0, 5);
      if (recent.length === 0) {
        recentTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--admin-text-muted); padding: 24px;">No updates published yet.</td></tr>`;
      } else {
        recentTableBody.innerHTML = recent.map(item => this.renderTableRow(item, false)).join('');
      }
    }

    // Render Live Activity Feed on Dashboard
    this.renderActivityFeed(analytics.recentEvents);
  }

  renderActivityFeed(events = []) {
    const feed = document.getElementById('activityFeedContainer');
    if (!feed) return;

    if (!events || events.length === 0) {
      feed.innerHTML = `
        <div style="padding: 20px 0; text-align: center; color: var(--admin-text-dim); font-size: 13px;">
          Listening for live visitor events...
        </div>
      `;
      return;
    }

    const typeIcons = {
      article_view: '<span class="activity-dot"></span>',
      resource_click: '<span class="activity-dot" style="background: #34d399; box-shadow: 0 0 10px rgba(52, 211, 153, 0.6);"></span>',
      pdf_interaction: '<span class="activity-dot" style="background: #fbbf24; box-shadow: 0 0 10px rgba(251, 191, 36, 0.6);"></span>'
    };

    feed.innerHTML = events.slice(0, 6).map(evt => {
      const dot = typeIcons[evt.type] || '<span class="activity-dot"></span>';
      const timeStr = this.formatRelativeTime(evt.timestamp);

      let text = '';
      if (evt.type === 'article_view') {
        text = `Article <strong>${this.escapeHtml(evt.articleTitle || 'Dispatch')}</strong> viewed (Anonymous Visitor).`;
      } else if (evt.type === 'pdf_interaction') {
        text = `PDF Document <strong>${this.escapeHtml(evt.pdfLabel || 'Slide Deck')}</strong> opened.`;
      } else if (evt.type === 'resource_click') {
        text = `External resource link clicked: <strong>${this.escapeHtml(evt.linkLabel || 'Resource')}</strong>.`;
      } else {
        text = `Live visitor event recorded (${this.escapeHtml(evt.type)}).`;
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

  // =========================================================================
  // VIEW: REAL-TIME ANALYTICS & TRAFFIC
  // =========================================================================
  renderAnalytics() {
    const summary = cmsStore.getAnalyticsSummary();
    if (!summary) return;

    // 1. KPI Cards
    const kpiViews = document.getElementById('kpiTotalViews');
    const kpiUnique = document.getElementById('kpiUniqueVisitors');
    const kpiRes = document.getElementById('kpiResourceClicks') || document.getElementById('kpiWhatsappClicks');
    const kpiConv = document.getElementById('kpiConversionRate');
    const kpiToday = document.getElementById('kpiTodayViews');

    const totalResourceEngagements = (summary.kpi.totalPdfOpens || 0) + (summary.kpi.totalResourceClicks || 0) + (summary.kpi.totalWhatsappClicks || 0);

    if (kpiViews) kpiViews.textContent = summary.kpi.totalPageViews.toLocaleString();
    if (kpiUnique) kpiUnique.textContent = summary.kpi.totalUniqueVisitors.toLocaleString();
    if (kpiRes) kpiRes.textContent = totalResourceEngagements.toLocaleString();
    if (kpiConv) kpiConv.textContent = `${summary.kpi.conversionRate}%`;
    if (kpiToday) kpiToday.textContent = `+${summary.kpi.todayViews} today`;

    // 2. Trend SVG Chart
    this.renderTrendChart(summary.chartData);

    // 3. Resource & Channel Distribution Bars
    this.renderResourceDistribution(summary.whatsappDistribution, totalResourceEngagements);

    // 4. Ranked Posts Table
    this.renderAnalyticsRankedTable(summary.postsRanked);

    // 5. Live Events Feed
    this.renderLiveEventsFeed(summary.recentEvents);
  }

  handleLiveAnalyticsEvent(payload) {
    // If we are currently on the Analytics view, live-update the counters smoothly
    if (this.currentRoute === 'analytics' && payload) {
      const summary = cmsStore.getAnalyticsSummary();

      const kpiViews = document.getElementById('kpiTotalViews');
      const kpiUnique = document.getElementById('kpiUniqueVisitors');
      const kpiRes = document.getElementById('kpiResourceClicks') || document.getElementById('kpiWhatsappClicks');
      const kpiConv = document.getElementById('kpiConversionRate');
      const kpiToday = document.getElementById('kpiTodayViews');

      const totalResourceEngagements = (summary.kpi.totalPdfOpens || 0) + (summary.kpi.totalResourceClicks || 0) + (summary.kpi.totalWhatsappClicks || 0);

      if (kpiViews) {
        kpiViews.textContent = summary.kpi.totalPageViews.toLocaleString();
        kpiViews.classList.remove('counter-flash');
        void kpiViews.offsetWidth;
        kpiViews.classList.add('counter-flash');
      }
      if (kpiUnique) kpiUnique.textContent = summary.kpi.totalUniqueVisitors.toLocaleString();
      if (kpiRes) kpiRes.textContent = totalResourceEngagements.toLocaleString();
      if (kpiConv) kpiConv.textContent = `${summary.kpi.conversionRate}%`;
      if (kpiToday) kpiToday.textContent = `${summary.kpi.todayViews} today`;

      // Update Chart & Distribution
      this.renderTrendChart(summary.chartData);
      this.renderResourceDistribution(summary.whatsappDistribution, totalResourceEngagements);

      // Prepend event to live feed
      if (payload.event) {
        const feed = document.getElementById('analyticsLiveFeed') || document.getElementById('liveEventsFeedContainer');
        if (feed) {
          const itemEl = document.createElement('div');
          itemEl.className = 'activity-item new-live-event';
          const typeDot = '<span class="activity-dot" style="background: #34d399; box-shadow: 0 0 10px rgba(52, 211, 153, 0.6);"></span>';

          let desc = '';
          if (payload.event.type === 'article_view') {
            desc = `Article <strong>${this.escapeHtml(payload.event.articleTitle || 'Dispatch')}</strong> viewed (Anonymous Visitor).`;
          } else if (payload.event.type === 'pdf_interaction') {
            desc = `PDF Document <strong>${this.escapeHtml(payload.event.pdfLabel || 'Deck')}</strong> opened.`;
          } else if (payload.event.type === 'resource_click') {
            desc = `Resource link <strong>${this.escapeHtml(payload.event.linkLabel || 'Resource')}</strong> clicked.`;
          } else {
            desc = `Visitor interaction recorded.`;
          }

          itemEl.innerHTML = `
            ${typeDot}
            <div>
              <p class="activity-text">${desc}</p>
              <span class="activity-time">Just now</span>
            </div>
          `;
          feed.insertBefore(itemEl, feed.firstChild);
        }
      }

      // Update table views dynamically
      this.renderAnalyticsRankedTable(summary.postsRanked);
    } else if (this.currentRoute === 'dashboard') {
      const summary = cmsStore.getAnalyticsSummary();
      const viewsEl = document.getElementById('dashStatViews');
      if (viewsEl) viewsEl.textContent = summary.kpi.totalPageViews.toLocaleString();
      this.renderActivityFeed(summary.recentEvents);
    }
  }

  renderTrendChart(chartData = []) {
    const container = document.getElementById('analyticsChartContainer');
    if (!container) return;

    if (chartData.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 60px; color: var(--admin-text-muted);">No chart data available.</div>`;
      return;
    }

    const metric = this.analyticsMetric || 'views';
    const values = chartData.map(d => metric === 'views' ? d.views : (metric === 'unique' ? d.unique : (d.whatsappClicks || d.unique || 0)));
    const maxVal = Math.max(...values, 10);

    const width = 800;
    const height = 220;
    const padding = { top: 20, right: 20, bottom: 35, left: 45 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const points = chartData.map((d, i) => {
      const val = metric === 'views' ? d.views : (metric === 'unique' ? d.unique : (d.whatsappClicks || d.unique || 0));
      const x = padding.left + (i / (chartData.length - 1)) * chartW;
      const y = padding.top + chartH - (val / maxVal) * chartH;
      return { x, y, val, label: d.displayLabel, dateKey: d.dateKey };
    });

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      pathD += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

    const yGridLines = [0, 0.25, 0.5, 0.75, 1].map(pct => {
      const y = padding.top + chartH * (1 - pct);
      const label = Math.round(maxVal * pct);
      return `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
        <text x="${padding.left - 8}" y="${y + 4}" font-size="10" fill="#6b7280" text-anchor="end">${label}</text>
      `;
    }).join('');

    const step = Math.ceil(chartData.length / 6);
    const xLabels = chartData.map((d, i) => {
      if (i % step === 0 || i === chartData.length - 1) {
        const x = padding.left + (i / (chartData.length - 1)) * chartW;
        return `<text x="${x}" y="${height - 8}" font-size="10" fill="#9ca3af" text-anchor="middle">${d.displayLabel}</text>`;
      }
      return '';
    }).join('');

    const color = (metric === 'resources' || metric === 'whatsapp') ? '#34d399' : (metric === 'unique' ? '#d946ef' : '#a855f7');
    const gradId = `chartGrad_${metric}`;

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width: 100%; height: 100%;">
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.35" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0.0" />
          </linearGradient>
        </defs>
        ${yGridLines}
        <path d="${areaD}" fill="url(#${gradId})" />
        <path d="${pathD}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" />
        ${points.map((p, idx) => `
          <circle cx="${p.x}" cy="${p.y}" r="3.5" fill="${color}" stroke="#121216" stroke-width="1.5" class="chart-bar-hover" data-point-idx="${idx}" />
        `).join('')}
        ${xLabels}
      </svg>
      <div class="chart-tooltip" id="chartHoverTooltip"></div>
    `;

    // Bind Tooltip on SVG Circles
    const tooltip = document.getElementById('chartHoverTooltip');
    if (tooltip) {
      container.querySelectorAll('.chart-bar-hover').forEach(circle => {
        circle.addEventListener('mouseenter', (e) => {
          const idx = parseInt(e.target.dataset.pointIdx, 10);
          const p = points[idx];
          if (!p) return;
          tooltip.innerHTML = `<strong>${p.label}</strong>: ${p.val.toLocaleString()} ${metric}`;
          tooltip.style.display = 'block';
          tooltip.style.left = `${(p.x / width) * 100}%`;
          tooltip.style.top = `${(p.y / height) * 100}%`;
        });
        circle.addEventListener('mouseleave', () => {
          tooltip.style.display = 'none';
        });
      });
    }
  }

  renderResourceDistribution(dist = {}, totalRes = 1) {
    const list = document.getElementById('resourceDistList') || document.getElementById('whatsappDistList') || document.getElementById('whatsappDistributionList');
    if (!list) return;

    const labels = {
      hero: 'Hero Search & Archive',
      navbar: 'Navigation Bar',
      sticky_bar: 'Direct Reading',
      sidebar_about: 'About StayDriven Section',
      footer: 'Footer Resource Hub',
      article_modal: 'Article Reader Deck Modal'
    };

    const entries = Object.entries(dist);
    const sum = Math.max(totalRes, entries.reduce((acc, [, v]) => acc + v, 0), 1);

    if (entries.length === 0 || sum <= 0) {
      list.innerHTML = `
        <div style="padding: 20px 0; text-align: center; color: var(--admin-text-dim); font-size: 13px;">
          Listening for live visitor engagements and research interactions...
        </div>
      `;
      return;
    }

    list.innerHTML = entries.map(([key, val]) => {
      const pct = ((val / sum) * 100).toFixed(0);
      const title = labels[key] || key.replace('_', ' ').toUpperCase();
      return `
        <div class="dist-item">
          <div class="dist-label-row">
            <span class="dist-label-title">${title}</span>
            <span class="dist-label-val">${val.toLocaleString()} (${pct}%)</span>
          </div>
          <div class="dist-bar-track">
            <div class="dist-bar-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderAnalyticsRankedTable(posts = []) {
    const tbody = document.getElementById('analyticsRankedTableBody');
    if (!tbody) return;

    let filtered = [...posts];

    // Filter by search query
    if (this.analyticsSearch) {
      const q = this.analyticsSearch.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q));
    }

    // Sort by column
    filtered.sort((a, b) => {
      const valA = a[this.analyticsSortCol] || 0;
      const valB = b[this.analyticsSortCol] || 0;
      if (typeof valA === 'string') {
        return this.analyticsSortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return this.analyticsSortAsc ? valA - valB : valB - valA;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 32px; color: var(--admin-text-muted);">No posts found matching search.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map((post, idx) => {
      const tagClass = (post.tag || 'AI TOOL').toLowerCase().replace(/\s+/g, '-');
      const convPct = Math.min(100, Math.max(0, post.conversionRate || 0));

      return `
        <tr>
          <td>
            <div style="display: flex; flex-direction: column; gap: 3px;">
              <span style="font-weight: 700; color: #ffffff; font-size: 13.5px;">${this.escapeHtml(post.title)}</span>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="tag-badge ${tagClass}" style="font-size: 10px; padding: 2px 6px;">${this.escapeHtml(post.tag)}</span>
                <span style="font-size: 11px; color: var(--admin-text-dim);">${this.escapeHtml(post.date || '')}</span>
              </div>
            </div>
          </td>
          <td style="font-weight: 800; color: #ffffff; text-align: right;">${(post.views || 0).toLocaleString()}</td>
          <td style="font-weight: 700; color: var(--admin-text-muted); text-align: right;">${(post.unique || 0).toLocaleString()}</td>
          <td style="font-weight: 700; color: #34d399; text-align: right;">${((post.pdfOpens || 0) + (post.resourceClicks || 0) + (post.whatsappClicks || 0)).toLocaleString()}</td>
          <td style="text-align: right;">
            <div class="conversion-pill-wrap" style="justify-content: flex-end;">
              <span style="font-weight: 800; font-size: 13px; color: #ffffff;">${post.conversionRate}%</span>
              <div class="conversion-mini-bar">
                <div class="conversion-mini-fill" style="width: ${convPct}%;"></div>
              </div>
            </div>
          </td>
          <td style="text-align: right; font-size: 12px; color: var(--admin-text-muted);">
            ${post.pdfOpens > 0 ? `<span style="color: #f0abfc;">📄 ${post.pdfOpens}</span>` : '<span style="color: #6b7280;">—</span>'}
          </td>
          <td style="text-align: right; font-size: 11px; color: var(--admin-text-dim);">
            ${post.lastViewedAt ? this.formatRelativeTime(post.lastViewedAt) : 'Never'}
          </td>
          <td style="text-align: right;">
            <a href="#editor?id=${post.id}" class="table-action-btn" title="Edit Dispatch">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }

  renderLiveEventsFeed(events = []) {
    const feed = document.getElementById('analyticsLiveFeed') || document.getElementById('liveEventsFeedContainer');
    if (!feed) return;

    if (!events || events.length === 0) {
      feed.innerHTML = `
        <div style="padding: 24px 0; text-align: center; color: var(--admin-text-dim); font-size: 13px;">
          Listening for live visitor events over WebSocket...
        </div>
      `;
      return;
    }

    const typeIcons = {
      article_view: '<span class="activity-dot"></span>',
      whatsapp_click: '<span class="activity-dot" style="background: #34d399; box-shadow: 0 0 10px rgba(52, 211, 153, 0.6);"></span>',
      pdf_interaction: '<span class="activity-dot" style="background: #fbbf24; box-shadow: 0 0 10px rgba(251, 191, 36, 0.6);"></span>',
      resource_click: '<span class="activity-dot" style="background: #a855f7; box-shadow: 0 0 10px rgba(168, 85, 247, 0.6);"></span>'
    };

    feed.innerHTML = events.slice(0, 15).map(evt => {
      const dot = typeIcons[evt.type] || '<span class="activity-dot"></span>';
      const timeStr = this.formatRelativeTime(evt.timestamp);

      let text = '';
      if (evt.type === 'article_view') {
        text = `Article <strong>${this.escapeHtml(evt.articleTitle || 'Dispatch')}</strong> viewed (Anonymous Visitor).`;
      } else if (evt.type === 'whatsapp_click') {
        text = `WhatsApp Community CTA clicked from <strong>${this.escapeHtml(evt.location || 'Hero')}</strong>.`;
      } else if (evt.type === 'pdf_interaction') {
        text = `PDF Document <strong>${this.escapeHtml(evt.pdfLabel || 'Slide Deck')}</strong> opened.`;
      } else if (evt.type === 'resource_click') {
        text = `External resource link clicked: <strong>${this.escapeHtml(evt.linkLabel || 'Resource')}</strong>.`;
      } else {
        text = `Live visitor event recorded (${this.escapeHtml(evt.type)}).`;
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
        gridContainer.innerHTML = items.map(item => this.renderGridCard(item)).join('');
      }
    }

    this.bindTableRowEvents();
  }

  renderTableRow(item, selectable = true) {
    const isSelected = this.selectedIds.has(item.id);
    const tagClass = (item.tag || 'AI TOOL').toLowerCase().replace(/\s+/g, '-');
    const isPub = item.status === 'published';
    const views = item.analytics?.viewCount || 0;

    let formatBadge = 'Article';
    if (item.contentType === 'both') formatBadge = 'Article + PDF';
    else if (item.contentType === 'pdf') formatBadge = 'PDF Deck';

    return `
      <tr data-id="${item.id}" class="${isSelected ? 'row-selected' : ''}">
        ${selectable ? `
          <td>
            <input type="checkbox" class="row-checkbox" data-id="${item.id}" ${isSelected ? 'checked' : ''}>
          </td>
        ` : ''}
        <td>
          <span class="tag-badge ${tagClass}">${this.escapeHtml(item.tag)}</span>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${item.thumbnailUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=80'}" alt="" style="width: 42px; height: 32px; border-radius: 6px; object-fit: cover; border: 1px solid var(--admin-border);">
            <span style="font-weight: 600; color: #ffffff;">${this.escapeHtml(item.title)}</span>
          </div>
        </td>
        <td style="color: var(--admin-text-muted); font-size: 12px; white-space: nowrap;">${this.escapeHtml(item.date)}</td>
        <td>
          <span style="font-size: 11px; padding: 3px 8px; border-radius: 4px; background: var(--admin-surface-2); border: 1px solid var(--admin-border); color: var(--admin-text-muted);">
            ${formatBadge}
          </span>
        </td>
        <td style="font-weight: 700; color: #ffffff;">${views.toLocaleString()}</td>
        <td>
          <span class="status-badge ${isPub ? 'published' : 'draft'}">
            ${isPub ? 'Published' : 'Draft'}
          </span>
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <a href="#editor?id=${item.id}" class="table-action-btn" title="Edit Update">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </a>
          <button type="button" class="table-action-btn delete-item-btn" data-id="${item.id}" title="Delete Update">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>
    `;
  }

  renderGridCard(item) {
    const tagClass = (item.tag || 'AI TOOL').toLowerCase().replace(/\s+/g, '-');
    const isPub = item.status === 'published';
    const views = item.analytics?.viewCount || 0;

    return `
      <div class="update-grid-card" data-id="${item.id}">
        <div class="card-thumb-wrap">
          <img src="${item.thumbnailUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'}" alt="${this.escapeHtml(item.title)}" loading="lazy">
          <span class="tag-badge ${tagClass}" style="position: absolute; top: 12px; left: 12px;">${this.escapeHtml(item.tag)}</span>
          <span class="status-badge ${isPub ? 'published' : 'draft'}" style="position: absolute; top: 12px; right: 12px;">
            ${isPub ? 'Published' : 'Draft'}
          </span>
        </div>
        <div class="card-body">
          <span style="font-size: 11px; color: var(--admin-text-dim); margin-bottom: 4px;">${this.escapeHtml(item.date)}</span>
          <h4 style="font-size: 15px; font-weight: 700; color: #ffffff; line-height: 1.35; margin-bottom: 6px;">
            ${this.escapeHtml(item.title)}
          </h4>
          <p style="font-size: 12.5px; color: var(--admin-text-muted); line-height: 1.5; margin-bottom: 12px; flex: 1;">
            ${this.escapeHtml(item.excerpt || '')}
          </p>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 10px; border-top: 1px solid var(--admin-border);">
            <span style="font-size: 12px; font-weight: 700; color: #a855f7;">${views.toLocaleString()} views</span>
            <div style="display: flex; gap: 6px;">
              <a href="#editor?id=${item.id}" class="btn-admin-primary btn-sm">Edit</a>
              <button type="button" class="btn-admin-danger btn-sm delete-item-btn" data-id="${item.id}">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindTableRowEvents() {
    // Checkbox selections
    document.querySelectorAll('.row-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        if (e.target.checked) this.selectedIds.add(id);
        else this.selectedIds.delete(id);
        this.updateBulkBar();
      });
    });

    // Master Checkbox
    const master = document.getElementById('masterCheckbox');
    if (master) {
      master.addEventListener('change', (e) => {
        const allBoxes = document.querySelectorAll('.row-checkbox');
        allBoxes.forEach(cb => {
          cb.checked = e.target.checked;
          const id = cb.dataset.id;
          if (e.target.checked) this.selectedIds.add(id);
          else this.selectedIds.delete(id);
        });
        this.updateBulkBar();
      });
    }

    // Delete Buttons
    document.querySelectorAll('.delete-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        this.openDeleteModal(id);
      });
    });
  }

  // =========================================================================
  // VIEW: COMPOSER / EDITOR
  // =========================================================================
  renderEditor(editId = null) {
    const heading = document.getElementById('editorViewHeading');
    const updateIdInput = document.getElementById('updateId');
    const updateTag = document.getElementById('updateTag');
    const updateDate = document.getElementById('updateDate');
    const updateTitle = document.getElementById('updateTitle');
    const updateExcerpt = document.getElementById('updateExcerpt');
    const updateAuthorName = document.getElementById('updateAuthorName');
    const updateAuthorAvatar = document.getElementById('updateAuthorAvatar');
    const updateSlug = document.getElementById('updateSlug');
    const updateThumbnailUrl = document.getElementById('updateThumbnailUrl');
    const articleSectionTitle = document.getElementById('articleSectionTitle');
    const articleSectionSubtitle = document.getElementById('articleSectionSubtitle');
    const articleBroaderContext = document.getElementById('articleBroaderContext');
    const primaryPdfLabel = document.getElementById('primaryPdfLabel');
    const primaryPdfUrl = document.getElementById('primaryPdfUrl');
    const storiesContainer = document.getElementById('storiesListContainer');
    const resourceLinksContainer = document.getElementById('resourceLinksContainer');
    const editorAnalyticsBox = document.getElementById('editorAnalyticsBox');

    // Reset Form
    storiesContainer.innerHTML = '';
    resourceLinksContainer.innerHTML = '';

    const settings = cmsStore.getSettings();

    if (editId) {
      const item = cmsStore.getById(editId);
      if (item) {
        heading.textContent = `Edit Intelligence Briefing: "${item.title}"`;
        updateIdInput.value = item.id;
        updateTag.value = item.tag || 'AI TOOL';
        updateDate.value = item.date || this.formatCurrentDate();
        updateTitle.value = item.title || '';
        updateExcerpt.value = item.excerpt || '';
        updateAuthorName.value = item.authorName || settings.adminName || 'StayDriven Editorial';
        updateAuthorAvatar.value = item.authorAvatarUrl || settings.adminAvatar || '';
        updateSlug.value = item.slug || '';
        updateThumbnailUrl.value = item.thumbnailUrl || '';
        this.updateThumbPreview(item.thumbnailUrl);

        // Status radio
        const statusRadio = document.querySelector(`input[name="updateStatus"][value="${item.status || 'published'}"]`);
        if (statusRadio) statusRadio.checked = true;

        // Content Type radio
        const typeRadio = document.querySelector(`input[name="contentType"][value="${item.contentType || 'article'}"]`);
        if (typeRadio) {
          typeRadio.checked = true;
          this.handleContentTypeChange(item.contentType || 'article');
        }

        // Article section
        if (item.article) {
          if (articleSectionTitle) articleSectionTitle.value = item.article.sectionTitle || '';
          if (articleSectionSubtitle) articleSectionSubtitle.value = item.article.sectionSubtitle || '';
          if (articleBroaderContext) articleBroaderContext.value = item.article.broaderContext || '';

          if (Array.isArray(item.article.stories) && item.article.stories.length > 0) {
            item.article.stories.forEach((st, idx) => {
              this.addStoryBlock(st, idx + 1);
            });
          } else {
            this.addStoryBlock();
          }
        } else {
          this.addStoryBlock();
        }

        // PDFs
        if (item.pdfs && item.pdfs.length > 0) {
          if (primaryPdfLabel) primaryPdfLabel.value = item.pdfs[0].label || '';
          if (primaryPdfUrl) primaryPdfUrl.value = item.pdfs[0].url || '';
          this.updatePdfPreview(item.pdfs[0].url);
        } else {
          if (primaryPdfLabel) primaryPdfLabel.value = '';
          if (primaryPdfUrl) primaryPdfUrl.value = '';
          this.updatePdfPreview('');
        }

        // Resource Links
        if (item.resourceLinks && item.resourceLinks.length > 0) {
          item.resourceLinks.forEach(l => this.addResourceLinkRow(l));
        }

        // Render Engagement Drilldown Box
        if (editorAnalyticsBox && item.analytics) {
          const an = item.analytics;
          const totalActions = (an.pdfOpenCount || 0) + (an.resourceClickCount || 0) + (an.whatsappClickCount || 0);
          const conv = an.uniqueViewCount > 0 ? ((totalActions / an.uniqueViewCount) * 100).toFixed(1) : '0.0';
          editorAnalyticsBox.style.display = 'block';
          editorAnalyticsBox.innerHTML = `
            <div class="editor-analytics-drilldown">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-weight: 700; font-size: 13px; color: #f0abfc; text-transform: uppercase; letter-spacing: 0.05em;">
                  Live Article Engagement Drilldown
                </span>
                <span style="font-size: 12px; color: var(--admin-text-dim);">
                  Last Viewed: ${an.lastViewedAt ? this.formatRelativeTime(an.lastViewedAt) : 'Never'}
                </span>
              </div>
              <div class="editor-analytics-grid">
                <div class="editor-stat-box">
                  <span class="editor-stat-num">${(an.viewCount || 0).toLocaleString()}</span>
                  <span class="editor-stat-label">Total Views</span>
                </div>
                <div class="editor-stat-box">
                  <span class="editor-stat-num">${(an.uniqueViewCount || 0).toLocaleString()}</span>
                  <span class="editor-stat-label">Unique Visitors</span>
                </div>
                <div class="editor-stat-box">
                  <span class="editor-stat-num" style="color: #34d399;">${totalActions.toLocaleString()}</span>
                  <span class="editor-stat-label">Resource Opens</span>
                </div>
                <div class="editor-stat-box">
                  <span class="editor-stat-num" style="color: #fbbf24;">${conv}%</span>
                  <span class="editor-stat-label">Engagement Rate</span>
                </div>
              </div>
            </div>
          `;
        }
        return;
      }
    }

    // Default New State
    heading.textContent = 'Create New Intelligence Briefing';
    updateIdInput.value = '';
    updateTag.value = 'AI TOOL';
    updateDate.value = this.formatCurrentDate();
    updateTitle.value = '';
    updateExcerpt.value = '';
    updateAuthorName.value = settings.adminName || 'StayDriven Editorial';
    updateAuthorAvatar.value = settings.adminAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80';
    updateSlug.value = '';
    updateThumbnailUrl.value = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';
    this.updateThumbPreview(updateThumbnailUrl.value);

    if (articleSectionTitle) articleSectionTitle.value = '';
    if (articleSectionSubtitle) articleSectionSubtitle.value = '';
    if (articleBroaderContext) articleBroaderContext.value = '';
    if (primaryPdfLabel) primaryPdfLabel.value = '';
    if (primaryPdfUrl) primaryPdfUrl.value = '';
    this.updatePdfPreview('');

    if (editorAnalyticsBox) editorAnalyticsBox.style.display = 'none';

    this.addStoryBlock();
    this.handleContentTypeChange('article');
  }

  handleContentTypeChange(type) {
    const articleCard = document.getElementById('articleEditorSectionCard');
    const pdfCard = document.getElementById('pdfEditorSectionCard');

    if (type === 'article') {
      if (articleCard) articleCard.style.display = 'block';
      if (pdfCard) pdfCard.style.display = 'none';
    } else if (type === 'pdf') {
      if (articleCard) articleCard.style.display = 'none';
      if (pdfCard) pdfCard.style.display = 'block';
    } else if (type === 'both') {
      if (articleCard) articleCard.style.display = 'block';
      if (pdfCard) pdfCard.style.display = 'block';
    }
  }

  updateThumbPreview(url) {
    const img = document.getElementById('thumbImgPreview');
    const placeholder = document.getElementById('thumbPlaceholder');
    if (!img || !placeholder) return;

    if (url && url.trim().length > 0) {
      img.src = url;
      img.style.display = 'block';
      placeholder.style.display = 'none';
    } else {
      img.src = '';
      img.style.display = 'none';
      placeholder.style.display = 'flex';
    }
  }

  updatePdfPreview(url) {
    const frame = document.getElementById('pdfPreviewFrame');
    const placeholder = document.getElementById('pdfPreviewPlaceholder');
    if (!frame || !placeholder) return;

    if (url && url.trim().length > 0) {
      const embed = CMSStore.convertDriveUrlToEmbed(url);
      frame.src = embed;
      frame.style.display = 'block';
      placeholder.style.display = 'none';
    } else {
      frame.src = '';
      frame.style.display = 'none';
      placeholder.style.display = 'flex';
    }
  }

  addStoryBlock(storyData = null, num = null) {
    const container = document.getElementById('storiesListContainer');
    if (!container) return;

    const count = num || (container.querySelectorAll('.story-block-card').length + 1);

    const block = document.createElement('div');
    block.className = 'story-block-card';

    let p1Text = '';
    let p2Text = '';
    let extraText = '';
    let pullQuoteText = storyData?.pullQuote || '';

    if (storyData && Array.isArray(storyData.paragraphs)) {
      storyData.paragraphs.forEach(p => {
        if (typeof p === 'object' && p !== null) {
          if (p.label && p.label.toLowerCase().includes('changes')) p1Text = p.text || '';
          else if (p.label && p.label.toLowerCase().includes('matters')) p2Text = p.text || '';
          else if (!p1Text) p1Text = p.text || '';
          else if (!p2Text) p2Text = p.text || '';
        } else if (typeof p === 'string') {
          extraText += (extraText ? '\n\n' : '') + p;
        }
      });
    }

    block.innerHTML = `
      <div class="story-block-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="story-badge-num">Story ${count}</span>
        </div>
        <button type="button" class="table-action-btn remove-story-btn" title="Remove Story">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>

      <div class="form-group">
        <label class="form-label">Story Headline</label>
        <input type="text" class="form-input story-heading-input" placeholder="e.g. Sub-150ms speech-to-speech models deployed at edge" value="${this.escapeHtml(storyData?.heading || '')}">
      </div>

      <div class="form-group" style="border-left: 3px solid var(--brand-purple); padding-left: 12px; margin-top: 10px;">
        <label class="form-label">Paragraph 1 Callout: "What changes."</label>
        <input type="hidden" class="story-p1-label" value="What changes.">
        <textarea class="form-textarea story-p1-text" rows="2" placeholder="Explain the breakthrough or structural change...">${this.escapeHtml(p1Text)}</textarea>
      </div>

      <div class="form-group" style="border-left: 3px solid var(--brand-magenta); padding-left: 12px; margin-top: 10px;">
        <label class="form-label">Paragraph 2 Callout: "Why it matters."</label>
        <input type="hidden" class="story-p2-label" value="Why it matters.">
        <textarea class="form-textarea story-p2-text" rows="2" placeholder="Explain the strategic impact, cost savings, or operational velocity...">${this.escapeHtml(p2Text)}</textarea>
      </div>

      <div class="form-group" style="margin-top: 10px;">
        <label class="form-label">Optional Pull Quote</label>
        <input type="text" class="form-input story-pullquote-input" placeholder="“Key executive summary or insight quote...”" value="${this.escapeHtml(pullQuoteText)}">
      </div>

      <div class="form-group" style="margin-top: 10px;">
        <label class="form-label">Additional Analysis Paragraphs</label>
        <textarea class="form-textarea story-extra-text" rows="2" placeholder="Any extra paragraphs or nuance...">${this.escapeHtml(extraText)}</textarea>
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
      const pullQuote = b.querySelector('.story-pullquote-input')?.value;
      const extra = b.querySelector('.story-extra-text')?.value;

      const paragraphs = [];
      if (p1Label || p1Text) paragraphs.push({ label: p1Label || 'What changes.', text: p1Text || '' });
      if (p2Label || p2Text) paragraphs.push({ label: p2Label || 'Why it matters.', text: p2Text || '' });
      if (extra) paragraphs.push(extra);

      stories.push({
        number: idx + 1,
        heading,
        paragraphs,
        pullQuote: pullQuote || undefined
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
  // ARTICLE PREVIEW MODAL RENDERER (Fully Interactive)
  // =========================================================================
  openArticlePreviewModal() {
    const data = this.gatherFormData();
    const modal = document.getElementById('articlePreviewModal');
    const tagEl = document.getElementById('modalPreviewTag');
    const dateEl = document.getElementById('modalPreviewDate');
    const bodyEl = document.getElementById('modalArticleRenderBody');

    if (!modal || !bodyEl) return;

    const tagClass = (data.tag || 'AI TOOL').toLowerCase().replace(/\s+/g, '-');
    if (tagEl) {
      tagEl.className = `tag-badge ${tagClass}`;
      tagEl.textContent = data.tag || 'AI TOOL';
    }
    if (dateEl) {
      dateEl.textContent = data.date || this.formatCurrentDate();
    }

    // Build rich preview markup
    let storiesHtml = '';
    if (data.article && Array.isArray(data.article.stories) && data.article.stories.length > 0) {
      storiesHtml = data.article.stories.map(st => {
        let paragraphsHtml = '';
        if (Array.isArray(st.paragraphs)) {
          paragraphsHtml = st.paragraphs.map(p => {
            if (typeof p === 'object' && p !== null) {
              const isWhy = p.label && p.label.toLowerCase().includes('matters');
              return `
                <div class="preview-callout ${isWhy ? 'why-matters' : 'what-changes'}">
                  <strong>${this.escapeHtml(p.label)}</strong> ${this.escapeHtml(p.text)}
                </div>
              `;
            } else if (typeof p === 'string') {
              return `<p style="font-size: 14px; line-height: 1.6; color: var(--admin-text-muted);">${this.escapeHtml(p)}</p>`;
            }
            return '';
          }).join('');
        }

        const pullQuoteHtml = st.pullQuote ? `
          <div class="preview-pullquote">
            ${this.escapeHtml(st.pullQuote)}
          </div>
        ` : '';

        return `
          <div class="preview-story-card">
            <div class="preview-story-head-row">
              <span class="preview-story-badge">Story ${st.number || 1}</span>
              <h4 class="preview-story-heading">${this.escapeHtml(st.heading || '')}</h4>
            </div>
            ${paragraphsHtml}
            ${pullQuoteHtml}
          </div>
        `;
      }).join('');
    }

    const broaderHtml = data.article?.broaderContext ? `
      <div class="preview-broader-box">
        <strong style="color: #ffffff; display: block; margin-bottom: 6px;">Strategic Context & Outlook</strong>
        ${this.escapeHtml(data.article.broaderContext)}
      </div>
    ` : '';

    let pdfHtml = '';
    if (data.pdfs && data.pdfs.length > 0 && (data.contentType === 'pdf' || data.contentType === 'both')) {
      const pdf = data.pdfs[0];
      pdfHtml = `
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-weight: 700; font-size: 13px; color: #ffffff;">Attached PDF Deck: ${this.escapeHtml(pdf.label)}</span>
            <a href="${pdf.url}" target="_blank" class="btn-admin-secondary btn-sm">Open in Drive ↗</a>
          </div>
          <div class="preview-pdf-embed-box">
            <iframe src="${pdf.embedUrl}" allow="autoplay" loading="lazy"></iframe>
          </div>
        </div>
      `;
    }

    let resourcesHtml = '';
    if (data.resourceLinks && data.resourceLinks.length > 0) {
      resourcesHtml = `
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
          <strong style="font-size: 13px; color: var(--admin-text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Referenced Guides & Prompts</strong>
          ${data.resourceLinks.map(l => `
            <a href="${l.url}" target="_blank" class="preview-resource-row">
              <span>${this.escapeHtml(l.label)}</span>
              <span style="color: var(--brand-purple); font-size: 12px;">Open Link ↗</span>
            </a>
          `).join('')}
        </div>
      `;
    }

    bodyEl.innerHTML = `
      <div class="preview-article-header">
        <h2 class="preview-article-title">${this.escapeHtml(data.title || 'Untitled Dispatch')}</h2>
        <p class="preview-article-subtitle">${this.escapeHtml(data.excerpt || '')}</p>
        <div class="preview-author-pill">
          <img src="${data.authorAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'}" alt="" class="preview-author-avatar">
          <div>
            <div style="font-weight: 700; font-size: 13px; color: #ffffff;">${this.escapeHtml(data.authorName || 'StayDriven Editorial')}</div>
            <div style="font-size: 11px; color: var(--admin-text-dim);">Editorial Byline</div>
          </div>
        </div>
      </div>

      ${data.thumbnailUrl ? `
        <div class="preview-hero-img-wrap">
          <img src="${data.thumbnailUrl}" alt="">
        </div>
      ` : ''}

      ${data.contentType !== 'pdf' ? `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${storiesHtml}
          ${broaderHtml}
        </div>
      ` : ''}

      ${pdfHtml}
      ${resourcesHtml}

      <div style="padding: 16px; background: rgba(168, 85, 247, 0.08); border: 1px solid rgba(168, 85, 247, 0.25); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; margin-top: 10px;">
        <span style="font-size: 13px; font-weight: 600; color: #f0abfc;">StayDriven AI Research Network</span>
        <button type="button" class="btn-admin-primary btn-sm" style="border: none; color: #ffffff;">Explore Archive</button>
      </div>
    `;

    modal.classList.add('open');
  }

  closeArticlePreviewModal() {
    const modal = document.getElementById('articlePreviewModal');
    if (modal) modal.classList.remove('open');
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

  openDeleteModal(target) {
    // target can be a single string id, or an array of ids
    if (Array.isArray(target)) {
      this.itemToDeleteId = target;
      const titleEl = document.getElementById('deleteConfirmTitle');
      const textEl = document.getElementById('deleteConfirmText');
      if (titleEl) titleEl.textContent = 'Delete Multiple Updates?';
      if (textEl) textEl.textContent = `Are you sure you want to delete ${target.length} selected articles? This action cannot be undone and will immediately sync across all readers.`;
    } else {
      this.itemToDeleteId = target;
      const titleEl = document.getElementById('deleteConfirmTitle');
      const textEl = document.getElementById('deleteConfirmText');
      if (titleEl) titleEl.textContent = 'Delete Update?';
      if (textEl) textEl.textContent = 'Are you sure you want to permanently delete this update? This action cannot be undone.';
    }
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) modal.classList.add('open');
  }

  async executeDelete() {
    if (!this.itemToDeleteId) return;

    if (Array.isArray(this.itemToDeleteId)) {
      const ids = this.itemToDeleteId;
      await cmsStore.bulkDelete(ids);
      ids.forEach(id => this.selectedIds.delete(id));
      this.itemToDeleteId = null;
      document.getElementById('deleteConfirmModal')?.classList.remove('open');
      this.updateBulkBar();
      this.showToast(`${ids.length} updates permanently deleted from library`, 'info');
      this.refreshCurrentView();
    } else {
      const id = this.itemToDeleteId;
      await cmsStore.delete(id);
      this.selectedIds.delete(id);
      this.itemToDeleteId = null;
      document.getElementById('deleteConfirmModal')?.classList.remove('open');
      this.updateBulkBar();
      this.showToast('Update permanently deleted from library', 'info');
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

    // Analytics Metric Tabs
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
          this.analyticsSortAsc = false;
        }
        const summary = cmsStore.getAnalyticsSummary();
        if (summary) this.renderAnalyticsRankedTable(summary.postsRanked);
      });
    });

    // Analytics Reset Counters (0 live telemetry testing)
    const resetCountersBtn = document.getElementById('resetAnalyticsCountersBtn');
    if (resetCountersBtn) {
      resetCountersBtn.addEventListener('click', async () => {
        await cmsStore.clearAnalytics();
        this.renderAnalytics();
        this.showToast('All telemetry and analytics counters reset to 0', 'info');
      });
    }

    // Analytics Manual Refresh
    const refreshAnalyticsBtn = document.getElementById('refreshAnalyticsBtn');
    if (refreshAnalyticsBtn) {
      refreshAnalyticsBtn.addEventListener('click', async () => {
        await cmsStore.syncFromServer();
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

        let csv = 'Article Title,Category,Slug,Total Views,Unique Visitors,Resource Opens,Engagement Rate %,PDF Opens,Resource Link Clicks,Last Viewed\n';
        summary.postsRanked.forEach(p => {
          const totalRes = (p.pdfOpens || 0) + (p.resourceClicks || 0) + (p.whatsappClicks || 0);
          const conv = p.unique > 0 ? ((totalRes / p.unique) * 100).toFixed(1) : '0.0';
          csv += `"${p.title.replace(/"/g, '""')}","${p.tag}","${p.slug}",${p.views},${p.unique},${totalRes},${conv}%,${p.pdfOpens},${p.resourceClicks},"${p.lastViewedAt || 'N/A'}"\n`;
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

    // View Mode Toggle (Table / Grid)
    const viewModeTable = document.getElementById('viewModeTableBtn') || document.getElementById('viewModeTable');
    const viewModeGrid = document.getElementById('viewModeGridBtn') || document.getElementById('viewModeGrid');
    const tableCard = document.getElementById('allUpdatesTableCard');
    const gridCard = document.getElementById('allUpdatesGrid');

    if (viewModeTable && viewModeGrid) {
      viewModeTable.addEventListener('click', () => {
        viewModeTable.classList.add('active');
        viewModeGrid.classList.remove('active');
        this.currentViewMode = 'table';
        if (tableCard) tableCard.style.display = 'block';
        if (gridCard) gridCard.style.display = 'none';
      });

      viewModeGrid.addEventListener('click', () => {
        viewModeGrid.classList.add('active');
        viewModeTable.classList.remove('active');
        this.currentViewMode = 'grid';
        if (tableCard) tableCard.style.display = 'none';
        if (gridCard) gridCard.style.display = 'grid';
        this.renderAllUpdates();
      });
    }

    // Bulk Actions
    const bulkPublishBtn = document.getElementById('bulkPublishBtn');
    const bulkDraftBtn = document.getElementById('bulkDraftBtn');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');

    if (bulkPublishBtn) {
      bulkPublishBtn.addEventListener('click', async () => {
        await cmsStore.bulkUpdateStatus(Array.from(this.selectedIds), 'published');
        this.selectedIds.clear();
        this.updateBulkBar();
        this.showToast('Selected items published to library', 'success');
        this.refreshCurrentView();
      });
    }

    if (bulkDraftBtn) {
      bulkDraftBtn.addEventListener('click', async () => {
        await cmsStore.bulkUpdateStatus(Array.from(this.selectedIds), 'draft');
        this.selectedIds.clear();
        this.updateBulkBar();
        this.showToast('Selected items converted to draft', 'info');
        this.refreshCurrentView();
      });
    }

    if (bulkDeleteBtn) {
      bulkDeleteBtn.addEventListener('click', () => {
        if (this.selectedIds.size > 0) {
          this.openDeleteModal(Array.from(this.selectedIds));
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
      updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = this.gatherFormData();
        await cmsStore.save(data);
        this.showToast('Update published to public archive successfully!', 'success');
        window.location.hash = '#updates';
      });
    }

    // Save Draft Button
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    if (saveDraftBtn) {
      saveDraftBtn.addEventListener('click', async () => {
        const data = this.gatherFormData();
        data.status = 'draft';
        await cmsStore.save(data);
        this.showToast('Draft saved successfully', 'info');
        window.location.hash = '#updates';
      });
    }

    // Preview Layout Button (FIX FOR PREVIEW ISSUE)
    const previewBtn = document.getElementById('previewArticleModalBtn');
    if (previewBtn) {
      previewBtn.addEventListener('click', () => {
        this.openArticlePreviewModal();
      });
    }

    const closePreviewBtn = document.getElementById('closePreviewModalBtn');
    if (closePreviewBtn) {
      closePreviewBtn.addEventListener('click', () => {
        this.closeArticlePreviewModal();
      });
    }

    // Backdrop click on preview modal
    const previewModal = document.getElementById('articlePreviewModal');
    if (previewModal) {
      previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
          this.closeArticlePreviewModal();
        }
      });
    }

    // Escape key closes modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeArticlePreviewModal();
        const delModal = document.getElementById('deleteConfirmModal');
        if (delModal) delModal.classList.remove('open');
      }
    });

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
      profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newSettings = {
          ...cmsStore.getSettings(),
          adminName: document.getElementById('settingsAdminName').value.trim(),
          adminRole: document.getElementById('settingsAdminRole').value.trim(),
          adminAvatar: document.getElementById('settingsAdminAvatar').value.trim(),
          aboutStayingAheadText: document.getElementById('settingsAboutText')?.value.trim() || ''
        };
        await cmsStore.saveSettings(newSettings);
        this.updateProfileUI();
        this.showToast('Profile & Settings updated successfully', 'success');
      });
    }

    // Change Password Form
    const passwordForm = document.getElementById('adminPasswordForm');
    if (passwordForm) {
      passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('currentPasswordInput').value;
        const newPassword = document.getElementById('newPasswordInput').value;
        const token = cmsStore.getToken();

        if (!token) {
          this.showToast('Session expired. Please log in again.', 'error');
          window.location.hash = '#login';
          return;
        }

        try {
          const res = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
          });

          const data = await res.json();
          if (res.ok && data.success) {
            this.showToast('Password updated successfully!', 'success');
            passwordForm.reset();
          } else {
            this.showToast(data.error || 'Failed to update password.', 'error');
          }
        } catch (err) {
          this.showToast('Failed to update password.', 'error');
        }
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
      resetDefaultsBtn.addEventListener('click', async () => {
        if (confirm('Reset all CMS content to initial sample dataset? Your custom edits will be replaced.')) {
          await cmsStore.resetToDefaults();
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

    // Login Form Submit
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const res = await cmsStore.login(email, password);
        if (res.success) {
          this.showToast(`Welcome back, ${res.user.name}!`, 'success');
          this.updateProfileUI();
          window.location.hash = '#dashboard';
        } else {
          this.showToast(res.error, 'error');
        }
      });
    }

    // Profile Pill & Dropdown (Crucial for mobile and desktop quick actions)
    const profilePillBtn = document.getElementById('profilePillBtn');
    const profileDropdownMenu = document.getElementById('profileDropdownMenu');
    const dropdownLogoutBtn = document.getElementById('dropdownLogoutBtn');
    const dropdownSettingsBtn = document.getElementById('dropdownSettingsBtn');

    if (profilePillBtn && profileDropdownMenu) {
      profilePillBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = profileDropdownMenu.style.display === 'block';
        profileDropdownMenu.style.display = isOpen ? 'none' : 'block';
        profilePillBtn.setAttribute('aria-expanded', !isOpen);
      });

      document.addEventListener('click', (e) => {
        if (!profilePillBtn.contains(e.target) && !profileDropdownMenu.contains(e.target)) {
          profileDropdownMenu.style.display = 'none';
          profilePillBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    if (dropdownSettingsBtn) {
      dropdownSettingsBtn.addEventListener('click', () => {
        if (profileDropdownMenu) profileDropdownMenu.style.display = 'none';
        window.location.hash = '#settings';
      });
    }

    if (dropdownLogoutBtn) {
      dropdownLogoutBtn.addEventListener('click', () => {
        if (profileDropdownMenu) profileDropdownMenu.style.display = 'none';
        cmsStore.logout();
        this.showToast('Signed out successfully', 'success');
        window.location.hash = '#login';
      });
    }

    // Logout Button (Sidebar)
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
