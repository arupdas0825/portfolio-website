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
