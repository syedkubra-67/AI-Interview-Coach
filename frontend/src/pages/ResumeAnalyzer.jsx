import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import {
  FileText,
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Trash2,
  Calendar,
  Zap,
} from 'lucide-react';
import Button from '../components/common/Button';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const { showToast } = useToast();

  const fetchHistory = async () => {
    try {
      const res = await API.get('/resumes/history');
      if (res.data && res.data.success) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load resume scan history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        showToast('Only PDF files are supported', 'warning');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      showToast('Please select a PDF file first', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setLoading(true);
    try {
      const res = await API.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data && res.data.success) {
        setResult(res.data.data);
        showToast('Resume scanned successfully!', 'success');
        setFile(null);
        fetchHistory(); // Refresh history log
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to scan resume. Verify format.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 60) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
  };

  return (
    <div className="space-y-8 animate-fade-in py-2">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <FileText className="w-8 h-8 text-accent-500" />
          ATS Resume Analyzer
        </h1>
        <p className="text-gray-400 text-sm mt-1">Audit ATS compliance, extract skills, and identify gaps instantly with Gemini AI.</p>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6 h-fit">
          <h3 className="text-md font-bold text-white uppercase tracking-wider text-xs">Scan New Resume</h3>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border border-dashed border-white/10 hover:border-accent-500/50 rounded-2xl p-6 text-center bg-slate-950/20 transition-all relative flex flex-col items-center justify-center min-h-[160px]">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
              <UploadCloud className="w-8 h-8 text-gray-500 mb-2" />
              {file ? (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-white truncate max-w-[200px]">{file.name}</p>
                  <p className="text-[10px] text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-300">Drag & Drop or Click to browse</p>
                  <p className="text-[10px] text-gray-500">Supports PDF format (Max 5MB)</p>
                </div>
              )}
            </div>

            {file && (
              <div className="flex gap-2 justify-end">
                <Button onClick={() => setFile(null)} variant="glass" size="sm" icon={<Trash2 className="w-4 h-4" />}>
                  Clear
                </Button>
                <Button type="submit" variant="primary" size="sm" loading={loading} icon={<Cpu className="w-4 h-4" />}>
                  Analyze
                </Button>
              </div>
            )}
          </form>

          {/* Simple explanation */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 text-[11px] text-gray-400 leading-relaxed space-y-1.5">
            <span className="font-bold text-gray-300 uppercase tracking-wider block">How it works:</span>
            <p>Our auditor parses text blocks, maps extracted tech tools against modern role profiles, computes formatting weights, and suggestions.</p>
          </div>
        </div>

        {/* Audit Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="glass-panel p-8 rounded-3xl space-y-6 animate-pulse">
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-500"></div>
              </div>
              <h3 className="text-center text-sm font-semibold text-gray-400">Gemini is auditing resume semantics...</h3>
              <LoadingSkeleton variant="text" />
            </div>
          ) : result ? (
            <div className="space-y-6 animate-slide-up">
              {/* ATS Metric Ring */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`glass-panel p-6 rounded-2xl border flex flex-col items-center justify-center text-center gap-3 ${getScoreColor(result.atsScore)}`}>
                  <TrendingUp className="w-8 h-8" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">ATS Match Index</span>
                    <span className="text-4xl font-extrabold font-mono">{result.atsScore}%</span>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5 md:col-span-2 flex flex-col justify-center gap-2">
                  <h4 className="text-sm font-bold text-white">File Audit Complete</h4>
                  <p className="text-xs text-gray-400">Scan details of: <strong className="text-white font-medium">{result.resumeFileName}</strong></p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Audited on {new Date(result.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Skills Cloud */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Extracted */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Extracted Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.skillsExtracted.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                        {s}
                      </span>
                    ))}
                    {result.skillsExtracted.length === 0 && <span className="text-xs text-gray-500 italic">None identified</span>}
                  </div>
                </div>

                {/* Missing */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    Missing / Suggested Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingSkills.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                        {s}
                      </span>
                    ))}
                    {result.missingSkills.length === 0 && <span className="text-xs text-gray-500 italic">None suggested</span>}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-accent-400 fill-accent-400/10" />
                  SaaS Recommendations For Improvement
                </h4>
                <div className="space-y-3">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed">
                      <ArrowRight className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-950/20 rounded-3xl border border-dashed border-white/5">
              <UploadCloud className="w-12 h-12 text-gray-600 mb-3" />
              <h3 className="text-white text-sm font-semibold">No Resume Audited</h3>
              <p className="text-gray-500 text-xs mt-1 max-w-xs leading-relaxed">
                Upload your engineering PDF resume in the sidebar tool panel to analyze ATS tags and formatting compliance indices.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History Log */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
        <h3 className="text-md font-bold text-white">Previous Resume Scans</h3>
        {historyLoading ? (
          <LoadingSkeleton variant="table" />
        ) : history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">File Name</th>
                  <th className="pb-3">ATS Rating</th>
                  <th className="pb-3">Skills Detected</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="text-xs text-gray-300 divide-y divide-white/5">
                {history.map((h) => (
                  <tr key={h._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-semibold text-white max-w-[150px] truncate">{h.resumeFileName}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 border rounded text-[10px] font-bold ${
                        h.atsScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' :
                        h.atsScore >= 60 ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/25'
                      }`}>
                        {h.atsScore}% Match
                      </span>
                    </td>
                    <td className="py-3 max-w-[200px] truncate">{h.skillsExtracted.slice(0, 4).join(', ')}...</td>
                    <td className="py-3 text-gray-500">{new Date(h.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <button
                        onClick={() => setResult(h)}
                        className="text-accent-400 hover:text-accent-300 font-bold transition-all"
                      >
                        Inspect Result
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-xs italic">No scan history recorded.</p>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
