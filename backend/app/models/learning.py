"""
Learning Plan Model
Stores day-by-day structured roadmaps prioritized to close verified skill gaps.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class LearningPlan(Base):
    __tablename__ = "learning_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    target_role = Column(String(255), nullable=False)
    target_skills = Column(JSON, default=list)  # ["MCP", "Kubernetes", "LangGraph"]
    total_days = Column(Integer, default=7)
    roadmap_days = Column(JSON, default=list)  # [{"day": 1, "topic": "MCP Architecture", "tasks": [...], "completed": False}]
    status = Column(String(50), default="active")  # active, completed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="learning_plans")
