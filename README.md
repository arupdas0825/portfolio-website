<div align="center">

<img src="public/logo192.png" width="90" height="90" alt="AD Logo" style="border-radius:18px; margin-bottom:16px"/>

<!-- Banner -->
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=8a5cf6&height=200&section=header&text=Arup%20Das&fontSize=70&fontColor=ffffff&fontAlignY=35&desc=AI%2FML%20Developer%20%7C%20React%20Developer%20%7C%20Photographer&descAlignY=58&descSize=18&animation=fadeIn"/>

<h3>
  <img src="https://readme-typing-svg.demolab.com?font=Syne&weight=700&size=20&pause=1200&color=A78BFA&center=true&vCenter=true&width=500&height=40&lines=AI+%2F+ML+Developer;React+Developer;Android+App+Developer;Open+Source+Contributor;Photographer+%26+Videographer" alt="Roles"/>
</h3>

<p>
  <a href="https://arup-portfolio-seven.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/LIVE-arup--portfolio.vercel.app-8a5cf6?style=for-the-badge&logo=vercel&logoColor=white"/>
  </a>
</p>

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white"/>
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black"/>
  <img src="https://img.shields.io/badge/Cloudinary-Free_Storage-3448C5?style=flat-square&logo=cloudinary&logoColor=white"/>
  <img src="https://img.shields.io/badge/Framer_Motion-12.x-FF0080?style=flat-square&logo=framer&logoColor=white"/>
  <img src="https://img.shields.io/badge/Canvas_API-2D+RAF-a855f7?style=flat-square&logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/Three.js-r3f-000000?style=flat-square&logo=threedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/GitHub_REST_API-v3-181717?style=flat-square&logo=github&logoColor=white"/>
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-MIT-a78bfa?style=flat-square"/>
</p>

<p>
  <a href="https://github.com/arupdas0825/portfolio-website">
    <img src="https://img.shields.io/github/stars/arupdas0825/portfolio-website?style=flat-square&color=facc15"/>
  </a>
  <a href="https://github.com/arupdas0825/portfolio-website">
    <img src="https://img.shields.io/github/last-commit/arupdas0825/portfolio-website?style=flat-square&color=4ade80"/>
  </a>
  <img src="https://img.shields.io/badge/PRs-welcome-8a5cf6?style=flat-square"/>
</p>

</div>

---

