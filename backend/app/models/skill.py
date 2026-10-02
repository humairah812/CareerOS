"""
Skill & Ontology Models
Stores canonical skill ontology graph and candidate demonstrated skills.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class SkillOntology(Base):
    __tablename__ = "skill_ontology"

    id = Column(Integer, primary_key=True, index=True)
    canonical_name = Column(String(150), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=False, index=True)  # AI/ML, Cloud, Backend, Frontend, Data, Systems, Security
    subcategory = Column(String(100), nullable=True)
    aliases = Column(JSON, default=list)  # ["pgvector", "vector-db", "vector database"]
    description = Column(Text, nullable=True)
    parent_skill = Column(String(150), nullable=True)  # Directed graph parent (e.g., PyTorch -> Deep Learning)


class CandidateSkill(Base):
    __tablename__ = "candidate_skills"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False, index=True)
    skill_name = Column(String(150), nullable=False, index=True)
    category = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False)  # strong, partial, missing, unclear
    confidence = Column(Float, default=1.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    resume = relationship("Resume", back_populates="candidate_skills")
    evidence_items = relationship("SkillEvidence", back_populates="candidate_skill", cascade="all, delete-orphan")
