import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Fingerprint, Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('vishnu@lifevault.ai');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const { login, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Atmosphere Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6C63FF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00D1FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Logo Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#00D1FF] p-0.5 shadow-glow-violet group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B0F1A] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#00D1FF]" />
              </div>
            </div>
            <span className="text-2xl font-extrabold font-display tracking-tight text-white">
              Life<span className="text-[#6C63FF]">Vault</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold font-display text-white mt-4">Welcome Back to Your Vault</h2>
          <p className="text-xs text-slate-400 mt-1">Authenticate to access your Second Brain</p>
        </div>

        {/* Auth Glass Card */}
        <div className="glass-panel p-8 rounded-3xl border border-white/15 shadow-2xl space-y-6">
          {/* Biometric Scan Visual Icon */}
          <div className="flex justify-center my-2">
            <div className="p-4 rounded-2xl bg-[#121829] border border-[#6C63FF]/30 shadow-glow-violet">
              <Fingerprint className="w-10 h-10 text-[#00D1FF] animate-pulse" />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@lifevault.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
              required
            />

            <Input
              label="Password"
              isPassword
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-[#6C63FF] focus:ring-[#6C63FF]"
                />
                <span>Remember me</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered email.'); }} className="text-[#00D1FF] hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight size={16} />}
            >
              Unlock My Vault
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#121829] px-3 text-[10px] text-slate-400 uppercase tracking-widest absolute">Or</span>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="w-full flex items-center justify-center gap-2"
            onClick={loginWithGoogle}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
            </svg>
            <span>Continue with Google</span>
          </Button>

          {/* Footer note */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Don't have a vault yet?{' '}
              <Link to="/signup" className="text-[#00D1FF] font-semibold hover:underline">
                Create Vault
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