## 🗺️ Table of Contents
- [Overview](#-overview)
- [What's New in v5.0 — AI Playback, Welcome Screen & More](#-whats-new-in-v50--ai-playback-welcome-screen--more)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Admin CMS](#-admin-cms)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Customization](#-customization)
- [Color System](#-color-system)

---

## 🧠 Overview

A **production-grade personal portfolio** engineered with React 19, powered by Firebase + Cloudinary, and featuring a custom admin CMS. The hero section showcases a **Futuristic Coding Monitor** and **Neural Core Visual** — interactive terminal-style animations that react to device type and session state. Key features include a **Cyberpunk Welcome Screen**, an **AI Playback Assistant** for guided tours, **Internship**, **Publications**, and **Certificates** sections, a **Three.js starfield**, and dedicated sub-routes for projects and galleries. Everything is self-updating via the admin panel — no rebuild required for content changes.

---


## 🆕 What's New in v5.0 — AI Playback, Welcome Screen & More

> **v5.0 introduces significant enhancements to interactivity, narration, and dedicated content navigation.**

| Feature | Description |
|---------|-------------|
| 🤖 **AI Playback Assistant** | Floating AI guide narrating the portfolio section-by-section using the Web Speech API. Features an animated AI Orb, waveform visualizer, section mini-map, and playback controls. |
| 🖥️ **Cyberpunk Welcome Screen** | `ENTROPY-CORE` boot sequence intro with terminal lines, particle canvas, and 3D tilt card. Shown once per session via `sessionStorage`. |
| 🌌 **Three.js Starfield** | `@react-three/fiber` powered 3D star field behind all content. Optimized with low-power GPU mode and disabled on touch devices. |
| 🚀 **Internship Section** | Showcase for industry experience and professional growth, featuring GSAP entrance animations and a premium glassmorphic layout. |
| 📚 **Publications & 📜 Certificates** | Dedicated sections for research papers and credentials, featuring DOI links, PDF downloads, and lightbox previews. |
| 🗂️ **Dedicated Sub-Routes** | Standalone routes for `/work`, `/photography-gallery`, `/publications`, and `/certificates` for direct access and cleaner navigation. |
| 📱 **Mobile Header** | Glassmorphic mobile header with quick access to the AI Playback trigger, active only on touch devices. |

---

## 🏗️ Architecture

The portfolio is built as a highly modular React 19 Single Page Application (SPA). It uses a **Hybrid Data Strategy**:
- **Live Data**: GitHub repositories and statistics are fetched in real-time via the GitHub REST API.
- **Managed Data**: Bio, skills, work metadata, and gallery photos are managed via a custom **Admin CMS** powered by Firebase Firestore and Cloudinary.
- **Static Content**: Core section headers and UI labels are defined as local constants for performance.

The UI is driven by a custom **AI Playback Assistant** that narrates the portfolio using the Web Speech API, with animations handled by **Framer Motion**, **GSAP**, and **Three.js**.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------| 
| **UI** | React 19 | Component architecture |
| **Routing** | React Router v6 | SPA routes (`/`, `/work`, `/photography-gallery`) |
| **Styling** | Tailwind CSS + CSS Variables | Design tokens |
| **Animation** | Framer Motion · Canvas API 2D · RAF · GSAP ScrollTrigger | Infinity loop, orbit, transitions, scroll |
| **3D** | Three.js · @react-three/fiber · @react-three/drei | Desktop starfield background |
| **AI Narration** | Web Speech API · playbackEngine.js | Portfolio guided tour |
| **Icons** | react-icons (fa, si) · lucide-react | All tech logos + UI icons |
| **Fonts** | Syne · DM Sans | Display · Body |
| **Data** | GitHub REST API v3 | Live repos, stats, READMEs |
| **CMS Storage** | Firebase Firestore | Content management |
| **Auth** | Firebase Authentication | Admin email/password login |
| **Images** | Cloudinary (free) | Photo/thumbnail storage |
| **Math** | Lemniscate + arc-length parameterization | Uniform-speed particle animation |
| **Build** | Create React App | Webpack bundler |
| **Hosting** | Vercel | CI/CD via GitHub |

---

## ✨ Features

### 🖥️ Welcome Screen — Cyberpunk Intro *(v5.0 — new)*
- Full-screen `ENTROPY-CORE` boot sequence with 6 typed terminal lines
- **3D tilt card** — `perspective(1200px) rotateX/Y` driven by cursor via Framer Motion springs
- **Particle canvas** — 65 floating purple dots with slow drift
- **Grid + scanlines overlay** for CRT terminal aesthetic
- **Auto-skip** after 4 seconds; manual skip via "ACCESS PORTFOLIO" button
- Shown **once per session** via `sessionStorage` — refreshing re-shows it; navigation does not

### 🤖 AI Playback Assistant *(v5.0 — new)*
- **Floating panel (desktop)** — glassmorphic card with AI Orb, waveform, section mini-map, floating subtitles, and full controls
- **Compact bar (mobile)** — triggered from the mobile header; same controls in a bottom sheet
- **AI Orb** — animated rings + pulse effect; states: idle / playing / paused
- **Waveform Visualizer** — 24 bars with staggered CSS animation while playing
- **Section Mini-Map** — jump to any section; tracks current + completed sections
- **Playback Engine** — contextual narration per section using live Firestore data (name, bio, project count, technologies); Web Speech API voices + speed control
- **Floating Subtitles** — live word-by-word caption overlay while narrating

### 🌌 Three.js Starfield *(v5.0 — new)*
- `@react-three/fiber` Canvas fixed behind all content
- 3 000 stars in a 20-unit cube, slowly rotating on X + Y axes
- `powerPreference: 'low-power'`, DPR capped at `[1, 1.5]`
- **Disabled on touch devices** — zero GPU cost on mobile

### 🚀 Internship Section *(New)*
- **Professional Presence** — Premium glassmorphic card for industry experience.
- **Dynamic Badge** — "OPEN FOR OPPORTUNITIES" status indicator.
- **GSAP Animations** — Smooth entrance triggers using `ScrollTrigger`.
- **Skill Focus** — Highlights core competencies in AI, Full Stack, and System Design.

### 🗂️ Dedicated Routes
- **`/work`** — Full GitHub repo showcase with filter tabs and README modals.
- **`/photography-gallery`** — Cinematic lightbox with keyboard and touch support.
- **`/publications`** — Standalone research paper showcase with direct access.
- **`/certificates`** — Standalone credential gallery with high-fidelity previews.

### 📱 Mobile Header *(v5.0 — new)*
- Fixed glassmorphic header rendered **only on touch devices**
- Logo (`arup.dev`) + AI Playback trigger button
- Displays `PRESENTING` state while AI is active

---

### 🖥️ Home — Futuristic Terminal Hero
- **Futuristic Monitor (Desktop)** — A real-time typing terminal that executes "neural system" commands.
- **Neural Core (Mobile)** — A high-fidelity pulsating AI orb with orbiting rings and data clouds.
- **Typewriter Roles** — Dynamic role cycling with customizable speed and delay.
- **Responsive Adaptive Design** — Seamlessly switches between 3D monitor and 2D neural core based on device capabilities.

#### Reusable Infrastructure
- **`useTypewriter(words)`** — Custom hook for typewriter effects with delete and pause support.
- **`IntersectionObserver`** — Scroll-based entrance animations for all home elements.
- **`IS_TOUCH` Detection** — Accurate pointer-based device sensing for optimal visual performance.

---

### 👤 About — Animated Profile
- **CSS `@property` gradient border** — purple→cyan rotating animation on profile photo
- Double-click photo to open hidden admin panel
- Bio and skills driven from Firebase (editable without code)

### 💼 Work — GitHub-Driven
- All repos auto-fetched from GitHub API (paginated)
- Click any card → README modal with Markdown rendering
- Admin: set each repo as Primary ⭐ or Secondary 📌
- Admin: add custom description, thumbnail, tech tags per repo

### 📊 GitHub Stats
- Real-time: Stars, Forks, Repos, Followers, Contributions
- Language breakdown by actual bytes (parallel fetch)
- Dual-source streak calculation

### 📷 Photography
- 10 cinematic shots with editorial titles + descriptions
- Side-by-side lightbox (image left, description right)
- Keyboard `←` `→` `Esc` navigation
- Managed via admin panel (Cloudinary uploads)
- Full-screen standalone gallery at `/photography-gallery`

### ⚙️ Services — 3D Tilt
- Liquid glass cards with `perspective(900px)` tilt on hover
- Cursor-following glow per card accent color
- Editable from admin panel

---

---

---

## 🔐 Admin CMS

Access: **Double-click your profile photo** → enter password → full CMS opens.
Alternatively, use **Firebase Auth** (`AdminLogin.js`) for email/password sign-in.

| Section | What you can edit |
|---------|------------------|
| 🏠 Home | Name, bio, social links, typewriter roles, orbital stats |
| 👤 About | Profile photo (Cloudinary upload), bio paragraphs, skill tags |
| 💼 Work | Per-repo: Primary/Secondary, description, thumbnail, tags |
| 📷 Gallery | Add/edit/delete photos (Cloudinary upload) |
| ⚙️ Services | All 6 cards — name, description, color, tags |
| 📄 CV | Upload PDF via Cloudinary, edit labels |
| 📬 Contact | Email, location, social links, availability status |

**Security:** No public URL — password-only session (sessionStorage) or Firebase Auth email/password.

---

## 🗂️ Project Structure

```
portfolio-website/
├── public/
│   ├── favicon.ico · logo192.png · logo512.png
│   ├── arup.jpg · CV.pdf
│   ├── photos/ (1.jpg → 10.jpg)
│   └── [project thumbnails & research paper PDFs/images]
│
├── src/
│   ├── App.js                  Router root + WelcomeScreen stage + MobileHeader
│   ├── App.css                 Design system + CSS variables
│   ├── firebase.js             Firestore + Auth config
│   │
│   ├── WelcomeScreen.jsx       🖥️  Cyberpunk boot intro screen
│   │
│   ├── components/             
│   │   └── ThreeBackground.jsx     🌌 Three.js @r3f rotating starfield (desktop)
│   │
│   ├── hooks/                  
│   │   └── useTypewriter.js        Typing animation hook
│   │
│   ├── utils/                  
│   │   └── helpers.js              General utilities
│   │
│   ├── ai-playback/            🤖  AI Playback Assistant
│   │   ├── AIPlaybackAssistant.jsx     Floating UI: orb, waveform, minimap, subtitles
│   │   ├── playbackEngine.js           Narration templates + Web Speech API
│   │   ├── usePlaybackStore.js         Global playback state
│   │   └── AIPlayback.css              Glassmorphic animation styles
│   │
│   ├── Home.js                 Hero section: Terminal / Neural Core
│   ├── About.js                Bio + animated gradient border
│   ├── TechStack.js            Glass panels
│   ├── Work.js                 GitHub fetch + README modal
│   ├── Internship.js           🚀 Industry experience section
│   ├── Publications.js         📚 Research papers section
│   ├── Certificates.js         📜 Credentials section
│   ├── GithubStats.js          Live stats dashboard
│   ├── Gallery.js              Photo grid + lightbox
│   ├── Services.js             3D tilt cards
│   ├── CV.js                   Resume preview
│   ├── Contact.js              Contact form
│   ├── Navbar.js               Scroll-spy floating nav
│   ├── CustomCursor.js         Custom pointer
│   ├── FloatingTechIcons.js    Floating icons (About section)
│   ├── TiltCard.js             Reusable tilt wrapper
│   ├── Starfield.js            CSS-based starfield (legacy/fallback)
│   ├── WorkPage.js             🗂️  /work route — full project showcase (new)
│   └── PhotographyGallery.js   📷 /photography-gallery route (new)
│   │
│   └── admin/
│       ├── AdminPanel.js           Password overlay (3D glass)
│       ├── AdminLogin.js           Firebase Auth email/password login (new)
│       ├── AdminDashboard.js       Sidebar + tab routing
│       ├── AdminStyles.js          Shared UI helpers
│       ├── cloudinary.js           Cloudinary upload utility
│       ├── Firestorehelper.js      Firestore read/write helpers
│       ├── HomeEditor.js
│       ├── AboutEditor.js          + photo upload
│       ├── WorkManager.js          GitHub repos + customize
│       ├── PhotoManager.js         Gallery CRUD
│       ├── ServicesEditor.js
│       ├── CVEditor.js
│       └── ContactEditor.js
│
├── tailwind.config.js
├── .env                        DISABLE_ESLINT_PLUGIN=true · CI=false
└── README.md
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/arupdas0825/portfolio-website.git
cd portfolio-website
npm install
npm start   # → localhost:3000
```

**Environment:**
```env
DISABLE_ESLINT_PLUGIN=true
CI=false
```

**Firebase setup:**
1. Create project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database **and** Authentication (Email/Password provider)
3. Paste your config in `src/firebase.js`
4. Set Firestore rules: `allow read, write: if true;` (for personal use)

**Cloudinary setup:**
1. Free account at [cloudinary.com](https://cloudinary.com)
2. Create unsigned upload preset named `portfolio_unsigned`
3. Set `CLOUD_NAME` in `src/admin/cloudinary.js`

---

## 🌐 Deployment

```bash
git push origin main   # Vercel auto-deploys
```

Vercel env variables:
- `CI=false`
- `DISABLE_ESLINT_PLUGIN=true`

---

## 📝 Customization

```js
// Change admin password (admin/AdminPanel.js)
const ADMIN_PASSWORD = 'YourPassword';

// Change GitHub username (Work.js, WorkPage.js, GithubStats.js)
const GITHUB_USERNAME = 'your-username';

// Add typewriter roles (Home.js)
const ROLES = ['Your Role Here', ...];

// Edit Welcome Screen boot lines (WelcomeScreen.jsx)
const BOOT_LINES = [
  { text: '> YOUR BOOT LINE HERE', delay: 0 },
  // ...
];

// Add AI Playback narration (ai-playback/playbackEngine.js)
// Each section has a getNarration(content) function — edit to personalize

// Add publications (Publications.js → ALL_PUBLICATIONS array)
// Add certificates (Certificates.js → ALL_CERTIFICATES array)
```

---

## 🎨 Color System

```css
/* Core palette */
--purple:       #8a5cf6
--purple-light: #a78bfa
--accent:       #c084fc
--bg:           #0a0812
--bg2:          #0f0c1a

/* Welcome Screen accent */
/* cyan   → #22d3ee  (bracket color, gradient end) */
```

---

## 📜 License

MIT © 2025 [Arup Das](https://github.com/arupdas0825)

---

<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=8a5cf6&height=100&section=footer"/>

**⭐ Star this repo if it helped you!**

[🌐 Live](https://arup-portfolio-seven.vercel.app/) · [🐙 GitHub](https://github.com/arupdas0825) · [💼 LinkedIn](https://linkedin.com/in/arupdas0825)

</div>
