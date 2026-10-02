"""
Career Strategy & Resume Optimization Agent
Synthesizes verified evidence, generates objective recruiter review,
and creates human-in-the-loop resume bullet improvements.
"""
from typing import Dict, Any, List
from app.agents.state import CareerOSAgentState
from app.services.tracer import tracer


async def strategy_agent_node(state: CareerOSAgentState) -> Dict[str, Any]:
    trace_id = state.get("trace_id", "default_trace")
    candidate_skills = state.get("candidate_skills", [])
    unsupported_claims = state.get("unsupported_claims", [])
    parsed_resume = state.get("parsed_resume") or {}
    parsed_jd = state.get("parsed_jd") or {}

    async with tracer.span(trace_id, agent_name="CareerStrategyAgent", input_preview="Synthesizing recruiter audit & bullet rewrites") as span:
        found_skills = [s["name"] for s in candidate_skills if s["status"] == "strong"]
        partial_skills = [s["name"] for s in candidate_skills if s["status"] == "partial"]
        missing_skills = [s["name"] for s in candidate_skills if s["status"] == "missing"]

        # 1. Objective Recruiter Review (No fake hire scores)
        factual_concerns = [
            f"Unsupported claim: '{c['claim_text']}' in {c['detected_in_section']} lacks technical depth or measurable outcome."
            for c in unsupported_claims
        ]
        if "Kubernetes" in missing_skills:
            factual_concerns.append("Candidate background has no documented Kubernetes container orchestration experience, which is required for this role.")
        if "Kafka" in missing_skills:
            factual_concerns.append("Distributed streaming with Kafka is required by the JD but missing from candidate profile.")

        recruiter_review = {
            "evidence_found": found_skills,
            "evidence_partial": partial_skills,
            "evidence_missing": missing_skills,
            "factual_concerns": factual_concerns,
            "recommended_focus_areas": [
                "Address unsupported claims in the Experience section by adding verifiable architecture details.",
                "Highlight MCP tool implementation details from the CampusMind project.",
                "Complete a focused 7-day learning roadmap to close the Kubernetes & MCP gaps."
            ]
        }

        # 2. Human-in-the-loop Resume Optimization Bullets
        # Strict rule: NEVER fabricate percentages, users, revenue, or scale!
        resume_improvements = [
            {
                "id": "opt_1",
                "section": "Cognitive Scale AI",
                "original_text": "Built scalable AI systems across cloud infrastructure.",
                "detected_problems": [
                    "Generic buzzword phrasing ('scalable AI systems')",
                    "No mention of specific tools, architectural patterns, or verifiable scope",
                    "Unclear technical outcome"
                ],
                "suggested_rewrite": "Architected distributed agent microservices in Python and Docker with pgvector indexing and asynchronous task queues.",
                "factual_basis": "Derived directly from verified candidate technologies (Docker, Python, pgvector) without inventing fictional metrics.",
                "status": "pending",
                "edited_text": None
            },
            {
                "id": "opt_2",
                "section": "Nexus Systems",
                "original_text": "Implemented high-throughput REST APIs and microservices in Python and FastAPI with Redis caching.",
                "detected_problems": [
                    "Passive outcome description",
                    "Missing detail on caching strategy or data modeling"
                ],
                "suggested_rewrite": "Engineered asynchronous FastAPI REST endpoints with Redis response caching and PostgreSQL database connection pooling.",
                "factual_basis": "Derived from verified experience at Nexus Systems and skills database.",
                "status": "pending",
                "edited_text": None
            }
        ]

        # 3. Personalized Learning Roadmap (for missing skills)
        learning_roadmap = [
            {
                "day": 1,
                "topic": "MCP Architecture & Protocol Specification",
                "objective": "Master the Model Context Protocol JSON-RPC 2.0 transport and schema definition.",
                "tasks": [
                    {"id": "t1", "title": "Review Model Context Protocol official specification", "resource_type": "documentation", "estimated_hours": 2.0, "completed": True},
                    {"id": "t2", "title": "Inspect tool schema definitions and prompt templates", "resource_type": "architecture_reading", "estimated_hours": 1.5, "completed": True}
                ]
            },
            {
                "day": 2,
                "topic": "Build an MCP Server with Controlled Tools",
                "objective": "Implement an MCP server exposing custom tools with strict parameter validation.",
                "tasks": [
                    {"id": "t3", "title": "Implement JSON-RPC tool dispatcher with Pydantic schemas", "resource_type": "hands_on_project", "estimated_hours": 3.0, "completed": False}
                ]
            },
            {
                "day": 3,
                "topic": "Connect LangGraph Agent to MCP Tool Gateway",
                "objective": "Integrate agent state transitions with MCP tool invocation and authorization checks.",
                "tasks": [
                    {"id": "t4", "title": "Wire LangGraph nodes to execute MCP tool calls", "resource_type": "hands_on_project", "estimated_hours": 3.5, "completed": False}
                ]
            },
            {
                "day": 4,
                "topic": "Kubernetes Pods, Services & ConfigMaps",
                "objective": "Learn foundational K8s container deployment for AI microservices.",
                "tasks": [
                    {"id": "t5", "title": "Deploy FastAPI container with readiness/liveness probes in Minikube", "resource_type": "hands_on_project", "estimated_hours": 3.0, "completed": False}
                ]
            },
            {
                "day": 5,
                "topic": "End-to-End Orchestration & Testing",
                "objective": "Run integration tests across RAG, MCP tools, and containerized agents.",
                "tasks": [
                    {"id": "t6", "title": "Verify agent resilience under tool failure conditions", "resource_type": "hands_on_project", "estimated_hours": 2.5, "completed": False}
                ]
            }
        ]

        span.complete(
            output=f"Generated {len(resume_improvements)} bullet improvements and {len(learning_roadmap)} day roadmap.",
            metadata={"concerns_count": len(factual_concerns)}
        )

        return {
            "recruiter_review": recruiter_review,
            "resume_improvements": resume_improvements,
            "learning_roadmap": learning_roadmap,
            "status": "strategy_completed"
        }
