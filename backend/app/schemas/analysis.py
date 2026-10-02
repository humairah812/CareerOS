"""
Analysis, Strategy, and Recruiter Schemas
"""
from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from app.schemas.evidence import EvidenceItem, UnsupportedClaim


class AnalysisRunRequest(BaseModel):
    resume_id: int
    job_id: int
    github_username: Optional[str] = None


class ResumeOptimizationBullet(BaseModel):
    id: str
    section: str
    original_text: str
    detected_problems: List[str]  # e.g., ["Lacks specific metric or scale", "Passive phrasing", "Generic AI buzzword"]
    suggested_rewrite: str  # Grounded strictly in verified facts - NO fabricated metrics!
    factual_basis: str  # Where in the candidate's work this comes from
    status: str = "pending"  # "pending", "accepted", "rejected", "edited"
    edited_text: Optional[str] = None


class RecruiterReviewResult(BaseModel):
    evidence_found: List[str]
    evidence_partial: List[str]
    evidence_missing: List[str]
    factual_concerns: List[str]  # Objective issues only (e.g. "Missing technical detail", "Unclear outcome")
    recommended_focus_areas: List[str]


class AnalysisResultResponse(BaseModel):
    analysis_id: str
    target_role: str
    target_company: Optional[str] = None
    skill_coverage_score: float  # Formula: (demonstrated_mandatory * 1.0 + partial_mandatory * 0.5) / total_mandatory * 100
    evidence_grounding_score: float  # Formula: verified_evidence_count / total_claimed_skills * 100
    strong_skills: List[str]
    partial_skills: List[str]
    missing_skills: List[str]
    unsupported_claims: List[UnsupportedClaim]
    recruiter_review: RecruiterReviewResult
    resume_improvements: List[ResumeOptimizationBullet]
    status: str  # "completed", "processing", "failed"
