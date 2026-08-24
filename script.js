// StayDriven Public Site JavaScript & Silent Analytics Engine
import { cmsStore, CMSStore } from './cms-store.js';

const grid = document.querySelector("[data-card-grid]");
const searchInput = document.querySelector("[data-search]");
const filterButtons = document.querySelectorAll("[data-filter]");
const emptyState = document.querySelector("[data-empty-state]");
const publicModal = document.getElementById("publicArticleModal");

let activeFilter = "ALL";
let currentOpenArticleId = null;
let lastViewedTrackedArticleId = null;

// =========================================================================
// 0. SILENT ANONYMOUS ANALYTICS TRACKER (Invisible & Resilient)
// =========================================================================
const Tracker = {
  getVisitorId() {
    try {
      let vid = localStorage.getItem('sd_visitor_id');
      if (!vid) {
        vid = 'v_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
        localStorage.setItem('sd_visitor_id', vid);
      }
      return vid;
    } catch (e) {
      return 'v_anonymous_' + Math.random().toString(36).substring(2, 8);
    }
  },

  getViewedArticles() {
    try {
      return JSON.parse(localStorage.getItem('sd_viewed_articles') || '[]');
    } catch (e) {
      return [];
    }
  },

  markArticleViewed(articleId) {
    try {
      const viewed = this.getViewedArticles();
      if (!viewed.includes(articleId)) {
        viewed.push(articleId);
        localStorage.setItem('sd_viewed_articles', JSON.stringify(viewed));
        return true; // Is unique view
      }
      return false; // Repeat view
    } catch (e) {
      return false;
    }
  },

  trackEvent(eventType, payload = {}) {
    try {
      const eventData = {
        type: eventType,
        visitorId: this.getVisitorId(),
        referrer: document.referrer || 'direct',
        timestamp: new Date().toISOString(),
        ...payload
      };

      // 1. Update client-side store immediately
      if (window.cmsStore && typeof window.cmsStore.trackEvent === 'function') {
        window.cmsStore.trackEvent(eventData);
      }

      // 2. Silent background ping to API endpoint
      if (typeof fetch === 'function') {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
          keepalive: true
        }).catch(() => {});
      }
    } catch (err) {
      // Fail silently without blocking UI
    }
  },

  trackArticleView(articleId, slug) {
    if (!articleId) return;
    const isUnique = this.markArticleViewed(articleId);
    this.trackEvent('article_view', { articleId, slug, isUnique });
  },

  trackPdfInteraction(articleId, pdfLabel, action = 'open_drive_click') {
    this.trackEvent('pdf_interaction', {
      articleId: articleId || currentOpenArticleId || null,
      pdfLabel: pdfLabel || 'PDF Document',
      action
    });
  },

  trackResourceClick(articleId, linkLabel, url) {
    this.trackEvent('resource_click', {
      articleId: articleId || currentOpenArticleId || null,
      linkLabel: linkLabel || url || 'Resource Link',
      url
    });
  }
};

window.Tracker = Tracker;

