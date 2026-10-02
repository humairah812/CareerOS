import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ArrowRight, 
  Compass, 
  FileText, 
  Github, 
  Briefcase, 
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { AnalysisResultResponse, NavTab } from '../types';

interface SkillGapsViewProps {
  analysis: AnalysisResultResponse;
  setActiveTab: (tab: NavTab) => void;
}

export const SkillGapsView: React.FC<SkillGapsViewProps> = ({ analysis, setActiveTab }) => {
  const [selectedSkill, setSelectedSkill] = useState<string>('Docker');

  // Combined canonical skills list
  const allSkills = [
    { name: 'Python', status: 'strong', category: 'Backend Programming' },
    { name: 'FastAPI', status: 'strong', category: 'API Frameworks' },
    { name: 'Machine Learning', status: 'strong', category: 'AI & Data' },
    { name: 'PostgreSQL', status: 'strong', category: 'Databases' },
    { name: 'RAG Retrieval', status: 'strong', category: 'AI & Data' },
    { name: 'pgvector', status: 'strong', category: 'Databases' },
    { name: 'Docker', status: 'partial', category: 'DevOps & Containers' },
    { name: 'Redis', status: 'partial', category: 'Caching & Queues' },
    { name: 'Model Deployment', status: 'partial', category: 'DevOps & Containers' },
    { name: 'Kubernetes', status: 'missing', category: 'DevOps & Containers' },
    { name: 'Apache Kafka', status: 'missing', category: 'Event Streaming' },
    { name: 'AWS Cloud', status: 'missing', category: 'Cloud Infrastructure' },
  ];

  const skillEvidenceDetails: Record<string, {
    status: string;
    why: string;
    resumeEvidence: string;
    githubEvidence: string;
    jobRequirement: string;
    confidence: string;
  }> = {
    Python: {
      status: "Strong",
      why: "Explicitly utilized across 2 professional roles and primary language across repositories.",
      resumeEvidence: "Cognitive Scale AI: Architected asynchronous services in Python and FastAPI.",
      githubEvidence: "github.com/alexmercer-ai: 14 public repos with Python as primary language.",
      jobRequirement: "Mandatory: Deep production expertise with Python and asyncio backend services.",
      confidence: "98% (High)"
    },
    FastAPI: {
      status: "Strong",
      why: "Verified high-throughput microservice architecture in recent professional role.",
      resumeEvidence: "Architected retrieval pipeline in FastAPI serving 450k daily queries.",
      githubEvidence: "campus-mind-gateway: Implemented FastAPI REST endpoints with Pydantic validation.",
      jobRequirement: "Mandatory: Hands-on backend API design using modern asynchronous frameworks.",
      confidence: "96% (High)"
    },
    Docker: {
      status: "Partial",
      why: "Used in personal setup and microservices, but missing production orchestration or complex multi-stage optimization details.",
      resumeEvidence: "Skills list mentions Docker; mentioned in passing under microservices.",
      githubEvidence: "Dockerfiles found in 2 personal repositories; basic single-stage builds.",
      jobRequirement: "Mandatory: Containerization, image size optimization, and multi-stage builds.",
      confidence: "65% (Moderate)"
    },
    Kubernetes: {
      status: "Missing",
      why: "Not found in resume experience, project descriptions, or public GitHub repositories.",
      resumeEvidence: "No mention of Kubernetes, Helm charts, or cluster deployments found.",
      githubEvidence: "No K8s manifests or Helm configs detected in scanned repositories.",
      jobRequirement: "Preferred: Production container orchestration, Helm charts, and cluster management.",
      confidence: "92% (High Confidence of Gap)"
    },
    "AWS Cloud": {
      status: "Missing",
      why: "No specific cloud infrastructure tools or cloud provider certifications detected.",
      resumeEvidence: "Vague mention of 'cloud infrastructure' without specific AWS services (ECS, S3, IAM).",
      githubEvidence: "No Terraform or AWS CDK configurations found.",
      jobRequirement: "Preferred: Cloud infrastructure design and deployment.",
      confidence: "88% (High Confidence of Gap)"
    },
    "Apache Kafka": {
      status: "Missing",
      why: "No event streaming or message queue implementation found in profile.",
      resumeEvidence: "No mention of Kafka, event streaming, or pub/sub patterns.",
      githubEvidence: "No Kafka consumer/producer implementations in public code.",
      jobRequirement: "Preferred: High-throughput event streaming with Kafka.",
      confidence: "90% (High Confidence of Gap)"
    }
  };

  const currentDetails = skillEvidenceDetails[selectedSkill] || {
    status: "Strong",
    why: "Candidate has demonstrated verifiable competency in projects.",
    resumeEvidence: "Found in professional experience section with verified project citations.",
    githubEvidence: "Repository evidence found with relevant implementations.",
    jobRequirement: "Core requirement for Staff AI Systems Engineer.",
    confidence: "90% (High)"
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-border">
        <div>
          <h2 className="text-lg font-bold text-white">Your Skills vs Job Requirements</h2>
          <p className="text-xs text-slate-400">
            Compare your verified competencies directly against the requirements for {analysis.target_role}.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('career_plan')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Create Improvement Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Content: Table on Left, Evidence Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skills Table */}
        <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border text-xs text-slate-400 font-semibold">
            <span>SKILL / COMPETENCY</span>
            <span>STATUS</span>
          </div>

          <div className="divide-y divide-border/60">
            {allSkills.map((s) => {
              const isSelected = selectedSkill === s.name;
              return (
                <div
                  key={s.name}
                  onClick={() => setSelectedSkill(s.name)}
                  className={`py-3 px-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-card border border-blue-500/40 text-white' : 'hover:bg-card/50 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold text-white">{s.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{s.category}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    {s.status === 'strong' ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Strong</span>
                      </span>
                    ) : s.status === 'partial' ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Partial</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Missing</span>
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Evidence Inspector Side Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-6 rounded-2xl border border-border space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Evidence Details</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedSkill}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                currentDetails.status === 'Strong' ? 'bg-emerald-500/15 text-emerald-400' :
                currentDetails.status === 'Partial' ? 'bg-amber-500/15 text-amber-400' :
                'bg-rose-500/15 text-rose-400'
              }`}>
                {currentDetails.status}
              </span>
            </div>

            {/* Why This Status */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                <span>Why this status?</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed p-3.5 rounded-xl bg-surface border border-border/80">
                {currentDetails.why}
              </p>
            </div>

            {/* Resume Evidence */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Evidence from Resume</span>
              </h4>
              <div className="text-xs text-slate-300 p-3 rounded-xl bg-surface border border-border/80 italic">
                "{currentDetails.resumeEvidence}"
              </div>
            </div>

            {/* GitHub Evidence */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-blue-400" />
                <span>Evidence from GitHub</span>
              </h4>
              <div className="text-xs text-slate-300 p-3 rounded-xl bg-surface border border-border/80">
                {currentDetails.githubEvidence}
              </div>
            </div>

            {/* Job Requirement */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>Job Requirement Definition</span>
              </h4>
              <div className="text-xs text-slate-300 p-3 rounded-xl bg-surface border border-border/80">
                {currentDetails.jobRequirement}
              </div>
            </div>

            {/* Confidence */}
            <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-slate-400">
              <span>Verification Confidence:</span>
              <span className="font-semibold text-white">{currentDetails.confidence}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
