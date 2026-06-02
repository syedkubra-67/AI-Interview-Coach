import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  PlayCircle,
  Flame,
  Award,
  Calendar,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Brain,
  ShieldAlert,
} from 'lucide-react';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import Button from '../components/common/Button';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get('/interviews/history');
        if (res.data && res.data.success) {
          setHistory(res.data.data);
        }
      } catch (err) {
        showToast('Failed to load recent interviews history', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [showToast]);

  // Compute stat averages
  const completedInterviews = history.length;
  const avgScore = completedInterviews > 0
    ? Math.round(history.reduce((sum, item) => sum + (item.overallReport?.overallScore || 0), 0) / completedInterviews)
    : 0;

  // Chart configuration
  const chartData = {
    labels: [...history].reverse().map((item, idx) => `Session ${idx + 1}`),
    datasets: [
      {
        fill: true,
        label: 'Overall Performance Score (%)',
        data: [...history].reverse().map(item => item.overallReport?.overallScore || 0),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#8b5cf6',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 10,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 10,
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="text" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
        <LoadingSkeleton variant="chart" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Hello, {user?.name}. Ready to level up your skills today?</p>
        </div>
        <Link to="/interview">
          <Button variant="primary" icon={<PlayCircle className="w-4 h-4" />}>
            New Mock Interview
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Interviews Practiced</p>
            <h3 className="text-2xl font-extrabold text-white">{completedInterviews}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <FileSpreadsheet className="w-5.5 h-5.5" />
          </div>
        </div>
        {/* Stat 2 */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Average Evaluation</p>
            <h3 className="text-2xl font-extrabold text-white">{avgScore}%</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <TrendingUp className="w-5.5 h-5.5" />
          </div>
        </div>
        {/* Stat 3 */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Streak</p>
            <h3 className="text-2xl font-extrabold text-white">{user?.stats?.streak || 0} Days</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Flame className="w-5.5 h-5.5 fill-amber-500/20" />
          </div>
        </div>
        {/* Stat 4 */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Experience Points</p>
            <h3 className="text-2xl font-extrabold text-white">{user?.stats?.xp || 0} XP</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Award className="w-5.5 h-5.5" />
          </div>
        </div>
      </div>

      {/* Middle Grid: Chart and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Line Chart */}
        <div className="glass-panel p-6 rounded-3xl lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-accent-400" />
              <h3 className="text-lg font-bold text-white">Performance Index</h3>
            </div>
            <span className="text-xs font-semibold text-gray-500 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md">
              Score History
            </span>
          </div>

          <div className="h-64 relative">
            {completedInterviews > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-950/20 rounded-2xl border border-dashed border-white/5">
                <ShieldAlert className="w-10 h-10 text-gray-600 mb-3" />
                <h4 className="text-white text-sm font-semibold">No Performance Data Yet</h4>
                <p className="text-gray-500 text-xs mt-1">Complete your first mock interview session to unlock charts visualization.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Tools Access */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Actions</h3>
            <p className="text-gray-400 text-xs">Unlock your career milestones with Gemini diagnostics.</p>
          </div>

          <div className="space-y-4">
            <Link to="/resume" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
              <div>
                <h4 className="text-sm font-semibold text-white">Resume ATS Scanner</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Parse resume and audit skill mismatches</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
            </Link>

            <Link to="/roadmap" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
              <div>
                <h4 className="text-sm font-semibold text-white">Career Pathways</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Synthesize 6-week personalized roadmaps</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
            </Link>

            <Link to="/voice-interview" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
              <div>
                <h4 className="text-sm font-semibold text-white">AI Voice Room</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Speak answers & check verbal mechanics</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Interviews Log */}
      <div className="glass-panel p-6 rounded-3xl space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Recent Mock Interviews</h3>
          {completedInterviews > 5 && (
            <Link to="/history" className="text-xs font-semibold text-accent-400 hover:text-accent-300 flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {completedInterviews > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.slice(0, 3).map((item) => (
              <div key={item._id} className="p-5 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-accent-500/30 transition-all flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 rounded bg-accent-500/10 text-accent-400 border border-accent-500/20 text-[10px] uppercase font-bold tracking-wider">
                      {item.difficulty}
                    </span>
                    <span className="text-gray-500 text-[10px] font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.completedAt || item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.jobRole}</h4>
                  <p className="text-xs text-gray-500">10 Questions (HR, Technical, Behavioral)</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <div>
                    <span className="text-xs font-semibold text-gray-400">Score: </span>
                    <span className={`text-sm font-extrabold ${
                      (item.overallReport?.overallScore || 0) >= 80 ? 'text-emerald-400' :
                      (item.overallReport?.overallScore || 0) >= 60 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {item.overallReport?.overallScore || 0}%
                    </span>
                  </div>
                  <Link to={`/report/${item._id}`}>
                    <Button variant="glass" size="sm">Review Report</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-950/20 rounded-2xl border border-dashed border-white/5">
            <p className="text-gray-500 text-sm">No interviews completed yet.</p>
            <Link to="/interview" className="mt-4 inline-block">
              <Button variant="primary" size="sm">Start Your First Interview</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
