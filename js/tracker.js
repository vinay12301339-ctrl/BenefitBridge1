/**
 * BenefitBridge - Application Tracker Logic (tracker.js)
 * Handles: Demo tracker with timeline visualization
 */

'use strict';

// ─── Demo Data ─────────────────────────────────────────────────────────────────
const DEMO_APPLICATIONS = {
  'BB2024001': {
    refNumber: 'BB2024001',
    scheme: 'PM Kisan Samman Nidhi',
    applicantName: 'Ramesh Kumar',
    state: 'Uttar Pradesh',
    appliedDate: '15 Jan 2024',
    currentStatus: 'approved',
    timeline: [
      {
        stage: 'Applied',
        icon: '📝',
        status: 'completed',
        date: '15 Jan 2024',
        description: 'Application submitted successfully at PM Kisan Portal',
      },
      {
        stage: 'Documents Verified',
        icon: '📋',
        status: 'completed',
        date: '22 Jan 2024',
        description: 'Aadhaar, land records and bank details verified by state officials',
      },
      {
        stage: 'Under Review',
        icon: '🔍',
        status: 'completed',
        date: '28 Jan 2024',
        description: 'Application reviewed by district agriculture officer',
      },
      {
        stage: 'Approved',
        icon: '✅',
        status: 'completed',
        date: '02 Feb 2024',
        description: 'Application approved. Benefit transfer initiated',
      },
      {
        stage: 'Benefit Disbursed',
        icon: '💰',
        status: 'completed',
        date: '10 Feb 2024',
        description: '₹2,000 transferred to bank account ending with XXXX1234',
      },
    ],
  },
  'BB2024002': {
    refNumber: 'BB2024002',
    scheme: 'Ayushman Bharat - PMJAY',
    applicantName: 'Priya Singh',
    state: 'Maharashtra',
    appliedDate: '05 Feb 2024',
    currentStatus: 'under-review',
    timeline: [
      {
        stage: 'Applied',
        icon: '📝',
        status: 'completed',
        date: '05 Feb 2024',
        description: 'Ayushman Card application submitted at nearest CSC',
      },
      {
        stage: 'Documents Verified',
        icon: '📋',
        status: 'completed',
        date: '08 Feb 2024',
        description: 'Ration card and Aadhaar verified at Common Service Centre',
      },
      {
        stage: 'Under Review',
        icon: '🔍',
        status: 'active',
        date: '12 Feb 2024',
        description: 'Application being reviewed by Ayushman Bharat authority',
      },
      {
        stage: 'Approved',
        icon: '✅',
        status: 'pending',
        date: 'Pending',
        description: 'Awaiting approval from PM-JAY authority',
      },
      {
        stage: 'Card Issued',
        icon: '🏥',
        status: 'pending',
        date: 'Pending',
        description: 'Ayushman Gold Card will be issued after approval',
      },
    ],
  },
  'BB2024003': {
    refNumber: 'BB2024003',
    scheme: 'PM Awas Yojana - Urban',
    applicantName: 'Sunil Verma',
    state: 'Rajasthan',
    appliedDate: '20 Jan 2024',
    currentStatus: 'documents-verified',
    timeline: [
      {
        stage: 'Applied',
        icon: '📝',
        status: 'completed',
        date: '20 Jan 2024',
        description: 'Housing loan subsidy application submitted online at pmaymis.gov.in',
      },
      {
        stage: 'Documents Verified',
        icon: '📋',
        status: 'active',
        date: '01 Feb 2024',
        description: 'Income certificate and property documents under verification by ULB',
      },
      {
        stage: 'Under Review',
        icon: '🔍',
        status: 'pending',
        date: 'Pending',
        description: 'Technical review of housing project plan pending',
      },
      {
        stage: 'Approved',
        icon: '✅',
        status: 'pending',
        date: 'Pending',
        description: 'Approval from Central Nodal Agency pending',
      },
      {
        stage: 'Subsidy Released',
        icon: '💰',
        status: 'pending',
        date: 'Pending',
        description: 'Interest subsidy will be credited to loan account',
      },
    ],
  },
  'BB2024004': {
    refNumber: 'BB2024004',
    scheme: 'PM Mudra Yojana - Kishore',
    applicantName: 'Meena Devi',
    state: 'Bihar',
    appliedDate: '10 Feb 2024',
    currentStatus: 'applied',
    timeline: [
      {
        stage: 'Applied',
        icon: '📝',
        status: 'active',
        date: '10 Feb 2024',
        description: 'Mudra loan application submitted at State Bank of India branch',
      },
      {
        stage: 'Documents Verified',
        icon: '📋',
        status: 'pending',
        date: 'Pending',
        description: 'KYC and business plan verification pending',
      },
      {
        stage: 'Under Review',
        icon: '🔍',
        status: 'pending',
        date: 'Pending',
        description: 'Credit assessment by bank pending',
      },
      {
        stage: 'Approved',
        icon: '✅',
        status: 'pending',
        date: 'Pending',
        description: 'Loan sanction pending',
      },
      {
        stage: 'Loan Disbursed',
        icon: '💳',
        status: 'pending',
        date: 'Pending',
        description: 'Mudra loan amount will be disbursed with Mudra card',
      },
    ],
  },
};

