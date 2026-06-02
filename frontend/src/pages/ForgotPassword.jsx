import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, Key, ArrowLeft, RefreshCw } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Send request, 2: Reset form
  const [loading, setLoading] = useState(false);

  const { forgotPassword, resetPassword } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRequestToken = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email', 'warning');
      return;
    }

    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);

    if (res.success) {
      showToast('Reset token generated! Copy the token from below.', 'success');
      setResetToken(res.resetToken); // Pre-fill token for easy developer run
      setStep(2);
    } else {
      showToast(res.error || 'User not found with this email.', 'error');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetToken || !newPassword) {
      showToast('Please enter both token and password', 'warning');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'warning');
      return;
    }

    setLoading(true);
    const res = await resetPassword(resetToken, newPassword);
    setLoading(false);

    if (res && res.success) {
      showToast('Password reset successfully! Logged in.', 'success');
      navigate('/dashboard');
    } else {
      showToast(res.error || 'Failed to reset password. Check your token.', 'error');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#080b11] bg-grid-pattern flex items-center justify-center p-4">
      <div className="purple-glow-glow top-[10%] left-[25%] opacity-60"></div>

      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-white/5 relative z-10 animate-fade-in shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl mx-auto mb-4 border border-white/10 shadow-lg">
            AI
          </div>
          <h2 className="text-2xl font-extrabold text-white">Reset Password</h2>
          <p className="text-gray-400 text-sm mt-1">
            {step === 1 ? 'Get a secure simulation reset token' : 'Specify your new password'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestToken} className="space-y-5">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Mail className="w-5 h-5" />}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              loading={loading}
              icon={<Key className="w-4 h-4" />}
            >
              Get Reset Token
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* Display the generated test token directly on screen */}
            <div className="p-4 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs break-all font-mono space-y-1">
              <span className="font-bold block uppercase tracking-wider text-[10px] text-gray-400">Simulation Token:</span>
              <span>{resetToken}</span>
            </div>

            <Input
              label="Paste Token"
              name="token"
              placeholder="Paste generated token"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              required
              icon={<Key className="w-5 h-5" />}
            />

            <Input
              label="New Password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              icon={<Lock className="w-5 h-5" />}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              loading={loading}
              icon={<RefreshCw className="w-4 h-4 animate-spin-slow" />}
            >
              Reset Password
            </Button>
          </form>
        )}

        <div className="mt-6 flex justify-center text-xs font-semibold text-gray-400 hover:text-white transition-colors">
          <Link to="/login" className="flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
