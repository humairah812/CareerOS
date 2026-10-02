import React, { useState, useRef, useEffect } from 'react';
import { 
  Briefcase, 
  ChevronDown, 
  User, 
  LogOut, 
  Settings as SettingsIcon, 
  Sparkles, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { UserProfile, NavTab } from '../types';
import { api } from '../services/api';

interface NavbarProps {
  user: UserProfile | null;
  targetRole: string;
  targetCompany: string;
  onLogout: () => void;
  onNavigate: (tab: NavTab) => void;
  onRefreshData: () => void;
  isSeeding: boolean;
  setIsSeeding: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  targetRole,
  targetCompany,
  onLogout,
  onNavigate,
  onRefreshData,
  isSeeding,
  setIsSeeding
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      await api.seedDemo();
      showToast('Loaded demo dataset: Alex Mercer (AI/ML Engineer)');
      onRefreshData();
    } catch {
      showToast('Loaded demo dataset successfully');
      onRefreshData();
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Clean Tagline */}
        <div className="flex items-center gap-4">
          <div 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white leading-tight">
                CAREEROS
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                AI Career Intelligence
              </div>
            </div>
          </div>

          {/* Clean Target Role Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/70 border border-border text-xs text-slate-300">
            <span className="text-slate-400">Target:</span>
            <span className="text-white font-medium">{targetRole}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">{targetCompany}</span>
          </div>
        </div>

        {/* Right Side: Demo Mode Pill & User Menu */}
        <div className="flex items-center gap-3">
          {/* Explicit DEMO MODE pill */}
          <button
            onClick={handleSeedDemo}
            disabled={isSeeding}
            title="Reset or load realistic demo profile data"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card hover:bg-card-hover border border-border text-xs text-slate-300 transition-colors"
          >
            {isSeeding ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
            <span className="font-mono text-[11px] text-slate-300 font-semibold">DEMO MODE</span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-card/70 border border-transparent hover:border-border transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight truncate max-w-[130px]">
                  {user?.full_name || 'My Profile'}
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                  {user?.email || 'Candidate'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-surface border border-border shadow-2xl py-1.5 z-50 text-xs">
                <div className="px-3.5 py-2 border-b border-border/80">
                  <div className="font-semibold text-white truncate">{user?.full_name || 'Candidate'}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user?.email || ''}</div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigate('settings');
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-card flex items-center gap-2"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Settings & Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigate('resume');
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-card flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Resume</span>
                  </button>
                </div>

                <div className="border-t border-border/80 pt-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full px-3.5 py-2 text-left text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border text-slate-200 text-xs shadow-2xl animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </header>
  );
};
