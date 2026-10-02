"""
AI Evaluation Schemas
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class EvaluationCaseResult(BaseModel):
    case_id: str
    scenario: str
    expected_skills: List[str]
    retrieved_skills: List[str]
    precision: float
    recall: float
    groundedness_score: float
    citation_accuracy: float
    tool_success: bool
    latency_ms: float
    tokens_used: int


class EvaluationRunResponse(BaseModel):
    id: int
    benchmark_name: str
    dataset_size: int
    precision: float
    recall: float
    f1_score: float
    groundedness: float
    citation_accuracy: float
    tool_success_rate: float
    avg_latency_ms: float
    total_tokens: int
    created_at: str
    case_results: List[EvaluationCaseResult] = []
