import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, ShieldCheck, Cpu, Terminal, Compass, BarChart3, Star, Zap, Flame, Award } from 'lucide-react';
import Button from '../components/common/Button';

const Landing = () => {
  return (
    <div className="relative min-h-screen bg-[#080b11] overflow-hidden bg-grid-pattern">
      {/* Background Glow Spheres */}
      <div className="purple-glow-glow top-[-100px] left-[-100px]"></div>
      <div className="blue-glow-glow bottom-[-50px] right-[-50px]"></div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-600/10 border border-accent-500/25 text-accent-400 text-xs font-semibold mb-6 animate-pulse">
          <Zap className="w-3.5 h-3.5 fill-accent-400" />
          <span>Supercharged by Google Gemini 1.5 Flash</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Ace Your Next Job Interview <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-400 via-indigo-400 to-blue-400">
            Powered by Advanced AI
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 mb-10 leading-relaxed">
          AI Interview Coach helps you practice mock interviews, parses resumes for ATS compatibility, analyzes communication metrics, and builds weekly study roadmaps.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/signup" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-xl" icon={<PlayCircle className="w-5 h-5" />}>
              Start Practicing Free
            </Button>
          </Link>
          <a href="#features" className="w-full sm:w-auto">
            <Button variant="glass" size="lg" className="w-full sm:w-auto">
              Explore Features
            </Button>
          </a>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mt-16 max-w-5xl mx-auto p-2.5 rounded-2xl glass-panel border border-white/10 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-transparent to-transparent z-10 rounded-2xl pointer-events-none"></div>
          <div className="rounded-xl overflow-hidden bg-slate-950/70 aspect-[16/9] flex items-center justify-center p-8 border border-white/5 relative">
            <div className="absolute top-4 left-4 flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            </div>
            <div className="max-w-md text-left space-y-4 animate-slide-up">
              <div className="inline-flex px-3 py-1 rounded bg-accent-500/20 text-accent-400 text-xs font-semibold uppercase tracking-wider">
                Question 3 of 10
              </div>
              <h3 className="text-xl font-bold text-white leading-snug">
                How would you optimize a React app containing a massive, complex dashboard page to prevent un-necessary re-renders?
              </h3>
              <div className="p-4 rounded-lg bg-slate-900 border border-white/5 font-mono text-xs text-gray-400">
                To optimize the dashboard, I would utilize react hooks like useMemo and useCallback to cache computations and function declarations...
              </div>
              <div className="flex gap-2">
                <span className="h-2 bg-accent-600 rounded w-full"></span>
                <span className="h-2 bg-slate-800 rounded w-1/2"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white mb-4">Complete Suite of AI Career Tools</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Get everything you need to boost confidence, fill skill gaps, and secure your dream offer.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5 glass-panel-hover flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-600/10 border border-accent-500/25 flex items-center justify-center text-accent-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Mock Interviews</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Generate 10 structured Technical, Behavioral, and HR questions based on your target role and difficulty. Get scored in real time with suggestions.
            </p>
          </div>
          {/* Card 2 */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5 glass-panel-hover flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">ATS Resume Auditor</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Upload your PDF resume. Our AI extracts existing skills, detects missing tools, calculates ATS compatibility indices, and suggests fixes.
            </p>
          </div>
          {/* Card 3 */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5 glass-panel-hover flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Personalized Roadmaps</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Map out custom 6-week learning tracks. Enter your CGPA, target roles, and skills to receive custom project milestones and placement prep plans.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white mb-4">Loved by Students & Job Seekers</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col justify-between">
            <p className="text-gray-300 italic mb-6">
              "The AI mock interview asked very specific Node.js and MongoDB optimization questions. The detailed scorecards and action plans helped me structure my answers, and I ended up landing my junior dev job last month!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white font-bold">SM</div>
              <div>
                <h4 className="text-sm font-bold text-white">Sameer Mehta</h4>
                <p className="text-xs text-gray-500">Frontend Engineer at TechCorp</p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col justify-between">
            <p className="text-gray-300 italic mb-6">
              "The Resume Analyzer was a game changer. I didn't realize I was missing standard keywords that recruiters screen for. My callback rates jumped from 10% to 45% after incorporating the recommended fixes."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white font-bold">AK</div>
              <div>
                <h4 className="text-sm font-bold text-white">Anjali Kapoor</h4>
                <p className="text-xs text-gray-500">CS Senior at IIIT</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400">Everything you need to master your coding interview.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
              <p className="text-gray-400 text-sm mb-6">Test the water and try mock sessions.</p>
              <span className="text-3xl font-extrabold text-white">$0</span>
              <span className="text-gray-500 text-sm"> / Free forever</span>
              <ul className="mt-8 space-y-4 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>3 Free Mock Interviews / Month</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Basic Scorecards & Feedback</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>1 Resume Parse / Month</span>
                </li>
              </ul>
            </div>
            <Link to="/signup" className="mt-8">
              <Button variant="glass" className="w-full">Create Free Account</Button>
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="glass-panel p-8 rounded-2xl border-2 border-accent-500 relative flex flex-col justify-between">
            <span className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-accent-600 text-white rounded-full text-xs font-bold uppercase tracking-wider">
              Popular
            </span>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Pro Coach</h3>
              <p className="text-gray-400 text-sm mb-6">Unlimited tools for heavy job seekers.</p>
              <span className="text-3xl font-extrabold text-white">$15</span>
              <span className="text-gray-500 text-sm"> / Month</span>
              <ul className="mt-8 space-y-4 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent-400" />
                  <span className="text-white font-medium">Unlimited Mock Interviews</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent-400" />
                  <span>Full Gemini evaluations and suggestions</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent-400" />
                  <span className="text-white font-medium">Unlimited PDF resume analyses</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent-400" />
                  <span>Interactive 6-week career roadmap creator</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent-400" />
                  <span>AI Voice Rooms (Speech-to-Text evaluations)</span>
                </li>
              </ul>
            </div>
            <Link to="/signup" className="mt-8">
              <Button variant="primary" className="w-full">Subscribe & Access</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-white/5 relative z-10 text-center text-sm text-gray-500">
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-accent-600 flex items-center justify-center font-bold text-white text-xs">AI</div>
          <span className="font-bold text-white">AI Interview Coach</span>
        </div>
        <p className="mb-2">© {new Date().getFullYear()} AI Interview Coach SaaS. All rights reserved.</p>
        <p className="text-xs text-gray-600">Built using React, Vite, Node, Express, MongoDB, and Gemini 1.5.</p>
      </footer>
    </div>
  );
};

export default Landing;
