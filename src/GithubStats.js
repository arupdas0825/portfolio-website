import React, { useState, useEffect } from 'react';
import { motion, animate } from 'framer-motion';
import { Star, GitFork, Package, Users, UserPlus, Github, Trophy, Zap, Clock, Code } from 'lucide-react';

const CountUp = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return <span>{displayValue}</span>;
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${color}33` }}
    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-300"
  >
    <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-3xl opacity-20`} style={{ backgroundColor: color }}></div>
    <div className="mb-4 p-3 rounded-xl bg-white/5 text-white group-hover:scale-110 transition-transform duration-300">
      <Icon size={24} style={{ color }} />
    </div>
    <div className="text-3xl font-bold text-white mb-1 font-syne">
      <CountUp value={value} />
    </div>
    <div className="text-sm text-slate-400 font-medium">{label}</div>
  </motion.div>
);

const ProgressBar = ({ label, percentage, color }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1 text-xs font-syne font-semibold uppercase tracking-wider text-slate-400">
      <span>{label}</span>
      <span>{percentage}%</span>
    </div>
    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${percentage}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
        style={{ background: color }}
      />
    </div>
  </div>
);

const GithubStats = () => {
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    publicRepos: 0,
    stars: 0,
    forks: 0,
    topLanguage: 'JavaScript',
    languageBreakdown: [
      { name: 'JavaScript', percentage: 75, color: '#f7df1e' },
      { name: 'Python', percentage: 15, color: '#3776ab' },
      { name: 'Java', percentage: 5, color: '#b07219' },
      { name: 'CSS', percentage: 3, color: '#563d7c' },
      { name: 'HTML', percentage: 2, color: '#e34c26' },
    ],
    totalCommits: 450, // Mock
    totalPRs: 25, // Mock
    totalIssues: 12, // Mock
    streak: { current: 15, longest: 45 }, // Mock
    contributions: 120, // Mock
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const userRes = await fetch('https://api.github.com/users/arupdas0825');
        const userData = await userRes.json();
        
        const reposRes = await fetch('https://api.github.com/users/arupdas0825/repos?per_page=100');
        const reposData = await reposRes.json();

        let totalStars = 0;
        let totalForks = 0;
        const languages = {};

        if (Array.isArray(reposData)) {
            reposData.forEach(repo => {
                totalStars += repo.stargazers_count;
                totalForks += repo.forks_count;
                if (repo.language) {
                    languages[repo.language] = (languages[repo.language] || 0) + 1;
                }
            });
        }

        const sortedLangs = Object.entries(languages).sort((a, b) => b[1] - a[1]);
        const topLanguage = sortedLangs[0]?.[0] || 'JavaScript';

        setStats(prev => ({
          ...prev,
          followers: userData.followers || 0,
          following: userData.following || 0,
          publicRepos: userData.public_repos || 0,
          stars: totalStars,
          forks: totalForks,
          topLanguage,
        }));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
        setLoading(false);
      }
    };

    fetchGithubData();
  }, []);

  return (
    <section id="github" className="py-24 relative overflow-hidden bg-[#0a0812]">
      {/* Background Particles/Motion */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-4 font-syne uppercase tracking-tighter"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-sm">
              GitHub Stats
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 font-medium tracking-widest text-sm uppercase"
          >
            Live Data from GitHub API
          </motion.p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full shadow-[0_0_15px_rgba(138,92,246,0.5)]"></div>
        </div>

        {/* Top Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
          <StatCard icon={Star} label="Stars" value={stats.stars} color="#facc15" />
          <StatCard icon={GitFork} label="Forks" value={stats.forks} color="#60a5fa" />
          <StatCard icon={Package} label="Repositories" value={stats.publicRepos} color="#c084fc" />
          <StatCard icon={Users} label="Followers" value={stats.followers} color="#4ade80" />
          <StatCard icon={UserPlus} label="Following" value={stats.following} color="#f472b6" />
        </div>

        {/* Large Advanced Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Info Box */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Github size={120} />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 h-full">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <Github size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-syne text-white">ARUP DAS</h3>
                    <p className="text-xs text-slate-500 tracking-wider">PORTFOLIO INSIGHTS</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full"></div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Total Stars</p>
                    <p className="text-2xl font-bold text-white font-syne"><CountUp value={stats.stars} /></p>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-full"></div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Commits</p>
                    <p className="text-2xl font-bold text-white font-syne"><CountUp value={stats.totalCommits} /></p>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-500 rounded-full"></div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">PRs</p>
                    <p className="text-2xl font-bold text-white font-syne"><CountUp value={stats.totalPRs} /></p>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-500 rounded-full"></div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Issues</p>
                    <p className="text-2xl font-bold text-white font-syne"><CountUp value={stats.totalIssues} /></p>
                  </div>
                </div>
              </div>

              {/* Progress Ring for Dominant Language */}
              <div className="flex flex-col items-center justify-center bg-white/5 rounded-3xl p-8 border border-white/5 min-w-[200px]">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-white/5"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="364.4"
                      initial={{ strokeDashoffset: 364.4 }}
                      whileInView={{ strokeDashoffset: 364.4 * (1 - 0.75) }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white font-syne">75%</span>
                  </div>
                </div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stats.topLanguage}</div>
              </div>
            </div>
          </motion.div>

          {/* Side Panel Breakdown */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between"
          >
            <h4 className="text-lg font-bold text-white mb-6 font-syne flex items-center gap-2">
              <Code size={20} className="text-fuchsia-400" /> Language Breakdown
            </h4>
            <div className="space-y-2">
              {stats.languageBreakdown.map((lang, idx) => (
                <ProgressBar key={idx} label={lang.name} percentage={lang.percentage} color={lang.color} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Contribution Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Contributions', value: stats.contributions, icon: Trophy, color: '#facc15' },
            { label: 'Current Streak', value: stats.streak.current, icon: Zap, color: '#f97316' },
            { label: 'Longest Streak', value: stats.streak.longest, icon: Clock, color: '#8b5cf6' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-6 group hover:bg-white/10 transition-all cursor-default"
            >
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/5" />
                  <motion.circle 
                    cx="32" cy="32" r="30" stroke={stat.color} strokeWidth="3" fill="transparent" 
                    strokeDasharray="188.5" initial={{ strokeDashoffset: 188.5 }}
                    whileInView={{ strokeDashoffset: 188.5 * (1 - 0.8) }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 + (idx * 0.1) }}
                    className="drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]"
                  />
                </svg>
                <stat.icon size={20} style={{ color: stat.color }} className="relative z-10 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white font-syne"><CountUp value={stat.value} /></p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GithubStats;
