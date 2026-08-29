import { PROJECTS_DATA } from '../data/projectsData';
import projectsConfig from '../content/projects/projects-config.json';

const GITHUB_USERNAME = 'arupdas0825';

export const langColors = {
  JavaScript: '#f1e05a', Python: '#3572A5', Java: '#b07219',
  Kotlin: '#A97BFF', TypeScript: '#2b7489', CSS: '#563d7c',
  HTML: '#e34c26', Dart: '#00B4AB', default: '#8a5cf6',
};

export const REPO_IMAGES = {
  'scientific-calculator': '/scientific-calculator.png',
  'ai-code-translator': '/ai-code-translator.png',
  'arupdas0825': '/arupdas0825.jpeg',
  'client-portfolio': '/client-portfolio.png',
  'EverBond-Wealth': '/EverBond-Wealth.png',
  'portfolio-website': '/portfolio-website.jpeg',
  'sentiment-analysis-project': '/sentiment-analysis-project.png',
  'streamnest': '/streamnest.png',
  'algorithm-visualizer': '/algorithm-visualizer.png',
  'quiz-web': '/quiz-web.png',
  'studytra': '/studytra.png',
  'sahasrajit-foundation': '/sahasrajit-foundation.png',
  'HireSight-AI': '/HireSight-AI.png',
  'LocalCare-Finder-Android': '/LocalCare-Finder-Android.jpeg',
  'NEURAL-RIFT': '/NEURAL-RIFT.png',
  'HyperLane': '/HyperLane.jpeg',
  'Space-Combat-Game': '/Space-Combat-Game.png',
  'Dev-Track': '/Dev-Track.png',
  'Lumira-Health-AI': '/Lumira-Health-AI.jpg',
  'TaskForge': '/TaskForge.png',
  'taskforge': '/TaskForge.png',
  'LedgerWise': '/LedgerWise.png',
  'ledgerwise': '/LedgerWise.png',
  'LadgerWise': '/LadgerWise.png',
  'CodeFolio': '/CodeFolio.png',
  'codefolio': '/CodeFolio.png',
  'Meridian': '/Meridian.png',
  'meridian': '/Meridian.png',
  'AtmosBridge': '/AtmosBridge.jpeg',
  'atmosbridge': '/AtmosBridge.jpeg',
  'Atmos-Bridge': '/AtmosBridge.jpeg',
  'atmos-bridge': '/AtmosBridge.jpeg',
};

export const REPO_VIDEOS = {
  'portfolio-website': '/videos/portfolio-website.mp4',
  'streamnest': '/videos/streamnest.mp4',
  'HireSight-AI': '/videos/HireSight-AI.mp4',
  'EverBond-Wealth': '/videos/everbond-wealth.mp4',
  'Space-Combat-Game': '/videos/Space-Combat-Game.mp4',
};

export const REPO_HOMEPAGES = {
  'scientific-calculator': 'https://arupdas0825.github.io/scientific-calculator/scientific-complex-calculator.html',
  'sentiment-analysis-project': 'https://sentiment-analysis-project-zvtb4q6vncknfc5qvkb63w.streamlit.app/',
  'quiz-web': 'https://quiz-web-demo.vercel.app',
  'portfolio-website': 'https://arup-portfolio-seven.vercel.app/',
  'Dev-Track': 'https://dev-track-brown.vercel.app',
};

