import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import {
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  AlertTriangle,
  Compass,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import Button from '../components/common/Button';

const InterviewReport = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); // track expanded question index

  const { showToast } = useToast();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await API.get(`/interviews/report/${id}`);
        if (res.data && res.data.success) {
          setReport(res.data.data);
        }
      } catch (err) {
        showToast('Failed to load interview report card details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id, showToast]);

  const toggleExpand = (qId) => {
    setExpandedId((prev) => (prev === qId ? null : qId));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 60) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
  };

  const getBadgeColor = (score) => {
    if (score >= 8) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
    if (score >= 6) return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="text" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LoadingSkeleton variant="card" className="md:col-span-1" />
          <LoadingSkeleton variant="card" className="md:col-span-2" />
        </div>
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12 bg-slate-950/20 rounded-2xl border border-dashed border-white/5 space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Report Not Found</h3>
        <p className="text-gray-500 text-sm">We could not fetch the evaluation details for this session.</p>
        <Link to="/dashboard">
          <Button variant="glass" size="sm">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const { interview, overallScore, strengths, weaknesses, actionPlan } = report;

  return (
    <div className="space-y-8 animate-fade-in py-2">
      {/* Navigation & Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors mb-2 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Performance Scorecard</h1>
          <p className="text-gray-400 text-sm">
            Analysis for <span className="text-white font-semibold">{interview?.jobRole}</span> attempt.
          </p>
        </div>

        <Link to="/interview">
          <Button variant="glass" size="sm" icon={<FileSpreadsheet className="w-4 h-4" />}>
            Practice Another Role
          </Button>
        </Link>
      </div>

      {/* Overview Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Aggregated Rating Score */}
        <div className={`glass-panel p-8 rounded-3xl border flex flex-col items-center justify-center text-center gap-4 ${getScoreColor(overallScore)}`}>
          <Award className="w-12 h-12 stroke-[1.5]" />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Integrated Score</h3>
            <span className="text-6xl font-extrabold font-mono mt-1 block">{overallScore}</span>
            <span className="text-sm font-semibold block text-gray-400 mt-1">out of 100 points</span>
          </div>
          <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold uppercase tracking-wider border border-white/5 text-gray-300">
            {overallScore >= 80 ? 'Excellent Match' : overallScore >= 60 ? 'Competent Match' : 'Training Required'}
          </span>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Strengths */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-emerald-400" />
              Key Strengths
            </h3>
            <ul className="space-y-3">
              {strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{str}</span>
                </li>
              ))}
              {strengths.length === 0 && (
                <p className="text-xs text-gray-500 italic">No specific strengths captured.</p>
              )}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Gaps identified
            </h3>
            <ul className="space-y-3">
              {weaknesses.map((weak, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed">
                  <XCircle className="w-4.5 h-4.5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{weak}</span>
                </li>
              ))}
              {weaknesses.length === 0 && (
                <p className="text-xs text-gray-500 italic">No major vulnerabilities found.</p>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Plan */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <Compass className="w-4.5 h-4.5 text-accent-400" />
          Actionable Development Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actionPlan.map((action, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-white/5 text-xs text-gray-300 leading-relaxed flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-accent-500/10 text-accent-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                {idx + 1}
              </span>
              <span>{action}</span>
            </div>
          ))}
          {actionPlan.length === 0 && (
            <p className="text-xs text-gray-500 italic md:col-span-2">No custom tasks generated.</p>
          )}
        </div>
      </div>

      {/* Expanded Accordion list for the 10 questions */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-400" />
          Question Breakdown
        </h3>

        <div className="space-y-3">
          {interview?.questions.map((q) => {
            const isExpanded = expandedId === q.questionId;
            const qScore = q.feedback?.score || 0;

            return (
              <div
                key={q.questionId}
                className="glass-panel rounded-2xl border border-white/5 overflow-hidden transition-all duration-200"
              >
                {/* Header button click */}
                <button
                  onClick={() => toggleExpand(q.questionId)}
                  className="w-full p-5 flex items-center justify-between text-left gap-4 hover:bg-white/5 transition-colors focus:outline-none"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] uppercase font-bold text-gray-400 flex-shrink-0">
                      Q{q.questionId}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate max-w-xl">{q.questionText}</h4>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className={`px-2 py-1 border rounded text-xs font-bold ${getBadgeColor(qScore)}`}>
                      Score: {qScore}/10
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>

                {/* Expanded answers content */}
                {isExpanded && (
                  <div className="p-6 bg-slate-950/30 border-t border-white/5 space-y-6 animate-slide-up">
                    {/* User Answer Panel */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Your Answer:</h5>
                      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-900 text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
                        {q.userAnswer || <span className="italic text-gray-600">No answer submitted for this question.</span>}
                      </div>
                    </div>

                    {/* Gemini Score breakdowns */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center space-y-1">
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Technical Accuracy</span>
                        <span className="text-lg font-bold text-white block">{q.feedback?.technicalAccuracy || 0}/10</span>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center space-y-1">
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Communication</span>
                        <span className="text-lg font-bold text-white block">{q.feedback?.communicationQuality || 0}/10</span>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center space-y-1">
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Clarity</span>
                        <span className="text-lg font-bold text-white block">{q.feedback?.clarity || 0}/10</span>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center space-y-1">
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Confidence Level</span>
                        <span className={`text-sm font-bold block mt-1 ${
                          q.feedback?.confidenceEstimation === 'High' ? 'text-emerald-400' :
                          q.feedback?.confidenceEstimation === 'Medium' ? 'text-amber-400' :
                          q.feedback?.confidenceEstimation === 'Low' ? 'text-rose-400' : 'text-gray-400'
                        }`}>
                          {q.feedback?.confidenceEstimation || 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-accent-400 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-accent-400" />
                        Coach Recommendations:
                      </h5>
                      <p className="text-xs text-gray-300 leading-relaxed bg-accent-500/5 p-4 rounded-xl border border-accent-500/15">
                        {q.feedback?.suggestions || 'No recommendation logged.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InterviewReport;
