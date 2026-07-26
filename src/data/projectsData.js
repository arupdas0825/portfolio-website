/**
 * projectsData.js
 * Centralized data store for premium project case studies.
 * Each project includes detailed engineering insights, tech stacks, and future roadmaps.
 */

export const PROJECTS_DATA = {
  'LocalCare-Finder-Android': {
    title: 'LocalCare Finder',
    tagline: 'Life-Saving Healthcare Connectivity for India',
    status: 'Completed',
    year: '2024',
    timeline: '4 Months',
    role: 'Lead Android Developer',
    banner: '/LocalCare-Finder-Android.jpeg',
    description: 'A comprehensive Android ecosystem connecting users with critical healthcare services. Designed for low-connectivity environments, it provides real-time facility tracking, blood bank directories, and offline navigation to ensure medical help is never out of reach.',
    fullStack: {
      languages: ['Kotlin', 'Java', 'Python'],
      frontend: ['Jetpack Compose', 'Material Design 3', 'XML Layouts'],
      backend: ['Flask (Python)', 'REST Web Services'],
      database: ['SQLite (Room)', 'Local Database'],
      apis: ['Google Maps API', 'OpenStreetMap API', 'Overpass API'],
      tools: ['Android Studio', 'Gradle', 'Postman', 'Git'],
      deployment: ['Google Play Console']
    },
    implementationDetails: {
      architecture: 'MVVM (Model-View-ViewModel) with Clean Architecture principles for maximum testability.',
      workflow: 'Repository pattern for seamless data switching between local SQLite and remote Firebase sources.',
      rendering: 'Native Android rendering with optimized view hierarchies and partial Jetpack Compose integration.',
      performance: 'Memory-efficient map marker clustering and background data syncing using WorkManager.',
      responsive: 'ConstraintLayout based design ensuring consistency from 5-inch phones to 10-inch tablets.'
    },
    planningDetails: {
      origin: 'Inspired by the difficulty of finding specialized blood groups during emergency surgeries in rural areas.',
      problem: 'Fragmentation of healthcare data in India makes finding nearby available facilities time-consuming.',
      decisions: 'Chose Kotlin over Java for null-safety and coroutines, critical for stable background network operations.',
      priority: 'Initial focus was on Offline-First capabilities to serve users in areas with spotty internet.'
    },
    futureRoadmap: [
      { title: 'AI Triage', description: 'Basic symptom checker powered by on-device ML.', status: 'planned' },
      { title: 'Telemedicine', description: 'In-app video consultation with verified doctors.', status: 'upcoming' },
      { title: 'iOS Version', description: 'Cross-platform expansion using Kotlin Multiplatform.', status: 'research' }
    ],
    features: [
      { icon: '📍', title: 'Smart Search', explanation: 'Radius-based facility filtering with real-time availability status.' },
      { icon: '🗺️', title: 'Offline Maps', explanation: 'Cached map tiles for navigation without active data connection.' },
      { icon: '🩸', title: 'Live Blood Bank', explanation: 'Direct contact with blood banks and volunteer donors.' },
      { icon: '🔋', title: 'Low Power Mode', explanation: 'Optimized GPS polling to preserve battery during emergencies.' }
    ],
    challenges: {
      problem: 'Maintaining an up-to-date database of thousands of healthcare facilities across India was a major technical hurdle.',
      solution: 'Implemented a crowdsourcing mechanism and integrated multiple open-source APIs to verify and update data dynamically.',
      decision: 'Chose Kotlin for its modern syntax and robust safety features in Android development.'
    },
    metrics: {
      latency: '< 150ms Search Result',
      uptime: '99.9% Database Sync',
      rating: '4.8/5 Beta User Score'
    },
    links: {
      github: 'https://github.com/arupdas0825/LocalCare-Finder-Android',
      demo: null
    }
  },
  'portfolio-website': {
    title: 'Cinematic AI Portfolio',
    tagline: 'The Intersection of Motion Design and Software Engineering',
    status: 'Completed',
    year: '2025',
    timeline: '6 Weeks',
    role: 'Full Stack Engineer & UI Designer',
    banner: '/portfolio-website.jpeg',
    description: 'A state-of-the-art developer portfolio that treats software showcase as a cinematic experience. It features high-fidelity animations, a bespoke 3D background engine, and an AI-driven interaction layer.',
    fullStack: {
      languages: ['JavaScript (ES15)', 'CSS3', 'HTML5'],
      frameworks: ['React 19', 'Next.js (SSG)'],
      styling: ['Vanilla CSS', 'TailwindCSS', 'CSS Modules'],
      animation: ['Framer Motion', 'GSAP', 'CSS Keyframes'],
      threejs: ['Three.js', 'React Three Fiber', 'Shaders (GLSL)'],
      backend: ['Local JSON Storage', 'Cloudinary'],
      state: ['React Context API', 'Zustand'],
      auth: ['Local Authentication'],
      tools: ['Vite', 'ESLint', 'Prettier', 'Figma'],
      deployment: ['Vercel', 'CI/CD Pipelines']
    },
    implementationDetails: {
      architecture: 'Component-based modular architecture with custom hooks for animation orchestration.',
      workflow: 'Mobile-first development workflow with continuous visual regression testing.',
      rendering: 'Hybrid rendering: Static Generation for speed, Client-side Hydration for interactive 3D elements.',
      performance: 'Asset prefetching, image optimization via Cloudinary, and frame-rate capped 3D loops.',
      responsive: 'Fluid typography and dynamic grid systems that adapt from 320px to 4K displays.'
    },
    planningDetails: {
      origin: 'Wanted to break away from the "standard" developer portfolio template and create something truly immersive.',
      problem: 'Traditional portfolios are static and fail to demonstrate the "feel" of a developer\'s work.',
      decisions: 'Opted for React 19 to leverage the latest Concurrent Rendering features for smoother UI transitions.',
      priority: 'Focused on "The First 3 Seconds" - ensuring the landing animation is flawless and high-impact.'
    },
    futureRoadmap: [
      { title: 'AI Code Review', description: 'Interactive section where an AI analyzes my public repos.', status: 'upcoming' },
      { title: 'Project Case Studies v2', description: 'Deep-dive technical blogs for each major project.', status: 'in-progress' },
      { title: 'Global Theme Engine', description: 'Dynamic color palettes based on project categories.', status: 'planned' }
    ],
    features: [
      { icon: '🤖', title: 'AI Assistant', explanation: 'Voice-enabled AI that explains project details in real-time.' },
      { icon: '🌌', title: 'Adaptive 3D', explanation: 'Three.js starfield that reacts to mouse movement and scroll.' },
      { icon: '🛠️', title: 'Modular Design', explanation: 'Bespoke component-based architecture for custom styling.' },
      { icon: '📱', title: 'PWA Ready', explanation: 'Installable mobile experience with offline capability.' }
    ],
    challenges: {
      problem: 'Balancing complex 3D animations and AI narration while maintaining 60FPS on mobile devices.',
      solution: 'Used lazy loading for heavy assets and optimized Three.js rendering loops with low-power GPU detection.',
      decision: 'Adopted React 19 for the latest performance improvements and concurrency features.'
    },
    metrics: {
      fps: '60 FPS Stable',
      lighthouse: '100/100 Performance',
      load: '< 1.2s Fully Loaded'
    },
    links: {
      github: 'https://github.com/arupdas0825/portfolio-website',
      demo: 'https://arupdas.com'
    }
  },
  'studytra': {
    title: 'Studytra',
    tagline: 'AI-Powered Global Education Bridge',
    status: 'Active',
    year: '2024',
    timeline: '5 Months',
    role: 'Lead AI Engineer',
    banner: '/studytra.png',
    description: 'A revolutionary platform that democratizes study-abroad counseling. By integrating Gemini AI, Studytra provides personalized university matches, document automation, and visa guidance for thousands of Indian students.',
    fullStack: {
      languages: ['JavaScript', 'Python'],
      frontend: ['React', 'Tailwind CSS', 'Redux Toolkit'],
      backend: ['Node.js', 'Express', 'Python (AI microservice)'],
      ai: ['Google Gemini API', 'OpenAI API (Fallback)', 'LangChain'],
      database: ['MongoDB', 'Local Storage'],
      auth: ['JWT', 'Local Authentication'],
      deployment: ['AWS EC2', 'Vercel'],
      tools: ['Docker', 'Postman', 'Swagger']
    },
    implementationDetails: {
      architecture: 'Microservices architecture separating the AI recommendation engine from the core user platform.',
      workflow: 'Agile development with bi-weekly sprints and user testing sessions with real students.',
      rendering: 'Client-side rendering with heavy emphasis on interactive forms and real-time AI chat.',
      performance: 'Redis caching for frequently accessed university data to reduce AI API costs.',
      responsive: 'Dashboard-centric design optimized for both laptop workstations and mobile browsers.'
    },
    planningDetails: {
      origin: 'Born from the frustration of expensive and biased study-abroad consultants in India.',
      problem: 'Students often lack access to unbiased, data-driven advice regarding international education.',
      decisions: 'Chose Gemini AI for its superior reasoning in multi-step educational planning tasks.',
      priority: 'Privacy and security of student documents was the highest priority during development.'
    },
    futureRoadmap: [
      { title: 'IELTS/TOEFL Prep', description: 'AI-driven practice tests and immediate feedback.', status: 'upcoming' },
      { title: 'Community Portal', description: 'Connect with seniors already studying abroad.', status: 'planned' },
      { title: 'Scholarship Tracker', description: 'Real-time database of global financial aid.', status: 'in-progress' }
    ],
    features: [
      { icon: '🧠', title: 'Gemini Advisor', explanation: 'Sophisticated RAG pipeline for hyper-personalized counseling.' },
      { icon: '📁', title: 'Vault Storage', explanation: 'Encrypted document management for sensitive visa papers.' },
      { icon: '🛂', title: 'Visa Predictor', explanation: 'Data-driven probability analysis for visa approvals.' }
    ],
    challenges: {
      problem: 'Managing vast amounts of university data and providing accurate AI-driven advice.',
      solution: 'Built a custom RAG (Retrieval-Augmented Generation) pipeline to feed specific study-abroad data to Gemini.',
      decision: 'Used client-side caching for offline capabilities and secure local authentication.'
    },
    metrics: {
      accuracy: '94% AI Precision',
      users: '5,000+ Active Beta',
      conversion: '22% App Completion'
    },
    links: {
      github: 'https://github.com/arupdas0825/studytra',
      demo: 'https://studytra.com'
    }
  },
  'NEURAL-RIFT': {
    title: 'NEURAL-RIFT',
    tagline: 'The Arena for Autonomous Code Agents',
    status: 'Experimental',
    year: '2024',
    timeline: '3 Months (Ongoing)',
    role: 'Founder & System Architect',
    banner: '/NEURAL-RIFT.png',
    description: 'A sandbox environment where developers can pit their AI agents against each other in real-time coding challenges. It tests the boundaries of autonomous code generation and system security.',
    fullStack: {
      languages: ['TypeScript', 'Rust (Sandbox)', 'Go'],
      frameworks: ['Next.js 14', 'Express'],
      database: ['PostgreSQL', 'Prisma ORM'],
      devops: ['Docker', 'Kubernetes (K8s)', 'GitHub Actions'],
      security: ['gVisor', 'Firecracker MicroVMs'],
      styling: ['Tailwind CSS', 'Framer Motion'],
      monitoring: ['Prometheus', 'Grafana']
    },
    implementationDetails: {
      architecture: 'Event-driven architecture using RabbitMQ for managing code execution queues.',
      workflow: 'Git-based workflow where agents pull tasks and push solutions via secure SSH keys.',
      rendering: 'Server-side rendering for the dashboard with real-time WebSocket updates for live battles.',
      performance: 'High-concurrency Rust-based runner that handles 100+ simultaneous code executions.',
      responsive: 'Low-latency IDE interface that works seamlessly on touch devices and desktop.'
    },
    planningDetails: {
      origin: 'Speculation on the future of software engineering where AI agents do the coding.',
      problem: 'Lack of safe, standard environments to benchmark the performance of coding agents.',
      decisions: 'Switched from standard Docker to Firecracker for better isolation and faster boot times.',
      priority: 'Security is paramount - ensuring no agent can escape the sandbox.'
    },
    futureRoadmap: [
      { title: 'Leaderboard v2', description: 'Elo-based ranking for autonomous agents.', status: 'upcoming' },
      { title: 'Multi-lang Support', description: 'Support for C++, Java, and Python agents.', status: 'in-progress' },
      { title: 'Marketplace', description: 'Buy and sell specialized agent modules.', status: 'planned' }
    ],
    features: [
      { icon: '⚔️', title: 'Neural Duels', explanation: 'Head-to-head AI coding battles with real-time scoring.' },
      { icon: '🛡️', title: 'Titan Sandbox', explanation: 'Ultra-secure microVM execution environment.' },
      { icon: '📊', title: 'Live Telemetry', explanation: 'Visualizing agent thought processes and resource usage.' }
    ],
    challenges: {
      problem: 'Securely executing user-provided code without compromising the server.',
      solution: 'Isolated execution in Docker containers with strict resource limits.',
      decision: 'Chose Next.js for its robust server-side capabilities.'
    },
    metrics: {
      isolation: '100% Secure Boot',
      latency: '< 50ms Exec Start',
      concurrency: '500+ Active Agents'
    },
    links: {
      github: 'https://github.com/arupdas0825/NEURAL-RIFT',
      demo: null
    }
  },
  'Dev-Track': {
    title: 'DevTrack',
    tagline: 'AI-Powered Developer Intelligence Platform',
    status: 'Completed',
    year: '2026',
    timeline: '3 Months',
    role: 'Lead Full-Stack Engineer',
    banner: '/Dev-Track.png',
    description: 'DevTrack is an AI-powered Developer Intelligence Platform that transforms GitHub activity into actionable insights, developer scores, growth analytics, and personalized career recommendations.',
    fullStack: {
      languages: ['TypeScript', 'JavaScript'],
      frontend: ['React 19', 'Next.js 15 (App Router)', 'Tailwind CSS', 'Framer Motion'],
      ai: ['Google Gemini API', 'LangChain'],
      apis: ['GitHub API'],
      tools: ['Git', 'GitHub', 'Vercel']
    },
    implementationDetails: {
      architecture: 'Next.js App Router architecture combined with client-side dashboard layouts and interactive charting elements.',
      workflow: 'Leverages the GitHub API to fetch commit history, language distributions, and pull request activity dynamically.',
      rendering: 'Hybrid rendering model utilizing Server Components for initial shell load and Client Components for dynamic data fetching and visualizations.',
      performance: 'Aggressive caching of API responses and optimized payload delivery to minimize network latency.',
      responsive: 'Highly adaptive responsive layout built with Tailwind CSS, providing a premium desktop and mobile dashboard experience.'
    },
    planningDetails: {
      origin: 'Conceived from the challenge of objectively measuring developer productivity and growth trends across various projects.',
      problem: 'Fragmented data makes it hard to track long-term coding velocity and learning progress.',
      decisions: 'Chose TypeScript for type safety and Next.js 15 for optimal performance and built-in API routing capabilities.',
      priority: 'Focused on low-latency data aggregation and secure OAuth connection to GitHub.'
    },
    futureRoadmap: [
      { title: 'Team Analytics', description: 'Aggregated analytics for collaborative development teams.', status: 'planned' },
      { title: 'Enterprise SSO', description: 'Integration with major enterprise identity providers.', status: 'research' }
    ],
    features: [
      { icon: '📊', title: 'Activity Insights', explanation: 'Visualizing commit activity, peak hours, and consistency trends.' },
      { icon: '🎯', title: 'Developer Scores', explanation: 'Algorithmic assessment of contributions and impact.' }
    ],
    challenges: {
      problem: 'Navigating GitHub API rate limits when fetching deep analytics for multiple active repositories.',
      solution: 'Implemented a local database cache layer and optimized GraphQL queries to bundle resource requests.',
      decision: 'Selected Redis for intermediate query caching.'
    },
    metrics: {
      precision: '98% Accuracy',
      uptime: '99.9% Platform Uptime',
      latency: '< 200ms API Response'
    },
    links: {
      github: 'https://github.com/arupdas0825/Dev-Track',
      demo: 'https://dev-track-brown.vercel.app'
    }
  },
  'Lumira-Health-AI': {
    title: 'Lumira Health AI',
    tagline: 'AI-Powered Remote Health Monitoring & Clinical Decision Support',
    status: 'Active',
    year: '2026',
    timeline: '3 Months (Ongoing)',
    role: 'Lead AI Engineer & Backend Architect',
    banner: '/Lumira-Health-AI.jpg',
    description: 'Lumira Health AI is a state-of-the-art clinical intelligence platform that leverages advanced AI/ML models to monitor patient vitals, predict potential health risks, and assist healthcare professionals with personalized care plans.',
    fullStack: {
      languages: ['TypeScript', 'Python', 'Go'],
      frontend: ['React 19', 'Next.js 15 (App Router)', 'Tailwind CSS', 'Framer Motion'],
      backend: ['FastAPI', 'Node.js', 'Express'],
      ai: ['Google Gemini API', 'PyTorch', 'LangChain'],
      database: ['PostgreSQL', 'Redis'],
      tools: ['Docker', 'Git', 'GitHub', 'Vercel']
    },
    implementationDetails: {
      architecture: 'Microservices architecture with FastAPI powering the ML model inference and Next.js handling the interactive clinical dashboard.',
      workflow: 'Real-time telemetry intake from simulated patient IoT devices, analyzed by our risk prediction models.',
      rendering: 'Server-side rendered dashboard components with dynamic WebSocket streams for real-time vital tracking.',
      performance: 'Async request handling in FastAPI with model caching and Redis-backed session storage.',
      responsive: 'Fully responsive medical-grade dashboard ensuring crisp data visualization from desktops to tablet screens.'
    },
    planningDetails: {
      origin: 'Inspired by the need for automated vital monitoring and diagnostic assistance in overwhelmed clinical settings.',
      problem: 'High caregiver-to-patient ratios lead to delays in identifying critical vital anomalies.',
      decisions: 'Chose FastAPI for Python-based model execution and Next.js 15 App Router for developer velocity and speed.',
      priority: 'Achieving sub-100ms vital analysis latency while maintaining high precision.'
    },
    futureRoadmap: [
      { title: 'IoT Integration', description: 'Direct BLE pairing with wearable medical sensors.', status: 'planned' },
      { title: 'Predictive Alerts v2', description: 'Multi-modal vital forecasting using custom LSTM models.', status: 'in-progress' }
    ],
    features: [
      { icon: '🩺', title: 'Vital Streaming', explanation: 'Real-time telemetry and visualization of patient heart rate, SpO2, and temperature.' },
      { icon: '🧠', title: 'Risk Prediction', explanation: 'On-the-fly anomaly detection and risk scoring using optimized ML classifiers.' },
      { icon: '📋', title: 'Care Automation', explanation: 'AI-generated personalized clinical summaries and treatment suggestions.' }
    ],
    challenges: {
      problem: 'Processing high-frequency medical telemetry without performance degradation.',
      solution: 'Used asynchronous background tasks in Python and buffered streaming writes to Redis.',
      decision: 'Chose PostgreSQL for transactional integrity and Redis for transient telemetry cache.'
    },
    metrics: {
      precision: '97.4% Classification Accuracy',
      latency: '< 80ms Vital Analysis',
      uptime: '99.95% API Uptime'
    },
    links: {
      github: 'https://github.com/arupdas0825/Lumira-Health-AI',
      demo: null
    }
  },
  'TaskForge': {
    title: 'TaskForge AI',
    tagline: 'Modern AI-Powered Productivity Platform',
    status: 'Active',
    year: '2026',
    timeline: '2 Months',
    role: 'Lead Full-Stack Engineer',
    banner: '/TaskForge.png',
    description: 'TaskForge AI is a modern AI-powered productivity platform inspired by Notion, TickTick, and Todoist. It features smart task management, AI-driven automation, and intuitive workflows.',
    fullStack: {
      languages: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3'],
      frontend: ['React', 'Tailwind CSS', 'Framer Motion'],
      backend: ['Node.js', 'Express'],
      ai: ['Google Gemini API'],
      tools: ['Git', 'GitHub', 'Vercel']
    },
    implementationDetails: {
      architecture: 'Modular React component hierarchy integrated with RESTful API endpoints for AI task parsing.',
      workflow: 'Agile development iteration with automated component testing.',
      rendering: 'Client-side reactive rendering with dynamic modal management and animations.',
      performance: 'Optimized state rendering and lightweight asset delivery for instant response.',
      responsive: 'Fluid grid layout designed for desktop productivity workstations and mobile screens.'
    },
    planningDetails: {
      origin: 'Conceived to revolutionize personal and team task management with intelligent automation.',
      problem: 'Traditional task apps lack smart AI prioritization and dynamic prompt-to-task parsing.',
      decisions: 'Chose React and Tailwind CSS for rapid UI development and fluid interactive animations.',
      priority: 'Delivering a crisp, responsive, user-friendly interface.'
    },
    futureRoadmap: [
      { title: 'Real-time Sync', description: 'Multi-device WebSocket synchronization.', status: 'planned' },
      { title: 'Team Workspaces', description: 'Shared task boards and role permissions.', status: 'upcoming' }
    ],
    features: [
      { icon: '⚡', title: 'Smart Tasking', explanation: 'Instant AI task breakdown and priority estimation.' },
      { icon: '🎨', title: 'Sleek Dashboard', explanation: 'Intuitive modern UI with dark-mode aesthetic.' }
    ],
    challenges: {
      problem: 'Designing an intuitive UI for complex AI-driven task workflows.',
      solution: 'Used modular UI components and responsive state flows.',
      decision: 'Selected Gemini API for fast, context-aware prompt parsing.'
    },
    metrics: {
      precision: '99% Uptime',
      latency: '< 100ms Action Latency'
    },
    links: {
      github: 'https://github.com/arupdas0825/TaskForge',
      demo: null
    }
  },
  'LedgerWise': {
    title: 'LedgerWise',
    tagline: 'Offline-First Personal Finance & Budget Tracking',
    status: 'Completed',
    year: '2024',
    timeline: '2 Months',
    role: 'Lead Full-Stack Engineer',
    banner: '/LedgerWise.png',
    description: 'LedgerWise — An offline-first personal finance and budget tracking app built with React, Firebase, and Dexie.',
    fullStack: {
      languages: ['JavaScript', 'HTML5', 'CSS3'],
      frontend: ['React', 'Tailwind CSS', 'Dexie.js'],
      backend: ['Firebase Auth', 'Firestore Sync'],
      tools: ['Git', 'GitHub']
    },
    implementationDetails: {
      architecture: 'Offline-first architecture powered by Dexie IndexedDB with cloud sync via Firebase.',
      workflow: 'Component-driven layout with dynamic budget calculations and reporting.',
      rendering: 'Client-side reactive rendering.',
      performance: 'Sub-50ms local database queries and instant offline capabilities.',
      responsive: 'Fluid grid layout designed for mobile and desktop finance management.'
    },
    planningDetails: {
      origin: 'Built to manage personal finances reliably even without an active internet connection.',
      problem: 'Most budget apps require continuous internet and suffer latency during transaction logging.',
      decisions: 'Chose Dexie IndexedDB for robust local storage with background Firebase synchronization.',
      priority: 'Fast offline transaction entry and clear visual financial charts.'
    },
    futureRoadmap: [
      { title: 'Multi-Currency', description: 'Support for real-time exchange rates and multiple currencies.', status: 'planned' },
      { title: 'Export Reports', description: 'PDF and CSV report export functionality.', status: 'upcoming' }
    ],
    features: [
      { icon: '💳', title: 'Offline-First', explanation: 'Instant transaction logging with local Dexie storage.' },
      { icon: '📊', title: 'Budget Analytics', explanation: 'Visual breakdown of monthly income, expenses, and savings.' }
    ],
    challenges: {
      problem: 'Handling conflict resolution when syncing offline IndexedDB data to Firebase Cloud.',
      solution: 'Implemented timestamp-based optimistic sync resolution.',
      decision: 'Selected Dexie.js for lightweight, intuitive IndexedDB management.'
    },
    metrics: {
      precision: '100% Offline Access',
      latency: '< 20ms Local Database Query'
    },
    links: {
      github: 'https://github.com/arupdas0825/LedgerWise',
      demo: null
    }
  }
};

