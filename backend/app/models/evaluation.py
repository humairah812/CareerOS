"""
Evaluation Model
Stores live benchmark runs against golden datasets with real mathematical scoring.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Float, JSON
from app.core.database import Base


class EvaluationRun(Base):
    __tablename__ = "evaluation_runs"

    id = Column(Integer, primary_key=True, index=True)
    benchmark_name = Column(String(100), default="CareerOS-Golden-v1", nullable=False)
    dataset_size = Column(Integer, default=10)
    precision = Column(Float, nullable=False)  # TP / (TP + FP)
    recall = Column(Float, nullable=False)  # TP / (TP + FN)
    f1_score = Column(Float, nullable=False)
    groundedness = Column(Float, nullable=False)  # % of claims with verified citations
    citation_accuracy = Column(Float, nullable=False)  # % of citations matching ground truth
    tool_success_rate = Column(Float, nullable=False)  # % of tool calls without validation errors
    avg_latency_ms = Column(Float, nullable=False)
    total_tokens = Column(Integer, default=0)
    metrics_json = Column(JSON, default=dict)  # Complete granular per-case breakdown
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
