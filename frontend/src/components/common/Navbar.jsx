import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Flame, Award, LogOut, LayoutDashboard, User } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-600 to-indigo-600 flex items-center justify-center shadow-md shadow-accent-600/35 border border-white/10 font-bold text-white text-lg">
            AI
          </div>
          <span className="font-extrabold text-white text-lg tracking-tight bg-clip-text">
            AI Interview Coach
          </span>
        </Link>

        {/* Action Menu */}
        <div className="flex items-center gap-4">
          {/* User Specific Stats */}
          {user && (
            <div className="hidden md:flex items-center gap-5 mr-3">
              {/* Streak Tracker */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>{user.stats?.streak || 0} Day Streak</span>
              </div>

              {/* XP Rewards */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-500/10 border border-accent-500/20 text-accent-400 text-xs font-semibold">
                <Award className="w-4 h-4" />
                <span>{user.stats?.xp || 0} XP</span>
              </div>
            </div>
          )}

          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-white/5 hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Dynamic Login/Logout buttons */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="hidden sm:inline-flex">
                <Button variant="glass" size="sm" icon={<LayoutDashboard className="w-4 h-4" />}>
                  Dashboard
                </Button>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl border border-rose-500/15 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="glass" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
