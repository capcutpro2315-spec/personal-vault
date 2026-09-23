import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const SignupPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: 'None', width: '0%', color: 'bg-slate-700' };
    if (password.length < 6) return { label: 'Weak', width: '33%', color: 'bg-red-500' };
    if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return { label: 'Medium', width: '66%', color: 'bg-yellow-500' };
    }
    return { label: 'Strong (AES Ready)', width: '100%', color: 'bg-[#34D399]' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service & Privacy Policy.');
      return;
    }

    try {
      await signup(fullName, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to create vault account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden my-8">
      {/* Background Atmosphere Glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#6C63FF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#00D1FF]/10 rounded-full blur-3xl pointer-events-none" />

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
          <h2 className="text-xl font-bold font-display text-white mt-4">Create Your Private LifeVault</h2>
          <p className="text-xs text-slate-400 mt-1">Initialize your AES-256 protected Second Brain</p>
        </div>

        {/* Auth Glass Card */}
        <div className="glass-panel p-8 rounded-3xl border border-white/15 shadow-2xl space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Vishnu Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<User size={16} />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@lifevault.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
              required
            />

            <div>
              <Input
                label="Password"
                isPassword
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={16} />}
                required
              />

              {/* Strength Bar */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Password Strength:</span>
                    <span className="font-semibold text-white">{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              isPassword
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              required
            />

            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-800 border-slate-700 text-[#6C63FF] focus:ring-[#6C63FF]"
                />
                <span>
                  I agree to the <a href="#" className="text-[#00D1FF] hover:underline">Terms of Service</a> and{' '}
                  <a href="#" className="text-[#00D1FF] hover:underline">Privacy Policy</a>
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight size={16} />}
            >
              Create My Vault
            </Button>
          </form>

          {/* Footer note */}
          <div className="text-center pt-2 border-t border-white/5">
            <p className="text-xs text-slate-400">
              Already have a vault?{' '}
              <Link to="/login" className="text-[#00D1FF] font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
