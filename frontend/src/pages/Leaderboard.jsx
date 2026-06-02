import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { Trophy, Flame, Award, Medal, Crown, Star } from 'lucide-react';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('xp'); // xp, streak
  const [rankings, setRankings] = useState({ byXp: [], byStreak: [] });
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const [rankRes, myRankRes] = await Promise.all([
          API.get('/leaderboard'),
          API.get('/leaderboard/my-rank'),
        ]);

        if (rankRes.data && rankRes.data.success) {
          setRankings(rankRes.data.data);
        }
        if (myRankRes.data && myRankRes.data.success) {
          setMyRank(myRankRes.data.data);
        }
      } catch (err) {
        showToast('Failed to load global rankings log data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, [showToast]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-amber-400 fill-amber-400/20" />;
      case 2:
        return <Medal className="w-5 h-5 text-slate-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 text-center font-mono font-bold text-gray-500 text-xs">{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  const list = activeTab === 'xp' ? rankings.byXp : rankings.byStreak;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-2">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Trophy className="w-8 h-8 text-accent-500" />
          Global Leaderboard
        </h1>
        <p className="text-gray-400 text-sm mt-1">Compete against student cohorts, stack up XP, and maintain your practice streak.</p>
      </div>

      {/* Ranks context cards for self */}
      {myRank && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-accent-500/20 bg-accent-500/5 flex items-center gap-4">
            <Award className="w-9 h-9 text-accent-400" />
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Your XP Rank</span>
              <p className="text-lg font-extrabold text-white">#{myRank.xpRank} <span className="text-gray-500 font-normal text-xs">of {myRank.totalUsers} developers</span></p>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-center gap-4">
            <Flame className="w-9 h-9 text-amber-400 fill-amber-400/15 animate-pulse" />
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Your Streak Rank</span>
              <p className="text-lg font-extrabold text-white">#{myRank.streakRank} <span className="text-gray-500 font-normal text-xs">of {myRank.totalUsers} developers</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/5 pb-2">
        <button
          onClick={() => setActiveTab('xp')}
          className={`pb-2 text-sm font-bold transition-all border-b-2 px-1
            ${activeTab === 'xp' ? 'border-accent-500 text-white font-extrabold' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          Rankings by XP
        </button>
        <button
          onClick={() => setActiveTab('streak')}
          className={`pb-2 text-sm font-bold transition-all border-b-2 px-1
            ${activeTab === 'streak' ? 'border-amber-500 text-white font-extrabold' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          Rankings by Streak
        </button>
      </div>

      {/* Table list */}
      <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-xs text-gray-400 font-semibold uppercase tracking-wider bg-slate-950/20">
                <th className="p-4 pl-6 w-20">Rank</th>
                <th className="p-4">User</th>
                <th className="p-4 text-right pr-6">Score / Metric</th>
              </tr>
            </thead>
            <tbody className="text-xs text-gray-300 divide-y divide-white/5">
              {list.map((u, idx) => (
                <tr key={u._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 pl-6 flex items-center h-14">{getRankIcon(idx + 1)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-center justify-center font-bold text-accent-400">
                        {u.name?.charAt(0)}
                      </div>
                      <span className="font-semibold text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right pr-6 font-mono font-bold">
                    {activeTab === 'xp' ? (
                      <span className="text-accent-400 flex items-center justify-end gap-1">
                        <Award className="w-4 h-4" />
                        {u.stats.xp} XP
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center justify-end gap-1">
                        <Flame className="w-4 h-4 fill-amber-400/10 animate-pulse" />
                        {u.stats.streak} Days
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {list.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-500 italic">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
