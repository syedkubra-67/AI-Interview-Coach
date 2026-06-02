import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { PlayCircle, Clock, ArrowLeft, ArrowRight, ShieldAlert, Cpu, Sparkles, MessageSquare } from 'lucide-react';
import Button from '../components/common/Button';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const InterviewSession = () => {
  const [stage, setStage] = useState('setup'); // setup, session, evaluating
  const [formData, setFormData] = useState({ jobRole: 'Frontend Developer', difficulty: 'Medium' });
  const [interview, setInterview] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: "userAnswer" }
  const [timer, setTimer] = useState(0); // overall duration
  const [loading, setLoading] = useState(false);
  const [evalProgress, setEvalProgress] = useState(0); // simulation text progress

  const timerRef = useRef(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Roles list
  const rolesList = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'AI Engineer',
    'Data Scientist',
    'Data Analyst',
  ];

  // Difficulty levels
  const levelsList = ['Easy', 'Medium', 'Hard'];

  // Start timer when session commences
  useEffect(() => {
    if (stage === 'session') {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [stage]);

  const handleStartSetup = async () => {
    setLoading(true);
    try {
      const res = await API.post('/interviews/generate', formData);
      if (res.data && res.data.success) {
        setInterview(res.data.interview);
        // Pre-fill empty answers for all questions
        const initialAnswers = {};
        res.data.interview.questions.forEach((q) => {
          initialAnswers[q.questionId] = '';
        });
        setAnswers(initialAnswers);
        setStage('session');
        setCurrentIdx(0);
        setTimer(0);
        showToast('Interview session generated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to start interview. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e) => {
    const questionId = interview.questions[currentIdx].questionId;
    setAnswers((prev) => ({ ...prev, [questionId]: e.target.value }));
  };

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentIdx < interview.questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleSubmitInterview = async () => {
    // Check if at least one question is answered
    const answeredCount = Object.values(answers).filter(val => val.trim().length > 0).length;
    if (answeredCount === 0) {
      showToast('Please answer at least one question before submitting', 'warning');
      return;
    }

    setStage('evaluating');
    setEvalProgress(10);

    // Simulate analysis loader checkpoints
    const interval = setInterval(() => {
      setEvalProgress((prev) => {
        if (prev < 90) return prev + 15;
        clearInterval(interval);
        return prev;
      });
    }, 1500);

    try {
      const answersPayload = Object.keys(answers).map((qId) => ({
        questionId: parseInt(qId),
        userAnswer: answers[qId],
      }));

      const res = await API.post('/interviews/evaluate', {
        interviewId: interview.id,
        answers: answersPayload,
      });

      clearInterval(interval);
      setEvalProgress(100);

      if (res.data && res.data.success) {
        showToast(`Interview evaluated! Earned ${res.data.earnedXp} XP!`, 'success');
        navigate(`/report/${interview.id}`);
      }
    } catch (err) {
      clearInterval(interval);
      setStage('session');
      showToast(err.response?.data?.error || 'Answer evaluation failed. Check internet.', 'error');
    }
  };

  // Renders the setup options screen
  if (stage === 'setup') {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in py-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Cpu className="w-8 h-8 text-accent-500" />
            Interview Generator
          </h1>
          <p className="text-gray-400 text-sm mt-1">Configure your mock session. Gemini generates 10 unique, targeted questions.</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl space-y-6 border border-white/5 shadow-2xl">
          {/* Dropdown 1 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Target Job Role</label>
            <select
              value={formData.jobRole}
              onChange={(e) => setFormData((prev) => ({ ...prev, jobRole: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500/50"
            >
              {rolesList.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Selector 2 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-3">
              {levelsList.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, difficulty: level }))}
                  className={`py-3 rounded-xl border text-sm font-semibold transition-all duration-200
                    ${
                      formData.difficulty === level
                        ? 'bg-accent-600/10 border-accent-500 text-accent-400 font-bold'
                        : 'bg-slate-900/50 border-slate-800 text-gray-400 hover:border-white/10 hover:text-white'
                    }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleStartSetup}
              variant="primary"
              className="w-full py-3.5 text-sm"
              loading={loading}
              icon={<PlayCircle className="w-4 h-4" />}
            >
              Generate Questions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Renders the evaluation screening
  if (stage === 'evaluating') {
    return (
      <div className="max-w-md mx-auto min-h-[50vh] flex flex-col items-center justify-center text-center p-8 space-y-6 animate-fade-in bg-[#080b11]">
        <div className="w-16 h-16 rounded-2xl bg-accent-500/10 flex items-center justify-center border border-accent-500/35 shadow-lg shadow-accent-600/10 animate-bounce">
          <Sparkles className="w-8 h-8 text-accent-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-white">Synthesizing Feedback Score</h2>
          <p className="text-gray-400 text-xs leading-relaxed max-w-xs mx-auto">
            Gemini is evaluating your technical accuracy, key vocabulary selection, structure, and clarity.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-3.5 p-0.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-accent-600 to-indigo-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${evalProgress}%` }}
          ></div>
        </div>
        <span className="text-xs font-mono font-bold text-accent-400">{evalProgress}% Complete</span>
      </div>
    );
  }

  // Renders the core active session
  const currentQuestion = interview.questions[currentIdx];
  const questionId = currentQuestion.questionId;
  const currentAnswer = answers[questionId] || '';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in py-4">
      {/* Session Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl glass-panel border border-white/5 gap-3">
        <div>
          <span className="px-2 py-0.5 rounded bg-accent-500/10 text-accent-400 text-[10px] uppercase font-bold tracking-wider">
            {interview.difficulty}
          </span>
          <h2 className="text-md font-bold text-white mt-1.5">{interview.jobRole} Interview</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-gray-300 text-xs font-mono">
          <Clock className="w-4 h-4 text-accent-400" />
          <span>Timer: {formatTime(timer)}</span>
        </div>
      </div>

      {/* Progress indicators bar */}
      <div className="flex items-center gap-1.5 w-full bg-slate-900/50 p-1.5 rounded-xl border border-white/5 overflow-x-auto scrollbar-none">
        {interview.questions.map((q, idx) => (
          <button
            key={q.questionId}
            onClick={() => setCurrentIdx(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0
              ${
                idx === currentIdx
                  ? 'bg-accent-600 text-white shadow-md shadow-accent-600/25'
                  : answers[q.questionId]?.trim().length > 0
                  ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400'
                  : 'bg-slate-950/40 border border-white/5 text-gray-500 hover:text-white'
              }`}
          >
            Q{idx + 1}
          </button>
        ))}
      </div>

      {/* Question Workspace Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col gap-6 shadow-xl relative min-h-[400px] justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-accent-500/20 text-accent-400 text-[10px] font-bold uppercase tracking-wider">
              {currentQuestion.category} Question
            </span>
            <span className="text-gray-500 text-xs font-semibold">Q{currentIdx + 1} of 10</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {currentQuestion.questionText}
          </h3>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
              <label htmlFor="answer-input" className="uppercase tracking-wider">Your Answer</label>
              <span>{currentAnswer.length} chars</span>
            </div>
            <textarea
              id="answer-input"
              value={currentAnswer}
              onChange={handleTextChange}
              placeholder="Type your detailed, structured answer here. Include relevant keywords, design paradigms, or framework details as necessary..."
              className="w-full min-h-[180px] bg-slate-950/40 border border-slate-800 hover:border-slate-700 focus:border-accent-500 text-white rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-accent-500/15 leading-relaxed resize-y transition-all"
            />
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex justify-between items-center pt-6 border-t border-white/5 gap-3">
          <Button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            variant="glass"
            size="md"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          {currentIdx === interview.questions.length - 1 ? (
            <Button
              onClick={handleSubmitInterview}
              variant="primary"
              size="md"
              icon={<Sparkles className="w-4 h-4" />}
            >
              Submit Interview
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="secondary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              className="flex-row-reverse gap-2"
            >
              Next
            </Button>
          )}
        </div>
      </div>

      {/* Quick helper advice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/15 text-amber-300 text-xs leading-relaxed">
        <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>
          <strong>Coach Tip:</strong> Avoid generic one-liners. Use the STAR method (Situation, Task, Action, Result) for behavioral questions, and explain framework/library core properties for technical inquiries.
        </p>
      </div>
    </div>
  );
};

export default InterviewSession;
