import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlayCircle,
  FileText,
  Map,
  Mic,
  Trophy,
  History,
  BookOpen,
  Shield,
  User,
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Mock Interview', path: '/interview', icon: <PlayCircle className="w-5 h-5" /> },
    { name: 'AI Voice Room', path: '/voice-interview', icon: <Mic className="w-5 h-5" /> },
    { name: 'Resume Analyzer', path: '/resume', icon: <FileText className="w-5 h-5" /> },
    { name: 'Career Roadmap', path: '/roadmap', icon: <Map className="w-5 h-5" /> },
    { name: 'Question Bank', path: '/question-bank', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="w-5 h-5" /> },
    { name: 'History Logs', path: '/history', icon: <History className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-white/5 h-[calc(100vh-4rem)] sticky top-16 hidden md:flex flex-col justify-between p-4 flex-shrink-0">
      <div className="space-y-6">
        {/* Navigation Section */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent
                ${
                  isActive
                    ? 'bg-accent-600/10 border-accent-500/20 text-accent-400 font-semibold'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Separator for Admin */}
        {user?.role === 'admin' && (
          <div className="pt-4 border-t border-white/5">
            <span className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-2">
              System Admin
            </span>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent
                ${
                  isActive
                    ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400 font-semibold'
                    : 'text-gray-400 hover:bg-white/5 hover:text-emerald-400'
                }`
              }
            >
              <Shield className="w-5 h-5" />
              <span>Admin Panel</span>
            </NavLink>
          </div>
        )}
      </div>

      {/* Footer Profile Details */}
      {user && (
        <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent-600/20 border border-accent-500/30 flex items-center justify-center text-accent-400 font-bold uppercase text-sm">
            {user.name?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-semibold text-white truncate">{user.name}</h4>
            <p className="text-[10px] text-gray-500 truncate uppercase tracking-wider font-semibold">
              {user.role} Member
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
