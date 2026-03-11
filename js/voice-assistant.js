/**
 * BenefitBridge - AI Voice Assistant (voice-assistant.js)
 * Uses Web Speech API (SpeechRecognition + SpeechSynthesis)
 * Supports: English (en-IN) and Hindi (hi-IN)
 * Keyboard shortcut: Alt+V to activate
 */

'use strict';

// ─── State ─────────────────────────────────────────────────────────────────────
const VA = {
  isOpen: false,
  isListening: false,
  isSpeaking: false,
  language: localStorage.getItem('bb_language') || 'en',
  recognition: null,
  synthesis: window.speechSynthesis,
  panelEl: null,
  fabEl: null,
  chatEl: null,
  inputEl: null,
  micBtnEl: null,
  supported: {
    speech: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
    synthesis: 'speechSynthesis' in window,
  },
};

// ─── Knowledge Base ─────────────────────────────────────────────────────────────
const KNOWLEDGE = {
  greetings: ['hello', 'hi', 'namaste', 'namaskar', 'hey', 'नमस्ते', 'हेलो'],
  help: ['help', 'what can you do', 'what do you do', 'मदद', 'क्या कर सकते हो'],
  about: ['what is benefitbridge', 'about benefitbridge', 'benefitbridge kya hai', 'benefitbridge क्या है'],
  eligibility: ['eligible', 'eligibility', 'qualify', 'check eligibility', 'पात्रता', 'योग्यता', 'am i eligible'],
  schemes: ['schemes', 'browse schemes', 'all schemes', 'list schemes', 'योजनाएं', 'स्कीम'],
  tracker: ['track', 'application status', 'track application', 'आवेदन स्थिति', 'ट्रैक'],
  contact: ['contact', 'helpline', 'help number', 'संपर्क', 'हेल्पलाइन'],
  pmkisan: ['pm kisan', 'kisan samman', 'किसान', 'पीएम किसान'],
  ayushman: ['ayushman', 'pmjay', 'health scheme', 'आयुष्मान', 'स्वास्थ्य'],
  awas: ['awas', 'housing', 'home', 'house scheme', 'आवास', 'घर'],
  mgnrega: ['mgnrega', 'mnrega', 'mahatma gandhi', 'employment guarantee', 'रोजगार'],
  ujjwala: ['ujjwala', 'lpg', 'gas connection', 'उज्ज्वला', 'गैस'],
  mudra: ['mudra', 'business loan', 'startup loan', 'मुद्रा', 'व्यवसाय'],
  documents: ['documents', 'document', 'papers', 'required', 'दस्तावेज'],
  apply: ['apply', 'how to apply', 'application', 'आवेदन', 'कैसे करें'],
};

