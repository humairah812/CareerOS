import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  BookOpen, 
  ArrowRight, 
  Target, 
  Map, 
  Mic 
} from 'lucide-react';
import { AnalysisResultResponse, NavTab } from '../types';

interface CareerPlanViewProps {
  analysis: AnalysisResultResponse;
  setActiveTab: (tab: NavTab) => void;
}

export const CareerPlanView: React.FC<CareerPlanViewProps> = ({ analysis, setActiveTab }) => {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-border">
        <div>
          <h2 className="text-lg font-bold text-white">Your Career Plan</h2>
          <p className="text-xs text-slate-400">
            A clear, personalized strategy to bridge skill gaps and maximize your chances for {analysis.target_role}.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('roadmap')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Map className="w-3.5 h-3.5" />
          <span>Open Learning Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. YOUR STRENGTHS */}
        <div className="glass-card p-6 rounded-2xl border border-border space-y-3">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Your Strengths</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your strongest competitive advantages are in <strong>asynchronous Python backend architecture</strong> and <strong>RAG vector retrieval</strong>. You have demonstrated ability to serve high query volumes with FastAPI and pgvector.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {analysis.strong_skills.map((s) => (
              <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* 2. SKILL GAPS */}
        <div className="glass-card p-6 rounded-2xl border border-border space-y-3">
          <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Skill Gaps</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            To reach parity with the role requirements, focus specifically on <strong>Kubernetes container orchestration</strong> and <strong>Kafka event streaming</strong>. These represent the primary missing competencies.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {analysis.missing_skills.map((s) => (
              <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* 3. RECOMMENDED PROJECTS */}
        <div className="glass-card p-6 rounded-2xl border border-border space-y-3">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            <span>Recommended Projects</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="p-3 rounded-xl bg-surface border border-border">
              <strong className="text-white block">1. Deploy FastAPI on Minikube / K8s</strong>
              <span className="text-slate-400 mt-0.5 block">
                Create Kubernetes deployment manifests, readiness probes, and a Service to prove hands-on container orchestration.
              </span>
            </li>
            <li className="p-3 rounded-xl bg-surface border border-border">
              <strong className="text-white block">2. Implement an Asynchronous Kafka Pipeline</strong>
              <span className="text-slate-400 mt-0.5 block">
                Build a lightweight message queue consumer in Python to demonstrate event-driven backend communication.
              </span>
            </li>
          </ul>
        </div>

        {/* 4. WHAT TO LEARN */}
        <div className="glass-card p-6 rounded-2xl border border-border space-y-3">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>What to Learn</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="p-3 rounded-xl bg-surface border border-border">
              <strong className="text-white block">Kubernetes Architecture</strong>
              <span className="text-slate-400 mt-0.5 block">
                Understand Pod lifecycles, ConfigMaps, Ingress, and horizontal pod autoscaling.
              </span>
            </li>
            <li className="p-3 rounded-xl bg-surface border border-border">
              <strong className="text-white block">Distributed Message Queues</strong>
              <span className="text-slate-400 mt-0.5 block">
                Study consumer groups, partitions, and at-least-once delivery guarantees.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* 5. NEXT STEPS */}
      <div className="glass-card p-6 rounded-2xl border border-border space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-400" />
          <span>Immediate Next Steps</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div 
            onClick={() => setActiveTab('optimizer')}
            className="p-4 rounded-xl bg-surface border border-border hover:border-blue-500 cursor-pointer transition-colors space-y-1.5"
          >
            <div className="font-bold text-white">1. Optimize Resume</div>
            <p className="text-slate-400 text-[11px]">
              Accept suggested STAR bullet points to eliminate unverified buzzwords.
            </p>
            <span className="text-blue-400 font-semibold text-[11px] block pt-1">Open Optimizer →</span>
          </div>

          <div 
            onClick={() => setActiveTab('roadmap')}
            className="p-4 rounded-xl bg-surface border border-border hover:border-blue-500 cursor-pointer transition-colors space-y-1.5"
          >
            <div className="font-bold text-white">2. Start Day 1 Roadmap</div>
            <p className="text-slate-400 text-[11px]">
              Follow the 5-day structured curriculum to close priority gaps.
            </p>
            <span className="text-blue-400 font-semibold text-[11px] block pt-1">View Roadmap →</span>
          </div>

          <div 
            onClick={() => setActiveTab('interview')}
            className="p-4 rounded-xl bg-surface border border-border hover:border-blue-500 cursor-pointer transition-colors space-y-1.5"
          >
            <div className="font-bold text-white">3. Practice Interview</div>
            <p className="text-slate-400 text-[11px]">
              Run a simulated technical interview session to practice questions.
            </p>
            <span className="text-blue-400 font-semibold text-[11px] block pt-1">Practice Now →</span>
          </div>
        </div>
      </div>
    </div>
  );
};
