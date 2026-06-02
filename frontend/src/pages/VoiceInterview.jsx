import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import {
  Mic,
  MicOff,
  Volume2,
  PlayCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Info,
  Award,
} from 'lucide-react';
import Button from '../components/common/Button';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const VoiceInterview = () => {
  const [stage, setStage] = useState('setup'); // setup, session, evaluating
  const [formData, setFormData] = useState({ jobRole: 'Frontend Developer', difficulty: 'Medium' });
  const [interview, setInterview] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [evalProgress, setEvalProgress] = useState(0);

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [speakingSpeed, setSpeakingSpeed] = useState(0); // WPM
  const [fillerWordsCount, setFillerWordsCount] = useState(0);

  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const rolesList = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'AI Engineer',
    'Data Scientist',
    'Data Analyst',
  ];

  // Speech Recognition hook setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        
        // Update the current answer draft
        const questionId = interview.questions[currentIdx].questionId;
        setAnswers((prev) => ({ ...prev, [questionId]: transcript }));
      };

      recognition.onerror = (e) => {
        console.error('Speech recognition error:', e.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [interview, currentIdx]);

  // Overall timer
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

  // Read question text aloud using browser Text-to-Speech
  const handleSpeakQuestion = () => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speaking
      window.speechSynthesis.cancel();
      const text = interview.questions[currentIdx].questionText;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for readability
      window.speechSynthesis.speak(utterance);
    } else {
      showToast('Text-to-speech is not supported on this browser', 'info');
    }
  };

  const handleStartSetup = async () => {
    setLoading(true);
    try {
      const res = await API.post('/interviews/generate', formData);
      if (res.data && res.data.success) {
        setInterview(res.data.interview);
        const initialAnswers = {};
        res.data.interview.questions.forEach((q) => {
          initialAnswers[q.questionId] = '';
        });
        setAnswers(initialAnswers);
        setStage('session');
        setCurrentIdx(0);
        setTimer(0);
        showToast('Voice interview generated!', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to generate interview.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStartRecording = () => {
    if (!isSpeechSupported || !recognitionRef.current) {
      showToast('Speech recognition is not supported in this browser. Try Chrome/Edge.', 'warning');
      return;
    }
    setIsRecording(true);
    recognitionRef.current.start();
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);

      // Perform local speech analytics
      const questionId = interview.questions[currentIdx].questionId;
      const text = answers[questionId] || '';
      
      // Calculate word counts
      const wordsArray = text.trim().split(/\s+/).filter(w => w.length > 0);
      setWordCount(wordsArray.length);

      // Estimate WPM (assuming 1 minute per question average)
      setSpeakingSpeed(wordsArray.length > 0 ? Math.round(wordsArray.length / 1) : 0);

      // Count fillers ("like", "basically", "um", "uh", "actually")
      const fillers = wordsArray.filter(w => 
        ['like', 'basically', 'actually', 'um', 'uh', 'so'].includes(w.toLowerCase())
      );
      setFillerWordsCount(fillers.length);
    }
  };

  const handleNext = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (currentIdx < interview.questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setWordCount(0);
      setSpeakingSpeed(0);
      setFillerWordsCount(0);
    }
  };

  const handlePrev = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setWordCount(0);
      setSpeakingSpeed(0);
      setFillerWordsCount(0);
    }
  };

  const handleSubmitInterview = async () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    // Map responses payload
    const answeredCount = Object.values(answers).filter(val => val.trim().length > 0).length;
    if (answeredCount === 0) {
      showToast('Please speak and answer at least one question', 'warning');
      return;
    }

    setStage('evaluating');
    setEvalProgress(15);

    const interval = setInterval(() => {
      setEvalProgress((prev) => {
        if (prev < 90) return prev + 20;
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
        showToast('Voice interview evaluation complete!', 'success');
        navigate(`/report/${interview.id}`);
      }
    } catch (err) {
      clearInterval(interval);
      setStage('session');
      showToast(err.response?.data?.error || 'Failed to submit voice answers.', 'error');
    }
  };

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (stage === 'setup') {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in py-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Mic className="w-8 h-8 text-accent-500" />
            AI Voice Interview Room
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Simulate a real verbal interview. Gemini will read questions aloud and parse speech-to-text answers.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl space-y-6 border border-white/5 shadow-2xl">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Target Role</label>
            <select
              value={formData.jobRole}
              onChange={(e) => setFormData((prev) => ({ ...prev, jobRole: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-accent-500/20 text-sm"
            >
              {rolesList.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-3">
              {['Easy', 'Medium', 'Hard'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, difficulty: level }))}
                  className={`py-3 rounded-xl border text-sm font-semibold transition-all duration-200
                    ${
                      formData.difficulty === level
                        ? 'bg-accent-600/10 border-accent-500 text-accent-400 font-bold'
                        : 'bg-slate-900/50 border-slate-800 text-gray-400 hover:text-white'
                    }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {!isSpeechSupported && (
            <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs rounded-xl">
              <Info className="w-4.5 h-4.5 flex-shrink-0" />
              <p>SpeechRecognition API is not supported. Use Google Chrome or Microsoft Edge for a fully operational Voice Room.</p>
            </div>
          )}

          <div className="pt-4">
            <Button
              onClick={handleStartSetup}
              variant="primary"
              className="w-full py-3.5 text-sm"
              loading={loading}
              icon={<PlayCircle className="w-4 h-4" />}
            >
              Enter Voice Room
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'evaluating') {
    return (
      <div className="max-w-md mx-auto min-h-[50vh] flex flex-col items-center justify-center text-center p-8 space-y-6 animate-fade-in bg-[#080b11]">
        <div className="w-16 h-16 rounded-2xl bg-accent-500/10 flex items-center justify-center border border-accent-500/35 shadow-lg shadow-accent-600/10 animate-bounce">
          <Sparkles className="w-8 h-8 text-accent-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-white">Scoring Communication Mechanics</h2>
          <p className="text-gray-400 text-xs leading-relaxed max-w-xs mx-auto">
            Gemini is grading technical accuracy, vocal pacing, sentence fluency, and confidence metrics.
          </p>
        </div>

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

  const currentQuestion = interview.questions[currentIdx];
  const currentAnswer = answers[currentQuestion.questionId] || '';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl glass-panel border border-white/5 gap-3">
        <div>
          <span className="px-2 py-0.5 rounded bg-accent-500/10 text-accent-400 text-[10px] uppercase font-bold tracking-wider">
            Voice Room • {interview.difficulty}
          </span>
          <h2 className="text-md font-bold text-white mt-1.5">{interview.jobRole} Interview</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-gray-300 text-xs font-mono">
          <Clock className="w-4 h-4 text-accent-400" />
          <span>Timer: {formatTime(timer)}</span>
        </div>
      </div>

      {/* Progress Line */}
      <div className="flex items-center gap-1.5 w-full bg-slate-900/50 p-1.5 rounded-xl border border-white/5 overflow-x-auto scrollbar-none">
        {interview.questions.map((q, idx) => (
          <button
            key={q.questionId}
            onClick={() => setCurrentIdx(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0
              ${
                idx === currentIdx
                  ? 'bg-accent-600 text-white shadow-md'
                  : answers[q.questionId]?.trim().length > 0
                  ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400'
                  : 'bg-slate-950/40 border border-white/5 text-gray-500 hover:text-white'
              }`}
          >
            Q{idx + 1}
          </button>
        ))}
      </div>

      {/* Mic Room workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6 lg:col-span-2 min-h-[350px] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span className="px-2 py-0.5 rounded bg-accent-500/10 border border-accent-500/20 text-accent-400 font-semibold">{currentQuestion.category}</span>
              <span>Question {currentIdx + 1} of 10</span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <h3 className="text-md sm:text-lg font-bold text-white leading-relaxed">
                {currentQuestion.questionText}
              </h3>
              <button
                onClick={handleSpeakQuestion}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 flex-shrink-0"
                title="Hear question text"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Answer Display */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-900 min-h-[120px] text-xs font-mono text-gray-300 leading-relaxed whitespace-pre-wrap">
              {currentAnswer || <span className="text-gray-600 italic">No verbal response recorded yet. Click 'Start Speaking' to transcribe your answer.</span>}
            </div>
          </div>

          {/* Nav tools */}
          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <Button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              variant="glass"
              size="sm"
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Prev
            </Button>

            {currentIdx === interview.questions.length - 1 ? (
              <Button
                onClick={handleSubmitInterview}
                variant="primary"
                size="sm"
                icon={<Sparkles className="w-4 h-4" />}
              >
                Submit Voice Interview
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="secondary"
                size="sm"
                icon={<ArrowRight className="w-4 h-4" />}
                className="flex-row-reverse gap-2"
              >
                Next
              </Button>
            )}
          </div>
        </div>

        {/* Real-time Voice Diagnostics */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between gap-6">
          <div className="text-center space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Microphone Input</h3>

            <div className="flex justify-center py-4">
              {isRecording ? (
                <button
                  onClick={handleStopRecording}
                  className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 animate-pulse border border-rose-500"
                >
                  <MicOff className="w-6 h-6 animate-pulse" />
                </button>
              ) : (
                <button
                  onClick={handleStartRecording}
                  className="w-16 h-16 rounded-full bg-accent-600 hover:bg-accent-500 text-white flex items-center justify-center shadow-lg shadow-accent-600/30 border border-accent-500/20"
                >
                  <Mic className="w-6 h-6" />
                </button>
              )}
            </div>

            <span className="text-xs text-gray-500 font-semibold block uppercase">
              {isRecording ? 'Listening... Speak now' : 'Mic Idle'}
            </span>

            {/* Simulated audio visualizer wave when recording */}
            {isRecording && (
              <div className="flex justify-center items-center gap-1.5 h-6">
                <span className="w-1 bg-accent-500 h-2 rounded animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-1 bg-accent-500 h-5 rounded animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                <span className="w-1 bg-accent-500 h-3 rounded animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1 bg-accent-500 h-6 rounded animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                <span className="w-1 bg-accent-500 h-2 rounded animate-bounce" style={{ animationDelay: '0.1s' }}></span>
              </div>
            )}
          </div>

          {/* Statistics Box */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Live Response Stats</h4>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-white/5 rounded-xl">
                <span className="text-[9px] text-gray-500 block">WORDS SPOKEN</span>
                <span className="text-md font-bold text-white">{wordCount}</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl">
                <span className="text-[9px] text-gray-500 block">SPEAKING PACE</span>
                <span className="text-md font-bold text-white">{speakingSpeed} WPM</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl col-span-2">
                <span className="text-[9px] text-gray-500 block">FILLER WORDS DETECTED</span>
                <span className="text-md font-bold text-rose-400">{fillerWordsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInterview;
