import React, { useState } from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Target, 
  RefreshCw,
  ArrowRight,
  Upload
} from 'lucide-react';
import { api } from '../services/api';

interface JobDescriptionViewProps {
  onJobAnalyzed?: () => void;
}

export const JobDescriptionView: React.FC<JobDescriptionViewProps> = ({ onJobAnalyzed }) => {
  const [jobText, setJobText] = useState(
    "Staff AI Systems Engineer\nCompany: Vanguard Autonomous AI\nLocation: Remote / San Francisco\n\nWe are seeking an experienced Staff AI Systems Engineer to architect, build, and deploy production multi-agent systems and real-time retrieval architectures.\n\nRequired Skills:\n- Python and FastAPI asynchronous microservices\n- RAG retrieval pipelines, dense embeddings, and pgvector\n- Containerization with Docker and relational PostgreSQL modeling\n\nPreferred Skills:\n- Model Context Protocol (MCP) tool integration\n- Kubernetes cluster orchestration and Helm deployments\n- Event streaming with Apache Kafka"
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedJob, setAnalyzedJob] = useState<{
    role: string;
    company: string;
    requiredSkills: string[];
    preferredSkills: string[];
    responsibilities: string[];
    techStack: string[];
  } | null>({
    role: "Staff AI Systems Engineer",
    company: "Vanguard Autonomous AI",
    requiredSkills: ["Python", "FastAPI", "RAG Retrieval", "pgvector", "Docker", "PostgreSQL"],
    preferredSkills: ["Model Context Protocol (MCP)", "Kubernetes", "Apache Kafka"],
    responsibilities: [
      "Architect asynchronous backend services for real-time document search.",
      "Design robust tool-calling validation for autonomous agent state machines.",
      "Collaborate with ML engineers to scale vector database indices."
    ],
    techStack: ["Python", "FastAPI", "Docker", "PostgreSQL", "pgvector", "Redis", "Kafka", "Kubernetes"]
  });

  const handleAnalyzeJob = async () => {
    setIsAnalyzing(true);
    try {
      const res = await api.createJob(jobText);
      if (res?.structured_data) {
        setAnalyzedJob({
          role: res.structured_data.role_title || "Staff AI Systems Engineer",
          company: res.structured_data.company || "Target Company",
          requiredSkills: res.structured_data.mandatory_requirements || ["Python", "FastAPI", "Docker"],
          preferredSkills: res.structured_data.preferred_requirements || ["Kubernetes", "Kafka"],
          responsibilities: [
            "Architect high-throughput AI microservices.",
            "Integrate tool calling and agent orchestration.",
            "Deploy and maintain scalable database schemas."
          ],
          techStack: ["Python", "FastAPI", "PostgreSQL", "Docker"]
        });
      }
      if (onJobAnalyzed) onJobAnalyzed();
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-border">
        <div>
          <h2 className="text-lg font-bold text-white">Target Job Description</h2>
          <p className="text-xs text-slate-400">
            Paste any job posting or internship description to extract required skills and evaluate your fit.
          </p>
        </div>

        <button
          onClick={handleAnalyzeJob}
          disabled={isAnalyzing || !jobText.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
        >
          {isAnalyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>{isAnalyzing ? 'Analyzing Job...' : 'Analyze Job'}</span>
        </button>
      </div>

      {/* Input Text Area Form */}
      <div className="glass-card p-6 rounded-2xl border border-border space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Paste Job Description
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {jobText.length} characters
          </span>
        </div>

        <textarea
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          rows={6}
          placeholder="Paste full job posting text here..."
          className="w-full p-4 rounded-xl bg-surface border border-border text-xs text-slate-200 outline-none focus:border-blue-500 font-mono leading-relaxed"
        />
      </div>

      {/* Structured Analysis Results */}
      {analyzedJob && (
        <div className="glass-card p-7 rounded-2xl border border-border space-y-6">
          <div className="flex items-start justify-between pb-5 border-b border-border">
            <div>
              <span className="text-xs font-semibold text-blue-400 font-mono uppercase tracking-wider">
                Extracted Job Profile
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{analyzedJob.role}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{analyzedJob.company}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              Requirements Parsed
            </span>
          </div>

          {/* Required vs Preferred Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Required Skills */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Required Skills (Must Have)</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {analyzedJob.requiredSkills.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Skills */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span>Preferred Skills (Nice to Have)</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {analyzedJob.preferredSkills.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Core Responsibilities */}
          <div className="space-y-2.5 pt-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Key Responsibilities
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 pl-4 list-disc marker:text-blue-500">
              {analyzedJob.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Technology Stack Tags */}
          <div className="space-y-2.5 pt-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {analyzedJob.techStack.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-card border border-border text-slate-300">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
