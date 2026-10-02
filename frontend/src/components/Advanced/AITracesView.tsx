import React, { useState } from 'react';
import { 
  Activity, 
  Clock, 
  Coins, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Sparkles,
  Zap
} from 'lucide-react';
import { AnalysisResultResponse } from '../../types';

interface AITracesViewProps {
  analysis: AnalysisResultResponse;
  onRunPipeline: () => void;
  isLoading: boolean;
}

export const AITracesView: React.FC<AITracesViewProps> = ({
  analysis,
  onRunPipeline,
  isLoading
}) => {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(0);

  const pipelineNodes = [
    {
      title: "Candidate Profiler Agent",
      agent: "CandidateProfilerAgent",
      model: "gpt-4o-mini",
      duration_ms: 142,
      tokens: 840,
      description: "Extracts sections from resume PDF, enforces security sanitization, and normalizes candidate skills into canonical ontology nodes.",
      inputs: { raw_text_length: "2,410 chars", source: "resume.pdf", security_status: "Verified Sanitized" },
      outputs: { extracted_skills: ["Python", "FastAPI", "Docker", "PostgreSQL", "pgvector", "Redis"], seniority: "Senior Engineer" },
      decision: "Found explicit implementation of hybrid retrieval serving 450k daily queries."
    },
    {
      title: "Job Requirements Parser",
      agent: "JobSpecAnalyzerAgent",
      model: "gpt-4o-mini",
      duration_ms: 168,
      tokens: 720,
      description: "Deconstructs job description into mandatory competencies, preferred credentials, and domain scope constraints.",
      inputs: { target_role: "Staff AI Systems Engineer", target_company: "Vanguard Autonomous AI" },
      outputs: { mandatory: ["Python", "FastAPI", "pgvector", "Docker"], preferred: ["Kubernetes", "Kafka", "MCP"] },
      decision: "Classified Kubernetes and Kafka as secondary preferred competencies."
    },
    {
      title: "Semantic Gap Matrix",
      agent: "CompetencyMatrixAgent",
      model: "gpt-4o-mini",
      duration_ms: 290,
      tokens: 1250,
      description: "Cross-references candidate canonical skills against JD requirements to classify into Strong, Partial, and Missing buckets.",
      inputs: { candidate_skills: 10, jd_requirements: 8 },
      outputs: { strong: 6, partial: 3, missing: 3, coverage_score: `${analysis.skill_coverage_score}%` },
      decision: "Computed 75% coverage based on verified project evidence."
    },
    {
      title: "Evidence RAG Grounder",
      agent: "GroundingVerificationAgent",
      model: "gpt-4o-mini",
      duration_ms: 380,
      tokens: 1540,
      description: "Evaluates candidate claims against hybrid lexical (BM25) and dense semantic indices, computing an Evidence Grounding Score.",
      inputs: { method: "BM25 + pgvector HNSW", top_k: 3, threshold: 0.75 },
      outputs: { grounding_score: `${analysis.evidence_grounding_score}%`, verified: 8, unsupported_claims: 2 },
      decision: "Flagged 'Built scalable AI systems across cloud infrastructure' as ungrounded buzzword."
    },
    {
      title: "Strategy & STAR Optimizer",
      agent: "ExecutiveStrategyAgent",
      model: "gpt-4o-mini",
      duration_ms: 260,
      tokens: 980,
      description: "Synthesizes verified bullet rewrites adhering to the STAR framework and formulates 5-day adaptive mastery roadmap.",
      inputs: { gaps: ["Kubernetes", "Kafka", "AWS"] },
      outputs: { rewrites_generated: 2, roadmap_days: 5, status: "completed" },
      decision: "Generated Docker/pgvector STAR bullet rewrite grounded in candidate codebase."
    }
  ];

  const selectedNode = pipelineNodes[selectedNodeIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              Advanced Telemetry
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">AI Traces & Multi-Agent Execution</h2>
          <p className="text-xs text-slate-400">
            Inspect LangGraph node transitions, agent reasoning logs, latencies, and token consumption.
          </p>
        </div>

        <button
          onClick={onRunPipeline}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors disabled:opacity-50"
        >
          {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
          <span>{isLoading ? 'Executing...' : 'Trigger Agent Swarm'}</span>
        </button>
      </div>

      {/* Node Sequence Bar */}
      <div className="glass-card p-5 rounded-2xl border border-border overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {pipelineNodes.map((node, idx) => {
            const isSelected = selectedNodeIndex === idx;
            return (
              <React.Fragment key={node.title}>
                <div
                  onClick={() => setSelectedNodeIndex(idx)}
                  className={`flex-1 p-3.5 rounded-xl cursor-pointer border transition-colors ${
                    isSelected 
                      ? 'bg-blue-600/20 border-blue-500' 
                      : 'bg-surface border-border hover:bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-slate-400 font-bold">Node {idx + 1}</span>
                    <span className="text-emerald-400 font-mono">{node.duration_ms}ms</span>
                  </div>
                  <div className="text-xs font-semibold text-white truncate">{node.title}</div>
                </div>

                {idx < pipelineNodes.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-card p-6 rounded-2xl border border-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <span className="text-[11px] font-mono text-blue-400">Node #{selectedNodeIndex + 1}</span>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedNode.title}</h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedNode.duration_ms}ms</span>
              </span>
              <span className="flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedNode.tokens} tokens</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedNode.description}
          </p>

          <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Agent Decision & Reasoning
            </span>
            <p className="text-xs text-slate-300 font-mono mt-1">
              "{selectedNode.decision}"
            </p>
          </div>

          {/* In/Out State Dumps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-surface border border-border space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Input State</span>
              <pre className="text-[11px] font-mono text-blue-300 overflow-x-auto">
                {JSON.stringify(selectedNode.inputs, null, 2)}
              </pre>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-border space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Output State</span>
              <pre className="text-[11px] font-mono text-emerald-300 overflow-x-auto">
                {JSON.stringify(selectedNode.outputs, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Global Telemetry Summary */}
        <div className="lg:col-span-4 glass-card p-6 rounded-2xl border border-border space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Pipeline Summary
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between">
              <span className="text-slate-400">Total Latency</span>
              <span className="font-mono font-bold text-white">1,240ms</span>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between">
              <span className="text-slate-400">Total Tokens</span>
              <span className="font-mono font-bold text-amber-400">5,330 tokens</span>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between">
              <span className="text-slate-400">Framework</span>
              <span className="font-mono font-bold text-blue-400">LangGraph v0.0.30</span>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between">
              <span className="text-slate-400">Agent Hops</span>
              <span className="font-mono font-bold text-emerald-400">5 Hops / Clean</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
