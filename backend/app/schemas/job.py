"""
Job Description Schemas
"""
from typing import List, Optional
from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    title: str
    company: Optional[str] = None
    raw_text: str


class JobStructuredData(BaseModel):
    role_title: str
    company: Optional[str] = None
    seniority: Optional[str] = None  # Junior, Mid, Senior, Staff, Lead
    mandatory_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)
    programming_languages: List[str] = Field(default_factory=list)
    frameworks: List[str] = Field(default_factory=list)
    databases: List[str] = Field(default_factory=list)
    cloud_technologies: List[str] = Field(default_factory=list)
    ai_ml_technologies: List[str] = Field(default_factory=list)
    responsibilities: List[str] = Field(default_factory=list)
    qualifications: List[str] = Field(default_factory=list)
    domain_knowledge: List[str] = Field(default_factory=list)


class JobResponse(BaseModel):
    id: int
    title: str
    company: Optional[str] = None
    seniority: Optional[str] = None
    structured_data: JobStructuredData

    class Config:
        from_attributes = True
