import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { Shield, Users, BarChart3, Coins, Zap, Clock, ShieldAlert } from 'lucide-react';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/admin/stats');
        if (res.data && res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        showToast('Failed to load administrative analytics data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, [showToast]);

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
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 bg-slate-950/20 rounded-2xl border border-dashed border-white/5 space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Access Denied</h3>
        <p className="text-gray-500 text-sm">Administrative metrics could not be fetched.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in py-2">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
          <Shield className="w-8 h-8 text-emerald-500" />
          Administrative Panel
        </h1>
        <p className="text-gray-400 text-sm mt-1">Monitor site statistics, user engagement metrics, and simulated platform billing streams.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Total Registrations</span>
            <p className="text-2xl font-extrabold text-white">{stats.totalUsers}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Users className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Weekly Active Users</span>
            <p className="text-2xl font-extrabold text-white">{stats.activeUsers}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Clock className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Assessments Run</span>
            <p className="text-2xl font-extrabold text-white">{stats.interviewsConducted}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <BarChart3 className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Stat 4 */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Simulated MRR ($)</span>
            <p className="text-2xl font-extrabold text-emerald-400">${stats.simulatedRevenue.toLocaleString()}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Coins className="w-5.5 h-5.5" />
          </div>
        </div>
      </div>

      {/* Aggregate Score Indicator */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-accent-400" />
          System-wide Average score
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-4xl font-extrabold text-accent-400 font-mono">{stats.averageScore}%</span>
          <p className="text-xs text-gray-400 leading-relaxed max-w-md">
            Aggregated mean score computed from all active candidate mock interviews. High scores indicate successful model alignment and thorough answer drafts.
          </p>
        </div>
      </div>

      {/* Recent Users registration list */}
      <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Registrations</h3>
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Top 5 Records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] text-gray-500 font-bold uppercase tracking-wider bg-slate-950/20">
                <th className="p-4 pl-6">Developer</th>
                <th className="p-4">Email</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right pr-6">Initial XP</th>
              </tr>
            </thead>
            <tbody className="text-xs text-gray-300 divide-y divide-white/5">
              {stats.recentUsers?.map((u) => (
                <tr key={u._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center font-bold text-emerald-400 text-xs uppercase">
                        {u.name?.charAt(0)}
                      </div>
                      <span className="font-semibold text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 font-mono">{u.email}</td>
                  <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right pr-6 font-mono font-bold text-accent-400">+{u.stats.xp} XP</td>
                </tr>
              ))}
              {stats.recentUsers?.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500 italic">No users registered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
