<div align="center">

<img src="public/logo192.png" width="90" height="90" alt="AD Logo" style="border-radius:18px; margin-bottom:16px"/>

<h1>
  <img src="https://readme-typing-svg.herokuapp.com?font=Syne&weight=800&size=32&pause=1000&color=8A5CF6&center=true&vCenter=true&width=500&lines=Arup+Das+%E2%80%94+Portfolio+v2.1;AI%2FML+%C2%B7+React+%C2%B7+Photographer" alt="Typing SVG"/>
</h1>

<p>
  <a href="https://arup-portfolio-seven.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/LIVE-arup--portfolio.vercel.app-8a5cf6?style=for-the-badge&logo=vercel&logoColor=white"/>
  </a>
</p>

<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white"/>
  <img src="https://img.shields.io/badge/Framer_Motion-10.x-FF0080?style=flat-square&logo=framer&logoColor=white"/>
  <img src="https://img.shields.io/badge/GitHub_REST_API-v3-181717?style=flat-square&logo=github&logoColor=white"/>
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-MIT-a78bfa?style=flat-square"/>
</p>

<p>
  <a href="https://github.com/arupdas0825/portfolio-website"><img src="https://img.shields.io/github/stars/arupdas0825/portfolio-website?style=flat-square&color=facc15&logo=github"/></a>
  <a href="https://github.com/arupdas0825/portfolio-website"><img src="https://img.shields.io/github/last-commit/arupdas0825/portfolio-website?style=flat-square&color=4ade80&logo=git&logoColor=white"/></a>
  <img src="https://img.shields.io/badge/PRs-welcome-8a5cf6?style=flat-square"/>
</p>

</div>

---

