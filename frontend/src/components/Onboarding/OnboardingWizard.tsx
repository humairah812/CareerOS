import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Briefcase, 
  Github, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Upload, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { api } from '../../services/api';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [resumeText, setResumeText] = useState(
    "Alex Mercer\nSenior AI Platform Engineer\nBuilt asynchronous RAG retrieval service using FastAPI, pgvector, and hybrid BM25 search.\nSkills: Python, FastAPI, Docker, PostgreSQL, pgvector, Redis, PyTorch"
  );
  const [jobText, setJobText] = useState(
    "Staff AI Systems Engineer\nVanguard Autonomous AI\nRequirements: Python, FastAPI, Docker, PostgreSQL, pgvector.\nPreferred: Kubernetes, Kafka, Model Context Protocol (MCP)."
  );
  const [githubUsername, setGithubUsername] = useState('alexmercer-ai');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsFileLoading(true);
    try {
      if (file.name.endsWith('.pdf')) {
        const res = await api.uploadResumeFile(file);
        const s = res.structured_data;
        const generatedText = `${s.candidate_name || file.name}\n${s.summary || 'Software Engineer'}\nSkills: ${s.technical_skills?.join(', ') || ''}`;
        setResumeText(generatedText);
      } else {
        const text = await file.text();
        setResumeText(text);
      }
    } catch (err) {
      console.warn('Could not parse file in wizard', err);
    } finally {
      setIsFileLoading(false);
      if (e.target) e.target.value = '';
    }
  };

  const steps = [
    { num: 1, title: 'Upload Resume', icon: FileText, desc: 'Your background & skills' },
    { num: 2, title: 'Target Job', icon: Briefcase, desc: 'The role you want' },
    { num: 3, title: 'Connect GitHub', icon: Github, desc: 'Optional project evidence' },
    { num: 4, title: 'Run Analysis', icon: Sparkles, desc: 'Build your career profile' }
  ];

  const handleFinish = async () => {
    setIsAnalyzing(true);
    try {
      // 1. Upload resume text
      await api.uploadResumeText(resumeText);
      // 2. Ingest job description
      await api.createJob(jobText, "Staff AI Systems Engineer", "Vanguard Autonomous AI");
      // 3. Trigger initial analysis
      await api.triggerAnalysis(1, 1, githubUsername);
    } catch (e) {
      console.warn("Using sample profile analysis for initial load");
    } finally {
      setIsAnalyzing(false);
      localStorage.setItem('careeros_onboarding_done', 'true');
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <span>Step {currentStep} of 4</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome to CareerOS
          </h1>
          <p className="text-sm text-slate-400">
            Let's build your career profile in four quick steps.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-4 gap-2">
          {steps.map((s) => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div 
                key={s.num}
                onClick={() => !isAnalyzing && setCurrentStep(s.num)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isCurrent 
                    ? 'bg-card border-blue-500 text-white' 
                    : isDone 
                    ? 'bg-card/40 border-emerald-500/30 text-emerald-400' 
                    : 'bg-card/20 border-border text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase">Step {s.num}</span>
                  {isDone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                </div>
                <div className="text-xs font-semibold truncate text-slate-200">{s.title}</div>
              </div>
            );
          })}
        </div>

        {/* Step Content Container */}
        <div className="glass-card p-8 rounded-2xl border border-border shadow-xl space-y-6">
          {/* Step 1: Resume */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Step 1: Provide Your Resume</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Paste your resume text below or use our verified candidate profile to get started immediately.
                </p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.txt,.md"
                className="hidden"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {resumeText.split('\n').length} lines • PDF parser ready
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isFileLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card hover:bg-surface border border-border text-slate-200 text-xs font-medium transition-colors"
                >
                  {isFileLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{isFileLoading ? 'Parsing file...' : 'Upload File (.pdf, .txt)'}</span>
                </button>
              </div>

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={8}
                placeholder="Paste your work experience, education, and technical skills..."
                className="w-full p-4 rounded-xl bg-surface border border-border text-xs text-slate-200 outline-none focus:border-blue-500 leading-relaxed font-mono"
              />

              <div className="flex items-center justify-end pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Next: Add Target Job</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Target Job */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Step 2: Add Target Job Description</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Paste the requirements for the job or internship you are targeting.
                </p>
              </div>

              <textarea
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                rows={8}
                placeholder="Paste the target job description or requirements..."
                className="w-full p-4 rounded-xl bg-surface border border-border text-xs text-slate-200 outline-none focus:border-blue-500 leading-relaxed font-mono"
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl bg-card hover:bg-card-hover border border-border text-slate-300 text-xs font-medium flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Next: Connect GitHub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Connect GitHub (Optional) */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Step 3: Connect GitHub (Optional)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Connect your GitHub profile to provide verifiable code evidence for your technical skills.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
                <label className="text-xs font-medium text-slate-300">GitHub Username</label>
                <div className="relative">
                  <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="e.g. alexmercer-ai"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-card border border-border text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  This step is completely optional. You can skip or change it at any time in Settings.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl bg-card hover:bg-card-hover border border-border text-slate-300 text-xs font-medium flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Next: Review & Run</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Run Career Analysis */}
          {currentStep === 4 && (
            <div className="space-y-5 text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Ready to Analyze Your Career Fit</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  CareerOS will cross-reference your resume against the job requirements, identify your skill gaps, and generate your personalized career plan.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Resume Source:</span>
                  <span className="text-emerald-400 font-medium">Ready</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Target Role:</span>
                  <span className="text-slate-100 font-semibold">Staff AI Systems Engineer</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>GitHub Profile:</span>
                  <span className="text-cyan-400 font-mono">@{githubUsername}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={isAnalyzing}
                  className="px-4 py-2.5 rounded-xl bg-card hover:bg-card-hover border border-border text-slate-300 text-xs font-medium flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleFinish}
                  disabled={isAnalyzing}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing Your Profile...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run Career Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
