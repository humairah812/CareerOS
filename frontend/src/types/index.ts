// TypeScript definitions for CareerOS

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  email: string;
  full_name: string;
}

export interface UnsupportedClaim {
  claim_text: string;
  detected_in_section: string;
  reason: string;
  severity: 'high' | 'medium' | 'low';
}

export interface RecruiterReviewResult {
  evidence_found: string[];
  evidence_partial: string[];
  evidence_missing: string[];
  factual_concerns: string[];
  recommended_focus_areas: string[];
}

export interface ResumeOptimizationBullet {
  id: string;
  section: string;
  original_text: string;
  detected_problems: string[];
  suggested_rewrite: string;
  factual_basis: string;
  status: 'pending' | 'accepted' | 'rejected' | 'edited';
  edited_text?: string | null;
}

export interface AnalysisResultResponse {
  analysis_id: string;
  target_role: string;
  target_company: string;
  skill_coverage_score: number;
  evidence_grounding_score: number;
  strong_skills: string[];
  partial_skills: string[];
  missing_skills: string[];
  unsupported_claims: UnsupportedClaim[];
  recruiter_review: RecruiterReviewResult;
  resume_improvements: ResumeOptimizationBullet[];
  status: string;
}

export interface EvidenceItem {
  id: number;
  skill_name: string;
  source_type: string;
  source_section: string;
  page_number: number;
  quote: string;
  confidence: number;
  is_unsupported: boolean;
  verification_notes: string;
}

export interface EvidenceQueryResponse {
  skill_name: string;
  is_verified: boolean;
  confidence: number;
  evidence: EvidenceItem[];
  citations_count: number;
}

export interface InterviewEvaluation {
  score: number;
  clarity_score: number;
  technical_depth_score: number;
  groundedness_score: number;
  star_compliance: boolean;
  critique: string;
  strengths: string[];
  areas_for_improvement: string[];
  ideal_answer_points: string[];
}

export interface InterviewTurnResponse {
  session_id: number;
  turn_number: number;
  current_question: string;
  question_topic: string;
  evaluation?: InterviewEvaluation | null;
  next_question?: string | null;
  is_finished: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  resource_type: string;
  estimated_hours: number;
  completed: boolean;
}

export interface RoadmapDay {
  day: number;
  topic: string;
  objective: string;
  tasks: TaskItem[];
}

export interface LearningPlanResponse {
  target_role: string;
  total_days: number;
  roadmap: RoadmapDay[];
}

export interface EvaluationBenchmarkSummary {
  dataset_size: number;
  precision: number;
  recall: number;
  f1_score: number;
  groundedness: number;
  tool_success_rate: number;
  hallucination_rate: number;
  timestamp: string;
}

export interface AgentSpan {
  span_id: string;
  trace_id: string;
  agent_name: string;
  model: string;
  prompt_summary: string;
  output_summary: string;
  duration_ms: number;
  tokens_used: number;
  timestamp: string;
  status: string;
}

export interface TraceSummary {
  trace_id: string;
  total_spans: number;
  total_duration_ms: number;
  total_tokens: number;
  start_time: string;
}

export interface GitHubProfileData {
  username: string;
  public_repos: number;
  total_stars: number;
  top_languages: string[];
  verified_projects: {
    name: string;
    description: string;
    skills: string[];
    stars: number;
  }[];
  verification_status: string;
}

export type NavTab = 
  | 'dashboard' 
  | 'resume' 
  | 'github' 
  | 'job_description' 
  | 'skill_gaps' 
  | 'evidence' 
  | 'optimizer' 
  | 'career_plan' 
  | 'roadmap' 
  | 'interview' 
  | 'traces' 
  | 'benchmarks' 
  | 'mcp' 
  | 'settings';

export interface ResumeStructuredData {
  candidate_name?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  github_url?: string;
  summary?: string;
  education: Array<{
    degree: string;
    university: string;
    graduation_year?: string;
    gpa_or_honors?: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    start_date?: string;
    end_date?: string;
    bullets: string[];
    technologies_mentioned: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies_used: string[];
    outcomes_or_metrics?: string;
    repository_url?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year?: string;
  }>;
  technical_skills: string[];
  soft_skills: string[];
}

export interface ResumeUploadResponse {
  resume_id: number;
  filename: string;
  file_size_bytes: number;
  extracted_sections: string[];
  structured_data: ResumeStructuredData;
}

