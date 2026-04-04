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
- [What's New in v4.0 — Cosmic Infinity Vortex](#-whats-new-in-v40--cosmic-infinity-vortex)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Infinity Vortex — Technical Deep Dive](#-infinity-vortex--technical-deep-dive)
- [Admin CMS](#-admin-cms)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Customization](#-customization)
- [Color System](#-color-system)

---

## 🧠 Overview

A **production-grade personal portfolio** engineered with React 19, powered by Firebase Firestore + Cloudinary, driven by the GitHub REST API, and featuring a hidden admin CMS. The hero section now showcases a **futuristic Awwwards-level Infinity Vortex** — a mathematically precise glowing lemniscate loop with 220 animated energy particles and 12 orbiting technology logos. Everything is live and self-updating — no rebuild needed to change content.

---

## 🆕 What's New in v4.0 — Cosmic Infinity Vortex

> **The biggest visual upgrade to date.** The hero animation has been completely redesigned from a blackhole canvas to a premium, Awwwards-quality interactive Infinity Vortex system.

| Feature | Description |
|---------|-------------|
| ♾️ **Lemniscate Infinity Loop** | Mathematically precise Lemniscate of Bernoulli curve — zero approximation, GPU-accelerated on a single Canvas 2D context |
| 🌟 **5-Layer Neon Glow** | Bloom → mid-glow → inner-glow → core line → supercore — blue, cyan, violet, white cascade effect |
| ⚡ **220 Energy Particles** | Arc-length parameterized flow — particles move at perfectly uniform speed with individual hue drift, trailing glow, and pulsating size |
| 💎 **Center Jewel** | Radial gradient convergence burst at the infinity crossover, with breathing pulse animation (sinusoidal amplitude) |
| 🪐 **12-Logo Circular Orbit** | Equal-angle distributed orbit using parametric circular positioning — React, Python, JS, HTML5, CSS3, Node.js, TypeScript, Firebase, AWS, Git, MongoDB, Java |
| 🔮 **Glassmorphic Logo Badges** | Each logo in a circular glassmorphism container — brand-coloured border, inner sheen, depth-based sizing and blur |
| 🌊 **Per-Logo Float Animation** | Independent sine-wave vertical float per logo (random amplitude + frequency phase) |
| 🎯 **3D Tilt on Hover** | `perspective(800px) rotateX/Y` driven by cursor position delta — real specular response |
| 🧲 **Magnetic Cursor Pull** | Logos within 110px of cursor are attracted with smooth force falloff |
| 🐌 **Orbit Slowdown on Hover** | Speed lerps from 0.30 → 0.03 rad/s on hover, smoothly resumes on leave |
| 🌌 **Galaxy Starfield Background** | 3-layer parallax canvas — far/mid/near stars with twinkle, mouse parallax, nebula halos |
| 📐 **Depth Sorting** | Logos sorted and rendered by sine-depth so back-orbit logos naturally appear behind front-orbit logos |
| 🏷️ **Smart Tooltip** | On hover: minimal floating label with fadeUpIn animation, brand-colored border |
| 📱 **Fully Responsive** | ResizeObserver-driven — orbit radius, icon sizes, canvas all recalculate on container resize |
| ⚡ **60 FPS Guaranteed** | All animation on RAF, `will-change: transform`, single canvas context, zero layout thrashing |

---

## 🏗️ Architecture

```
React 19 SPA — Single Page, Smooth Scroll
│
├─ ♾️  Home          Infinity Vortex hero · Typewriter roles
│       ├─ InfinityVortex.js        Master orchestrator
│       ├─ components/
│       │   ├─ InfinityLoop.jsx     Canvas lemniscate + 220 particles
│       │   ├─ OrbitingLogos.jsx    12-logo circular orbit (RAF)
│       │   ├─ LogoItem.jsx         Glassmorphic badge + 3D tilt
│       │   └─ ParticleBackground.jsx  3-layer galaxy canvas
│       ├─ hooks/
│       │   ├─ useAnimationFrame.js Clean RAF loop with delta-time
│       │   └─ useMousePosition.js  Normalized cursor tracking
│       └─ utils/
│           └─ mathHelpers.js       Lemniscate, orbit math, lerp, clamp
│
├─ 👤 About         Animated gradient border photo · Skills · CMS-driven bio
├─ 🧩 TechStack     Liquid glass panels · Animated chip hover
├─ 💼 Work          GitHub API auto-fetch · README modal · Primary/Secondary
├─ 📊 GithubStats   Live stats · Language bytes · Streak · CountUp
├─ 📷 Photography   Cinematic grid · Side-by-side lightbox · Keyboard nav
├─ ⚙️  Services      3D tilt cards · Liquid glass · Cursor glow
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
| **UI** | React 19 | Component architecture |
| **Styling** | Tailwind CSS + CSS Variables | Design tokens |
| **Animation** | Framer Motion · Canvas API 2D · RAF | Infinity loop, orbit, transitions |
| **Icons** | react-icons (fa, si) | All tech logos — zero CDN dependency |
| **Fonts** | Syne · DM Sans | Display · Body |
| **Data** | GitHub REST API v3 | Live repos, stats, READMEs |
| **CMS Storage** | Firebase Firestore | Content management |
| **Images** | Cloudinary (free) | Photo/thumbnail storage |
| **Math** | Lemniscate + arc-length parameterization | Uniform-speed particle animation |
| **Build** | Create React App | Webpack bundler |
| **Hosting** | Vercel | CI/CD via GitHub |

---

## ✨ Features

### ♾️ Home — Cosmic Infinity Vortex *(v4.0 — new)*

#### Infinity Loop Canvas (`InfinityLoop.jsx`)
- **Lemniscate of Bernoulli** curve `x(t) = a·cos(t)/(1+sin²t)` — exact parametric formula
- **5-layer render stack**: outer bloom (36px) → mid bloom (20px) → inner glow (9px) → core (3.5px) → supercore (1px)
- **Animated gradient colour**: blue `hsl(220)` → purple `hsl(270)` → white → cyan cycling along the path
- **Breathing pulse**: sinusoidal `Math.sin(frame × 0.018)` modulates lineWidth and alpha each frame
- **Center jewel**: dual radial gradient — soft outer diffuse halo + hard inner gem with continuous bloom
- **220 energy particles**: arc-length lookup table (800 samples, binary search O(log n)) ensures perfectly uniform speed regardless of curve geometry
- Each particle: independent hue drift, pulsating size, trailing glow, coloured radial head

#### Orbiting Logos (`OrbitingLogos.jsx` + `LogoItem.jsx`)
- **12 tech logos** equally spaced: `angle = (i/n) × 2π`
- **Elliptical orbit** (`rx = 44%`, `ry = 38%` of container) creates natural 3D depth perspective
- **Depth sorting** by `sin(angle)` — logos in back render under front-orbit logos
- **Orbit speed**: 0.30 rad/s normal → lerps to 0.03 rad/s on any hover
- **Per-logo float**: independent `sin(t × speed) × amplitude` vertical offset (random phase seeded at mount)
- **3D tilt**: `perspective(800px) rotateX(−relY×28°) rotateY(relX×28°)` on `mousemove`
- **Magnetic pull**: logos within 110px attracted toward cursor with `(1 − d/r) × 14px` force
- **Glassmorphism**: `backdrop-filter: blur(14px)`, inner sheen overlay, brand-colored border + glow
- **Depth perception**: back logos smaller (0.65×), blurred, faded; front logos full-size, crisp, bright

#### Galaxy Background (`ParticleBackground.jsx`)
- **3 depth layers**: far (55% of stars, 2px parallax) → mid (30%, 8px) → near (15%, 18px)
- **Mouse parallax**: star positions offset by `mouseNX × layer.px` for immersive depth
- **Nebula halos**: 3 radial-gradient blobs at fixed viewport positions — deep violet, ocean blue, purple
- **Twinkling**: per-star `alpha ± twinkleSpeed × direction` each frame, clipped to `[0.05, 0.95]`
- **Near stars** get `shadowBlur` soft glow; far stars render bare for performance

#### Reusable Infrastructure
- **`useAnimationFrame(callback, active)`** — clean RAF loop with delta-time capping at 100ms, ref-stable callback
- **`useMousePosition(targetRef)`** — returns `{x, y, nx, ny}` (raw + normalized `[−1, 1]`)
- **`mathHelpers.js`** — `lemniscate()`, `buildLemniscateTable()`, `posAtArcLength()`, `orbitPosition()`, `lerp()`, `clamp()`, `mapRange()`, `dist2D()`, `easeInOutQuart()`

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

### ⚙️ Services — 3D Tilt
- Liquid glass cards with `perspective(900px)` tilt on hover
- Cursor-following glow per card accent color
- Editable from admin panel

---

## ♾️ Infinity Vortex — Technical Deep Dive

### Lemniscate of Bernoulli

The infinity loop uses the exact **Lemniscate of Bernoulli** parametric equations:

```
x(t) = a · cos(t) / (1 + sin²(t))
y(t) = a · sin(t) · cos(t) / (1 + sin²(t))
```

Where `a = size × 0.36` (half-width of the loop), `t ∈ [0, 2π]`.

### Arc-Length Parameterization

Naive parametric traversal creates non-uniform speed (particles bunch at high-curvature regions). The fix:

```js
// 1. Pre-sample 800 points, accumulate arc length
buildLemniscateTable(a, 800) → { pts[], totalLen }

// 2. Binary search for position at normalized arc-length u ∈ [0,1]
posAtArcLength(table, u) → { x, y }  // O(log 800) per particle per frame

// 3. Particles advance: p.u += p.speed  (uniform real distance)
```

This ensures all 220 particles travel at perceptually equal speed regardless of curve geometry.

### Depth Perception System

```
Orbit angle α → depth = (sin(α) + 1) / 2  →  [0 = farthest, 1 = closest]
scale   = 0.65 + depth × 0.50     // 0.65× back → 1.15× front
blur    = (1 − depth) × 1.5       // sharp front, blurry back
opacity = 0.55 + depth × 0.45     // dim back, bright front
zIndex  = depth * 40              // correct overlap order
```

Logos are additionally sorted by depth before rendering so back-orbit items are always under front-orbit items in the DOM.

### Magnetic Pull Formula

```js
const d = dist2D(logoX, logoY, mouseX, mouseY);
if (d < 110) {
  const strength = clamp(1 − d/110, 0, 1) × 14;  // linear falloff
  magnetX = (dx/len) × strength;
  magnetY = (dy/len) × strength;
}
```

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
│   ├── App.js                  Single-page root
│   ├── App.css                 Design system + CSS variables
│   ├── firebase.js             Firestore config (no Auth needed)
│   │
│   ├── InfinityVortex.js       ♾️  Master orchestrator (hero animation)
│   │
│   ├── components/             ♾️  Infinity Vortex sub-components
│   │   ├── InfinityLoop.jsx        Canvas: lemniscate + 220 particles
│   │   ├── OrbitingLogos.jsx       12-logo circular orbit management
│   │   ├── LogoItem.jsx            Glassmorphic logo + 3D tilt + float
│   │   └── ParticleBackground.jsx  3-layer galaxy starfield canvas
│   │
│   ├── hooks/                  ♾️  Animation hooks
│   │   ├── useAnimationFrame.js    RAF loop with delta-time
│   │   └── useMousePosition.js     Normalized cursor position
│   │
│   ├── utils/                  ♾️  Math & animation utilities
│   │   └── mathHelpers.js          Lemniscate, orbit, lerp, clamp...
│   │
│   ├── Home.js                 Hero section (uses InfinityVortex)
│   ├── About.js                Bio + animated gradient border
│   ├── TechStack.js            Glass panels
│   ├── Work.js                 GitHub fetch + README modal
│   ├── GithubStats.js          Live stats dashboard
│   ├── Gallery.js              Photo grid + lightbox
│   ├── Services.js             3D tilt cards
│   ├── CV.js                   Resume preview
│   ├── Contact.js              Contact form
│   ├── Navbar.js               Scroll-spy floating nav
│   ├── CustomCursor.js         Custom pointer
│   ├── FloatingTechIcons.js    Floating icons (About section)
│   ├── TiltCard.js             Reusable tilt wrapper
│   │
│   └── admin/
│       ├── AdminPanel.js           Password overlay (3D glass)
│       ├── AdminDashboard.js       Sidebar + tab routing
│       ├── adminStyles.js          Shared UI helpers
│       ├── cloudinary.js           Cloudinary upload utility
│       ├── HomeEditor.js
│       ├── AboutEditor.js          + photo upload
│       ├── WorkManager.js          GitHub repos + customize
│       ├── PhotoManager.js         Gallery CRUD
│       ├── ServicesEditor.js
│       ├── CVEditor.js
│       └── ContactEditor.js
│
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
// Change admin password (admin/AdminPanel.js)
const ADMIN_PASSWORD = 'YourPassword';

// Change GitHub username (Work.js, GithubStats.js)
const GITHUB_USERNAME = 'your-username';

// Add/remove orbiting tech logos (src/components/OrbitingLogos.jsx)
const TECHS = [
  { Icon: FaReact, label: 'React', color: '#61DAFB' },
  // add more react-icons entries here...
];

// Change orbit speed (OrbitingLogos.jsx)
const ORBIT_SPEED_NORMAL = 0.30;   // rad/s — increase to spin faster

// Change infinity loop size (InfinityVortex.js → InfinityLoop.jsx)
const A = size * 0.36;             // increase for larger loop

// Add typewriter roles (Home.js)
const ROLES = ['Your Role Here', ...];
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

/* Infinity Vortex glow colors */
/* blue   → hsl(220) */
/* cyan   → hsl(190) */
/* violet → hsl(270) */
/* white  → rgb(255,255,255) core */
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
