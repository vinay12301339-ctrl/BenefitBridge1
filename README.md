# 🇮🇳 BenefitBridge

> **Making Government Benefits Accessible to Every Indian Citizen — No Middlemen, No Confusion, No Fees**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🎯 About BenefitBridge

BenefitBridge is a digital platform that connects Indian citizens directly to government welfare schemes. It eliminates the need for middlemen, reduces paperwork confusion, and provides full transparency in the benefits process.

**The Problem:** Millions of eligible Indian citizens miss out on government benefits because:
- They don't know which schemes they qualify for
- Middlemen charge fees for free government services
- Complex application processes and paperwork confusion
- Language barriers (schemes described only in complex English)

**Our Solution:** A free, voice-enabled, multilingual platform that:
- Matches citizens to eligible schemes in under 2 minutes
- Provides clear information in simple Hindi and English
- Links directly to official government portals
- Requires zero registration or data collection

---

## ✨ Features

### 🏠 Landing Page
- Hero section with key CTA buttons
- 3-step visual flow explaining how the platform works
- Stats bar: 500+ Schemes, 28 States, 100% Free, 0 Middlemen
- Featured scheme cards (PM Kisan, Ayushman Bharat, MGNREGA, etc.)
- AI Voice Assistant widget (floating mic button)
- Responsive navbar with language toggle (EN/हिंदी)
- Footer with all navigation links

### 📋 Schemes Browser
- Real-time search/filter by name, keyword, ministry
- Category filters: Agriculture, Health, Housing, Employment, Education, Women & Child, Senior Citizens, SC/ST/OBC
- Sort options: Best Match, Name A-Z, Newest First
- Scheme cards with icon, name, Hindi name, ministry, description, benefits
- Detailed modal on click: full description, eligibility criteria, required documents, application steps, official website link, helpline number

### ✅ Eligibility Checker
- 4-step questionnaire with progress bar
- Step 1: Personal Info (Age, Gender, State)
- Step 2: Economic Info (Annual Income, Occupation)
- Step 3: Social Category (General/SC/ST/OBC/Minority/EWS)
- Step 4: Additional Info (BPL card, Disability, Land ownership, Children)
- Results ranked by match percentage (0-100%)
- Client-side processing — no data sent to any server

### 📊 Application Tracker
- Demo tracker with reference numbers (BB2024001 – BB2024004)
- Visual timeline: Applied → Documents Verified → Under Review → Approved → Benefit Disbursed
- Sample applications for PM Kisan, Ayushman Bharat, PM Awas, Mudra Loan
- Links to real official tracking portals

### 🤖 AI Voice Assistant
- Floating mic button (bottom-right) on all pages
- Keyboard shortcut: **Alt+V** to activate
- Speech-to-text using Web Speech API (SpeechRecognition)
- Text-to-speech using Web Speech Synthesis API
- Supports both **English (en-IN)** and **Hindi (hi-IN)**
- Intent recognition for 20+ query types
- Chat panel with conversation history
- Typing indicator and pulse animation while listening
- Fallback text input for unsupported browsers

### 📖 About Page
- Mission statement and key principles
- How the platform works (4-step explanation)
- FAQ section (7 common questions with accordion)
- Important disclaimer

### 📞 Contact Page
- Contact form (Name, Email, Phone, Category, Message)
- 8+ government scheme helpline numbers
- Links to 8 official government portals
- FAQ section (4 questions)

---

## 🗄️ Schemes Database

`data/schemes.json` contains **20 real Indian government schemes** with accurate data:

| # | Scheme | Category | Ministry |
|---|--------|----------|----------|
| 1 | PM Kisan Samman Nidhi | Agriculture | Agriculture & Farmers Welfare |
| 2 | Ayushman Bharat (PMJAY) | Health | Health & Family Welfare |
| 3 | PM Awas Yojana | Housing | Housing & Urban Affairs |
| 4 | MGNREGA | Employment | Rural Development |
| 5 | Sukanya Samriddhi Yojana | Women & Child | Finance |
| 6 | PM Ujjwala Yojana | Women & Child | Petroleum & Natural Gas |
| 7 | PM Jan Dhan Yojana | Employment | Finance |
| 8 | National Pension Scheme (NPS) | Senior Citizens | Finance / PFRDA |
| 9 | Atal Pension Yojana | Senior Citizens | Finance / PFRDA |
| 10 | PM Mudra Yojana | Employment | Finance |
| 11 | Beti Bachao Beti Padhao | Women & Child | Women & Child Development |
| 12 | PM Fasal Bima Yojana | Agriculture | Agriculture & Farmers Welfare |
| 13 | Standup India | SC/ST/OBC | Finance / SIDBI |
| 14 | Digital India | Education | Electronics & IT |
| 15 | National Scholarship Portal | Education | Various |
| 16 | PM Vishwakarma Yojana | Employment | MSME |
| 17 | PM Surya Ghar (Solar Rooftop) | Housing | New & Renewable Energy |
| 18 | Agnipath Scheme (Agniveer) | Employment | Defence |
| 19 | PM Garib Kalyan Anna Yojana | Agriculture | Food & Public Distribution |
| 20 | Ladli Behna Yojana | Women & Child | Madhya Pradesh Government |

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Primary Color | `#FF9933` (Saffron) |
| Secondary Color | `#138808` (India Green) |
| Accent Color | `#000080` (Navy Blue / Ashoka Chakra) |
| Background | `#FFF9F0` (Warm Off-White) |
| Text | `#1a1a2e` (Dark Navy) |
| Heading Font | Poppins (Google Fonts) |
| Body Font | Inter (Google Fonts) |
| Border Radius | 8px / 12px / 20px |
| Design Pattern | Card-based, Mobile-First |

