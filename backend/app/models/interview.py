"""
Interview Models
Tracks multi-mode simulated interviews, questions, user answers, and objective rubric feedback.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    role_title = Column(String(255), nullable=False)
    mode = Column(String(50), nullable=False)  # technical, project, aiml, behavioral, system_design
    status = Column(String(50), default="active")  # active, completed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="interview_sessions")
    turns = relationship("InterviewTurn", back_populates="session", cascade="all, delete-orphan")


class InterviewTurn(Base):
    __tablename__ = "interview_turns"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id"), nullable=False, index=True)
    turn_number = Column(Integer, default=1)
    question = Column(Text, nullable=False)
    question_topic = Column(String(150), nullable=True)
    candidate_answer = Column(Text, nullable=True)
    technical_score = Column(Float, nullable=True)  # 0.0 - 100.0 based on explicit rubric
    rubric_scores = Column(JSON, default=dict)  # {"correctness": 85, "relevance": 90, "completeness": 75, "clarity": 80}
    feedback = Column(Text, nullable=True)
    missing_concepts = Column(JSON, default=list)  # ["deadlock handling", "connection pool starvation"]
    suggested_improvement = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    session = relationship("InterviewSession", back_populates="turns")
