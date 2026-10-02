"""
Job Description Model
Stores raw job postings and parsed structured requirements.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=True)
    seniority = Column(String(100), nullable=True)  # Junior, Mid, Senior, Staff, Lead
    raw_text = Column(Text, nullable=False)
    parsed_json = Column(JSON, default=dict)  # {"mandatory_skills": [], "preferred_skills": [], "responsibilities": [], ...}
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="job_descriptions")
