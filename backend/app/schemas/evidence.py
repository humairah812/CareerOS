"""
Evidence Engine Schemas
"""
from typing import List, Optional
from pydantic import BaseModel, Field


class EvidenceItem(BaseModel):
    id: int
    skill_name: str
    source_type: str  # "resume", "github", "certification"
    source_section: Optional[str] = None
    page_number: Optional[int] = None
    quote: str
    confidence: float
    is_unsupported: bool
    verification_notes: Optional[str] = None


class UnsupportedClaim(BaseModel):
    claim_text: str
    detected_in_section: str
    reason: str  # e.g., "Contains high-level buzzwords ('built scalable AI systems') without metrics, architecture, or verifiable tools."
    severity: str  # "high", "medium"


class EvidenceQueryResponse(BaseModel):
    skill_name: str
    is_verified: bool
    confidence: float
    evidence: List[EvidenceItem]
    citations_count: int
