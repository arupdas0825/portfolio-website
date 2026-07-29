/**
 * playbackEngine.js — AI Portfolio Playback Engine
 * 
 * Dynamically analyzes portfolio sections, generates contextual narration,
 * and manages speech synthesis, scrolling, and section highlighting.
 */

// ── Section definitions with intelligent narration templates ──────────────
const SECTION_CONFIG = [
  {
    id: 'home',
    label: 'Introduction',
    icon: '🏠',
    priority: 1,
    getNarration: (content) => {
      return `Welcome to Arup Das's portfolio — a digital experience designed to showcase the intersection of engineering excellence and creative vision. ${content.name || 'Arup'} is a B.Tech Computer Science student specializing in Artificial Intelligence and Machine Learning at Brainware University, Kolkata. What you're about to see is not just a portfolio — it's a statement. A statement about what happens when you combine modern frontend engineering, deep AI knowledge, and a photographer's eye for detail. Let's take a closer look.`;
    },
  },
  {
    id: 'about',
    label: 'About Me',
    icon: '👤',
    priority: 2,
    getNarration: (content) => {
      const bio = content.bio || '';
      if (bio.includes('Artificial Intelligence')) {
        return `Here we discover who Arup really is. A detail-oriented engineer with a passion for bridging the gap between robust software architecture and intelligent system design. With a strong foundation in Python, Java, C, C++, and database integrations, Arup focuses on building scalable applications that solve real problems. But here's what makes him unique — he complements his technical toolkit with a creative background in professional photography and video editing. That rare combination of analytical thinking and visual storytelling is what sets his work apart from the crowd.`;
      }
      return `Let's get to know the person behind the code. Arup Das is not your typical developer. He combines deep technical expertise with an artistic sensibility that's evident in every project he builds. His approach to problem-solving blends engineering rigor with creative thinking — a combination that's becoming increasingly valuable in the tech industry.`;
    },
  },
  {
    id: 'techstack',
    label: 'Tech Stack',
    icon: '⚡',
    priority: 3,
    getNarration: (content) => {
      const techs = content.technologies || [];
      const techList = techs.length > 0 ? techs.join(', ') : 'Python, JavaScript, TypeScript, Java, React, Next.js, Node.js, MongoDB, AWS, and Google Cloud';
      return `Now let's look at the technical arsenal. This is where it gets impressive. Arup works across the entire modern tech stack — from ${techList}. Notice the breadth here: languages like Python and Java for backend and AI work, React and Next.js for cutting-edge frontend development, plus cloud platforms like AWS and Google Cloud for deployment at scale. He also works with data science libraries including Pandas, NumPy, Matplotlib, and Scikit-Learn — essential tools for anyone serious about AI and machine learning. This isn't just a list of technologies — it's a carefully curated toolkit built for shipping production-grade software.`;
    },
  },
  {
    id: 'work',
    label: 'Projects',
    icon: '💼',
    priority: 4,
    getNarration: (content) => {
      const projectCount = content.projectCount || 'multiple';
      const projects = content.projects || [];
      let projectHighlights = '';
      if (projects.length > 0) {
        const top = projects.slice(0, 3);
        projectHighlights = top.map(p => `${p.name}${p.description ? ' — ' + p.description.slice(0, 60) : ''}`).join('; ');
        projectHighlights = ` Some highlights include: ${projectHighlights}.`;
      }
      return `This is the Projects section — and it's pulled live from the GitHub API. Arup has built ${projectCount} open-source projects spanning web applications, mobile apps, AI tools, and algorithm visualizers.${projectHighlights} What's remarkable here is the diversity of the work. From a sentiment analysis tool powered by machine learning, to a scientific calculator, to full-stack fintech platforms — each project demonstrates not just coding ability, but product thinking. The ability to take an idea from concept to deployment. Every card here is clickable — you can read the full README documentation for any project.`;
    },
  },
  {
    id: 'publications',
    label: 'Publications',
    icon: '📄',
    priority: 5,
    getNarration: (content) => {
      const pubs = content.publications || [];
      let pubDetails = '';
      if (pubs.length > 0) {
        pubDetails = pubs.map(p => `"${p.title}"`).join(' and ');
        pubDetails = ` His published works include ${pubDetails}.`;
      }
      return `Moving into academia — Arup has authored peer-reviewed research publications.${pubDetails} This demonstrates a rare quality in a student developer: the ability to not just build software, but to contribute original ideas to the field. Research papers require rigorous methodology, clear communication, and deep domain expertise — skills that translate directly into building better products. The fact that he's publishing in areas like AI code translation and fintech systems shows he's working at the intersection of multiple disciplines.`;
    },
  },
  {
    id: 'certificates',
    label: 'Certifications',
    icon: '🏅',
    priority: 6,
    getNarration: (content) => {
      return `Professional certifications add another dimension to Arup's profile. These credentials validate his commitment to continuous learning and staying current with rapidly evolving technologies. From generative AI and prompt engineering to tech community participation — each certification represents dedicated effort to deepen expertise. This is someone who doesn't just learn by doing — he validates his knowledge through recognized industry channels.`;
    },
  },
  {
    id: 'githubstats',
    label: 'GitHub Activity',
    icon: '📊',
    priority: 7,
    getNarration: (content) => {
      const stats = content.stats || {};
      return `Let's look at the numbers. These GitHub statistics are pulled in real-time from the API, giving you an authentic picture of Arup's development activity. ${stats.repos ? `With ${stats.repos} repositories` : 'With multiple repositories'}, ${stats.contributions ? `${stats.contributions} total contributions` : 'consistent contributions'}, and ${stats.streak ? `a ${stats.streak}-day streak` : 'an impressive streak'} — this is clearly someone who codes consistently. The language breakdown shows JavaScript as the dominant language, reflecting his focus on modern web development, with Python for AI and ML work. The contribution heatmap tells the real story — consistent, daily commitment to writing code and shipping projects.`;
    },
  },
  {
    id: 'gallery',
    label: 'Photography',
    icon: '📸',
    priority: 8,
    getNarration: (content) => {
      return `And now for something completely different — Arup's cinematic photography. This is where the creative side truly shines. Each photograph here tells a story — from the golden haze of a morning commute in Kolkata, to the iconic Hooghly River sunset, to intimate macro captures that reveal hidden beauty in everyday moments. This isn't casual hobby photography — it's intentional visual storytelling. And here's the connection: the same eye for composition, color theory, and emotional impact that goes into these photographs is exactly what makes his UI designs feel polished and premium. Photography and frontend development share more DNA than most people realize.`;
    },
  },
  {
    id: 'services',
    label: 'Services',
    icon: '🛠️',
    priority: 9,
    getNarration: (content) => {
      return `Here's what Arup brings to the table as a professional. Web Development with React and Tailwind, AI and Machine Learning solutions using cutting-edge models, Mobile App Development with Kotlin and local databases, Creative Direction combining photography with UI/UX design, Data Analysis with Python's scientific stack, and robust Backend Systems architecture. What makes this service offering unique is the combination — most developers specialize in one or two areas. Arup offers a full spectrum from creative design to backend infrastructure, making him a versatile asset for any team or project.`;
    },
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: '📬',
    priority: 10,
    getNarration: (content) => {
      return `We've reached the end of our journey through Arup's portfolio. If what you've seen resonates — whether it's the technical depth, the creative vision, or the consistent execution — the next step is simple: reach out. Arup is available for internships, collaborations, freelance projects, and full-time opportunities. Based in Kolkata, India, but working globally through the power of the internet. Thank you for taking this AI-guided tour. This portfolio is a living, breathing digital presence — constantly evolving, always pushing boundaries. Until next time.`;
    },
  },
];

