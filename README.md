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
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white"/>
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black"/>
  <img src="https://img.shields.io/badge/Cloudinary-Free_Storage-3448C5?style=flat-square&logo=cloudinary&logoColor=white"/>
  <img src="https://img.shields.io/badge/Framer_Motion-10.x-FF0080?style=flat-square&logo=framer&logoColor=white"/>
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
- [What's New in v3.0](#-whats-new-in-v30)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Admin CMS](#-admin-cms)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Customization](#-customization)

---

## 🧠 Overview

A **production-grade personal portfolio** engineered with React 18, powered by Firebase Firestore + Cloudinary, driven by the GitHub REST API, and featuring a hidden admin CMS accessible only via a secret gesture. Everything is live and self-updating — no rebuild needed to change content.

---

## 🆕 What's New in v3.0

| Feature | Description |
|---------|-------------|
| 🌑 **Blackhole Animation** | Canvas-based realistic blackhole with physics — accretion disk, event horizon, photon ring. 12 tech icons orbit and get sucked in, then re-emerge |
| 🔐 **Hidden Admin Panel** | Double-click on profile photo → password-protected CMS panel opens as 3D glass overlay |
| 📸 **Full CMS** | Edit every section from browser — Home, About (with photo upload), Work, Gallery, Services, CV, Contact |
| 🖼️ **Cloudinary Storage** | Free image hosting (25GB) for profile photo, project thumbnails, gallery photos |
| 💼 **GitHub-driven Work** | Work section pulls all repos from API; customize description, type, thumbnail per repo |
| 🌈 **Gradient Photo Border** | Animated purple→cyan gradient border on profile photo using CSS `@property` |

---

## 🏗️ Architecture

```
React 18 SPA — Single Page, Smooth Scroll
│
├─ 🌑 Home          Blackhole canvas animation · Typewriter roles
├─ 👤 About         Animated gradient border photo · Skills · CMS-driven bio
├─ 🧩 TechStack     Liquid glass panels · Animated chip hover
├─ 💼 Work          GitHub API auto-fetch · README modal · Primary/Secondary
├─ 📊 GithubStats   Live stats · Language bytes · Streak · CountUp
├─ 📷 Photography   Cinematic grid · Side-by-side lightbox · Keyboard nav
├─ ⚙️ Services      3D tilt cards · Liquid glass · Cursor glow
├─ 📄 CV            Preview card · Upload via Cloudinary
└─ 📬 Contact       Form · Social links · Firebase-stored
         │
         ├─ GitHub REST API v3 → repos, README, languages, stats
         ├─ Firebase Firestore → CMS content storage
         ├─ Cloudinary → Image uploads (free 25GB)
         └─ Admin Panel → Double-click photo → password → edit anything
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI** | React 18 | Component architecture |
| **Styling** | Tailwind CSS + CSS Variables | Design tokens |
| **Animation** | Framer Motion · Canvas API | Physics, transitions |
| **Icons** | Lucide React | SVG icon system |
| **Fonts** | Syne · DM Sans · Orbitron | Display · Body · Headings |
| **Data** | GitHub REST API v3 | Live repos, stats, READMEs |
| **CMS Storage** | Firebase Firestore | Content management |
| **Images** | Cloudinary (free) | Photo/thumbnail storage |
| **Build** | Create React App | Webpack bundler |
| **Hosting** | Vercel | CI/CD via GitHub |

---

## ✨ Features

### 🌑 Home — Blackhole Hero
- **Realistic blackhole** — accretion disk, event horizon glow, photon ring, swirl arms
- 12 tech badges orbit in elliptical paths, get gravitationally pulled in, re-emerge
- Canvas 2D with requestAnimationFrame physics simulation
- Typewriter cycling through 8 roles

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

### ⚙️ Services — 3D Tilt
- Liquid glass cards with `perspective(900px)` tilt on hover
- Cursor-following glow per card accent color
- Editable from admin panel

---

## 🔐 Admin CMS

Access: **Double-click your profile photo** → enter password → full CMS opens

| Section | What you can edit |
|---------|------------------|
| 🏠 Home | Name, bio, social links, typewriter roles, orbital stats |
| 👤 About | Profile photo (Cloudinary upload), bio paragraphs, skill tags |
| 💼 Work | Per-repo: Primary/Secondary, description, thumbnail, tags |
| 📷 Gallery | Add/edit/delete photos (Cloudinary upload) |
| ⚙️ Services | All 6 cards — name, description, color, tags |
| 📄 CV | Upload PDF via Cloudinary, edit labels |
| 📬 Contact | Email, location, social links, availability status |

**Security:** No public URL, no email login — password-only, session-based.

---

## 🗂️ Project Structure

```
portfolio-website/
├── public/
│   ├── favicon.ico · logo192.png · logo512.png
│   ├── arup.jpg · CV.pdf
│   └── photos/ (1.jpg → 10.jpg)
│
├── src/
│   ├── App.js              Single-page root
│   ├── App.css             Design system + CSS variables
│   ├── firebase.js         Firestore config (no Auth needed)
│   │
│   ├── BlackholeVortex.js  Canvas blackhole physics
│   ├── Home.js             Hero section
│   ├── About.js            Bio + animated gradient border
│   ├── TechStack.js        Glass panels
│   ├── Work.js             GitHub fetch + README modal
│   ├── GithubStats.js      Live stats dashboard
│   ├── Gallery.js          Photo grid + lightbox
│   ├── Services.js         3D tilt cards
│   ├── CV.js               Resume preview
│   ├── Contact.js          Contact form
│   ├── Navbar.js           Scroll-spy floating nav
│   │
│   └── admin/
│       ├── AdminPanel.js       Password overlay (3D glass)
│       ├── AdminDashboard.js   Sidebar + tab routing
│       ├── adminStyles.js      Shared UI helpers
│       ├── cloudinary.js       Cloudinary upload utility
│       ├── HomeEditor.js
│       ├── AboutEditor.js      + photo upload
│       ├── WorkManager.js      GitHub repos + customize
│       ├── PhotoManager.js     Gallery CRUD
│       ├── ServicesEditor.js
│       ├── CVEditor.js
│       └── ContactEditor.js
│
├── .env                    DISABLE_ESLINT_PLUGIN=true · CI=false
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
2. Enable Firestore Database
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
// Change admin password (AdminPanel.js)
const ADMIN_PASSWORD = 'YourPassword';

// Change GitHub username (Work.js, GithubStats.js)
const GITHUB_USERNAME = 'your-username';

// Add typewriter roles (Home.js)
const ROLES = ['Your Role Here', ...];
```

---

## 🎨 Color System

```css
--purple:       #8a5cf6
--purple-light: #a78bfa
--accent:       #c084fc
--bg:           #0a0812
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
