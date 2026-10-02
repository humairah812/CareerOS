"""
Skill Evidence Model
Critical Evidence Engine storage. Links every candidate skill to a verified quote,
section, confidence, and flags unsupported claims.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base


class SkillEvidence(Base):
    __tablename__ = "skill_evidence"

    id = Column(Integer, primary_key=True, index=True)
    candidate_skill_id = Column(Integer, ForeignKey("candidate_skills.id"), nullable=False, index=True)
    source_type = Column(String(50), nullable=False)  # "resume", "github", "certification"
    source_section = Column(String(100), nullable=True)  # "Projects: CampusMind", "Experience: Tech Corp"
    page_number = Column(Integer, nullable=True)
    quote = Column(Text, nullable=True)  # Verbatim quote from resume
    confidence = Column(Float, default=1.0)  # 0.0 - 1.0
    is_unsupported = Column(Boolean, default=False)  # True if candidate claimed it with no measurable proof
    verification_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    candidate_skill = relationship("CandidateSkill", back_populates="evidence_items")
