"""
Observability Trace Model
Tracks request IDs, agent names, latency, token consumption, prompts, and status.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, JSON
from app.core.database import Base


class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(Integer, primary_key=True, index=True)
    trace_id = Column(String(100), index=True, nullable=False)
    user_id = Column(Integer, nullable=True, index=True)
    orchestrator = Column(String(100), default="CareerOSGraph")
    agent_name = Column(String(100), nullable=False, index=True)  # ResumeAgent, JDAgent, SkillAgent, EvidenceAgent
    model_name = Column(String(100), default="gpt-4o-mini")
    latency_ms = Column(Float, default=0.0)
    prompt_tokens = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    total_tokens = Column(Integer, default=0)
    status = Column(String(50), default="completed")  # completed, error, queued
    input_preview = Column(Text, nullable=True)
    output_preview = Column(Text, nullable=True)
    metadata_json = Column(JSON, default=dict)  # {"prompt_version": "1.2", "tool_calls": [...], "retrieval_count": 4}
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
