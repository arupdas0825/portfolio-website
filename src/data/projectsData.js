/**
 * projectsData.js
 * Centralized data store for premium project case studies.
 * Each project can have detailed features, challenges, and metrics.
 */

export const PROJECTS_DATA = {
  'LocalCare-Finder-Android': {
    title: 'LocalCare Finder (Android)',
    tagline: 'Instant Healthcare Access Across India',
    status: 'Completed',
    year: '2024',
    banner: '/LocalCare-Finder-Android.jpeg',
    description: 'A robust Android application designed to help users locate nearby hospitals, pharmacies, and blood banks instantly. Developed to address the critical need for quick healthcare access during emergencies.',
    features: [
      { icon: '📍', title: 'Location Tracking', explanation: 'Real-time GPS integration for precise healthcare facility locating.' },
      { icon: '🗺️', title: 'Interactive Maps', explanation: 'Google Maps and OpenStreetMap API for visual navigation.' },
      { icon: '🩸', title: 'Blood Bank Network', explanation: 'Instant directory for blood availability across various centers.' },
      { icon: '🔋', title: 'Offline Mode', explanation: 'Basic facility data available without active internet connection.' }
    ],
    stack: ['Kotlin', 'Google Maps API', 'Flask', 'OpenStreetMap', 'Firebase'],
    challenges: {
      problem: 'Maintaining an up-to-date database of thousands of healthcare facilities across India was a major technical hurdle.',
      solution: 'Implemented a crowdsourcing mechanism and integrated multiple open-source APIs to verify and update data dynamically.',
      decision: 'Chose Kotlin for its modern syntax and robust safety features in Android development.'
    },
    metrics: {
      performance: 'Fast search response < 200ms',
      accessibility: 'High accessibility score (95+)',
      responsive: 'Adaptive layout for all Android screen sizes'
    },
    gallery: [
      '/LocalCare-Finder-Android.jpeg'
    ]
  },
  'portfolio-website': {
    title: 'Cinematic AI Portfolio',
    tagline: 'Blending Engineering with Artistic Vision',
    status: 'Completed',
    year: '2025',
    banner: '/portfolio-website.jpeg',
    description: 'A premium, high-performance portfolio showcasing AI/ML expertise through a cinematic user experience. Features an AI Playback Assistant and interactive 3D visualizations.',
    features: [
      { icon: '🤖', title: 'AI Playback Assistant', explanation: 'Real-time voice narration using Web Speech API.' },
      { icon: '🌌', title: '3D Starfield', explanation: 'Immersive Three.js background optimized for performance.' },
      { icon: '🛠️', title: 'Admin CMS', explanation: 'Double-click to access hidden content management panel.' },
      { icon: '📱', title: 'App-like Experience', explanation: 'Mobile-first design with floating dock and smooth transitions.' }
    ],
    stack: ['React 19', 'Framer Motion', 'GSAP', 'Three.js', 'Firebase', 'Cloudinary'],
    challenges: {
      problem: 'Balancing complex 3D animations and AI narration while maintaining 60FPS on mobile devices.',
      solution: 'Used lazy loading for heavy assets and optimized Three.js rendering loops with low-power GPU detection.',
      decision: 'Adopted React 19 for the latest performance improvements and concurrency features.'
    },
    metrics: {
      performance: 'Optimized Lighthouse scores',
      seo: 'SEO optimized structure',
      mobile: '100% Mobile Responsive'
    },
    gallery: [
      '/portfolio-website.jpeg',
      '/about-preview.png'
    ]
  },
  'studytra': {
    title: 'Studytra',
    tagline: 'AI-Powered Study Abroad Platform',
    status: 'Completed',
    year: '2024',
    banner: '/studytra.png',
    description: 'An intelligent platform assisting Indian students in planning their studies in Germany, USA, and Canada. Leverages Gemini AI for personalized recommendations.',
    features: [
      { icon: '🧠', title: 'Gemini AI Integration', explanation: 'Personalized university and course suggestions based on student profiles.' },
      { icon: '📁', title: 'Document Manager', explanation: 'Securely upload and manage applications and visa documents.' },
      { icon: '🛂', title: 'Visa Guide', explanation: 'Step-by-step assistance for study visa applications.' }
    ],
    stack: ['React', 'Gemini AI API', 'Node.js', 'Firebase Auth', 'Tailwind CSS'],
    challenges: {
      problem: 'Managing vast amounts of university data and providing accurate AI-driven advice.',
      solution: 'Built a custom RAG (Retrieval-Augmented Generation) pipeline to feed specific study-abroad data to Gemini.',
      decision: 'Used Firebase for its real-time database capabilities and easy authentication.'
    },
    metrics: {
      ai: '90%+ accuracy in AI recommendations',
      speed: 'Optimized page load times',
      scale: 'Ready for 10k+ concurrent users'
    }
  },
  'NEURAL-RIFT': {
    title: 'NEURAL-RIFT',
    tagline: 'High-Fidelity AI Coding Challenge',
    status: 'Experimental',
    year: '2024',
    banner: '/NEURAL-RIFT.png',
    description: 'An experimental platform for testing AI-driven code generation and competitive programming challenges.',
    features: [
      { icon: '⚔️', title: 'Code Battles', explanation: 'Compete against AI or other developers in real-time coding tasks.' },
      { icon: '⚡', title: 'Instant Execution', explanation: 'Secure sandboxed environment for code testing.' }
    ],
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Docker'],
    challenges: {
      problem: 'Securely executing user-provided code without compromising the server.',
      solution: 'Isolated execution in Docker containers with strict resource limits.',
      decision: 'Chose Next.js for its robust server-side capabilities.'
    },
    metrics: {
      security: 'Sandbox isolation verified',
      latency: 'Minimal execution delay',
      responsive: 'Full IDE experience on web'
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
    banner: null,
    description: repo.description || 'A comprehensive open-source project showcasing modern engineering practices.',
    features: [
      { icon: '💻', title: 'Open Source', explanation: 'Publicly available codebase on GitHub.' },
      { icon: '🔧', title: 'Scalable Architecture', explanation: 'Built with modularity and future expansion in mind.' }
    ],
    stack: [repo.language || 'Software'],
    challenges: {
      problem: 'Developing a robust solution while maintaining clean, readable code.',
      solution: 'Adhered to SOLID principles and implemented thorough testing.',
      decision: `Chose ${repo.language || 'standard technologies'} for reliability and community support.`
    },
    metrics: {
      stars: `${repo.stargazers_count} GitHub Stars`,
      forks: `${repo.forks_count} Repo Forks`,
      responsive: 'Fully Responsive'
    }
  };
};
