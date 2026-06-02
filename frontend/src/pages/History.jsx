import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { History as HistoryIcon, Calendar, ArrowLeft, PlayCircle, ShieldAlert } from 'lucide-react';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import Button from '../components/common/Button';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get('/interviews/history');
        if (res.data && res.data.success) {
          setHistory(res.data.data);
        }
      } catch (err) {
        showToast('Failed to load complete interview history', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [showToast]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 60) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in py-2">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors mb-2 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5">
            <HistoryIcon className="w-8 h-8 text-accent-500" />
            Interview History Logs
          </h1>
          <p className="text-gray-400 text-sm mt-1">Review all your previous evaluations, question scores, and Gemini reports.</p>
        </div>
        <Link to="/interview">
          <Button variant="primary" icon={<PlayCircle className="w-4 h-4" />}>
            New Mock Interview
          </Button>
        </Link>
      </div>

      {/* History table */}
      <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs text-gray-400 font-semibold uppercase tracking-wider bg-slate-950/20">
                  <th className="p-4 pl-6">Role</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">Attempted Date</th>
                  <th className="p-4">Score</th>
                  <th className="p-4 text-center pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="text-xs text-gray-300 divide-y divide-white/5">
                {history.map((item) => (
                  <tr key={item._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-white">{item.jobRole}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-accent-500/10 text-accent-400 border border-accent-500/25 font-semibold text-[10px] uppercase">
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 font-semibold flex items-center gap-1.5 mt-2.5 h-full">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.completedAt || item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-xl border text-[11px] font-mono font-bold ${getScoreColor(item.overallReport?.overallScore || 0)}`}>
                        {item.overallReport?.overallScore || 0}% Score
                      </span>
                    </td>
                    <td className="p-4 text-center pr-6">
                      <Link to={`/report/${item._id}`}>
                        <Button variant="glass" size="sm">Review Report</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-8 flex flex-col items-center justify-center gap-4">
            <ShieldAlert className="w-12 h-12 text-gray-600" />
            <h3 className="text-white text-md font-semibold">No Sessions Recorded</h3>
            <p className="text-gray-500 text-xs max-w-xs leading-relaxed">
              You haven't completed any mock interviews yet. Generate a test session, answer some questions, and evaluate them to see logs.
            </p>
            <Link to="/interview">
              <Button variant="primary" size="sm">Start Practice</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
