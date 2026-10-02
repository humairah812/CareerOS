"""
AI Observability & Trace Collector Service
Provides context managers and registry for capturing agent execution spans,
latencies, token expenditures, prompt versions, and tool calls.
"""
import time
import uuid
from typing import Dict, List, Any, Optional
from contextlib import asynccontextmanager


class Span:
    def __init__(
        self,
        span_id: str,
        trace_id: str,
        agent_name: str,
        model_name: str = "gpt-4o-mini",
        input_preview: str = ""
    ):
        self.span_id = span_id
        self.trace_id = trace_id
        self.agent_name = agent_name
        self.model_name = model_name
        self.input_preview = input_preview[:200]
        self.output_preview = ""
        self.status = "running"
        self.start_time = time.time()
        self.latency_ms = 0.0
        self.prompt_tokens = 0
        self.completion_tokens = 0
        self.total_tokens = 0
        self.metadata: Dict[str, Any] = {}

    def complete(self, output: str, tokens: Optional[Dict[str, int]] = None, metadata: Optional[Dict[str, Any]] = None):
        self.latency_ms = round((time.time() - self.start_time) * 1000.0, 2)
        self.output_preview = str(output)[:200]
        self.status = "completed"
        if tokens:
            self.prompt_tokens = tokens.get("prompt_tokens", 0)
            self.completion_tokens = tokens.get("completion_tokens", 0)
            self.total_tokens = tokens.get("total_tokens", self.prompt_tokens + self.completion_tokens)
        if metadata:
            self.metadata.update(metadata)

    def fail(self, error_message: str):
        self.latency_ms = round((time.time() - self.start_time) * 1000.0, 2)
        self.output_preview = f"ERROR: {error_message}"[:200]
        self.status = "error"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.span_id,
            "trace_id": self.trace_id,
            "agent_name": self.agent_name,
            "model_name": self.model_name,
            "latency_ms": self.latency_ms,
            "prompt_tokens": self.prompt_tokens,
            "completion_tokens": self.completion_tokens,
            "total_tokens": self.total_tokens,
            "status": self.status,
            "input_preview": self.input_preview,
            "output_preview": self.output_preview,
            "metadata_json": self.metadata,
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(self.start_time))
        }


class TraceRegistry:
    def __init__(self):
        # Store traces by trace_id -> list of Span
        self._traces: Dict[str, List[Span]] = {}

    def new_trace_id(self) -> str:
        return f"tr_{uuid.uuid4().hex[:12]}"

    def record_span(self, span: Span):
        if span.trace_id not in self._traces:
            self._traces[span.trace_id] = []
        self._traces[span.trace_id].append(span)

    def get_trace(self, trace_id: str) -> Optional[Dict[str, Any]]:
        spans = self._traces.get(trace_id, [])
        if not spans:
            return None
        total_latency = sum(s.latency_ms for s in spans)
        total_tokens = sum(s.total_tokens for s in spans)
        agents = list({s.agent_name for s in spans})
        has_error = any(s.status == "error" for s in spans)

        return {
            "trace_id": trace_id,
            "total_spans": len(spans),
            "total_latency_ms": round(total_latency, 2),
            "total_tokens": total_tokens,
            "agents_involved": agents,
            "status": "error" if has_error else "completed",
            "created_at": spans[0].to_dict()["created_at"] if spans else "",
            "spans": [s.to_dict() for s in spans]
        }

    def list_all_traces(self, limit: int = 50) -> List[Dict[str, Any]]:
        results = []
        for tid in reversed(list(self._traces.keys())):
            trace_obj = self.get_trace(tid)
            if trace_obj:
                results.append(trace_obj)
            if len(results) >= limit:
                break
        return results

    @asynccontextmanager
    async def span(
        self,
        trace_id: str,
        agent_name: str,
        model_name: str = "gpt-4o-mini",
        input_preview: str = ""
    ):
        span_id = f"sp_{uuid.uuid4().hex[:8]}"
        s = Span(span_id, trace_id, agent_name, model_name, input_preview)
        self.record_span(s)
        try:
            yield s
        except Exception as e:
            s.fail(str(e))
            raise


tracer = TraceRegistry()
