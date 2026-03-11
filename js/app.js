/**
 * BenefitBridge - Main Application Logic (app.js)
 * Handles: Navigation, scroll animations, language toggle, shared utilities
 */

'use strict';

// ─── Global State ─────────────────────────────────────────────────────────────
const BB = {
  language: localStorage.getItem('bb_language') || 'en',
  recentSearches: JSON.parse(localStorage.getItem('bb_recent_searches') || '[]'),
};

// ─── DOM Ready ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initLanguageToggle();
  initCounterAnimations();
  setActiveNavLink();
});

// ─── Navbar ────────────────────────────────────────────────────────────────────
function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on nav link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('/').pop();
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ─── Scroll Animations ─────────────────────────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ─── Counter Animations ────────────────────────────────────────────────────────
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('en-IN');
  }, 16);
}

// ─── Language Toggle ───────────────────────────────────────────────────────────
function initLanguageToggle() {
  const langBtns = document.querySelectorAll('.lang-btn');
  if (!langBtns.length) return;

  langBtns.forEach(btn => {
    if (btn.dataset.lang === BB.language) btn.classList.add('active');

    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      BB.language = lang;
      localStorage.setItem('bb_language', lang);

      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Notify other components
      document.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
      showToast(lang === 'hi' ? 'हिंदी में स्विच किया गया' : 'Switched to English', 'success');
    });
  });
}

// ─── Toast Notifications ────────────────────────────────────────────────────────
function showToast(message, type = 'default', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ─── Load Schemes JSON ─────────────────────────────────────────────────────────
async function loadSchemes() {
  // Determine path based on current page location
  const isSubPage = window.location.pathname.includes('/pages/');
  const basePath = isSubPage ? '../data/schemes.json' : 'data/schemes.json';

  try {
    const response = await fetch(basePath);
    if (!response.ok) throw new Error('Failed to load schemes');
    return await response.json();
  } catch (err) {
    console.warn('Could not load schemes.json:', err);
    return [];
  }
}

// ─── Category Icon Mapping ─────────────────────────────────────────────────────
const CATEGORY_ICONS = {
  'Agriculture': '🌾',
  'Health': '🏥',
  'Housing': '🏠',
  'Employment': '💼',
  'Education': '📚',
  'Women & Child': '👩‍👧',
  'Senior Citizens': '👴',
  'SC/ST/OBC': '🤝',
};

const CATEGORY_CSS = {
  'Agriculture': 'agriculture',
  'Health': 'health',
  'Housing': 'housing',
  'Employment': 'employment',
  'Education': 'education',
  'Women & Child': 'women',
  'Senior Citizens': 'senior',
  'SC/ST/OBC': 'scst',
};

function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || '📋';
}

function getCategoryCss(category) {
  return CATEGORY_CSS[category] || 'employment';
}

