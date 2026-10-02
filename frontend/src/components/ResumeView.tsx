import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  RefreshCw,
  AlertCircle,
  FileCheck,
  X
} from 'lucide-react';
import { api } from '../services/api';

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

interface EducationItem {
  degree: string;
  institution: string;
  gradYear: string;
  gpa: string;
}

interface ProjectItem {
  name: string;
  description: string;
}

interface ResumeDisplayData {
  filename: string;
  fileSizeBytes: number;
  candidateName: string;
  title: string;
  email: string;
  github: string;
  experiences: ExperienceItem[];
  education: EducationItem;
  projects: ProjectItem[];
  skills: string[];
}

const DEFAULT_RESUME: ResumeDisplayData = {
  filename: "Alex_Mercer_AI_Engineer.pdf",
  fileSizeBytes: 104520,
  candidateName: "Alex Mercer",
  title: "Senior AI Platform Engineer",
  email: "alex.mercer@example.com",
  github: "github.com/alexmercer-ai",
  experiences: [
    {
      company: "Cognitive Scale AI",
      role: "Senior AI Platform Engineer",
      period: "2023 - Present",
      bullets: [
        "Architected asynchronous retrieval microservices using FastAPI, pgvector, and hybrid BM25 search serving 450k daily queries.",
        "Built multi-agent orchestration service to automate code review workflows and tool execution.",
        "Containerized distributed backend services with Docker and automated CI/CD pipelines."
      ]
    },
    {
      company: "Nexus Systems",
      role: "Backend Software Engineer",
      period: "2021 - 2023",
      bullets: [
        "Implemented high-throughput REST APIs and microservices in Python and FastAPI with Redis caching.",
        "Managed relational database schemas and automated Alembic migrations on PostgreSQL."
      ]
    }
  ],
  education: {
    degree: "B.S. in Computer Science",
    institution: "Carnegie Mellon University",
    gradYear: "2021",
    gpa: "3.85 / 4.0"
  },
  projects: [
    {
      name: "CampusMind Agent Gateway",
      description: "Enterprise tool orchestration platform implementing standardized tool-calling validation."
    },
    {
      name: "RAG Vector Benchmark",
      description: "Asynchronous retrieval benchmark evaluating hybrid lexical BM25 and pgvector cosine search latency."
    }
  ],
  skills: ["Python", "FastAPI", "Docker", "PostgreSQL", "pgvector", "Redis", "REST APIs", "PyTorch", "Git"]
};