/**
 * Fallback generator for repos not explicitly defined in PROJECTS_DATA.
 */
export const getProjectMetadata = (repo) => {
  if (PROJECTS_DATA[repo.name]) return PROJECTS_DATA[repo.name];

  return {
    title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    tagline: repo.description ? (repo.description.slice(0, 60) + '...') : 'Open Source Project',
    status: 'Completed',
    year: new Date(repo.updated_at).getFullYear().toString(),
    timeline: 'Open Source',
    role: 'Contributor',
    banner: null,
    description: repo.description || 'A comprehensive open-source project showcasing modern engineering practices.',
    fullStack: {
      languages: [repo.language || 'Software'],
      tools: ['Git', 'GitHub']
    },
    implementationDetails: {
      architecture: 'Clean, modular architecture designed for community contribution.',
      workflow: 'GitHub-centric workflow with pull requests and code reviews.',
      rendering: 'Standard modern web rendering optimized for accessibility.',
      performance: 'Built with performance and scalability as core priorities.',
      responsive: 'Fully responsive design adapting to all screen sizes.'
    },
    planningDetails: {
      origin: 'Identified a gap in the open-source ecosystem and built a solution.',
      problem: 'Solving real-world problems through collaborative software development.',
      decisions: 'Prioritized reliability and community-driven features.',
      priority: 'Focused on developer experience and ease of onboarding.'
    },
    futureRoadmap: [
      { title: 'Expansion', description: 'Adding more features based on community feedback.', status: 'planned' },
      { title: 'Optimization', description: 'Continuous performance and stability improvements.', status: 'upcoming' }
    ],
    features: [
      { icon: '💻', title: 'Open Source', explanation: 'Publicly available codebase on GitHub.' },
      { icon: '🔧', title: 'Scalable Architecture', explanation: 'Built with modularity and future expansion in mind.' }
    ],
    challenges: {
      problem: 'Developing a robust solution while maintaining clean, readable code.',
      solution: 'Adhered to SOLID principles and implemented thorough testing.',
      decision: `Chose ${repo.language || 'standard technologies'} for reliability and community support.`
    },
    metrics: {
      stars: `${repo.stargazers_count} GitHub Stars`,
      forks: `${repo.forks_count} Repo Forks`,
      status: 'Stable Build'
    },
    links: {
      github: repo.html_url,
      demo: repo.homepage
    }
  };
};