// =========================================================================
// 1. CARD GRID RENDERING (Real Photography & High-Hierarchy Cards)
// =========================================================================
function renderCards() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const dispatches = cmsStore.getPublished();

  const visibleCards = dispatches.filter((dispatch) => {
    const matchesFilter = activeFilter === "ALL" || dispatch.tag === activeFilter;
    const matchesSearch = !query || 
      dispatch.title.toLowerCase().includes(query) ||
      (dispatch.tag && dispatch.tag.toLowerCase().includes(query)) ||
      (dispatch.excerpt && dispatch.excerpt.toLowerCase().includes(query)) ||
      (dispatch.article && dispatch.article.sectionTitle && dispatch.article.sectionTitle.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  if (!grid) return;

  grid.innerHTML = visibleCards
    .map(
      (dispatch) => {
        const thumbUrl = dispatch.thumbnailUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80';
        const authorName = dispatch.authorName || 'StayDriven Editorial';
        const authorAvatar = dispatch.authorAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80';
        const excerpt = dispatch.excerpt || (dispatch.article && dispatch.article.sectionSubtitle) || 'In-depth analysis, key architectural updates, and tactical breakthroughs from the StayDriven community.';
        const hasPdf = dispatch.contentType === 'pdf' || dispatch.contentType === 'both' || (dispatch.pdfs && dispatch.pdfs.length > 0);

        return `
          <article class="dispatch-card" tabindex="0" role="button" aria-label="${escapeHtml(dispatch.title)}" data-id="${dispatch.id}">
            <div class="dispatch-card-img-wrap">
              <img src="${escapeHtml(thumbUrl)}" alt="${escapeHtml(dispatch.title)}" class="dispatch-card-img" loading="lazy">
              <div class="dispatch-card-badges">
                <span class="dispatch-tag">${escapeHtml(dispatch.tag)}</span>
                ${hasPdf ? `<span class="dispatch-pdf-badge">PDF DECK</span>` : ''}
              </div>
            </div>
            
            <div class="dispatch-card-body">
              <div class="dispatch-card-meta">
                <h3 class="dispatch-title">${escapeHtml(dispatch.title)}</h3>
                <p class="dispatch-excerpt">${escapeHtml(excerpt)}</p>
              </div>

              <div class="dispatch-card-footer">
                <div class="dispatch-author-row">
                  <img src="${escapeHtml(authorAvatar)}" alt="${escapeHtml(authorName)}" class="dispatch-author-avatar" loading="lazy">
                  <span class="dispatch-author-name">${escapeHtml(authorName)}</span>
                </div>
                <span class="dispatch-date">${escapeHtml(dispatch.date)}</span>
              </div>
            </div>
          </article>
        `;
      }
    )
    .join("");

  if (emptyState) {
    emptyState.hidden = visibleCards.length > 0;
  }

  // Bind click handlers to cards
  grid.querySelectorAll(".dispatch-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      openPublicArticle(id, true);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPublicArticle(card.dataset.id, true);
      }
    });
  });
}