// ─── Responses ──────────────────────────────────────────────────────────────────
const RESPONSES = {
  en: {
    welcome: `Welcome to BenefitBridge AI Assistant! 🙏 I can help you discover government welfare schemes, check your eligibility, and guide you through the application process. How can I assist you today?`,
    help: `I can help you with: \n• Finding schemes you're eligible for\n• Details about specific schemes like PM Kisan, Ayushman Bharat\n• Required documents for any scheme\n• Application process steps\n• Navigating to any page\n\nTry asking: "Tell me about PM Kisan" or "How to apply for Ayushman Bharat?"`,
    about: `BenefitBridge is a digital platform that connects Indian citizens directly to government welfare schemes. We eliminate middlemen, reduce paperwork confusion, and provide full transparency. Everything is 100% free, and we only link to official government portals.`,
    eligibility: `I'll help you find schemes you're eligible for! Click on "Check Eligibility" in the navigation, or I can take you there right now. You'll answer simple questions about your age, income, occupation, and category to get matched schemes.`,
    schemes: `There are 500+ government schemes in India! On our Schemes page, you can browse and filter by category — Agriculture, Health, Housing, Employment, Education, Women & Child, and more. Shall I take you to the schemes page?`,
    tracker: `To track your application status, you'll need your reference number from the scheme's official portal. Our demo tracker shows how the process works with sample data.`,
    contact: `For government scheme helplines:\n• PM Kisan: 155261\n• Ayushman Bharat: 14555\n• MGNREGA: 1800-111-555\n• PM Awas: 1800-11-6446\n• General PM Helpline: 1800-11-0031`,
    pmkisan: `PM Kisan Samman Nidhi provides ₹6,000 per year to farmer families in 3 installments of ₹2,000 each. Eligibility: Land-owning farmer families. Apply at pmkisan.gov.in or nearest Common Service Centre. Helpline: 155261`,
    ayushman: `Ayushman Bharat (PMJAY) provides ₹5 lakh health insurance per family per year for hospitalization at empanelled hospitals. Check eligibility at pmjay.gov.in or call 14555. Get your Ayushman Card from the nearest hospital or CSC.`,
    awas: `PM Awas Yojana provides financial assistance for housing. Urban: up to ₹2.67 lakh subsidy for EWS/LIG/MIG families. Rural: up to ₹1.30 lakh for pucca house. Apply at pmaymis.gov.in. Helpline: 1800-11-6446`,
    mgnrega: `MGNREGA guarantees 100 days of employment per year to rural households at wages of ₹220-₹350/day. Get a Job Card from your Gram Panchayat and apply for work. Website: nrega.nic.in. Helpline: 1800-111-555`,
    ujjwala: `PM Ujjwala Yojana provides free LPG connections to BPL women. You get free connection, first cylinder, and ₹1,600 assistance. Visit your nearest LPG distributor with Aadhaar and BPL ration card. Helpline: 1906`,
    mudra: `PM Mudra Yojana offers loans up to ₹10 lakh for small businesses — Shishu (up to ₹50K), Kishore (₹50K-5L), Tarun (₹5L-10L). No collateral needed! Apply at any bank or NBFC. Website: mudra.org.in`,
    documents: `Common documents needed for most schemes:\n• Aadhaar Card\n• Bank Account / Passbook\n• Income Certificate\n• Ration Card (for BPL schemes)\n• Caste Certificate (for SC/ST/OBC schemes)\n• Residence Proof\n\nSpecific documents vary by scheme. Which scheme do you need documents for?`,
    apply: `General steps to apply for any government scheme:\n1. Visit the official scheme website\n2. Register with your Aadhaar number\n3. Fill the online application form\n4. Upload required documents\n5. Submit and note reference number\n6. Track status online or at CSC\n\nWhich specific scheme would you like to apply for?`,
    navigate_eligibility: `Taking you to the Eligibility Checker now! 🎯`,
    navigate_schemes: `Taking you to the Schemes page now! 📋`,
    navigate_tracker: `Taking you to the Application Tracker! 📊`,
    navigate_contact: `Taking you to the Contact page! 📞`,
    not_understood: `I'm not sure I understood that. Could you rephrase? You can ask about specific schemes like "PM Kisan", "Ayushman Bharat", or ask "how to apply" or "check eligibility".`,
    no_speech: `Speech recognition is not supported in your browser. Please type your question in the text box below. I can still answer all your queries!`,
    listening: `Listening... 🎤`,
    processing: `Processing your request...`,
  },
  hi: {
    welcome: `बेनिफिट ब्रिज AI असिस्टेंट में आपका स्वागत है! 🙏 मैं आपको सरकारी योजनाएं खोजने, पात्रता जांचने और आवेदन प्रक्रिया में मदद कर सकता हूं। आज मैं आपकी कैसे मदद कर सकता हूं?`,
    help: `मैं इन चीजों में मदद कर सकता हूं:\n• आपके लिए पात्र योजनाएं खोजना\n• पीएम किसान, आयुष्मान भारत जैसी योजनाओं की जानकारी\n• दस्तावेजों की सूची\n• आवेदन प्रक्रिया\n\nपूछें: "पीएम किसान के बारे में बताओ"`,
    about: `बेनिफिट ब्रिज एक डिजिटल प्लेटफॉर्म है जो भारतीय नागरिकों को सरकारी कल्याण योजनाओं से सीधे जोड़ता है। कोई बिचौलिया नहीं, कोई शुल्क नहीं।`,
    eligibility: `पात्रता जांचने के लिए "पात्रता जांचें" पेज पर जाएं। वहां आप अपनी उम्र, आय, पेशा की जानकारी देकर अपने लिए उपयुक्त योजनाएं पा सकते हैं।`,
    schemes: `भारत में 500+ सरकारी योजनाएं हैं! योजनाएं पेज पर जाकर श्रेणी के अनुसार फ़िल्टर करें।`,
    pmkisan: `पीएम किसान सम्मान निधि में किसानों को हर साल ₹6,000 की आर्थिक मदद मिलती है। 3 किस्तों में ₹2,000-₹2,000 सीधे बैंक खाते में। pmkisan.gov.in पर आवेदन करें।`,
    ayushman: `आयुष्मान भारत में परिवार को हर साल ₹5 लाख तक का मुफ्त इलाज मिलता है। पात्रता जांचें pmjay.gov.in पर। हेल्पलाइन: 14555`,
    documents: `अधिकांश योजनाओं के लिए: आधार कार्ड, बैंक पासबुक, आय प्रमाण पत्र, राशन कार्ड। विशेष जानकारी के लिए बताएं किस योजना के लिए चाहिए।`,
    not_understood: `मैं समझ नहीं पाया। कृपया दोबारा पूछें। आप "पीएम किसान", "आयुष्मान भारत" जैसी योजनाओं के बारे में पूछ सकते हैं।`,
    no_speech: `आपके ब्राउज़र में स्पीच पहचान समर्थित नहीं है। कृपया टेक्स्ट बॉक्स में प्रश्न लिखें।`,
    listening: `सुन रहा हूं... 🎤`,
  },
};

