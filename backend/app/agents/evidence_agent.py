"""
Evidence Agent
Grounded Evidence Engine. Cites exact resume sections/projects and public GitHub repos.
Detects ungrounded buzzwords and classifies them as Unsupported Claims.
"""
from typing import Dict, Any, List
from app.agents.state import CareerOSAgentState
from app.services.rag_engine import rag_engine
from app.services.github_service import GitHubService
from app.services.tracer import tracer


async def evidence_agent_node(state: CareerOSAgentState) -> Dict[str, Any]:
    trace_id = state.get("trace_id", "default_trace")
    candidate_skills = state.get("candidate_skills", [])
    parsed_resume = state.get("parsed_resume") or {}
    github_user = state.get("github_username") or "alexmercer-ai"

    async with tracer.span(trace_id, agent_name="EvidenceAgent", input_preview="Extracting citations and unverified claims") as span:
        # Fetch GitHub intelligence
        gh_intel = await GitHubService.get_user_intelligence(github_user)
        repos = gh_intel.get("repositories", [])

        evidence_items: List[Dict[str, Any]] = []
        unsupported_claims: List[Dict[str, Any]] = []

        # 1. Evaluate candidate skills
        for skill in candidate_skills:
            skill_name = skill["name"]
            if skill["status"] == "missing":
                continue

            # Query RAG for citations
            citations = rag_engine.hybrid_search(skill_name, top_k=2)
            gh_check = GitHubService.cross_verify_claim(skill_name, repos)

            quote = citations[0]["text"] if citations else f"Candidate mentions {skill_name} in skills summary."
            section = citations[0]["metadata"].get("section", "Resume") if citations else "Skills"

            evidence_items.append({
                "id": len(evidence_items) + 1,
                "skill_name": skill_name,
                "source_type": "resume",
                "source_section": section,
                "page_number": 1,
                "quote": quote[:250],
                "confidence": 0.95 if citations else 0.65,
                "is_unsupported": False,
                "verification_notes": gh_check["status_text"]
            })

        # 2. Check for vague/unsupported claims in experience bullets
        for exp in parsed_resume.get("experience", []):
            for bullet in exp.get("bullets", []):
                grounding_check = rag_engine.verify_claim_groundedness(bullet, rag_engine.hybrid_search(bullet, top_k=1))
                if not grounding_check["grounded"]:
                    unsupported_claims.append({
                        "claim_text": bullet,
                        "detected_in_section": f"Experience: {exp.get('company', 'Unknown')}",
                        "reason": grounding_check["reason"],
                        "severity": "high"
                    })

        span.complete(
            output=f"Extracted {len(evidence_items)} verified evidence items. Flagged {len(unsupported_claims)} unsupported claims.",
            metadata={"unsupported_count": len(unsupported_claims)}
        )

        return {
            "evidence_items": evidence_items,
            "unsupported_claims": unsupported_claims,
            "github_intelligence": gh_intel,
            "status": "evidence_verified"
        }