// =========================================================================
// 2. EDITORIAL ARTICLE DETAIL READER (Two-Column Layout + Sticky Sidebar)
// =========================================================================
function openPublicArticle(id, updateHash = false) {
  const item = cmsStore.getById(id);
  if (!item || !publicModal) return;

  currentOpenArticleId = id;
  if (updateHash) {
    window.location.hash = `article?id=${id}`;
  }

  // Fire Silent Analytics View Event (guarded against duplicate on same item)
  if (lastViewedTrackedArticleId !== id) {
    lastViewedTrackedArticleId = id;
    Tracker.trackArticleView(item.id, item.slug);
  }

  const settings = cmsStore.getSettings() || {};
  const authorName = item.authorName || 'StayDriven Editorial';
  const authorAvatar = item.authorAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80';
  const thumbUrl = item.thumbnailUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';
  const aboutText = settings.aboutStayingAheadText || 'StayDriven is an AI intelligence community and weekly briefing platform for builders, founders, and engineers.';
  const shareUrl = window.location.origin + window.location.pathname + `#article?id=${item.id}`;

  // Estimate read time
  let totalWordCount = (item.title + ' ' + (item.excerpt || '')).split(/\s+/).length;
  if (item.article && item.article.stories) {
    item.article.stories.forEach(s => {
      totalWordCount += (s.heading || '').split(/\s+/).length;
      (s.paragraphs || []).forEach(p => {
        if (typeof p === 'object' && p !== null) totalWordCount += (p.label + ' ' + p.text).split(/\s+/).length;
        else if (typeof p === 'string') totalWordCount += p.split(/\s+/).length;
      });
    });
  }
  const readMinutes = Math.max(2, Math.ceil(totalWordCount / 180));

  // Build Story Sections & Extract H2 Table of Contents Data
  const tocItems = [];
  let storiesHtml = "";

  if (item.article && item.article.stories && item.article.stories.length > 0) {
    storiesHtml = item.article.stories.map((story, idx) => {
      const sectionId = `story-section-${idx + 1}`;
      tocItems.push({
        id: sectionId,
        title: story.heading || `Story #${story.number || idx + 1}`,
        number: story.number || idx + 1
      });

      return `
        <section class="editorial-story-section" id="${sectionId}">
          <h2 class="editorial-h2">
            <span class="story-badge-num">${story.number || idx + 1}</span>
            <span>${escapeHtml(story.heading)}</span>
          </h2>
          <div class="editorial-prose">
            ${(story.paragraphs || []).map(p => {
              if (typeof p === 'object' && p !== null) {
                return `
                  <div class="editorial-callout-card">
                    <span class="callout-pill-label">${escapeHtml(p.label)}</span>
                    <p class="callout-text">${escapeHtml(p.text)}</p>
                  </div>
                `;
              }
              return `<p style="margin-bottom: 16px;">${escapeHtml(p)}</p>`;
            }).join('')}
          </div>
        </section>
      `;
    }).join('');
  } else if (item.excerpt) {
    storiesHtml = `
      <div class="editorial-prose">
        <p class="editorial-lead-para">${escapeHtml(item.excerpt)}</p>
      </div>
    `;
  }

  // Pull Quote Component
  let pullQuoteHtml = "";
  if (item.article && item.article.stories && item.article.stories[0]) {
    const firstStory = item.article.stories[0];
    pullQuoteHtml = `
      <blockquote class="editorial-pull-quote">
        "${escapeHtml(firstStory.heading)}"
        <cite>— Key Takeaway · StayDriven Intelligence</cite>
      </blockquote>
    `;
  }

  // PDF Viewer
  const embedUrl = (item.pdfs && item.pdfs.length > 0) ? CMSStore.convertDriveUrlToEmbed(item.pdfs[0].driveUrl) : null;
  let pdfHtml = "";
  if (embedUrl) {
    const pdfLabel = item.pdfs[0].label || 'PDF Slide Deck';
    pdfHtml = `
      <div class="editorial-pdf-section" id="attached-pdf-section">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <h3 style="font-family: 'Plus Jakarta Sans', Inter, sans-serif; font-size: 18px; font-weight: 800; color: #fff; margin: 0;">
            ${escapeHtml(pdfLabel)}
          </h3>
          <a href="${item.pdfs[0].driveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline track-pdf-btn" data-pdf-label="${escapeHtml(pdfLabel)}" style="font-size: 12px; min-height: 36px; padding: 0 14px;">
            Open in Google Drive ↗
          </a>
        </div>
        <div class="pdf-embed-wrapper">
          <iframe src="${embedUrl}" style="width: 100%; height: 100%; border: none;" title="${escapeHtml(pdfLabel)}" allow="autoplay"></iframe>
        </div>
      </div>
    `;
  }

  // Resource Links Box
  let resourcesHtml = "";
  if (item.resourceLinks && item.resourceLinks.length > 0) {
    resourcesHtml = `
      <div class="editorial-resources-section">
        <h4 style="font-family: 'Plus Jakarta Sans', Inter, sans-serif; font-size: 12px; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.08em; margin: 0;">
          Helpful Resources & Documentation
        </h4>
        <ul class="resources-list">
          ${item.resourceLinks.map(l => `
            <li>
              <a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer" class="resource-item-link track-resource-btn" data-resource-label="${escapeHtml(l.label || l.url)}">
                <span>${escapeHtml(l.label || l.url)}</span>
                <span style="font-size: 16px; color: var(--pink);">↗</span>
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  // Broader Context Banner
  let contextHtml = "";
  if (item.article && item.article.broaderContext) {
    contextHtml = `
      <div class="editorial-context-box">
        <div class="context-box-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Broader Context & Strategic Impact
        </div>
        <p style="font-size: 15px; line-height: 1.65; color: #e5e7eb; margin: 0;">${escapeHtml(item.article.broaderContext)}</p>
      </div>
    `;
  }

  // 3 Compact Updates for Sidebar
  const allPublished = cmsStore.getPublished();
  const otherUpdates = allPublished.filter(u => u.id !== item.id).slice(0, 3);
  const compactUpdatesHtml = otherUpdates.map(u => `
    <div class="compact-update-item" data-open-id="${u.id}">
      <div class="compact-update-meta">
        <span class="compact-update-tag">${escapeHtml(u.tag)}</span>
        <span class="compact-update-date">${escapeHtml(u.date)}</span>
      </div>
      <p class="compact-update-title">${escapeHtml(u.title)}</p>
    </div>
  `).join('');

  // 3 Related Updates for Bottom Grid
  const relatedCardsHtml = otherUpdates.map(u => {
    const uThumb = u.thumbnailUrl || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80';
    return `
      <article class="dispatch-card" data-open-id="${u.id}" style="min-height: auto;">
        <div class="dispatch-card-img-wrap" style="aspect-ratio: 16/10;">
          <img src="${escapeHtml(uThumb)}" alt="${escapeHtml(u.title)}" class="dispatch-card-img" loading="lazy">
          <div class="dispatch-card-badges">
            <span class="dispatch-tag">${escapeHtml(u.tag)}</span>
          </div>
        </div>
        <div class="dispatch-card-body" style="padding: 16px;">
          <h4 class="dispatch-title" style="font-size: 15px;">${escapeHtml(u.title)}</h4>
          <span class="dispatch-date" style="margin-top: 8px;">${escapeHtml(u.date)}</span>
        </div>
      </article>
    `;
  }).join('');

  // Populate Modal Dialog
  publicModal.innerHTML = `
    <div class="public-modal-dialog">
      <!-- Sticky Modal Topbar -->
      <div class="public-modal-topbar">
        <button type="button" class="public-modal-back-btn" id="modalBackToArchiveBtn">
          ← Back to Archive
        </button>
        <button type="button" class="public-modal-close" id="modalCloseActionBtn" aria-label="Close article">✕</button>
      </div>

      <div class="editorial-container">
        <!-- Main Two-Column Layout Grid -->
        <div class="editorial-layout-grid">
          
          <!-- LEFT COLUMN: ARTICLE CONTENT (~65%) -->
          <article class="editorial-main-col">
            <div class="article-header-meta">
              <span class="dispatch-tag">${escapeHtml(item.tag)}</span>
              <span class="article-read-time">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${readMinutes} min read
              </span>
            </div>

            <h1 class="editorial-h1">${escapeHtml(item.title)}</h1>

            ${item.article && item.article.sectionSubtitle ? `
              <p class="editorial-subtitle">${escapeHtml(item.article.sectionSubtitle)}</p>
            ` : ''}

            <!-- Author Byline Bar -->
            <div class="editorial-byline">
              <div class="byline-author-group">
                <img src="${escapeHtml(authorAvatar)}" alt="${escapeHtml(authorName)}" class="byline-avatar">
                <div class="byline-info">
                  <span class="byline-name">By ${escapeHtml(authorName)}</span>
                  <span class="byline-meta">${escapeHtml(item.date)} · StayDriven Intelligence</span>
                </div>
              </div>

              <div class="byline-share-btns">
                <button type="button" class="share-btn-pill copy-article-link-btn" title="Copy article link">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Copy Article Link
                </button>
              </div>
            </div>

            <!-- Featured Photography Hero -->
            <div class="editorial-featured-img-wrap">
              <img src="${escapeHtml(thumbUrl)}" alt="${escapeHtml(item.title)}" class="editorial-featured-img">
            </div>

            <!-- Lead Paragraph -->
            ${item.excerpt ? `
              <p class="editorial-lead-para">${escapeHtml(item.excerpt)}</p>
            ` : ''}

            <!-- Story Sections -->
            ${storiesHtml}

            <!-- Pull Quote -->
            ${pullQuoteHtml}

            <!-- Broader Context -->
            ${contextHtml}

            <!-- PDF Viewer -->
            ${pdfHtml}

            <!-- Helpful Resources -->
            ${resourcesHtml}

            <!-- Bottom Share Bar -->
            <div class="editorial-share-bar">
              <div>
                <strong style="display: block; font-size: 14px; color: #fff; margin-bottom: 2px;">Enjoyed this brief?</strong>
                <span style="font-size: 12.5px; color: #9ca3af;">Share it with fellow builders, founders, and AI engineers.</span>
              </div>
              <div class="byline-share-btns">
                <button type="button" class="share-btn-pill copy-article-link-btn">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Copy Article Link
                </button>
              </div>
            </div>
          </article>

          <!-- RIGHT COLUMN: STICKY SIDEBAR (~35%) -->
          <aside class="editorial-sidebar-col">
            
            <!-- Widget 1: Table of Contents -->
            ${tocItems.length > 0 ? `
              <div class="sidebar-widget-card" id="articleTocWidget">
                <h3 class="sidebar-widget-title">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  Table of Contents
                </h3>
                <nav aria-label="Table of contents">
                  <ul class="toc-nav-list">
                    ${tocItems.map((toc, i) => `
                      <li>
                        <a href="#${toc.id}" class="toc-nav-link ${i === 0 ? 'active' : ''}" data-target-id="${toc.id}">
                          <span>${toc.number}. ${escapeHtml(toc.title)}</span>
                          <span class="toc-chevron">›</span>
                        </a>
                      </li>
                    `).join('')}
                    ${embedUrl ? `
                      <li>
                        <a href="#attached-pdf-section" class="toc-nav-link" data-target-id="attached-pdf-section">
                          <span>📄 PDF Slide Deck</span>
                          <span class="toc-chevron">›</span>
                        </a>
                      </li>
                    ` : ''}
                  </ul>
                </nav>
              </div>
            ` : ''}

            <!-- Widget 2: About StayDriven -->
            <div class="sidebar-widget-card">
              <h3 class="sidebar-widget-title">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                About StayDriven
              </h3>
              <div class="sidebar-about-text" style="display: flex; flex-direction: column; gap: 8px;">
                ${aboutText.split('\n\n').map(para => `<p style="margin: 0;">${escapeHtml(para)}</p>`).join('')}
              </div>
            </div>

            <!-- Widget 3: More Updates -->
            ${otherUpdates.length > 0 ? `
              <div class="sidebar-widget-card">
                <h3 class="sidebar-widget-title">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  More Updates
                </h3>
                <div class="compact-updates-list">
                  ${compactUpdatesHtml}
                </div>
              </div>
            ` : ''}

          </aside>
        </div>

        <!-- Bottom Related Archive Section -->
        ${otherUpdates.length > 0 ? `
          <div class="editorial-bottom-related">
            <h3 class="bottom-related-heading">More from the Archive</h3>
            <div class="card-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
              ${relatedCardsHtml}
            </div>
          </div>
        ` : ''}

      </div>
    </div>
  `;

  publicModal.style.display = "flex";
  document.body.style.overflow = "hidden";
  publicModal.scrollTop = 0;

  // Bind Close and Back buttons
  const backBtn = document.getElementById("modalBackToArchiveBtn");
  const closeBtn = document.getElementById("modalCloseActionBtn");
  if (backBtn) backBtn.addEventListener("click", closePublicArticleModal);
  if (closeBtn) closeBtn.addEventListener("click", closePublicArticleModal);

  // Bind Copy Link Buttons
  publicModal.querySelectorAll(".copy-article-link-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast("Article link copied to clipboard!");
      }).catch(() => {
        showToast("Link copied: " + shareUrl);
      });
    });
  });

  // Bind PDF open tracking
  publicModal.querySelectorAll(".track-pdf-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      Tracker.trackPdfInteraction(item.id, btn.dataset.pdfLabel, 'open_drive_click');
    });
  });

  // Bind Resource link click tracking
  publicModal.querySelectorAll(".track-resource-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      Tracker.trackResourceClick(item.id, btn.dataset.resourceLabel, btn.getAttribute('href'));
    });
  });

  // Bind WhatsApp links inside modal
  wireWhatsAppLinks();

  // Bind Compact / Related update cards inside reader
  publicModal.querySelectorAll("[data-open-id]").forEach(card => {
    card.addEventListener("click", () => {
      const newId = card.dataset.openId;
      openPublicArticle(newId, true);
    });
  });

  // Setup Smooth TOC Clicking and Scrollspy
  setupTocInteractivity();
}

