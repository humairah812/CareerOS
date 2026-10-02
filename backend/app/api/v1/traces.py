"""
AI Traces & Observability API Router
Exposes recorded agent spans, latencies, and token counts.
"""
from typing import List
from fastapi import APIRouter, HTTPException
from app.services.tracer import tracer
from app.schemas.trace import TraceSummary

router = APIRouter(prefix="/traces", tags=["AI Observability"])


@router.get("/")
def list_traces():
    all_traces = tracer.list_all_traces()
    if not all_traces:
        # Pre-seed a rich trace for demo visualization
        tid = "tr_demo_orchestration"
        s1 = tracer.span(tid, "ResumeAgent", "gpt-4o-mini", "Parse candidate resume PDF")
        tracer.record_span(tracer._traces.get(tid, [])[-1] if tid in tracer._traces else None)
    return tracer.list_all_traces()


@router.get("/{trace_id}")
def get_trace(trace_id: str):
    trace_data = tracer.get_trace(trace_id)
    if not trace_data:
        raise HTTPException(status_code=404, detail="Trace ID not found.")
    return trace_data
