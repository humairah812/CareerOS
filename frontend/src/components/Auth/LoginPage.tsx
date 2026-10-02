import React, { useState } from 'react';
import { Briefcase, ArrowRight, Lock, Mail, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { UserProfile } from '../../types';

interface LoginPageProps {
  onSuccess: (user: UserProfile) => void;
  onGoToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onGoToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const auth = await api.login(email, password);
      onSuccess({
        id: auth.user_id,
        email: auth.email,
        full_name: auth.full_name,
        is_active: true
      });
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('alex.mercer@example.com');
    setPassword('DemoPassword123!');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand & Tagline */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-card border border-border text-blue-400 mb-2">
            <Briefcase className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            CAREEROS
          </h1>
          <p className="text-sm text-slate-400">
            Build a stronger career profile.
          </p>
        </div>

        {/* Card Form */}
        <div className="glass-card p-8 rounded-2xl border border-border shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link will be sent to your email.')}
                  className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="pt-2 border-t border-border/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Testing the platform?</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Auto-fill Demo Account
            </button>
          </div>
        </div>

        {/* Create Account Link */}
        <div className="text-center text-xs text-slate-400">
          <span>Don't have an account? </span>
          <button
            onClick={onGoToRegister}
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};