---

## 🏗️ Project Structure

```
BenefitBridge1/
├── index.html                  # Landing/Home page
├── manifest.json               # PWA manifest
├── pages/
│   ├── schemes.html            # Browse all schemes page
│   ├── eligibility.html        # Eligibility checker page
│   ├── tracker.html            # Application tracker page
│   ├── about.html              # About BenefitBridge page
│   └── contact.html            # Contact/Help page
├── css/
│   └── styles.css              # Main stylesheet (4000+ lines)
├── js/
│   ├── app.js                  # Main application logic (utilities, modals, animations)
│   ├── schemes.js              # Schemes data loading and filtering logic
│   ├── eligibility.js          # Eligibility checker multi-step form logic
│   ├── tracker.js              # Application tracker demo logic
│   └── voice-assistant.js      # AI Voice Assistant (Web Speech API)
├── data/
│   └── schemes.json            # Database of 20 government schemes
├── assets/
│   └── icons/                  # PWA icons placeholder
└── README.md                   # This file
```

---

## 🚀 How to Run Locally

### Option 1: Direct Browser (Simplest)
```bash
# Clone the repository
git clone https://github.com/vinay12301339-ctrl/BenefitBridge1.git
cd BenefitBridge1

# Open in browser (some features need HTTP server)
open index.html
```

> ⚠️ Note: The `data/schemes.json` file is loaded via `fetch()`, which requires an HTTP server in most browsers due to CORS policy.

### Option 2: Using Python HTTP Server
```bash
cd BenefitBridge1
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Option 3: Using Node.js
```bash
cd BenefitBridge1
npx serve .
# or
npx http-server .
```

### Option 4: Using VS Code
Install the **Live Server** extension and click "Go Live" at the bottom of VS Code.

---

## 🌐 Browser Support

| Browser | Speech Recognition | Speech Synthesis | Full Support |
|---------|-------------------|------------------|--------------|
| Chrome 25+ | ✅ | ✅ | ✅ Full |
| Edge 79+ | ✅ | ✅ | ✅ Full |
| Safari 14.1+ | ⚠️ Limited | ✅ | ⚠️ Partial |
| Firefox | ❌ | ✅ | ⚠️ No Voice Input |
| Chrome for Android | ✅ | ✅ | ✅ Full |

> The app works perfectly without speech recognition — text input is always available as a fallback.

---

## 📱 Responsive Design

| Breakpoint | Layout |
|-----------|--------|
| Mobile (< 768px) | Single column, hamburger nav, full-width cards |
| Tablet (768px–1024px) | 2-column cards, collapsible nav |
| Desktop (> 1024px) | 3-column cards, full navigation |

---

## ⚡ Technical Highlights

- **Zero Dependencies** — Pure HTML, CSS, and Vanilla JavaScript
- **No Build Tools** — Works by opening index.html in a browser
- **Client-Side Only** — No backend, no database, no server required
- **Privacy First** — No data collection, no cookies, no tracking
- **PWA Ready** — Add to home screen, app-like experience
- **Accessible** — ARIA labels, keyboard navigation, screen reader friendly
- **SEO Friendly** — Proper meta tags, Open Graph, semantic HTML
- **Animations** — IntersectionObserver scroll animations, CSS transitions
- **LocalStorage** — Remembers language preference

---

## 🤖 Voice Assistant Commands

| Query | Response |
|-------|---------|
| "Hello" / "Namaste" | Welcome greeting |
| "What can you do?" | Lists all capabilities |
| "What is BenefitBridge?" | Platform explanation |
| "Am I eligible?" | Guides to eligibility checker |
| "Tell me about PM Kisan" | PM Kisan details + helpline |
| "Tell me about Ayushman Bharat" | PMJAY details + helpline |
| "How to apply for PM Awas?" | Application steps |
| "What documents do I need?" | Common documents list |
| "Go to schemes page" | Navigates to schemes page |
| "Track my application" | Navigates to tracker page |
| "Contact helpline" | Lists all government helplines |

**Keyboard Shortcut:** `Alt + V` to open/activate voice assistant

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/new-scheme`
3. Add scheme data to `data/schemes.json` following the existing schema
4. Test across devices and browsers
5. Submit a Pull Request with a clear description

**Contribution Guidelines:**
- Only add accurate, officially verified scheme information
- Include official website links and helpline numbers
- Test on mobile devices (most users will be on mobile)
- Keep the zero-dependency principle

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Government of India for creating impactful welfare schemes
- Ministry of Electronics & IT for Digital India initiative
- All citizens who work to make government services more accessible
- Open source community for inspiration

---

## ⚠️ Disclaimer

BenefitBridge is an **independent informational platform**. We are not affiliated with the Government of India or any state government. We do not process applications, collect fees, or guarantee benefits. All information is provided for reference only. Always verify at official government portals before applying.

---

<div align="center">
  Made with ❤️ for India | 🇮🇳 Jan Seva — सेवा परमो धर्म
</div>