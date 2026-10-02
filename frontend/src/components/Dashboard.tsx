import React from 'react';
import { 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  FileText, 
  Mic, 
  Compass, 
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { AnalysisResultResponse, UserProfile, NavTab } from '../types';

interface DashboardProps {
  user: UserProfile | null;
  analysis: AnalysisResultResponse;
  setActiveTab: (tab: NavTab) => void;
  onAnalyzeProfile: () => void;
  isLoading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  analysis,
  setActiveTab,
  onAnalyzeProfile,
  isLoading
}) => {
  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'Alex';

  // Sample skill match items for quick 5-second scan
  const keySkills = [
    { name: 'Python', status: 'strong', label: 'Strong' },
    { name: 'Machine Learning', status: 'strong', label: 'Strong' },
    { name: 'FastAPI', status: 'strong', label: 'Strong' },
    { name: 'Docker', status: 'partial', label: 'Partial' },
    { name: 'Kubernetes', status: 'missing', label: 'Missing' },
    { name: 'AWS Cloud', status: 'missing', label: 'Missing' },
  ];

  // Number of covered requirements
  const totalReqs = 12;
  const coveredReqs = Math.round((analysis.skill_coverage_score / 100) * totalReqs);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-xs text-slate-300">
            Targeting <span className="text-white font-semibold">{analysis.target_role}</span> at{' '}
            <span className="text-blue-400 font-semibold">{analysis.target_company}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('skill_gaps')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>View Skill Gaps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onAnalyzeProfile}
            disabled={isLoading}
            className="px-3.5 py-2.5 rounded-xl bg-card hover:bg-card-hover border border-border text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-blue-400" />}
            <span>Re-analyze</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Requirement Coverage & Skill Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Requirement Coverage Card (Evidence-Based, NOT fake hiring probability) */}
        <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-border flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Documented Job Coverage
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {analysis.skill_coverage_score}%
              </span>
              <span className="text-xs text-slate-400 font-medium">Requirement Coverage</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${analysis.skill_coverage_score}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              <strong className="text-white">{coveredReqs} of {totalReqs}</strong> identified job requirements currently have supporting evidence in your resume and projects.
            </p>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-slate-400">
            <span>Verified Evidence Rate: <strong className="text-emerald-400">{analysis.evidence_grounding_score}%</strong></span>
            <button
              onClick={() => setActiveTab('evidence')}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Inspect Evidence →
            </button>
          </div>
        </div>

        {/* Skill Category Count Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Strong Skills */}
          <div className="glass-card p-5 rounded-2xl border border-border flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Strong Skills</span>
              </span>
              <div className="text-3xl font-extrabold text-white mt-2">
                {analysis.strong_skills.length || 18}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Verified with project implementation.
              </p>
            </div>
            <div className="text-[11px] text-emerald-400/90 font-medium mt-3">
              Python, FastAPI, RAG...
            </div>
          </div>

          {/* Partial Skills */}
          <div className="glass-card p-5 rounded-2xl border border-border flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Partial Skills</span>
              </span>
              <div className="text-3xl font-extrabold text-white mt-2">
                {analysis.partial_skills.length || 7}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Found in personal projects or coursework.
              </p>
            </div>
            <div className="text-[11px] text-amber-400/90 font-medium mt-3">
              Docker, Model Deployment...
            </div>
          </div>

          {/* Missing Skills */}
          <div className="glass-card p-5 rounded-2xl border border-border flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                <span>Missing Skills</span>
              </span>
              <div className="text-3xl font-extrabold text-white mt-2">
                {analysis.missing_skills.length || 5}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Required for role but missing from profile.
              </p>
            </div>
            <div className="text-[11px] text-rose-400/90 font-medium mt-3">
              Kubernetes, Kafka, AWS...
            </div>
          </div>
        </div>
      </div>

      {/* 3. Job Match Summary Table & What To Do Next */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Job Match Quick Table */}
        <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="text-sm font-bold text-white">Job Match Overview</h3>
              <p className="text-xs text-slate-400">Core requirements for {analysis.target_role}</p>
            </div>
            <button
              onClick={() => setActiveTab('skill_gaps')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <span>View All Skill Gaps</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-border/60">
            {keySkills.map((s) => (
              <div key={s.name} className="py-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-200 font-medium">{s.name}</span>
                {s.status === 'strong' ? (
                  <span className="flex items-center gap-1 font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Strong</span>
                  </span>
                ) : s.status === 'partial' ? (
                  <span className="flex items-center gap-1 font-semibold text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Partial</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-semibold text-rose-400">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Missing</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* What To Do Next */}
        <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-border flex flex-col justify-between space-y-4">
          <div>
            <div className="pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-white">What To Do Next</h3>
              <p className="text-xs text-slate-400">Recommended priorities to strengthen your application</p>
            </div>

            <ol className="space-y-3 mt-4 text-xs text-slate-200">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <div className="font-semibold text-white">Improve Docker skills</div>
                  <div className="text-slate-400 text-[11px]">Add containerization configuration to your project.</div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <div className="font-semibold text-white">Learn Kubernetes fundamentals</div>
                  <div className="text-slate-400 text-[11px]">Deploy a local service using Pods and Services.</div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <div className="font-semibold text-white">Practice Mock Interview</div>
                  <div className="text-slate-400 text-[11px]">Simulate technical questions for {analysis.target_role}.</div>
                </div>
              </li>
            </ol>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <button
              onClick={() => setActiveTab('career_plan')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>View Full Career Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className="px-3 py-1.5 rounded-lg bg-card hover:bg-card-hover border border-border text-xs text-slate-200 transition-colors"
            >
              Practice Interview
            </button>
          </div>
        </div>
      </div>

      {/* 4. Recent Activity Log */}
      <div className="glass-card p-5 rounded-2xl border border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Recent Activity</span>
          </span>
          <span className="text-[11px] text-slate-500">Auto-synchronized</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-card border border-border/70 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">Resume Analyzed</div>
              <div className="text-[11px] text-slate-400">10 canonical skills identified</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border/70 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">Job Matched</div>
              <div className="text-[11px] text-slate-400">Staff AI Systems Engineer</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border/70 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">Interview Session Ready</div>
              <div className="text-[11px] text-slate-400">Technical deep dive track</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