const FALLBACK_REPOS = [
  {
    id: 15, name: 'AtmosBridge', fork: false,
    description: 'AtmosBridge — AI-powered climate intelligence platform for detecting hyperlocal pollution, forecasting air-quality risks, and enabling cross-border climate action across BRICS.',
    language: 'JavaScript', stargazers_count: 3, forks_count: 2,
    html_url: 'https://github.com/arupdas0825/AtmosBridge', homepage: '',
    updated_at: '2026-08-25T00:00:00Z', pushed_at: '2026-08-25T00:00:00Z'
  },
  {
    id: 1, name: 'LocalCare-Finder-Android', fork: false,
    description: 'LocalCare Finder — Find nearby hospitals, pharmacies & blood banks across India instantly. Built with Kotlin, Google Maps, Flask & OpenStreetMap API.',
    language: 'Kotlin', stargazers_count: 1, forks_count: 0,
    html_url: 'https://github.com/arupdas0825/LocalCare-Finder-Android', homepage: '',
    updated_at: '2024-08-01T00:00:00Z', pushed_at: '2024-08-01T00:00:00Z'
  },
  {
    id: 2, name: 'sahasrajit-foundation', fork: false,
    description: 'Built the official website for Sahasrajit Foundation, a grassroots NGO. Integrated database dashboard.',
    language: 'JavaScript', stargazers_count: 2, forks_count: 0,
    html_url: 'https://github.com/arupdas0825/sahasrajit-foundation', homepage: '',
    updated_at: '2024-09-01T00:00:00Z', pushed_at: '2024-09-01T00:00:00Z'
  },
  {
    id: 3, name: 'quiz-web', fork: false,
    description: 'A modern Online Examination System built with ReactJs. Features DBMS, OOPS, Python, C, DSA, 10-min countdown timer, grade calculation.',
    language: 'JavaScript', stargazers_count: 3, forks_count: 1,
    html_url: 'https://github.com/arupdas0825/quiz-web', homepage: 'https://quiz-web-demo.vercel.app',
    updated_at: '2024-10-01T00:00:00Z', pushed_at: '2024-10-01T00:00:00Z'
  },
  {
    id: 4, name: 'arupdas0825', fork: false,
    description: 'B.Tech CSE (AIML) | React Developer | Exploring AI, Algorithms & Full-Stack Development',
    language: 'JavaScript', stargazers_count: 4, forks_count: 0,
    html_url: 'https://github.com/arupdas0825', homepage: '',
    updated_at: '2024-11-01T00:00:00Z', pushed_at: '2024-11-01T00:00:00Z'
  },
  {
    id: 5, name: 'algorithm-visualizer', fork: false,
    description: 'A React-based Algorithm Visualizer that animates sorting algorithms like Bubble Sort for real-time visualization.',
    language: 'JavaScript', stargazers_count: 2, forks_count: 0,
    html_url: 'https://github.com/arupdas0825/algorithm-visualizer', homepage: '',
    updated_at: '2024-12-01T00:00:00Z', pushed_at: '2024-12-01T00:00:00Z'
  },
  {
    id: 6, name: 'portfolio-website', fork: false,
    description: 'A premium interactive portfolio blending Artificial Intelligence, software engineering, and cinematic photography. Built with React, Tailwind CSS.',
    language: 'JavaScript', stargazers_count: 3, forks_count: 0,
    html_url: 'https://github.com/arupdas0825/portfolio-website', homepage: 'https://arup-portfolio-seven.vercel.app/',
    updated_at: '2025-01-01T00:00:00Z', pushed_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 7, name: 'Online-Examination-System-Java', fork: false,
    description: 'A robust, scalable Java web application for seamless online assessment management with secure user authentication and automated evaluation.',
    language: 'Java', stargazers_count: 1, forks_count: 0,
    html_url: 'https://github.com/arupdas0825/Online-Examination-System-Java', homepage: '',
    updated_at: '2024-05-01T00:00:00Z', pushed_at: '2024-05-01T00:00:00Z'
  },
  {
    id: 8, name: 'localcare-finder', fork: false,
    description: 'LocalCare Finder is a public utility web app to help users quickly locate nearby healthcare services using location-based search.',
    language: 'CSS', stargazers_count: 1, forks_count: 0,
    html_url: 'https://github.com/arupdas0825/localcare-finder', homepage: '',
    updated_at: '2024-06-01T00:00:00Z', pushed_at: '2024-06-01T00:00:00Z'
  },
  {
    id: 9, name: 'studytra', fork: false,
    description: 'Study Abroad Execution Platform for Indian students wanting to study in Germany, USA or Canada. Powered by Gemini AI.',
    language: 'JavaScript', stargazers_count: 5, forks_count: 1,
    html_url: 'https://github.com/arupdas0825/studytra', homepage: '',
    updated_at: '2024-07-01T00:00:00Z', pushed_at: '2024-07-01T00:00:00Z'
  },
  {
    id: 10, name: 'Space-Combat-Game', fork: false,
    description: 'A 3D space flight combat simulation game built with HTML Canvas, WebGL, and custom particle engines.',
    language: 'JavaScript', stargazers_count: 5, forks_count: 0,
    html_url: 'https://github.com/arupdas0825/Space-Combat-Game', homepage: '',
    updated_at: '2024-04-01T00:00:00Z', pushed_at: '2024-04-01T00:00:00Z'
  },
  {
    id: 11, name: 'Lumira-Health-AI', fork: false,
    description: 'An AI-powered clinical intelligence platform for remote patient health monitoring and real-time medical risk prediction.',
    language: 'Python', stargazers_count: 5, forks_count: 0,
    html_url: 'https://github.com/arupdas0825/Lumira-Health-AI', homepage: '',
    updated_at: '2026-07-11T23:15:23Z', pushed_at: '2026-07-11T23:15:23Z'
  },
  {
    id: 12, name: 'LedgerWise', fork: false,
    description: 'LedgerWise — An offline-first personal finance and budget tracking app built with React, Firebase, and Dexie.',
    language: 'JavaScript', stargazers_count: 1, forks_count: 0,
    html_url: 'https://github.com/arupdas0825/LedgerWise', homepage: '',
    updated_at: '2024-08-15T00:00:00Z', pushed_at: '2024-08-15T00:00:00Z'
  },
  {
    id: 13, name: 'CodeFolio', fork: false,
    description: 'Codefolio: An AI-powered Developer Intelligence Platform that transforms GitHub activity into actionable insights, developer scores, growth analytics, and personalized career recommendations.',
    language: 'TypeScript', stargazers_count: 23, forks_count: 6,
    html_url: 'https://github.com/arupdas0825/CodeFolio', homepage: '',
    updated_at: '2026-08-01T00:00:00Z', pushed_at: '2026-08-01T00:00:00Z'
  },
  {
    id: 14, name: 'Meridian', fork: false,
    description: 'Plan smart. Manage money. Get things done. Explore Europe. A unified PWA combining productivity, personal finance, and travel planning into one seamless app.',
    language: 'JavaScript', stargazers_count: 2, forks_count: 1,
    html_url: 'https://github.com/arupdas0825/Meridian', homepage: '',
    updated_at: '2026-08-01T00:00:00Z', pushed_at: '2026-08-01T00:00:00Z'
  },
];