// ─── Scheme Card Builder ────────────────────────────────────────────────────────
function buildSchemeCard(scheme) {
  const icon = getCategoryIcon(scheme.category);
  const css = getCategoryCss(scheme.category);

  return `
    <div class="card scheme-card" data-id="${scheme.id}" role="button" tabindex="0"
         aria-label="View details for ${scheme.name}">
      <div class="scheme-card-header">
        <div class="scheme-icon ${css}">${icon}</div>
        <div>
          <div class="scheme-name">${scheme.name}</div>
          <div class="scheme-hindi">${scheme.hindiName || ''}</div>
          <div class="scheme-ministry">📌 ${scheme.ministry}</div>
        </div>
      </div>
      <div class="scheme-body">
        <div class="scheme-description">${scheme.description}</div>
        <div class="scheme-benefit">💰 ${scheme.benefitAmount}</div>
        <div class="scheme-tags">
          <span class="badge badge-${css}">${scheme.category}</span>
          ${(scheme.tags || []).slice(0, 2).map(t => `<span class="scheme-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="scheme-card-footer">
        <span class="badge badge-secondary">✓ Active</span>
        <button class="btn btn-sm btn-primary view-details-btn" data-id="${scheme.id}">
          View Details →
        </button>
      </div>
    </div>
  `;
}

// ─── Scheme Detail Modal ────────────────────────────────────────────────────────
function buildSchemeModal(scheme) {
  const icon = getCategoryIcon(scheme.category);
  const docsHtml = (scheme.documents || []).map(d => `<li>${d}</li>`).join('');
  const stepsHtml = (scheme.applicationProcess || []).map(s => `<li>${s}</li>`).join('');

  return `
    <div class="modal-overlay" id="schemeModal" role="dialog" aria-modal="true">
      <div class="modal">
        <div class="modal-header">
          <div>
            <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.4rem;">
              <span style="font-size:1.75rem">${icon}</span>
              <div>
                <h3 style="margin:0">${scheme.name}</h3>
                <div style="font-size:0.85rem;color:var(--text-muted)">${scheme.hindiName || ''}</div>
              </div>
            </div>
            <span class="badge badge-${getCategoryCss(scheme.category)}">${scheme.category}</span>
            &nbsp;<span class="badge badge-secondary">Active</span>
          </div>
          <button class="modal-close" id="closeModal" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <h4>About the Scheme</h4>
            <p style="color:var(--text-muted);font-size:0.92rem">${scheme.description}</p>
          </div>
          <div class="info-grid" style="margin-bottom:1.5rem">
            <div class="info-item">
              <div class="label">Ministry</div>
              <div class="value">${scheme.ministry}</div>
            </div>
            <div class="info-item">
              <div class="label">Benefit Amount</div>
              <div class="value" style="color:var(--secondary-dark)">${scheme.benefitAmount}</div>
            </div>
            <div class="info-item">
              <div class="label">Helpline</div>
              <div class="value" style="color:var(--primary)">📞 ${scheme.helplineNumber}</div>
            </div>
            <div class="info-item">
              <div class="label">Launched</div>
              <div class="value">${scheme.launchYear || 'N/A'}</div>
            </div>
          </div>
          <div class="detail-section">
            <h4>Key Benefits</h4>
            <p style="color:var(--text-muted);font-size:0.92rem">${scheme.benefits}</p>
          </div>
          <div class="detail-section">
            <h4>Eligibility</h4>
            <p style="color:var(--text-muted);font-size:0.92rem">${scheme.eligibility.description}</p>
            ${scheme.eligibility.additionalCriteria && scheme.eligibility.additionalCriteria.length ?
              `<ul class="detail-list">${scheme.eligibility.additionalCriteria.map(c => `<li>${c}</li>`).join('')}</ul>` : ''}
          </div>
          <div class="detail-section">
            <h4>Required Documents</h4>
            <ul class="detail-list">${docsHtml}</ul>
          </div>
          <div class="detail-section">
            <h4>How to Apply</h4>
            <ol class="step-list">${stepsHtml}</ol>
          </div>
          <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.5rem">
            <a href="${scheme.officialWebsite}" target="_blank" rel="noopener noreferrer"
               class="btn btn-primary">
              🔗 Official Website
            </a>
            <a href="tel:${scheme.helplineNumber.split('/')[0].trim()}"
               class="btn btn-outline">
              📞 Call Helpline
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function openSchemeModal(scheme) {
  // Remove existing modal
  const existing = document.getElementById('schemeModal');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', buildSchemeModal(scheme));
  const overlay = document.getElementById('schemeModal');

  requestAnimationFrame(() => overlay.classList.add('open'));

  // Close handlers
  overlay.querySelector('#closeModal').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', handleModalKey);
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('schemeModal');
  if (!overlay) return;
  overlay.classList.remove('open');
  setTimeout(() => { overlay.remove(); document.body.style.overflow = ''; }, 300);
  document.removeEventListener('keydown', handleModalKey);
}

function handleModalKey(e) {
  if (e.key === 'Escape') closeModal();
}

// ─── Export Utilities ──────────────────────────────────────────────────────────
window.BB = BB;
window.loadSchemes = loadSchemes;
window.buildSchemeCard = buildSchemeCard;
window.openSchemeModal = openSchemeModal;
window.getCategoryIcon = getCategoryIcon;
window.getCategoryCss = getCategoryCss;
window.showToast = showToast;
