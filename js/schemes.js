/**
 * BenefitBridge - Schemes Page Logic (schemes.js)
 * Handles: Loading, filtering, searching, and displaying scheme data
 */

'use strict';

let allSchemes = [];
let filteredSchemes = [];
let activeCategory = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', async () => {
  await initSchemesPage();
});

async function initSchemesPage() {
  showLoadingState();
  allSchemes = await loadSchemes();
  filteredSchemes = [...allSchemes];
  renderSchemes(filteredSchemes);
  initSearch();
  initFilters();
}

// ─── Loading State ─────────────────────────────────────────────────────────────
function showLoadingState() {
  const grid = document.getElementById('schemesGrid');
  if (!grid) return;
  grid.innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:3rem">
      <div class="loading-spinner"></div>
      <p>Loading government schemes...</p>
    </div>
  `;
}

// ─── Render Schemes ────────────────────────────────────────────────────────────
function renderSchemes(schemes) {
  const grid = document.getElementById('schemesGrid');
  const countEl = document.getElementById('schemesCount');
  if (!grid) return;

  if (countEl) countEl.textContent = `Showing ${schemes.length} scheme${schemes.length !== 1 ? 's' : ''}`;

  if (!schemes.length) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column:1/-1">
        <span class="no-results-icon">🔍</span>
        <h3>No schemes found</h3>
        <p>Try adjusting your search or filters</p>
        <button class="btn btn-outline" onclick="resetFilters()">Clear Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = schemes.map(s => buildSchemeCard(s)).join('');
  attachCardListeners();
  animateCards();
}

function attachCardListeners() {
  document.querySelectorAll('.scheme-card, .view-details-btn').forEach(el => {
    el.addEventListener('click', (e) => {
      const id = el.dataset.id || el.closest('.scheme-card')?.dataset.id;
      if (id) openSchemeById(id);
    });

    if (el.classList.contains('scheme-card')) {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openSchemeById(el.dataset.id);
        }
      });
    }
  });
}

function animateCards() {
  document.querySelectorAll('.scheme-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 60);
  });
}

function openSchemeById(id) {
  const scheme = allSchemes.find(s => s.id === id);
  if (scheme) openSchemeModal(scheme);
}

// ─── Search ────────────────────────────────────────────────────────────────────
function initSearch() {
  const searchInput = document.getElementById('schemeSearch');
  if (!searchInput) return;

  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    }, 300);
  });
}

// ─── Filters ───────────────────────────────────────────────────────────────────
function initFilters() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.category || 'all';
      applyFilters();
    });
  });

  // Sort dropdown
  const sortSelect = document.getElementById('sortSchemes');
  if (sortSelect) {
    sortSelect.addEventListener('change', applyFilters);
  }
}

function applyFilters() {
  let results = [...allSchemes];

  // Category filter
  if (activeCategory !== 'all') {
    results = results.filter(s =>
      s.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }

  // Search filter
  if (searchQuery) {
    results = results.filter(s =>
      s.name.toLowerCase().includes(searchQuery) ||
      (s.hindiName && s.hindiName.includes(searchQuery)) ||
      s.description.toLowerCase().includes(searchQuery) ||
      s.ministry.toLowerCase().includes(searchQuery) ||
      (s.tags || []).some(t => t.toLowerCase().includes(searchQuery)) ||
      s.category.toLowerCase().includes(searchQuery)
    );
  }

  // Sort
  const sortSelect = document.getElementById('sortSchemes');
  if (sortSelect) {
    const sortVal = sortSelect.value;
    if (sortVal === 'name-asc') results.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortVal === 'name-desc') results.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortVal === 'year-new') results.sort((a, b) => (b.launchYear || 0) - (a.launchYear || 0));
    else if (sortVal === 'year-old') results.sort((a, b) => (a.launchYear || 0) - (b.launchYear || 0));
  }

  filteredSchemes = results;
  renderSchemes(filteredSchemes);
}

function resetFilters() {
  searchQuery = '';
  activeCategory = 'all';
  const searchInput = document.getElementById('schemeSearch');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  const allChip = document.querySelector('.filter-chip[data-category="all"]');
  if (allChip) allChip.classList.add('active');
  applyFilters();
}

window.resetFilters = resetFilters;
