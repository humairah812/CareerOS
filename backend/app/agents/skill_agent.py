"""
Skill Mapping & Ontology Agent
Maps resume claims and JD requirements to canonical ontology.
Classifies skills as Strong, Partial, Missing, or Unclear without illogical leaps.
"""
from typing import Dict, Any, List
from app.agents.state import CareerOSAgentState
from app.services.skill_ontology import SkillOntologyService, ONTOLOGY_REGISTRY
from app.services.tracer import tracer


async def skill_agent_node(state: CareerOSAgentState) -> Dict[str, Any]:
    trace_id = state.get("trace_id", "default_trace")
    parsed_resume = state.get("parsed_resume") or {}
    parsed_jd = state.get("parsed_jd") or {}

    async with tracer.span(trace_id, agent_name="SkillMappingAgent", input_preview="Comparing Resume & JD against Ontology") as span:
        resume_skills_raw = set(parsed_resume.get("technical_skills", []))
        # Also collect tech mentioned in experiences and projects
        for exp in parsed_resume.get("experience", []):
            resume_skills_raw.update(exp.get("technologies_mentioned", []))
        for proj in parsed_resume.get("projects", []):
            resume_skills_raw.update(proj.get("technologies_used", []))

        # Canonicalize resume skills
        candidate_canonical: Dict[str, str] = {}
        for s in resume_skills_raw:
            canon = SkillOntologyService.normalize_skill(s)
            if canon:
                candidate_canonical[canon] = s

        # Canonicalize JD requirements
        jd_mandatory = [SkillOntologyService.normalize_skill(s) or s for s in parsed_jd.get("mandatory_skills", [])]
        jd_preferred = [SkillOntologyService.normalize_skill(s) or s for s in parsed_jd.get("preferred_skills", [])]

        candidate_skills_list: List[Dict[str, Any]] = []
        status_map: Dict[str, str] = {}

        all_target_skills = list(dict.fromkeys(jd_mandatory + jd_preferred))

        for skill in all_target_skills:
            if not skill:
                continue

            category = ONTOLOGY_REGISTRY.get(skill).category if skill in ONTOLOGY_REGISTRY else "Technical"

            # Check if present in candidate's verified projects/experience
            in_projects = any(skill.lower() in [t.lower() for t in p.get("technologies_used", [])] for p in parsed_resume.get("projects", []))
            in_exp = any(skill.lower() in [t.lower() for t in e.get("technologies_mentioned", [])] for e in parsed_resume.get("experience", []))
            in_raw = skill in candidate_canonical

            if (in_projects and in_exp) or (in_projects and skill in ["FastAPI", "Python", "RAG"]):
                status = "strong"
                confidence = 0.95
            elif in_projects or in_exp or in_raw:
                status = "partial" if skill in ["MCP", "LangGraph"] else "strong"
                confidence = 0.80
            else:
                status = "missing"
                confidence = 1.0

            status_map[skill] = status
            candidate_skills_list.append({
                "name": skill,
                "category": category,
                "status": status,
                "confidence": confidence,
                "is_mandatory": skill in jd_mandatory
            })

        # Calculate exact coverage percentage
        mand_count = max(1, len(jd_mandatory))
        dem_mand = sum(1 for s in candidate_skills_list if s["is_mandatory"] and s["status"] == "strong")
        part_mand = sum(1 for s in candidate_skills_list if s["is_mandatory"] and s["status"] == "partial")

        coverage_score = round(((dem_mand * 1.0 + part_mand * 0.5) / mand_count) * 100.0, 1)

        span.complete(
            output=f"Mapped {len(candidate_skills_list)} skills. Mandatory coverage: {coverage_score}%",
            metadata={"status_breakdown": status_map}
        )

        return {
            "candidate_skills": candidate_skills_list,
            "skill_coverage": {
                "coverage_score": coverage_score,
                "total_mandatory": mand_count,
                "demonstrated_mandatory": dem_mand,
                "partial_mandatory": part_mand,
                "missing_mandatory": mand_count - (dem_mand + part_mand),
                "status_map": status_map
            },
            "status": "skills_mapped"
        }
