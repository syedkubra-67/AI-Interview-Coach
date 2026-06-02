import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

// Components & Routing Guards
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// View Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import InterviewSession from './pages/InterviewSession';
import InterviewReport from './pages/InterviewReport';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import CareerRoadmap from './pages/CareerRoadmap';
import VoiceInterview from './pages/VoiceInterview';
import QuestionBank from './pages/QuestionBank';
import Leaderboard from './pages/Leaderboard';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard';

// Layout wrapper for Authenticated dashboard paths
const PrivateLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#080b11] text-gray-200">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] overflow-y-auto">
          {children}
        </main>
      </div>

      <a
  href="https://github.com/syedkubra-67"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-3 right-4 text-xs text-purple-400 opacity-40 hover:opacity-100 z-50"
>
  © 2026 AI Interview Coach • Built by Syed Kubra
</a>
    </div>
  );
};

// Layout wrapper for Public paths
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#080b11] text-gray-200">
      <Navbar />
      <main>{children}</main>

    <a
  href="https://github.com/syedkubra-67"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-3 right-4 text-xs text-purple-400 opacity-40 hover:opacity-100 z-50"
>
  © 2026 AI Interview Coach • Built by Syed Kubra
</a>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Unprotected Paths */}
              <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />
              <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
              <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />
              <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />

              {/* Private Protected Paths */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <PrivateLayout>
                      <Dashboard />
                    </PrivateLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview"
                element={
                  <ProtectedRoute>
                    <PrivateLayout>
                      <InterviewSession />
                    </PrivateLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/report/:id"
                element={
                  <ProtectedRoute>
                    <PrivateLayout>
                      <InterviewReport />
                    </PrivateLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume"
                element={
                  <ProtectedRoute>
                    <PrivateLayout>
                      <ResumeAnalyzer />
                    </PrivateLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roadmap"
                element={
                  <ProtectedRoute>
                    <PrivateLayout>
                      <CareerRoadmap />
                    </PrivateLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/voice-interview"
                element={
                  <ProtectedRoute>
                    <PrivateLayout>
                      <VoiceInterview />
                    </PrivateLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/question-bank"
                element={
                  <ProtectedRoute>
                    <PrivateLayout>
                      <QuestionBank />
                    </PrivateLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <PrivateLayout>
                      <Leaderboard />
                    </PrivateLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <PrivateLayout>
                      <History />
                    </PrivateLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <PrivateLayout>
                      <AdminDashboard />
                    </PrivateLayout>
                  </ProtectedRoute>
                }
              />

              {/* Catch all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
