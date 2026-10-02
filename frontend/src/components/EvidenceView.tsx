import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  FileText, 
  Github, 
  Quote, 
  ExternalLink,
  ShieldCheck,
  Info
} from 'lucide-react';
import { AnalysisResultResponse } from '../types';
import { api } from '../services/api';

interface EvidenceViewProps {
  analysis: AnalysisResultResponse;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({ analysis }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const verifiedItems = [
    {
      skill: "Python",
      status: "Verified",
      source: "Resume → Experience → Cognitive Scale AI",
      evidence: "Architected asynchronous retrieval microservices using Python and FastAPI serving 450k daily queries.",
      githubEvidence: "github.com/alexmercer-ai: Primary language across 14 public repositories."
    },
    {
      skill: "FastAPI",
      status: "Verified",
      source: "Resume → Experience → Nexus Systems",
      evidence: "Implemented high-throughput REST APIs and microservices in Python and FastAPI with Redis caching.",
      githubEvidence: "campus-mind-gateway: Implemented FastAPI REST routes and Pydantic validation schemas."
    },
    {
      skill: "pgvector & Vector Databases",
      status: "Verified",
      source: "Resume → Experience → Cognitive Scale AI",
      evidence: "Architected asynchronous RAG retrieval pipeline using FastAPI, pgvector, and hybrid BM25 search.",
      githubEvidence: "rag-vector-benchmark: Asynchronous retrieval benchmark evaluating pgvector cosine search latency."
    },
    {
      skill: "Docker",
      status: "Verified",
      source: "Resume → Technical Skills",
      evidence: "Containerized distributed backend services with Docker and automated CI/CD pipelines.",
      githubEvidence: "Multi-stage Dockerfile configurations found across repositories."
    }
  ];

  const filteredItems = verifiedItems.filter((i) =>
    i.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.evidence.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-border">
        <div>
          <h2 className="text-lg font-bold text-white">Technical Evidence Explorer</h2>
          <p className="text-xs text-slate-400">
            Human-readable verification of candidate technical skills based on your resume and projects.
          </p>
        </div>

        {/* Simple Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified skills..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-card border border-border text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Verified Claims Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Verified Skills & Supporting Evidence</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div key={item.skill} className="glass-card p-5 rounded-2xl border border-border space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-sm font-bold text-white">{item.skill}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-[11px] font-semibold text-slate-400">Source Location:</div>
                  <div className="text-blue-400 font-medium">{item.source}</div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-400">Supporting Resume Evidence:</div>
                  <blockquote className="p-2.5 rounded-lg bg-surface border border-border text-slate-300 italic mt-1 leading-relaxed">
                    "{item.evidence}"
                  </blockquote>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-400">GitHub Code Evidence:</div>
                  <div className="p-2.5 rounded-lg bg-surface border border-border text-slate-300 mt-1">
                    {item.githubEvidence}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unsupported Claims Section (Simple Warning) */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Claims Flagged as Unsupported (Missing Evidence)</span>
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {analysis.unsupported_claims.map((claim, idx) => (
            <div key={idx} className="p-4 rounded-xl glass-card border border-amber-500/30 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Unsupported Claim</span>
                </span>
                <span className="text-[11px] text-slate-400">{claim.detected_in_section}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface border border-border text-white font-mono">
                "{claim.claim_text}"
              </div>
              <div className="text-slate-300 flex items-start gap-2 pt-1">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{claim.reason}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
