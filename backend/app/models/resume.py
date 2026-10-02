"""
Resume Model
Stores raw extracted document text, detected sections, and parsed structured JSON.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    filename = Column(String(255), nullable=False)
    file_size_bytes = Column(Integer, default=0)
    raw_text = Column(Text, nullable=False)
    sections_json = Column(JSON, default=dict)  # {"experience": "...", "education": "...", "skills": "...", "projects": "..."}
    structured_json = Column(JSON, default=dict)  # Pydantic ResumeStructuredData representation
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="resumes")
    candidate_skills = relationship("CandidateSkill", back_populates="resume", cascade="all, delete-orphan")
