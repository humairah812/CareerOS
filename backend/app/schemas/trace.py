"""
Trace Observability Schemas
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class TraceSpanItem(BaseModel):
    id: int
    trace_id: str
    agent_name: str
    model_name: str
    latency_ms: float
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    status: str
    input_preview: Optional[str] = None
    output_preview: Optional[str] = None
    metadata_json: Dict[str, Any] = {}
    created_at: str


class TraceSummary(BaseModel):
    trace_id: str
    total_spans: int
    total_latency_ms: float
    total_tokens: int
    agents_involved: List[str]
    status: str
    created_at: str
    spans: List[TraceSpanItem]
