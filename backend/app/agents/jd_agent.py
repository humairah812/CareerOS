"""
Job Description (JD) Agent
Analyzes job description to extract mandatory vs. preferred requirements, seniority, and domain scope.
"""
from typing import Dict, Any
from app.agents.state import CareerOSAgentState
from app.schemas.job import JobStructuredData
from app.services.llm_factory import LLMFactory
from app.services.tracer import tracer


async def jd_agent_node(state: CareerOSAgentState) -> Dict[str, Any]:
    trace_id = state.get("trace_id", "default_trace")
    jd_text = state.get("jd_raw_text", "")

    async with tracer.span(trace_id, agent_name="JDAgent", input_preview=jd_text[:150]) as span:
        prompt = f"Analyze the following job description and extract mandatory vs preferred skills and seniority:\n\n{jd_text}"
        structured_jd, metadata = await LLMFactory.generate_structured(prompt, JobStructuredData)

        span.complete(
            output=f"Role: {structured_jd.role_title}, Mandatory skills: {len(structured_jd.mandatory_skills)}, Preferred: {len(structured_jd.preferred_skills)}",
            tokens=metadata
        )

        return {
            "parsed_jd": structured_jd.model_dump(),
            "status": "jd_parsed"
        }
