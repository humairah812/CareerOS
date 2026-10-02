import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  Github, 
  Briefcase, 
  Target, 
  SearchCheck, 
  Wand2, 
  Compass, 
  Map, 
  Mic, 
  ChevronDown, 
  ChevronRight, 
  Settings as SettingsIcon,
  Activity,
  Award,
  Terminal
} from 'lucide-react';
import { NavTab } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  gapsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  gapsCount
}) => {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const isAdvancedActive = ['traces', 'benchmarks', 'mcp'].includes(activeTab);

  return (
    <aside className="w-60 flex-shrink-0 border-r border-border bg-surface/60 backdrop-blur-sm flex flex-col justify-between p-3.5 min-h-[calc(100vh-65px)]">
      <div className="space-y-5">
        {/* Main Dashboard Link */}
        <div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-card'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Section: MY PROFILE */}
        <div className="space-y-1">
          <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            My Profile
          </div>
          <button
            onClick={() => setActiveTab('resume')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'resume'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-card'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Resume</span>
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'github'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-card'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </button>
        </div>

        {/* Section: JOB MATCH */}
        <div className="space-y-1">
          <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Job Match
          </div>
          <button
            onClick={() => setActiveTab('job_description')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'job_description'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-card'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Job Description</span>
          </button>
          <button
            onClick={() => setActiveTab('skill_gaps')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'skill_gaps'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-card'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Target className="w-4 h-4" />
              <span>Skill Gaps</span>
            </div>
            {gapsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300">
                {gapsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'evidence'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-card'
            }`}
          >
            <SearchCheck className="w-4 h-4" />
            <span>Evidence</span>
          </button>
        </div>

        {/* Section: IMPROVE */}
        <div className="space-y-1">
          <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Improve
          </div>
          <button
            onClick={() => setActiveTab('optimizer')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'optimizer'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-card'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Resume Optimizer</span>
          </button>
          <button
            onClick={() => setActiveTab('career_plan')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'career_plan'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-card'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Career Plan</span>
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'roadmap'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-card'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Learning Roadmap</span>
          </button>
        </div>

        {/* Section: PRACTICE */}
        <div className="space-y-1">
          <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Practice
          </div>
          <button
            onClick={() => setActiveTab('interview')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'interview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-card'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Interview Lab</span>
          </button>
        </div>
      </div>

      {/* Bottom Section: Collapsible Advanced & Settings */}
      <div className="pt-4 border-t border-border/80 space-y-2">
        {/* Collapsible Advanced Menu */}
        <div>
          <button
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              isAdvancedActive ? 'text-blue-400 bg-card/60' : 'text-slate-400 hover:text-slate-200 hover:bg-card/40'
            }`}
          >
            <span className="uppercase text-[10px] font-semibold tracking-wider">Advanced</span>
            {advancedOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {advancedOpen && (
            <div className="pl-2 space-y-1 mt-1 border-l border-border/60 ml-2">
              <button
                onClick={() => setActiveTab('traces')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  activeTab === 'traces'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-card'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>AI Traces</span>
              </button>
              <button
                onClick={() => setActiveTab('benchmarks')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  activeTab === 'benchmarks'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-card'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>AI Evaluation</span>
              </button>
              <button
                onClick={() => setActiveTab('mcp')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  activeTab === 'mcp'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-card'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>MCP Console</span>
              </button>
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-card'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};
