import React, { useState } from 'react';
import { BookOpen, Search, Filter, Bookmark, BookmarkCheck, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';

const QuestionBank = () => {
  const [search, setSearch] = useState('');
  const [activeRole, setActiveRole] = useState('All');
  const [activeDiff, setActiveDiff] = useState('All');
  const [favorites, setFavorites] = useState([]); // Array of questionIds

  const roles = ['All', 'Frontend', 'Backend', 'AI Engineer', 'Data Scientist', 'HR/Behavioral'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const questionsDb = [
    { id: 1, role: 'Frontend', diff: 'Easy', category: 'Technical', text: 'What is the virtual DOM in React and how does it work?' },
    { id: 2, role: 'Frontend', diff: 'Medium', category: 'Technical', text: 'Explain the differences between client-side rendering (CSR) and server-side rendering (SSR).' },
    { id: 3, role: 'Frontend', diff: 'Hard', category: 'Technical', text: 'How would you write a custom hook in React to manage debounce state changes?' },
    { id: 4, role: 'Backend', diff: 'Easy', category: 'Technical', text: 'What is the purpose of middleware in Express.js applications?' },
    { id: 5, role: 'Backend', diff: 'Medium', category: 'Technical', text: 'Explain how indexing works in MongoDB and when you should avoid it.' },
    { id: 6, role: 'Backend', diff: 'Hard', category: 'Technical', text: 'How do you design a rate limiter middleware for high-traffic API nodes?' },
    { id: 7, role: 'AI Engineer', diff: 'Medium', category: 'Technical', text: 'Explain the difference between supervised, unsupervised, and reinforcement learning.' },
    { id: 8, role: 'AI Engineer', diff: 'Hard', category: 'Technical', text: 'What is the role of attention mechanism in Transformer models?' },
    { id: 9, role: 'Data Scientist', diff: 'Medium', category: 'Technical', text: 'What is overfitting and how can you prevent it in neural network training?' },
    { id: 10, role: 'HR/Behavioral', diff: 'Easy', category: 'Behavioral', text: 'Tell me about a time you faced a conflict with a team member and how you resolved it.' },
    { id: 11, role: 'HR/Behavioral', diff: 'Medium', category: 'HR', text: 'Why do you want to join our company and what matches your long-term career goals?' },
    { id: 12, role: 'HR/Behavioral', diff: 'Hard', category: 'Behavioral', text: 'Describe a situation where a project scope shifted significantly. How did you adapt?' },
  ];

  const handleToggleFav = (qId) => {
    setFavorites((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  // Filtering logic
  const filteredQuestions = questionsDb.filter((q) => {
    const matchesSearch = q.text.toLowerCase().includes(search.toLowerCase());
    const matchesRole = activeRole === 'All' || q.role === activeRole;
    const matchesDiff = activeDiff === 'All' || q.diff === activeDiff;
    return matchesSearch && matchesRole && matchesDiff;
  });

  return (
    <div className="space-y-8 animate-fade-in py-2">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-accent-500" />
          Prep Question Bank
        </h1>
        <p className="text-gray-400 text-sm mt-1">Review standard industry questions, practice answers offline, and bookmark concepts.</p>
      </div>

      {/* Filters & Search Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search questions by keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-accent-500/20 text-sm"
          />
        </div>

        {/* Diff filter dropdown */}
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            value={activeDiff}
            onChange={(e) => setActiveDiff(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-accent-500/20 text-sm appearance-none"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff} Difficulty
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-none border-b border-white/5">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => setActiveRole(role)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0
              ${
                activeRole === role
                  ? 'bg-accent-600/10 border border-accent-500 text-accent-400 font-bold'
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Questions list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredQuestions.map((q) => {
          const isFav = favorites.includes(q.id);

          return (
            <div
              key={q.id}
              className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between gap-4 glass-panel-hover"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-accent-500/10 text-accent-400 border border-accent-500/20 text-[10px] font-bold uppercase tracking-wider">
                      {q.role}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      q.diff === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                      q.diff === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {q.diff}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleFav(q.id)}
                    className="text-gray-500 hover:text-accent-400 transition-colors"
                  >
                    {isFav ? <BookmarkCheck className="w-5 h-5 text-accent-500 fill-accent-500" /> : <Bookmark className="w-5 h-5" />}
                  </button>
                </div>

                <h4 className="text-sm font-bold text-white leading-relaxed">{q.text}</h4>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{q.category}</span>
                <span className="text-accent-400 hover:text-accent-300 text-xs font-semibold flex items-center gap-1">
                  <span>Topic summary</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}

        {filteredQuestions.length === 0 && (
          <div className="col-span-2 text-center py-12 bg-slate-950/20 rounded-2xl border border-dashed border-white/5">
            <p className="text-gray-500 text-sm">No questions match your current search/filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;
