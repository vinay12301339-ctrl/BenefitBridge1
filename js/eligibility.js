/**
 * BenefitBridge - Eligibility Checker Logic (eligibility.js)
 * Handles: Multi-step questionnaire, matching, and results display
 */

'use strict';

let schemesData = [];
let currentStep = 1;
const TOTAL_STEPS = 4;

const userProfile = {
  age: null,
  gender: '',
  state: '',
  income: null,
  occupation: '',
  socialCategory: '',
  bplCard: false,
  disability: false,
  numChildren: 0,
  ownsLand: false,
};

document.addEventListener('DOMContentLoaded', async () => {
  schemesData = await loadSchemes();
  initEligibilityChecker();
});

function initEligibilityChecker() {
  updateProgressUI();

  document.getElementById('nextBtn')?.addEventListener('click', handleNext);
  document.getElementById('prevBtn')?.addEventListener('click', handlePrev);
  document.getElementById('checkBtn')?.addEventListener('click', handleCheck);
  document.getElementById('restartBtn')?.addEventListener('click', restartChecker);
}

// ─── Navigation ────────────────────────────────────────────────────────────────
function handleNext() {
  if (!validateStep(currentStep)) return;
  collectStepData(currentStep);
  currentStep++;
  updateStepVisibility();
  updateProgressUI();
}

function handlePrev() {
  currentStep--;
  updateStepVisibility();
  updateProgressUI();
}

function handleCheck() {
  if (!validateStep(currentStep)) return;
  collectStepData(currentStep);
  const matches = computeMatches();
  renderResults(matches);
}

function restartChecker() {
  currentStep = 1;
  Object.keys(userProfile).forEach(k => {
    userProfile[k] = typeof userProfile[k] === 'boolean' ? false :
                     typeof userProfile[k] === 'number' ? (k === 'numChildren' ? 0 : null) : '';
  });
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.querySelector('.results-page')?.classList.remove('active');
  document.querySelector('.form-step[data-step="1"]')?.classList.add('active');
  document.getElementById('checkerForm')?.style.removeProperty('display');
  updateProgressUI();
}

function updateStepVisibility() {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.querySelector(`.form-step[data-step="${currentStep}"]`)?.classList.add('active');

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const checkBtn = document.getElementById('checkBtn');

  if (prevBtn) prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
  if (nextBtn) nextBtn.style.display = currentStep === TOTAL_STEPS ? 'none' : 'inline-flex';
  if (checkBtn) checkBtn.style.display = currentStep === TOTAL_STEPS ? 'inline-flex' : 'none';
}

function updateProgressUI() {
  const progressFill = document.getElementById('progressFill');
  const pct = ((currentStep - 1) / TOTAL_STEPS) * 100;
  if (progressFill) progressFill.style.width = `${pct}%`;

  document.querySelectorAll('.progress-step').forEach(step => {
    const num = parseInt(step.dataset.step, 10);
    step.classList.remove('active', 'completed');
    if (num < currentStep) step.classList.add('completed');
    else if (num === currentStep) step.classList.add('active');
  });
}

// ─── Validation ────────────────────────────────────────────────────────────────
function validateStep(step) {
  const fields = {
    1: ['age', 'gender', 'state'],
    2: ['income', 'occupation'],
    3: ['socialCategory'],
    4: [],
  };
  const required = fields[step] || [];
  let valid = true;

  required.forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (!el || !el.value.trim()) {
      showFieldError(el);
      valid = false;
    } else {
      clearFieldError(el);
    }
  });

  return valid;
}

function showFieldError(el) {
  if (!el) return;
  el.style.borderColor = '#dc3545';
  el.style.boxShadow = '0 0 0 3px rgba(220,53,69,0.15)';
}

function clearFieldError(el) {
  if (!el) return;
  el.style.borderColor = '';
  el.style.boxShadow = '';
}

// ─── Data Collection ───────────────────────────────────────────────────────────
function collectStepData(step) {
  const g = (id) => document.getElementById(id);
  const gv = (id) => g(id) ? g(id).value : '';
  const gc = (id) => g(id) ? g(id).checked : false;

  if (step === 1) {
    userProfile.age = parseInt(gv('age'), 10) || null;
    userProfile.gender = gv('gender');
    userProfile.state = gv('state');
  } else if (step === 2) {
    userProfile.income = parseInt(gv('income'), 10) || 0;
    userProfile.occupation = gv('occupation');
  } else if (step === 3) {
    userProfile.socialCategory = gv('socialCategory');
  } else if (step === 4) {
    userProfile.bplCard = gc('bplCard');
    userProfile.disability = gc('disability');
    userProfile.numChildren = parseInt(gv('numChildren'), 10) || 0;
    userProfile.ownsLand = gc('ownsLand');
  }
}