## 🗺️ Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Color System](#-color-system)
- [Customization Guide](#-customization-guide)
- [License](#-license)

---

## 🧠 Overview

A **production-grade personal portfolio** engineered with React 18, driven by the GitHub REST API, and designed around a unified dark-purple design system. Every section is built to be dynamic — project cards, GitHub stats, language breakdowns, and contribution streaks are all fetched and rendered in real time with no manual data entry.

> Built not just to look good, but to function as a living, self-updating developer profile.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│                                                          │
│  React 18 SPA — Single Page, Smooth Scroll Navigation   │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Home    │  │  About   │  │TechStack │  │  Work  │  │
│  │ Orbital  │  │ Skills   │  │  Glass   │  │  API + │  │
│  │ Widget   │  │ Groups   │  │  Panels  │  │ README │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  GitHub  │  │ Gallery  │  │ Services │  │   CV   │  │
│  │  Stats   │  │Lightbox  │  │  Cards   │  │Preview │  │
│  │  Live    │  │          │  │          │  │        │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
│                                                          │
└──────────────────────────┬──────────────────────────────┘
                           │ fetch()
          ┌────────────────▼─────────────────┐
          │        GitHub REST API v3         │
          │                                   │
          │  /users/{u}          → profile    │
          │  /users/{u}/repos    → projects   │
          │  /repos/{u}/{r}/readme → README   │
          │  /repos/{u}/{r}/languages → bytes │
          │  /users/{u}/events   → streak     │
          └───────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI Framework** | React 18 | Component architecture, hooks |
| **Styling** | Tailwind CSS 3 + CSS Variables | Utility-first + design tokens |
| **Animation** | Framer Motion 10 | Spring physics, page transitions |
| **Icons** | Lucide React | Consistent SVG icon system |
| **Fonts** | Syne · DM Sans · Orbitron | Display · Body · Mono headings |
| **Data** | GitHub REST API v3 | Live repos, stats, READMEs |
| **Build** | Create React App | Zero-config webpack bundler |
| **Hosting** | Vercel | CI/CD via GitHub push |

---

## ✨ Features

### 🏠 Home — Hero
| Feature | Implementation |
|---------|---------------|
| Orbital 3D Widget | Pure CSS `@keyframes` spin + counter-spin rings |
| Typewriter Effect | Custom `useTypewriter` hook — type → pause → delete → cycle |
| `< HELLO WORLD />` | Code-style tag with monospace font |
| Live status badge | Green pulse dot via CSS animation |
| Social links | GitHub · LinkedIn · Instagram |

### 🧩 TechStack — Liquid Glass
- 6 categorised panels: **Frontend · Backend · Database · Tools · Languages · Exploring**
- True glassmorphism: `rgba(255,255,255,0.035)` — no `backdrop-filter`, portfolio background visible through panels
- Per-category colour accent line on panel top edge
- Animated chip hover: spring scale + glow shadow

### 💼 Work — GitHub-Driven
- **All repos auto-fetched** from GitHub API — zero hardcoding
- **README modal** on card click — fetches `application/vnd.github.v3.raw`, renders Markdown in-browser
- Language filter pills with real language bytes percentages
- Fallback static repos when API rate-limited
- Live Demo button rendered only when `homepage` URL is set in repo

### 📊 GitHub Stats — Real-time Dashboard
| Metric | Source |
|--------|--------|
| Stars · Forks · Repos · Followers | `GET /users/{u}` + `/repos` |
| Language breakdown (% by bytes) | `GET /repos/{u}/{r}/languages` — parallel fetch |
| Contributions total | `github-contributions-api.jogruber.de` |
| Current streak · Longest streak | Contributions API + GitHub Events fallback |
| Total commits | `GET /search/commits?q=author:{u}` |
| Profile avatar | `user.avatar_url` |

### 📷 Photography — Cinematic Gallery
- 10 curated shots with titles + editorial descriptions
- Lightbox: **side-by-side** — image left, title + description right
- Keyboard: `←` `→` navigate · `Esc` close
- `useCallback` memoised handlers (ESLint exhaustive-deps compliant)

---

## 🗂️ Project Structure

```
portfolio-website/
│
├── public/
│   ├── favicon.ico            # Custom AD logo (converted from AVIF)
│   ├── logo192.png            # PWA manifest icon
│   ├── logo512.png            # PWA manifest icon (large)
│   ├── arup.jpg               # Profile photo
│   ├── CV.pdf                 # Downloadable résumé
│   └── photos/
│       └── 1.jpg … 10.jpg    # Gallery images
│
├── src/
│   ├── App.js                 # Root — section orchestration, no Router
│   ├── App.css                # Design system — CSS variables, all component styles
│   ├── index.js               # React DOM entry
│   │
│   ├── Navbar.js              # Floating pill nav, scroll-spy active state
│   ├── Home.js                # Hero — orbital widget, typewriter hook
│   ├── About.js               # Bio, skill group cards
│   ├── TechStack.js           # Liquid glass tech panels
│   ├── Work.js                # GitHub repo fetch, README modal, MD renderer
│   ├── GithubStats.js         # Live stats dashboard, language bytes, streaks
│   ├── Gallery.js             # Photo grid, lightbox, keyboard nav
│   ├── Services.js            # Service cards
│   ├── CV.js                  # CV preview + download
│   └── Contact.js             # Contact form + social links
│
├── .env                       # DISABLE_ESLINT_PLUGIN=true
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

```
node  >= 18.x
npm   >= 9.x   (or yarn >= 1.22)
```

### Clone & Run

```bash
# 1. Clone
git clone https://github.com/arupdas0825/portfolio-website.git
cd portfolio-website

# 2. Install dependencies
npm install

# 3. Start dev server
npm start
# → http://localhost:3000
```

### Production Build

```bash
npm run build
# Output: /build (optimised, minified)
```

---

## 🔐 Environment Variables

Create a `.env` file at the project root:

```env
# Prevents ESLint warnings from failing the Vercel CI build
DISABLE_ESLINT_PLUGIN=true

# Set on Vercel to prevent treating warnings as errors
CI=false
```

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Automatic — just push to main
git push origin main
# Vercel picks it up via GitHub integration and deploys automatically
```

**Manual setup:**

| Setting | Value |
|---------|-------|
| Framework | Create React App |
| Build Command | `npm run build` |
| Output Directory | `build` |
| Env Variable | `CI=false` · `DISABLE_ESLINT_PLUGIN=true` |

### Netlify Alternative

```bash
# Build locally, drag-drop /build to Netlify
npm run build
```

---

## 🎨 Color System

```css
/* Design tokens — defined in App.css */
:root {
  --bg:            #0a0812;                  /* Primary background */
  --bg2:           #0f0c1a;                  /* Secondary background */
  --purple:        #8a5cf6;                  /* Primary accent */
  --purple-light:  #a78bfa;                  /* Light accent / headings */
  --purple-dim:    rgba(138, 92, 246, 0.15); /* Subtle fills */
  --accent:        #c084fc;                  /* Hover state */
  --glow:          rgba(138, 92, 246, 0.4);  /* Box-shadow glow */
  --card:          rgba(30, 22, 55, 0.85);   /* Card background */
  --card-border:   rgba(138, 92, 246, 0.25); /* Card borders */
  --text:          #e2d9f3;                  /* Body text */
  --text-muted:    #9d8ec4;                  /* Secondary text */
  --white:         #ffffff;
}
```

---

## 📝 Customization Guide

### Add Typewriter Roles — `src/Home.js`
```js
const ROLES = [
  'AI / ML Developer',
  'Your New Role Here',   // ← append here
];
```

### Add Photography — `src/Gallery.js`
```js
const photos = [
  // existing entries...
  {
    id: 11,
    src: '/photos/11.jpg',
    title: 'Your Shot Title',
    desc: 'Your editorial description...',
  },
];
```

### Change GitHub Username — `src/Work.js` + `src/GithubStats.js`
```js
const GITHUB_USERNAME = 'your-github-username'; // one line change
```

### Add TechStack Item — `src/TechStack.js`
```js
// Find the relevant category and append:
{ name: 'New Tool', icon: '🔧' }
```

### Add Service Card — `src/Services.js`
```js
const services = [
  // existing...
  {
    name: 'New Service',
    desc: 'Description here.',
    tags: ['Tag1', 'Tag2'],
    icon: <svg>...</svg>,
  },
];
```

---

## 📜 License

```
MIT License — Copyright (c) 2025 Arup Das

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software.
```

---

<div align="center">

```
╔═══════════════════════════════════════╗
║   Built by Arup Das                   ║
║   B.Tech CSE (AIML)                   ║
║   Brainware University · Kolkata      ║
╚═══════════════════════════════════════╝
```

<p>
  <a href="https://arup-portfolio-seven.vercel.app/">🌐 Live Portfolio</a> ·
  <a href="https://github.com/arupdas0825">🐙 GitHub</a> ·
  <a href="https://linkedin.com/in/arupdas0825">💼 LinkedIn</a>
</p>

**If this project helped you, consider giving it a ⭐**

</div>
