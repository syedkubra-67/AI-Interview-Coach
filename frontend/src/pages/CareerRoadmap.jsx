import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import {
  Map,
  Compass,
  Award,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const CareerRoadmap = () => {
  const [formData, setFormData] = useState({
    targetRole: 'Full Stack Developer',
    currentSkills: '',
    cgpa: '',
  });
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  const { showToast } = useToast();

  const rolesList = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'AI Engineer',
    'Data Scientist',
    'Data Analyst',
  ];

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await API.get('/roadmaps/latest');
        if (res.data && res.data.success) {
          setRoadmap(res.data.data);
        }
      } catch (err) {
        // No roadmap exists yet, ignore error silently
      }
    };
    fetchLatest();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.targetRole || !formData.cgpa) {
      showToast('Please specify targetRole and CGPA', 'warning');
      return;
    }

    const cgpaVal = parseFloat(formData.cgpa);
    if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) {
      showToast('Please enter a valid CGPA between 0 and 10', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/roadmaps/generate', {
        targetRole: formData.targetRole,
        currentSkills: formData.currentSkills,
        cgpa: cgpaVal,
      });

      if (res.data && res.data.success) {
        setRoadmap(res.data.data);
        showToast('Personalized roadmap created!', 'success');
        setFormData(prev => ({ ...prev, currentSkills: '', cgpa: '' }));
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to synthesize roadmap.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in py-2">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Map className="w-8 h-8 text-accent-500" />
          Career Roadmap Generator
        </h1>
        <p className="text-gray-400 text-sm mt-1">Devise structured learning timelines, coding projects, and prep tasks aligned with your GPA.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Setup Parameters Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6 h-fit">
          <h3 className="text-md font-bold text-white uppercase tracking-wider text-xs">Configure Roadmap Parameters</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Target Role</label>
              <select
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500/50 text-sm"
              >
                {rolesList.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Current Skills"
              name="currentSkills"
              placeholder="e.g. HTML, CSS, JavaScript (comma-separated)"
              value={formData.currentSkills}
              onChange={handleChange}
            />

            <Input
              label="CGPA"
              name="cgpa"
              type="number"
              step="0.01"
              placeholder="e.g. 8.5 (on a 10.0 scale)"
              value={formData.cgpa}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 text-sm"
              loading={loading}
              icon={<Sparkles className="w-4 h-4" />}
            >
              Generate Roadmap
            </Button>
          </form>
        </div>

        {/* Generated Roadmap Display Panel */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="glass-panel p-8 rounded-3xl space-y-6 animate-pulse">
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-500"></div>
              </div>
              <h3 className="text-center text-sm font-semibold text-gray-400">Gemini is synthesizing study pathways...</h3>
              <LoadingSkeleton variant="text" />
            </div>
          ) : roadmap ? (
            <div className="space-y-8 animate-slide-up">
              {/* Header card summary */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-tr from-accent-600/5 to-indigo-600/5">
                <div>
                  <h3 className="text-lg font-bold text-white">{roadmap.targetRole} Roadmap</h3>
                  <p className="text-xs text-gray-400 mt-1">Configured using CGPA: <strong className="text-white">{roadmap.cgpa}</strong></p>
                </div>
                <span className="px-3 py-1 bg-accent-500/10 border border-accent-500/25 rounded-full text-xs font-semibold text-accent-400">
                  Active learning track
                </span>
              </div>

              {/* Weekly study schedule grid */}
              <div className="space-y-4">
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent-400" />
                  6-Week Study Schedule
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {roadmap.weeklyPlan?.map((w) => (
                    <div key={w.week} className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-accent-600/15 border border-accent-500/25 text-accent-400 flex items-center justify-center font-bold text-xs">
                          W{w.week}
                        </span>
                        <h4 className="text-sm font-bold text-white">{w.focus}</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Topics */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Core Topics:</span>
                          <ul className="space-y-1">
                            {w.topics?.map((topic, i) => (
                              <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tasks */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Weekly Tasks / Milestones:</span>
                          <ul className="space-y-1">
                            {w.tasks?.map((task, i) => (
                              <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="space-y-4">
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-accent-400" />
                  Recommended Portfolio Projects
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {roadmap.recommendedProjects?.map((proj, idx) => (
                    <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">{proj.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                        {proj.techStack?.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-400 text-[10px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications and strategy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Certs */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    Target Industrial Credentials
                  </h4>
                  <ul className="space-y-2">
                    {roadmap.certifications?.map((c, i) => (
                      <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Strategy */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    Placement Preparation Plan
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {roadmap.placementPrepPlan}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-950/20 rounded-3xl border border-dashed border-white/5">
              <Map className="w-12 h-12 text-gray-600 mb-3" />
              <h3 className="text-white text-sm font-semibold">No Roadmap Generated</h3>
              <p className="text-gray-500 text-xs mt-1 max-w-xs leading-relaxed">
                Fill in the details in the settings panel to formulate your personalized weekly study goals, certifications, and coding roadmap.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerRoadmap;