function getResponse(key) {
  const lang = VA.language;
  const res = RESPONSES[lang] || RESPONSES.en;
  return res[key] || RESPONSES.en[key] || RESPONSES.en.not_understood;
}

// ─── DOM Build ──────────────────────────────────────────────────────────────────
function buildVoiceUI() {
  // FAB Button
  const fab = document.createElement('button');
  fab.className = 'voice-fab';
  fab.id = 'voiceFab';
  fab.setAttribute('aria-label', 'Open AI Voice Assistant (Alt+V)');
  fab.setAttribute('title', 'AI Voice Assistant');
  fab.innerHTML = `
    🎤
    <span class="fab-tooltip">AI Assistant (Alt+V)</span>
  `;
  document.body.appendChild(fab);

  // Panel
  const panel = document.createElement('div');
  panel.className = 'voice-panel';
  panel.id = 'voicePanel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'BenefitBridge AI Assistant');
  panel.innerHTML = `
    <div class="voice-panel-header">
      <div class="voice-panel-title">🤖 BenefitBridge AI</div>
      <button class="voice-panel-close" id="voicePanelClose" aria-label="Close assistant">✕</button>
    </div>
    <div class="voice-chat" id="voiceChat" aria-live="polite" aria-label="Conversation"></div>
    <div class="voice-input-row">
      <input type="text" class="voice-text-input" id="voiceTextInput"
             placeholder="Type your question..." aria-label="Type your question"
             autocomplete="off" />
      <button class="voice-mic-btn" id="voiceMicBtn" aria-label="Start voice input" title="Start listening">🎤</button>
      <button class="voice-send-btn" id="voiceSendBtn" aria-label="Send message" title="Send">➤</button>
    </div>
  `;
  document.body.appendChild(panel);

  // Toast container
  if (!document.querySelector('.toast-container')) {
    const tc = document.createElement('div');
    tc.className = 'toast-container';
    document.body.appendChild(tc);
  }

  VA.panelEl = panel;
  VA.fabEl = fab;
  VA.chatEl = document.getElementById('voiceChat');
  VA.inputEl = document.getElementById('voiceTextInput');
  VA.micBtnEl = document.getElementById('voiceMicBtn');

  // Attach events
  fab.addEventListener('click', togglePanel);
  document.getElementById('voicePanelClose').addEventListener('click', closePanel);
  VA.micBtnEl.addEventListener('click', toggleListening);
  document.getElementById('voiceSendBtn').addEventListener('click', sendTextMessage);
  VA.inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendTextMessage();
  });

  // Keyboard shortcut
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      togglePanel();
    }
  });

  // Show welcome on first open (handled in togglePanel)
}

// ─── Panel Control ─────────────────────────────────────────────────────────────
function togglePanel() {
  VA.isOpen ? closePanel() : openPanel();
}

function openPanel() {
  VA.isOpen = true;
  VA.panelEl.classList.add('open');

  if (!VA.chatEl.children.length) {
    addMessage('assistant', getResponse('welcome'));
  }

  VA.inputEl.focus();
}

function closePanel() {
  VA.isOpen = false;
  VA.panelEl.classList.remove('open');
  if (VA.isListening) stopListening();
}

// ─── Messages ──────────────────────────────────────────────────────────────────
function addMessage(role, text) {
  const msg = document.createElement('div');
  msg.className = `voice-msg ${role}`;

  // Convert newlines
  const formatted = text.replace(/\n/g, '<br>');
  msg.innerHTML = formatted;

  VA.chatEl.appendChild(msg);
  VA.chatEl.scrollTop = VA.chatEl.scrollHeight;
  return msg;
}