// ─── Matching Algorithm ─────────────────────────────────────────────────────────
function computeMatches() {
  return schemesData
    .map(scheme => ({ scheme, score: computeScore(scheme) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

function computeScore(scheme) {
  const el = scheme.eligibility;
  let score = 0;
  let maxScore = 0;

  // Age check
  if (userProfile.age !== null) {
    maxScore += 20;
    const minOk = !el.minAge || userProfile.age >= el.minAge;
    const maxOk = !el.maxAge || userProfile.age <= el.maxAge;
    if (minOk && maxOk) score += 20;
    else return 0; // Hard disqualifier
  }

  // Gender check
  if (el.gender && el.gender !== 'all') {
    maxScore += 15;
    if (el.gender === userProfile.gender) score += 15;
    else return 0; // Hard disqualifier
  } else {
    score += 10;
    maxScore += 10;
  }

  // Occupation check
  if (el.occupations && !el.occupations.includes('all')) {
    maxScore += 20;
    if (el.occupations.includes(userProfile.occupation)) score += 20;
    else score += 0;
  } else {
    score += 15;
    maxScore += 15;
  }

  // Social category check
  if (el.socialCategories && !el.socialCategories.includes('all')) {
    maxScore += 15;
    if (el.socialCategories.includes(userProfile.socialCategory)) score += 15;
  } else {
    score += 10;
    maxScore += 10;
  }

  // Income check
  if (el.maxIncome !== null && el.maxIncome !== undefined) {
    maxScore += 20;
    if (userProfile.income <= el.maxIncome) score += 20;
    else return 0;
  } else {
    score += 10;
    maxScore += 10;
  }

  // BPL check
  if (el.bplRequired) {
    maxScore += 15;
    if (userProfile.bplCard) score += 15;
    else score -= 10;
  }

  // State check
  if (el.states && !el.states.includes('all')) {
    maxScore += 10;
    const stateMatch = el.states.some(s =>
      s.toLowerCase().includes(userProfile.state.toLowerCase()) ||
      userProfile.state.toLowerCase().includes(s.toLowerCase())
    );
    if (stateMatch) score += 10;
    else score = Math.max(score - 15, 0);
  } else {
    score += 5;
    maxScore += 5;
  }

  // Land ownership bonus for farmers
  if (userProfile.ownsLand && el.occupations && el.occupations.includes('farmer')) {
    score += 5;
    maxScore += 5;
  }

  if (maxScore === 0) return 50;
  const pct = Math.round((score / maxScore) * 100);
  return Math.max(Math.min(pct, 100), 0);
}

// ─── Results Rendering ─────────────────────────────────────────────────────────
function renderResults(matches) {
  const resultsPage = document.querySelector('.results-page');
  const form = document.getElementById('checkerForm');
  const resultsList = document.getElementById('resultsList');
  const resultsCountEl = document.getElementById('resultsCount');

  if (form) form.style.display = 'none';
  if (resultsPage) resultsPage.classList.add('active');

  if (resultsCountEl) {
    resultsCountEl.textContent = `Found ${matches.length} matching scheme${matches.length !== 1 ? 's' : ''} for you`;
  }

  if (!resultsList) return;

  if (!matches.length) {
    resultsList.innerHTML = `
      <div class="no-results">
        <span class="no-results-icon">😔</span>
        <h3>No exact matches found</h3>
        <p>Try exploring all schemes — you may still qualify for some.</p>
        <a href="schemes.html" class="btn btn-primary">Browse All Schemes</a>
      </div>
    `;
    return;
  }

  resultsList.innerHTML = matches.map(({ scheme, score }) => {
    const scoreClass = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
    const icon = getCategoryIcon(scheme.category);

    return `
      <div class="result-card" data-id="${scheme.id}" role="button" tabindex="0">
        <div class="result-score ${scoreClass}">
          <span class="pct">${score}%</span>
          <span class="match-label">Match</span>
        </div>
        <div class="result-info">
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.3rem">
            <span>${icon}</span>
            <span class="result-name">${scheme.name}</span>
          </div>
          <div class="result-benefit">💰 ${scheme.benefitAmount}</div>
          <div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.2rem">${scheme.ministry}</div>
        </div>
        <button class="btn btn-sm btn-primary" data-id="${scheme.id}">View →</button>
      </div>
    `;
  }).join('');

  // Attach listeners
  resultsList.querySelectorAll('[data-id]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id || el.closest('[data-id]')?.dataset.id;
      const scheme = schemesData.find(s => s.id === id);
      if (scheme) openSchemeModal(scheme);
    });
  });
}

window.restartChecker = restartChecker;