// ── Content Analyzer: reads live DOM content ──────────────────────────────
function analyzeSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return {};

  const content = {};

  switch (sectionId) {
    case 'home': {
      const name = el.querySelector('.hero-name');
      content.name = name ? name.textContent.replace("Hi, I'm ", '') : 'Arup Das';
      const desc = el.querySelector('.hero-desc');
      content.description = desc ? desc.textContent : '';
      break;
    }
    case 'about': {
      const bio = el.querySelector('.section-sub.about-sub, .about-sub');
      content.bio = bio ? bio.textContent : '';
      break;
    }
    case 'techstack': {
      const icons = el.querySelectorAll('.tech-icon-box img, .tech-tooltip');
      content.technologies = Array.from(icons)
        .map(i => i.title || i.alt || i.textContent)
        .filter(Boolean)
        .slice(0, 15);
      break;
    }
    case 'work': {
      const cards = el.querySelectorAll('.project-card');
      content.projectCount = cards.length;
      content.projects = Array.from(cards).slice(0, 5).map(card => ({
        name: card.querySelector('.project-name')?.textContent || '',
        description: card.querySelector('.project-desc')?.textContent || '',
        language: card.querySelector('.project-tag')?.textContent?.trim() || '',
      }));
      break;
    }
    case 'publications': {
      const pubCards = el.querySelectorAll('.pub-card-v2');
      content.publications = Array.from(pubCards).map(card => ({
        title: card.querySelector('.pub-title-v2')?.textContent || '',
        journal: card.querySelector('.pub-journal')?.textContent || '',
      }));
      break;
    }
    case 'certificates': {
      const certCards = el.querySelectorAll('.cert-card');
      content.certCount = certCards.length;
      content.certificates = Array.from(certCards).map(card => ({
        title: card.querySelector('.cert-title')?.textContent || '',
        issuer: card.querySelector('.cert-issuer')?.textContent || '',
      }));
      break;
    }
    case 'githubstats': {
      content.stats = {};
      // Try to read rendered numbers
      const statPanels = el.querySelectorAll('[style*="text-align:center"], [style*="textAlign"]');
      break;
    }
    case 'gallery': {
      const photos = el.querySelectorAll('.gallery-item');
      content.photoCount = photos.length;
      break;
    }
    case 'services': {
      const svcCards = el.querySelectorAll('.svc-card');
      content.services = Array.from(svcCards).map(card => ({
        name: card.querySelector('.svc-name')?.textContent || '',
      }));
      break;
    }
    case 'contact': {
      break;
    }
    default:
      break;
  }

  return content;
}