const STATUS_LABELS = {
  'approved': { label: 'Approved ✅', color: 'var(--secondary)' },
  'under-review': { label: 'Under Review 🔍', color: 'var(--primary)' },
  'documents-verified': { label: 'Documents Verified 📋', color: 'var(--accent)' },
  'applied': { label: 'Applied 📝', color: '#6c757d' },
  'disbursed': { label: 'Benefit Disbursed 💰', color: 'var(--secondary)' },
};

// ─── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTracker();
});

function initTracker() {
  const trackBtn = document.getElementById('trackBtn');
  const refInput = document.getElementById('refInput');

  if (trackBtn) {
    trackBtn.addEventListener('click', () => {
      const ref = refInput ? refInput.value.trim().toUpperCase() : '';
      trackApplication(ref);
    });
  }

  if (refInput) {
    refInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        trackApplication(refInput.value.trim().toUpperCase());
      }
    });
  }

  // Demo reference buttons
  document.querySelectorAll('.demo-ref-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ref = btn.dataset.ref;
      if (refInput) refInput.value = ref;
      trackApplication(ref);
    });
  });
}

// ─── Track Application ──────────────────────────────────────────────────────────
function trackApplication(refNumber) {
  const resultArea = document.getElementById('trackerResult');
  if (!resultArea) return;

  if (!refNumber) {
    showToast('Please enter a reference number', 'error');
    return;
  }

  const app = DEMO_APPLICATIONS[refNumber];

  if (!app) {
    resultArea.innerHTML = `
      <div class="tracker-card">
        <div class="tracker-card-body" style="text-align:center;padding:3rem">
          <div style="font-size:3rem;margin-bottom:1rem">❌</div>
          <h3>Reference Not Found</h3>
          <p>No application found with reference number <strong>${refNumber}</strong>.</p>
          <p style="font-size:0.88rem;margin-top:1rem">Try one of the demo references below, or visit the official scheme portal for real tracking.</p>
        </div>
      </div>
    `;
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }

  const statusInfo = STATUS_LABELS[app.currentStatus] || { label: app.currentStatus, color: '#666' };

  resultArea.innerHTML = `
    <div class="tracker-card fade-in visible">
      <div class="tracker-card-header">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem">
          <div>
            <div style="font-size:0.8rem;opacity:0.8;margin-bottom:0.25rem">Reference Number</div>
            <div style="font-size:1.4rem;font-weight:800;letter-spacing:1px">${app.refNumber}</div>
          </div>
          <div class="tracker-status-badge">${statusInfo.label}</div>
        </div>
        <div style="margin-top:1rem;display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
          <div>
            <div style="font-size:0.75rem;opacity:0.7">Scheme</div>
            <div style="font-weight:600;font-size:0.9rem">${app.scheme}</div>
          </div>
          <div>
            <div style="font-size:0.75rem;opacity:0.7">Applicant</div>
            <div style="font-weight:600;font-size:0.9rem">${app.applicantName}</div>
          </div>
          <div>
            <div style="font-size:0.75rem;opacity:0.7">State</div>
            <div style="font-weight:600;font-size:0.9rem">${app.state}</div>
          </div>
          <div>
            <div style="font-size:0.75rem;opacity:0.7">Applied On</div>
            <div style="font-weight:600;font-size:0.9rem">${app.appliedDate}</div>
          </div>
        </div>
      </div>
      <div class="tracker-card-body">
        <h4 style="margin-bottom:1.5rem">Application Timeline</h4>
        <div class="timeline">
          ${app.timeline.map(t => buildTimelineItem(t)).join('')}
        </div>
        <div class="demo-note" style="margin-top:1.5rem">
          <span>ℹ️</span>
          <span>This is a <strong>demonstration</strong>. For real application tracking, please visit the official portal of the respective scheme.</span>
        </div>
      </div>
    </div>
  `;

  resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function buildTimelineItem(item) {
  return `
    <div class="timeline-item ${item.status}">
      <div class="timeline-dot">${item.icon}</div>
      <div class="timeline-content">
        <div class="timeline-title">${item.stage}</div>
        <div class="timeline-date">📅 ${item.date}</div>
        <div class="timeline-desc">${item.description}</div>
      </div>
    </div>
  `;
}
