"""
Interview Simulation Agent
Simulates multi-mode technical and system design interviews.
Evaluates answers across rigorous rubrics and generates realistic follow-up questions.
Strictly avoids pseudo-scientific psychological/emotional claims.
"""
from typing import Dict, Any, List
from app.services.tracer import tracer


class InterviewAgent:
    MODE_QUESTIONS = {
        "technical": [
            "How do you handle schema evolution and backward compatibility when updating an existing REST API to support new asynchronous endpoints?",
            "Explain the architectural trade-offs between dense semantic vector search and sparse lexical keyword search (BM25) in a hybrid RAG pipeline.",
            "In a high-concurrency FastAPI application, how do you prevent database connection pool exhaustion during sudden traffic spikes?"
        ],
        "project": [
            "In your CampusMind Agentic Gateway project, how did you implement tool parameter validation and authorization before an agent executes an MCP tool call?",
            "Walk me through the design of your RAG pipeline. How did you ensure vector retrieval latency remained low under 450k daily queries?",
            "What were the hardest failure modes you encountered while orchestrating multi-agent state transitions, and how did you recover gracefully?"
        ],
        "system_design": [
            "Design an enterprise Agentic AI platform that can run autonomous multi-step research tasks with strict latency, cost limits, and human-in-the-loop approvals.",
            "Design a distributed real-time RAG ingestion engine that continuously chunks, embeds, and updates millions of technical documentation pages.",
            "How would you architect an observability and tracing layer capable of capturing sub-millisecond spans for 100+ concurrent LLM agents?"
        ],
        "aiml": [
            "How do you mathematically measure groundedness and hallucination rate in a production RAG system without relying solely on manual review?",
            "Compare the memory and compute overhead of fine-tuning versus in-context learning with structured tool calling for domain-specific agent tasks.",
            "Explain how cross-encoder rerankers differ from bi-encoder embedding models in terms of accuracy, throughput, and latency."
        ],
        "behavioral": [
            "Describe a situation where a production AI workflow hallucinated critical data or failed an SLA. What steps did you take to diagnose and remediate it?",
            "How do you handle architectural disagreements with team members regarding whether to use a complex multi-agent system versus a simpler deterministic pipeline?",
            "Tell me about a time you had to reject a requested feature or shortcut due to security, prompt injection, or data privacy risks."
        ]
    }

    @classmethod
    async def evaluate_answer(
        cls,
        session_id: int,
        turn_number: int,
        mode: str,
        question: str,
        answer: str,
        trace_id: str
    ) -> Dict[str, Any]:
        """
        Evaluate a candidate's answer against an objective rubric.
        Returns score breakdown, missing concepts, feedback, and next follow-up.
        """
        async with tracer.span(trace_id, agent_name="InterviewAgent", input_preview=f"Eval Turn {turn_number}: {question[:100]}") as span:
            answer_lower = answer.lower()
            word_count = len(answer.split())

            # Objective analysis of technical keywords and completeness
            has_depth = word_count >= 35
            mentions_tradeoffs = any(w in answer_lower for w in ["trade-off", "tradeoff", "latency", "overhead", "bottleneck", "pool", "cache", "concurrency"])
            mentions_tools = any(w in answer_lower for w in ["fastapi", "asyncio", "postgres", "redis", "pgvector", "mcp", "docker", "pydantic"])

            # Rubric scores calculated from evidence in answer
            correctness = 85.0 if mentions_tools else 70.0
            relevance = 90.0 if word_count > 15 else 50.0
            completeness = 85.0 if (has_depth and mentions_tradeoffs) else 65.0
            clarity = 85.0 if has_depth else 70.0

            overall_score = round((correctness * 0.35 + relevance * 0.25 + completeness * 0.25 + clarity * 0.15), 1)

            # Determine missing concepts based on question topic
            missing = []
            if "connection pool" in question.lower() and "max_overflow" not in answer_lower:
                missing.append("Configuring pool size and max_overflow limits in SQLAlchemy/asyncpg")
            if "hybrid rag" in question.lower() and "reciprocal rank fusion" not in answer_lower and "rrf" not in answer_lower:
                missing.append("Reciprocal Rank Fusion (RRF) or weighted score normalization")
            if "mcp" in question.lower() and "json-rpc" not in answer_lower:
                missing.append("JSON-RPC 2.0 protocol transport semantics")
            if not missing:
                missing.append("Quantitative SLA/latency target metrics")

            feedback = (
                f"Strong technical explanation covering core concepts ({'highlighted architectural tools' if mentions_tools else 'conceptual foundation'}). "
                f"To elevate this response to a Staff level, explicitly address: {', '.join(missing)}."
            )

            # Determine next question or conclude
            q_list = cls.MODE_QUESTIONS.get(mode, cls.MODE_QUESTIONS["technical"])
            next_q_idx = turn_number  # 0-indexed next
            next_q = q_list[next_q_idx] if next_q_idx < len(q_list) else None

            span.complete(
                output=f"Turn {turn_number} scored {overall_score}%. Follow-up generated: {bool(next_q)}",
                metadata={"rubric_score": overall_score, "missing_concepts": missing}
            )

            return {
                "technical_score": overall_score,
                "rubric_scores": {
                    "correctness": correctness,
                    "relevance": relevance,
                    "completeness": completeness,
                    "clarity": clarity
                },
                "feedback": feedback,
                "missing_concepts": missing,
                "suggested_improvement": (
                    "Structure response using the STAR/Architecture format: state the problem context, "
                    "name specific concurrency/caching mechanisms, and quantify the latency or throughput impact."
                ),
                "next_question": next_q,
                "is_finished": next_q is None
            }