function addTypingIndicator() {
  const msg = document.createElement('div');
  msg.className = 'voice-msg assistant typing';
  msg.id = 'typingIndicator';
  msg.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
  VA.chatEl.appendChild(msg);
  VA.chatEl.scrollTop = VA.chatEl.scrollHeight;
  return msg;
}

function removeTypingIndicator() {
  const ti = document.getElementById('typingIndicator');
  if (ti) ti.remove();
}

// ─── Intent Recognition ────────────────────────────────────────────────────────
function detectIntent(query) {
  const q = query.toLowerCase();

  if (KNOWLEDGE.greetings.some(g => q.includes(g))) return 'greeting';
  if (KNOWLEDGE.help.some(h => q.includes(h))) return 'help';
  if (KNOWLEDGE.about.some(a => q.includes(a))) return 'about';

  // Navigation intents
  if (q.includes('go to eligibility') || q.includes('check eligibility') || q.includes('eligibility page') ||
      q.includes('पात्रता जांच') || q.includes('पात्रता पेज')) return 'nav_eligibility';
  if (q.includes('go to schemes') || q.includes('browse schemes') || q.includes('schemes page') ||
      q.includes('योजना पेज')) return 'nav_schemes';
  if (q.includes('go to tracker') || q.includes('track application') || q.includes('application status') ||
      q.includes('ट्रैकर')) return 'nav_tracker';
  if (q.includes('contact') || q.includes('helpline') || q.includes('संपर्क')) return 'nav_contact';

  // Scheme-specific
  if (KNOWLEDGE.pmkisan.some(k => q.includes(k))) return 'pmkisan';
  if (KNOWLEDGE.ayushman.some(k => q.includes(k))) return 'ayushman';
  if (KNOWLEDGE.awas.some(k => q.includes(k))) return 'awas';
  if (KNOWLEDGE.mgnrega.some(k => q.includes(k))) return 'mgnrega';
  if (KNOWLEDGE.ujjwala.some(k => q.includes(k))) return 'ujjwala';
  if (KNOWLEDGE.mudra.some(k => q.includes(k))) return 'mudra';

  // General intents
  if (KNOWLEDGE.eligibility.some(e => q.includes(e))) return 'eligibility';
  if (KNOWLEDGE.schemes.some(s => q.includes(s))) return 'schemes';
  if (KNOWLEDGE.tracker.some(t => q.includes(t))) return 'tracker';
  if (KNOWLEDGE.documents.some(d => q.includes(d))) return 'documents';
  if (KNOWLEDGE.apply.some(a => q.includes(a))) return 'apply';

  return 'not_understood';
}

async function processQuery(query) {
  addMessage('user', query);
  const typing = addTypingIndicator();

  await new Promise(r => setTimeout(r, 700));
  removeTypingIndicator();

  const intent = detectIntent(query);
  let response = '';
  let navigateTo = null;

  switch (intent) {
    case 'greeting':
      response = getResponse('welcome');
      break;
    case 'help':
      response = getResponse('help');
      break;
    case 'about':
      response = getResponse('about');
      break;
    case 'nav_eligibility':
      response = getResponse('navigate_eligibility') || getResponse('eligibility');
      navigateTo = 'eligibility';
      break;
    case 'nav_schemes':
      response = getResponse('navigate_schemes') || getResponse('schemes');
      navigateTo = 'schemes';
      break;
    case 'nav_tracker':
      response = getResponse('navigate_tracker') || getResponse('tracker');
      navigateTo = 'tracker';
      break;
    case 'nav_contact':
      response = getResponse('navigate_contact') || getResponse('contact');
      navigateTo = 'contact';
      break;
    case 'pmkisan': response = getResponse('pmkisan'); break;
    case 'ayushman': response = getResponse('ayushman'); break;
    case 'awas': response = getResponse('awas'); break;
    case 'mgnrega': response = getResponse('mgnrega'); break;
    case 'ujjwala': response = getResponse('ujjwala'); break;
    case 'mudra': response = getResponse('mudra'); break;
    case 'eligibility': response = getResponse('eligibility'); break;
    case 'schemes': response = getResponse('schemes'); break;
    case 'tracker': response = getResponse('tracker'); break;
    case 'contact': response = getResponse('contact'); break;
    case 'documents': response = getResponse('documents'); break;
    case 'apply': response = getResponse('apply'); break;
    default: response = getResponse('not_understood');
  }

  addMessage('assistant', response);
  speakText(response.replace(/\n•/g, ',').replace(/\n/g, '. ').substring(0, 300));

  // Navigate after speaking
  if (navigateTo) {
    setTimeout(() => navigatePage(navigateTo), 2500);
  }
}

