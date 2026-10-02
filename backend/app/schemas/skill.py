"""
Skill & Ontology Schemas
"""
from typing import List, Optional
from pydantic import BaseModel, Field


class SkillOntologyNode(BaseModel):
    id: int
    name: str
    category: str
    subcategory: Optional[str] = None
    parent_skill: Optional[str] = None
    description: Optional[str] = None
    aliases: List[str] = Field(default_factory=list)


class SkillGraphData(BaseModel):
    nodes: List[dict]  # [{"id": "fastapi", "label": "FastAPI", "category": "Backend", "status": "strong"}]
    edges: List[dict]  # [{"source": "python", "target": "fastapi", "relation": "framework_of"}]


class CandidateSkillItem(BaseModel):
    id: int
    name: str
    category: str
    status: str  # strong, partial, missing, unclear
    confidence: float
    evidence_count: int = 0


class SkillCoverageMetric(BaseModel):
    category: str
    total_required: int
    demonstrated: int
    partial: int
    missing: int
    coverage_percentage: float  # explicitly calculated: (demonstrated * 1.0 + partial * 0.5) / total_required * 100
