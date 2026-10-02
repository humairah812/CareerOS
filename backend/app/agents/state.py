"""
LangGraph Multi-Agent State Definition
"""
from typing import TypedDict, List, Dict, Any, Optional


class CareerOSAgentState(TypedDict):
    trace_id: str
    resume_raw_text: str
    jd_raw_text: str
    github_username: Optional[str]
    parsed_resume: Optional[Dict[str, Any]]
    parsed_jd: Optional[Dict[str, Any]]
    candidate_skills: List[Dict[str, Any]]
    evidence_items: List[Dict[str, Any]]
    unsupported_claims: List[Dict[str, Any]]
    github_intelligence: Optional[Dict[str, Any]]
    skill_coverage: Dict[str, Any]
    recruiter_review: Dict[str, Any]
    resume_improvements: List[Dict[str, Any]]
    learning_roadmap: List[Dict[str, Any]]
    status: str
    errors: List[str]
