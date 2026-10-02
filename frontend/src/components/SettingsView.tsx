import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Briefcase, 
  ShieldCheck, 
  LogOut, 
  Check, 
  Save 
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  user: UserProfile | null;
  targetRole: string;
  targetCompany: string;
  onLogout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  targetRole,
  targetCompany,
  onLogout
}) => {
  const [fullName, setFullName] = useState(user?.full_name || 'Alex Mercer');
  const [email, setEmail] = useState(user?.email || 'alex.mercer@example.com');
  const [role, setRole] = useState(targetRole);
  const [company, setCompany] = useState(targetCompany);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="p-5 rounded-2xl glass-card border border-border">
        <h2 className="text-lg font-bold text-white">Account & Preferences</h2>
        <p className="text-xs text-slate-400">
          Manage your candidate credentials and career target parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Profile Info */}
        <div className="glass-card p-6 rounded-2xl border border-border space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Target Career Profile */}
        <div className="glass-card p-6 rounded-2xl border border-border space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Target Career Goal
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Target Role Title</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Target Company</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Preferences saved successfully</span>
            </span>
          ) : <span></span>}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Sign Out */}
      <div className="glass-card p-6 rounded-2xl border border-rose-500/20 space-y-3">
        <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
          Sign Out of CareerOS
        </h3>
        <p className="text-xs text-slate-400">
          Sign out of your session on this browser. You can sign back in at any time.
        </p>
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