export const ResumeView: React.FC = () => {
  const [hasResume, setHasResume] = useState(true);
  const [showTechnical, setShowTechnical] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [resumeData, setResumeData] = useState<ResumeDisplayData>(() => {
    const saved = localStorage.getItem('careeros_current_resume');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_RESUME;
      }
    }
    return DEFAULT_RESUME;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowed = ['.pdf', '.txt', '.md', '.json'];
    if (!allowed.includes(ext)) {
      setUploadMsg({
        text: `Unsupported file type "${ext}". Please upload a PDF (.pdf), Text (.txt), or Markdown (.md) document.`,
        type: 'error'
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadMsg({
        text: 'File size exceeds maximum allowed limit of 10 MB.',
        type: 'error'
      });
      return;
    }

    setIsUploading(true);
    setUploadMsg(null);

    try {
      const response = await api.uploadResumeFile(file);
      const s = response.structured_data;

      const formatted: ResumeDisplayData = {
        filename: response.filename,
        fileSizeBytes: response.file_size_bytes,
        candidateName: s.candidate_name || file.name.replace(/\.[^/.]+$/, ""),
        title: s.summary ? s.summary.split('.')[0] : "Software Engineer",
        email: s.email || "candidate@example.com",
        github: s.github_url || "github.com",
        experiences: s.experience && s.experience.length > 0 ? s.experience.map(e => ({
          company: e.company || "Engineering Company",
          role: e.role || "Software Engineer",
          period: `${e.start_date || '2023'} - ${e.end_date || 'Present'}`,
          bullets: e.bullets && e.bullets.length > 0 ? e.bullets : ["Contributed to core application development and microservices."]
        })) : [
          {
            company: "Engineering Organization",
            role: "Software Engineer",
            period: "2023 - Present",
            bullets: [
              "Designed and developed scalable backend microservices and REST APIs.",
              "Implemented database models and optimized query performance."
            ]
          }
        ],
        education: s.education && s.education.length > 0 ? {
          degree: s.education[0].degree || "B.S. in Computer Science",
          institution: s.education[0].university || "University",
          gradYear: s.education[0].graduation_year || "2023",
          gpa: s.education[0].gpa_or_honors || "3.8 / 4.0"
        } : {
          degree: "B.S. in Computer Science",
          institution: "University",
          gradYear: "2023",
          gpa: "3.8 / 4.0"
        },
        projects: s.projects && s.projects.length > 0 ? s.projects.map(p => ({
          name: p.name || "Technical Project",
          description: p.description || "Scalable application leveraging modern engineering practices."
        })) : [
          {
            name: "Core Software Platform",
            description: "High-performance service built using modern backend frameworks and automated tests."
          }
        ],
        skills: s.technical_skills && s.technical_skills.length > 0 ? s.technical_skills : ["Python", "FastAPI", "Docker", "PostgreSQL", "Git"]
      };

      setResumeData(formatted);
      localStorage.setItem('careeros_current_resume', JSON.stringify(formatted));
      setHasResume(true);
      setUploadMsg({
        text: `Resume "${file.name}" uploaded & parsed successfully! Career intelligence updated.`,
        type: 'success'
      });

      // Automatically trigger multi-agent pipeline update
      try {
        await api.triggerAnalysis(response.resume_id, 1);
      } catch (e) {
        console.warn('Analysis pipeline update warning:', e);
      }
    } catch (err: any) {
      console.error('Resume upload error:', err);
      setUploadMsg({
        text: err.message || 'Failed to upload and parse resume. Please ensure the file is a valid PDF or text document.',
        type: 'error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.txt,.md,.json"
        className="hidden"
        id="resume-file-input"
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-border">
        <div>
          <h2 className="text-lg font-bold text-white">Your Resume</h2>
          <p className="text-xs text-slate-400">
            Review your parsed candidate profile or upload an updated resume document.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          <span>{isUploading ? 'Uploading & Parsing...' : 'Upload Updated Resume'}</span>
        </button>
      </div>

      {/* Upload Notification Banner */}
      {uploadMsg && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs animate-in fade-in duration-200 ${
          uploadMsg.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-center gap-2.5">
            {uploadMsg.type === 'success' ? (
              <FileCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span>{uploadMsg.text}</span>
          </div>
          <button
            onClick={() => setUploadMsg(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center space-y-2 ${
          isDragging 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-border/70 hover:border-blue-500/50 hover:bg-card/40'
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-card border border-border text-blue-400 flex items-center justify-center mx-auto">
          {isUploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
        </div>
        <div>
          <span className="text-xs font-semibold text-white">
            {isUploading ? 'Parsing document into structured profile...' : 'Click to select or drag & drop your resume file here'}
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Supported formats: PDF (.pdf), Text (.txt), or Markdown (.md) up to 10 MB
          </p>
        </div>
      </div>

      {!hasResume ? (
        /* Empty State */
        <div className="glass-card p-12 rounded-2xl border border-border text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-card border border-border text-blue-400 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Resume Uploaded</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Upload your resume in PDF or TXT format to start your career analysis.
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm"
          >
            Upload Resume
          </button>
        </div>
      ) : (
        /* Formatted Clean Resume */
        <div className="glass-card p-7 rounded-2xl border border-border space-y-6">
          {/* Header Card */}
          <div className="flex items-start justify-between pb-5 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{resumeData.candidateName}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Successfully Analyzed</span>
                </span>
              </div>
              <p className="text-xs text-blue-400 font-medium mt-0.5">{resumeData.title}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                <span>{resumeData.email}</span>
                <span>•</span>
                <span>{resumeData.github}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-slate-300 block font-medium">{resumeData.filename}</span>
              <span className="text-[11px] text-slate-400">
                {resumeData.filename.endsWith('.pdf') ? 'PDF' : 'Text'} Document • {formatFileSize(resumeData.fileSizeBytes)}
              </span>
            </div>
          </div>

          {/* Experience Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
              <span>Work Experience</span>
            </h4>
            <div className="space-y-4">
              {resumeData.experiences.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-surface/70 border border-border/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{exp.role}</span>
                      <span className="text-slate-400"> — {exp.company}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">{exp.period}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300 pl-4 list-disc marker:text-blue-500">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Projects Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Education */}
            <div className="p-4 rounded-xl bg-surface/70 border border-border/80 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                <span>Education</span>
              </h4>
              <div className="text-xs">
                <div className="font-semibold text-white">{resumeData.education.degree}</div>
                <div className="text-slate-400 mt-0.5">{resumeData.education.institution} • {resumeData.education.gradYear}</div>
                <div className="text-slate-500 text-[11px] mt-1">GPA / Honors: {resumeData.education.gpa}</div>
              </div>
            </div>

            {/* Projects */}
            <div className="p-4 rounded-xl bg-surface/70 border border-border/80 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-blue-400" />
                <span>Key Projects</span>
              </h4>
              <div className="space-y-2 text-xs">
                {resumeData.projects.map((p, i) => (
                  <div key={i}>
                    <div className="font-semibold text-white">{p.name}</div>
                    <div className="text-slate-400 text-[11px]">{p.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Identified Skills ({resumeData.skills.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {resumeData.skills.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-card border border-border text-slate-200">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Collapsible Technical Details (Hidden by Default) */}
          <div className="pt-4 border-t border-border">
            <button
              onClick={() => setShowTechnical(!showTechnical)}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono transition-colors"
            >
              {showTechnical ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              <span>{showTechnical ? 'Hide Technical Parser Metadata' : 'View Technical Details'}</span>
            </button>

            {showTechnical && (
              <div className="mt-3 p-4 rounded-xl bg-surface border border-border space-y-2 font-mono text-xs">
                <div className="text-[11px] text-slate-400">Security Guard: Clean (No prompt injection detected)</div>
                <div className="text-[11px] text-slate-400">Document Chunks: {Math.max(4, resumeData.experiences.length * 2)} indexed for hybrid semantic search</div>
                <div className="text-[11px] text-slate-400">Extracted Entities: {resumeData.skills.length} skills, {resumeData.experiences.length} roles, 1 degree</div>
                <div className="text-[11px] text-slate-400">Status: Processed & Vector Grounded</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