// ── Speech Engine ──────────────────────────────────────────────────────────
class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
    this.voices = [];
    this.selectedVoice = null;
    this.rate = 1.0;
    this.onBoundary = null;
    this.onEnd = null;
    this.onStart = null;
    this._loadVoices();
  }

  _loadVoices() {
    if (!this.synth) return;
    const load = () => {
      this.voices = this.synth?.getVoices?.() || [];
      // Prefer high-quality English voices
      const preferred = [
        'Google UK English Female',
        'Google UK English Male', 
        'Microsoft Zira',
        'Microsoft David',
        'Samantha',
        'Daniel',
        'Karen',
        'Moira',
      ];
      for (const name of preferred) {
        const v = this.voices.find(v => v.name?.includes(name));
        if (v) { this.selectedVoice = v; break; }
      }
      if (!this.selectedVoice && this.voices.length > 0) {
        // Fallback: first English voice
        this.selectedVoice = this.voices.find(v => v.lang?.startsWith('en')) || this.voices[0];
      }
    };
    load();
    if (this.voices.length === 0 && this.synth?.addEventListener) {
      this.synth.addEventListener('voiceschanged', load);
    }
  }

  getVoices() {
    return this.voices.filter(v => v.lang.startsWith('en'));
  }

  setVoice(voiceName) {
    const v = this.voices.find(v => v.name === voiceName);
    if (v) this.selectedVoice = v;
  }

  setRate(rate) {
    this.rate = Math.max(0.5, Math.min(2.0, rate));
  }

  speak(text) {
    return new Promise((resolve) => {
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = this.selectedVoice;
      utterance.rate = this.rate;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        if (this.onStart) this.onStart();
      };

      utterance.onboundary = (e) => {
        if (this.onBoundary) this.onBoundary(e, text);
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        if (this.onEnd) this.onEnd();
        resolve();
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('Speech error:', e.error);
        }
        this.currentUtterance = null;
        resolve();
      };

      this.currentUtterance = utterance;
      if (this.synth) {
        this.synth.speak(utterance);
      } else {
        resolve();
      }
    });
  }

  pause() {
    this.synth?.pause?.();
  }

  resume() {
    this.synth?.resume?.();
  }

  stop() {
    this.synth?.cancel?.();
    this.currentUtterance = null;
  }

  get isSpeaking() {
    return Boolean(this.synth?.speaking);
  }

  get isPaused() {
    return Boolean(this.synth?.paused);
  }
}

// ── Scroll Controller ────────────────────────────────────────────────────
function smoothScrollToSection(sectionId, offset = 80) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({
    top,
    behavior: 'smooth',
  });
}

// ── Highlight Controller ─────────────────────────────────────────────────
function highlightSection(sectionId) {
  // Remove existing highlights
  document.querySelectorAll('.ai-playback-highlight').forEach(el => {
    el.classList.remove('ai-playback-highlight');
  });

  const el = document.getElementById(sectionId);
  if (el) {
    el.classList.add('ai-playback-highlight');
  }
}

function clearHighlights() {
  document.querySelectorAll('.ai-playback-highlight').forEach(el => {
    el.classList.remove('ai-playback-highlight');
  });
}

// ── Exports ──────────────────────────────────────────────────────────────
export {
  SECTION_CONFIG,
  analyzeSection,
  SpeechEngine,
  smoothScrollToSection,
  highlightSection,
  clearHighlights,
};
