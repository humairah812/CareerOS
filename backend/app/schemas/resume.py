"""
Resume Structured Data Schemas
Rigid schemas for LLM structured extraction.
"""
from typing import List, Optional, Dict
from pydantic import BaseModel, Field


class EducationItem(BaseModel):
    degree: str
    university: str
    graduation_year: Optional[str] = None
    gpa_or_honors: Optional[str] = None


class WorkExperienceItem(BaseModel):
    company: str
    role: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    bullets: List[str] = Field(default_factory=list)
    technologies_mentioned: List[str] = Field(default_factory=list)


class ProjectItem(BaseModel):
    name: str
    description: str
    technologies_used: List[str] = Field(default_factory=list)
    outcomes_or_metrics: Optional[str] = None
    repository_url: Optional[str] = None


class CertificationItem(BaseModel):
    name: str
    issuer: str
    year: Optional[str] = None


class ResumeStructuredData(BaseModel):
    candidate_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    summary: Optional[str] = None
    education: List[EducationItem] = Field(default_factory=list)
    experience: List[WorkExperienceItem] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    certifications: List[CertificationItem] = Field(default_factory=list)
    technical_skills: List[str] = Field(default_factory=list)
    soft_skills: List[str] = Field(default_factory=list)


class ResumeUploadResponse(BaseModel):
    resume_id: int
    filename: str
    file_size_bytes: int
    extracted_sections: List[str]
    structured_data: ResumeStructuredData