function setupTocInteractivity() {
  const tocLinks = publicModal.querySelectorAll(".toc-nav-link");
  if (!tocLinks.length) return;

  tocLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.dataset.targetId;
      const targetEl = publicModal.querySelector(`#${targetId}`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        tocLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  const sections = Array.from(tocLinks).map(link => {
    const targetId = link.dataset.targetId;
    return {
      link,
      element: publicModal.querySelector(`#${targetId}`)
    };
  }).filter(item => item.element !== null);

  const handleModalScroll = () => {
    const scrollPos = publicModal.scrollTop + 160;
    let activeSection = sections[0];

    for (let i = 0; i < sections.length; i++) {
      const top = sections[i].element.offsetTop;
      if (scrollPos >= top) {
        activeSection = sections[i];
      }
    }

    if (activeSection) {
      tocLinks.forEach(l => l.classList.remove('active'));
      activeSection.link.classList.add('active');
    }
  };

  publicModal.removeEventListener("scroll", publicModal._scrollHandler);
  publicModal._scrollHandler = handleModalScroll;
  publicModal.addEventListener("scroll", handleModalScroll);
}

function closePublicArticleModal() {
  if (!publicModal) return;
  publicModal.style.display = "none";
  document.body.style.overflow = "";
  currentOpenArticleId = null;
  lastViewedTrackedArticleId = null;
  
  if (window.location.hash.startsWith('#article')) {
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }
}

// Global Toast Notice
function showToast(message) {
  const existing = document.querySelector(".toast-notice");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast-notice";
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#f0abfc" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
    <span>${escapeHtml(message)}</span>
  `;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// =========================================================================
// 3. ROUTE & HASH LISTENER (Direct Article Deep-Linking)
// =========================================================================
function handleHashRoute() {
  const hash = window.location.hash.replace('#', '');
  if (hash.startsWith('article')) {
    const params = new URLSearchParams(hash.split('?')[1] || '');
    const id = params.get('id');
    const slug = params.get('slug');

    if (id) {
      openPublicArticle(id, false);
    } else if (slug) {
      const all = cmsStore.getAll();
      const match = all.find(u => u.slug === slug);
      if (match) openPublicArticle(match.id, false);
    }
  } else if (currentOpenArticleId && !hash.startsWith('article')) {
    closePublicArticleModal();
  }
}

window.addEventListener("hashchange", handleHashRoute);
window.addEventListener("popstate", handleHashRoute);

// Close modal on click outside
if (publicModal) {
  publicModal.addEventListener("click", (e) => {
    if (e.target === publicModal) {
      closePublicArticleModal();
    }
  });
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && publicModal && publicModal.style.display === "flex") {
    closePublicArticleModal();
  }
});

// Category Filter Buttons
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderCards();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", renderCards);
}

// Listen for CMS updates in another tab or admin panel
window.addEventListener('staydriven_cms_change', () => {
  renderCards();
  if (currentOpenArticleId) {
    openPublicArticle(currentOpenArticleId, false);
  }
});

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Initial render & immediate server sync
renderCards();
handleHashRoute();

// Ensure fresh data is fetched from the server immediately upon initial launch
if (cmsStore && typeof cmsStore.syncFromServer === 'function') {
  cmsStore.syncFromServer().then(() => {
    renderCards();
    handleHashRoute();
  }).catch(() => {});
}

// =========================================================================
// 4. SECRET ADMIN PORTAL ACCESS
// =========================================================================
function setupSecretAdminAccess() {
  // Method 1: Keyboard shortcut Ctrl + Shift + A (or Cmd + Shift + A)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'D' || e.key === 'd')) {
      e.preventDefault();
      window.location.href = '/admin.html';
    }
  });

  // Method 2: Secret triple-click on bottom copyright text or brand logo
  let clickCount = 0;
  let clickTimer = null;
  const triggerSecretNavigation = () => {
    clickCount++;
    clearTimeout(clickTimer);
    if (clickCount >= 3) {
      clickCount = 0;
      window.location.href = '/admin.html';
    } else {
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 700);
    }
  };

  const copyrightEl = document.querySelector('.footer-bottom-copyright');
  if (copyrightEl) {
    copyrightEl.style.cursor = 'default';
    copyrightEl.addEventListener('click', triggerSecretNavigation);
  }

  const brandImg = document.querySelector('.brand-logo-img');
  if (brandImg) {
    brandImg.addEventListener('click', (e) => {
      if (e.altKey) {
        e.preventDefault();
        window.location.href = '/admin.html';
      }
    });
  }

  // Method 3: Secret keyword sequence 'admin' typed on keyboard
  let keySequence = '';
  window.addEventListener('keydown', (e) => {
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (activeTag === 'input' || activeTag === 'textarea') return;

    if (e.key && e.key.length === 1) {
      keySequence += e.key.toLowerCase();
      if (keySequence.length > 8) {
        keySequence = keySequence.slice(-8);
      }
      if (keySequence.endsWith('admin') || keySequence.endsWith('sdcms')) {
        keySequence = '';
        window.location.href = '/admin.html';
      }
    }
  });
}

setupSecretAdminAccess();
