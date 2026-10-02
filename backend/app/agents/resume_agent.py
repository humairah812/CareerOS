"""
Resume Agent
Parses resume text into structured schema, segments sections, and indexes chunks for RAG.
"""
from typing import Dict, Any
from app.agents.state import CareerOSAgentState
from app.schemas.resume import ResumeStructuredData
from app.services.llm_factory import LLMFactory
from app.services.document_parser import DocumentParser
from app.services.rag_engine import rag_engine
from app.services.tracer import tracer


async def resume_agent_node(state: CareerOSAgentState) -> Dict[str, Any]:
    trace_id = state.get("trace_id", "default_trace")
    resume_text = state.get("resume_raw_text", "")

    async with tracer.span(trace_id, agent_name="ResumeAgent", input_preview=resume_text[:150]) as span:
        # Segment sections
        sections = DocumentParser.segment_sections(resume_text)

        # Index chunks in RAG for grounded citation lookups
        for sec_name, sec_content in sections.items():
            rag_engine.chunk_and_index(
                document_id=f"res_{trace_id}",
                text=sec_content,
                section_name=sec_name.capitalize(),
                page_number=1
            )

        # Structured parsing via LLM
        prompt = f"Parse the following candidate resume into structured JSON:\n\n{resume_text}"
        structured_data, metadata = await LLMFactory.generate_structured(prompt, ResumeStructuredData)

        span.complete(
            output=f"Extracted {len(structured_data.experience)} experiences, {len(structured_data.projects)} projects, {len(structured_data.technical_skills)} skills.",
            tokens=metadata,
            metadata={"sections_detected": list(sections.keys())}
        )

        return {
            "parsed_resume": structured_data.model_dump(),
            "status": "resume_parsed"
        }
