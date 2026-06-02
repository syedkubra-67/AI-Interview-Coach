import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, LogIn } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    setLoading(true);
    const res = await login(formData.email, formData.password);
    setLoading(false);

    if (res && res.success) {
      showToast('Logged in successfully!', 'success');
      navigate('/dashboard');
    } else {
      showToast(res.error || 'Invalid credentials. Please try again.', 'error');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#080b11] bg-grid-pattern flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="purple-glow-glow top-[10%] left-[20%] opacity-70"></div>

      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-white/5 relative z-10 animate-fade-in shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl mx-auto mb-4 border border-white/10 shadow-lg shadow-accent-600/20">
            AI
          </div>
          <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-gray-400 text-sm mt-1">Access your interview preparation room</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="name@domain.com"
            value={formData.email}
            onChange={handleChange}
            required
            icon={<Mail className="w-5 h-5" />}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            icon={<Lock className="w-5 h-5" />}
          />

          <div className="flex justify-end text-xs font-semibold text-accent-400 hover:text-accent-300">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3"
            loading={loading}
            icon={<LogIn className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6 font-medium">
          New to the coach?{' '}
          <Link to="/signup" className="text-accent-400 hover:text-accent-300 font-bold transition-all">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