export const getRepoImage = (repo) => {
  if (repo.image) return repo.image;
  if (!repo.name) return null;
  const name = repo.name.toLowerCase();
  const keys = Object.keys(REPO_IMAGES);
  const matchKey = keys.find(k => k.toLowerCase() === name);
  if (matchKey) return REPO_IMAGES[matchKey];
  return `https://opengraph.githubassets.com/1/arupdas0825/${repo.name}`;
};

export const fetchAndMergeProjects = async () => {
  // 1. Fetch GitHub Repositories
  let githubRepos = [];
  const CACHE_KEY = `gh_repos_v2_${GITHUB_USERNAME}`;
  const CACHE_TTL = 60 * 60 * 1000; // 1 hour

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL && Array.isArray(data) && data.length > 0) {
        githubRepos = data;
      }
    }
  } catch (_) {}

  if (githubRepos.length === 0) {
    try {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
        { headers: { 'Accept': 'application/vnd.github.v3+json' } }
      );
      if (!res.ok) throw new Error(`API returned status ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        githubRepos = data.filter(r => !r.fork);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data: githubRepos, ts: Date.now() }));
        } catch (_) {}
      } else {
        throw new Error('Empty GitHub API response');
      }
    } catch (err) {
      githubRepos = FALLBACK_REPOS;
    }
  }

  // Filter out the profile repository (readme)
  const filteredGitHubRepos = githubRepos.filter(
    r => r.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase()
  );

  // Helper to check if description is a placeholder
  const isPlaceholderDescription = (desc) => {
    if (!desc) return true;
    const d = desc.trim().toLowerCase();
    return (
      d === 'a comprehensive open-source project showcasing modern engineering practices.' ||
      d === 'no description provided.' ||
      d === ''
    );
  };

  // Helper to get category from local config
  const getCategoryFromLocalConfig = (repoName) => {
    const nameLower = repoName.toLowerCase();
    if (projectsConfig.major.some(n => n.toLowerCase() === nameLower)) return 'Major';
    if (projectsConfig.college.some(n => n.toLowerCase() === nameLower)) return 'Academic';
    return 'Secondary';
  };

  const mergedRepos = [];

  // 2. Merge Loop
  filteredGitHubRepos.forEach(repo => {
    const repoNameLower = repo.name.toLowerCase();
    const dataKey = Object.keys(PROJECTS_DATA).find(k => k.toLowerCase() === repoNameLower);
    const projData = dataKey ? PROJECTS_DATA[dataKey] : null;

    let mergedRepo = {
      id: repo.id,
      name: repo.name,
      html_url: repo.html_url,
      pushed_at: repo.pushed_at,
      updated_at: repo.updated_at,
      topics: repo.topics || [],
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      language: repo.language || 'JavaScript',
    };

    // Description matching
    if (projData && projData.description && !isPlaceholderDescription(projData.description)) {
      mergedRepo.description = projData.description;
    } else {
      mergedRepo.description = repo.description || '';
    }

    // Homepage matching - explicit REPO_HOMEPAGES takes top priority
    if (REPO_HOMEPAGES[repo.name]) {
      mergedRepo.homepage = REPO_HOMEPAGES[repo.name];
    } else if (projData && projData.links && projData.links.demo) {
      mergedRepo.homepage = projData.links.demo;
    } else if (repo.homepage) {
      mergedRepo.homepage = repo.homepage;
    } else {
      mergedRepo.homepage = '';
    }

    // Image matching
    if (projData && projData.banner) {
      mergedRepo.image = projData.banner;
    } else {
      mergedRepo.image = getRepoImage(repo);
    }

    // Video matching
    mergedRepo.video = REPO_VIDEOS[repo.name] || null;

    // Category mapping
    let category = getCategoryFromLocalConfig(repo.name);
    if (category === 'college' || category === 'Academic') {
      category = 'Academic';
    }
    mergedRepo.category = category;

    // Display order and featured status
    mergedRepo.display_order = 999;
    mergedRepo.featured = projectsConfig.major.some(n => n.toLowerCase() === repoNameLower);

    mergedRepos.push(mergedRepo);
  });

  return mergedRepos;
};