function navigatePage(page) {
  const isSubPage = window.location.pathname.includes('/pages/');
  const base = isSubPage ? '' : 'pages/';
  const paths = {
    eligibility: `${base}eligibility.html`,
    schemes: `${base}schemes.html`,
    tracker: `${base}tracker.html`,
    contact: `${base}contact.html`,
    home: isSubPage ? '../index.html' : 'index.html',
  };
  if (paths[page]) window.location.href = paths[page];
}

// ─── Text Input ────────────────────────────────────────────────────────────────
function sendTextMessage() {
  const text = VA.inputEl.value.trim();
  if (!text) return;
  VA.inputEl.value = '';
  processQuery(text);
}

// ─── Speech Recognition ─────────────────────────────────────────────────────────
function initSpeechRecognition() {
  if (!VA.supported.speech) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  VA.recognition = new SpeechRecognition();
  VA.recognition.continuous = false;
  VA.recognition.interimResults = false;
  VA.recognition.maxAlternatives = 1;
  VA.recognition.lang = VA.language === 'hi' ? 'hi-IN' : 'en-IN';

  VA.recognition.onstart = () => {
    VA.isListening = true;
    VA.fabEl.classList.add('listening');
    VA.micBtnEl.classList.add('listening');
    VA.micBtnEl.setAttribute('aria-label', 'Stop listening');
    VA.inputEl.placeholder = getResponse('listening');
  };

  VA.recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    VA.inputEl.placeholder = 'Type your question...';
    processQuery(transcript);
  };

  VA.recognition.onerror = (event) => {
    stopListening();
    if (event.error !== 'no-speech') {
      addMessage('assistant', `Sorry, I couldn't hear you clearly. Please try again or type your question.`);
    }
  };

  VA.recognition.onend = () => {
    stopListening();
  };
}

function toggleListening() {
  if (!VA.supported.speech) {
    addMessage('assistant', getResponse('no_speech'));
    if (!VA.isOpen) openPanel();
    return;
  }
  VA.isListening ? stopListening() : startListening();
}

function startListening() {
  if (!VA.recognition) initSpeechRecognition();
  if (!VA.recognition) return;

  if (!VA.isOpen) openPanel();
  VA.recognition.lang = VA.language === 'hi' ? 'hi-IN' : 'en-IN';

  try {
    VA.recognition.start();
  } catch (e) {
    // Already started
  }
}

function stopListening() {
  VA.isListening = false;
  VA.fabEl?.classList.remove('listening');
  VA.micBtnEl?.classList.remove('listening');
  VA.micBtnEl?.setAttribute('aria-label', 'Start voice input');
  if (VA.inputEl) VA.inputEl.placeholder = 'Type your question...';

  try {
    VA.recognition?.stop();
  } catch (e) {
    // Ignore
  }
}

// ─── Speech Synthesis ─────────────────────────────────────────────────────────
function speakText(text) {
  if (!VA.supported.synthesis || !text) return;

  VA.synthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = VA.language === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  utterance.volume = 0.9;

  // Try to use Indian English voice
  const voices = VA.synthesis.getVoices();
  const preferred = voices.find(v => v.lang === (VA.language === 'hi' ? 'hi-IN' : 'en-IN')) ||
                    voices.find(v => v.lang.startsWith('en')) ||
                    null;
  if (preferred) utterance.voice = preferred;

  utterance.onstart = () => { VA.isSpeaking = true; };
  utterance.onend = () => { VA.isSpeaking = false; };
  utterance.onerror = () => { VA.isSpeaking = false; };

  VA.synthesis.speak(utterance);
}

// ─── Language Change Listener ──────────────────────────────────────────────────
document.addEventListener('languageChange', (e) => {
  VA.language = e.detail.lang;
  if (VA.recognition) {
    VA.recognition.lang = VA.language === 'hi' ? 'hi-IN' : 'en-IN';
  }
});

// ─── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildVoiceUI();
  if (VA.supported.speech) initSpeechRecognition();
});

// Handle voices loading asynchronously
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    // Voices loaded, ready to speak
  };
}
