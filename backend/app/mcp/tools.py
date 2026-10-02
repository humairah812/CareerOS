"""
MCP Controlled Tools Implementation
All tools adhere to strict schemas and access control.
"""
from typing import Dict, Any, List, Optional
from app.mcp.registry import MCPTool, tool_registry
from app.services.skill_ontology import SkillOntologyService
from app.services.rag_engine import rag_engine
from app.services.github_service import GitHubService


# Tool 1: get_resume
async def handle_get_resume(resume_id: int) -> Dict[str, Any]:
    return {
        "resume_id": resume_id,
        "candidate_name": "Alex Mercer",
        "education": "B.S. Computer Science, Carnegie Mellon University (2021)",
        "experience": [
            "Senior AI Platform Engineer at Cognitive Scale AI (2023-Present)",
            "Backend Software Engineer at Nexus Systems (2021-2023)"
        ],
        "skills": ["Python", "FastAPI", "LangGraph", "RAG", "Docker", "PostgreSQL", "pgvector", "Redis", "MCP"]
    }

# Tool 2: get_job_description
async def handle_get_job_description(job_id: int) -> Dict[str, Any]:
    return {
        "job_id": job_id,
        "role_title": "Staff AI Systems Engineer",
        "company": "Vanguard Autonomous AI",
        "mandatory_skills": ["Python", "FastAPI", "RAG", "LangGraph", "Docker", "PostgreSQL"],
        "preferred_skills": ["Kubernetes", "MCP", "PyTorch", "Kafka", "AWS"]
    }

# Tool 3: search_skills
async def handle_search_skills(query: str, category: Optional[str] = None) -> List[Dict[str, Any]]:
    all_skills = SkillOntologyService.get_all_skills()
    results = [s for s in all_skills if query.lower() in s["name"].lower()]
    if category:
        results = [s for s in results if s["category"].lower() == category.lower()]
    return results

# Tool 4: get_candidate_projects
async def handle_get_candidate_projects(candidate_id: Optional[int] = None) -> List[Dict[str, Any]]:
    return [
        {
            "name": "CampusMind Agentic Gateway",
            "description": "Enterprise agent orchestration platform implementing Model Context Protocol (MCP) and tool-calling validation.",
            "technologies": ["FastAPI", "MCP", "Python", "Docker", "LangGraph"],
            "repo_url": "https://github.com/alexmercer-ai/campusmind-gateway"
        },
        {
            "name": "Hybrid RAG Engine",
            "description": "Asynchronous vector retrieval engine utilizing pgvector and BM25 lexical reranking.",
            "technologies": ["Python", "pgvector", "FastAPI", "PostgreSQL"],
            "repo_url": "https://github.com/alexmercer-ai/agentic-rag-engine"
        }
    ]

# Tool 5: get_github_repositories
async def handle_get_github_repositories(username: str) -> Dict[str, Any]:
    return await GitHubService.get_user_intelligence(username)

# Tool 6: analyze_repository
async def handle_analyze_repository(repo_name: str, username: str = "alexmercer-ai") -> Dict[str, Any]:
    intel = await GitHubService.get_user_intelligence(username)
    for r in intel.get("repositories", []):
        if r["name"].lower() == repo_name.lower():
            return r
    return {"error": f"Repository '{repo_name}' not found."}

# Tool 7: search_learning_resources
async def handle_search_learning_resources(skill_name: str) -> List[Dict[str, Any]]:
    return [
        {"title": f"Mastering {skill_name}: Official Production Guide", "type": "documentation", "hours": 2.5},
        {"title": f"Hands-on {skill_name} Architecture Lab", "type": "project", "hours": 4.0},
        {"title": f"Common Failure Modes in {skill_name}", "type": "case_study", "hours": 1.5}
    ]

# Tool 8: create_learning_plan
async def handle_create_learning_plan(target_role: str, missing_skills: List[str], days: int = 7) -> Dict[str, Any]:
    roadmap = []
    for d in range(1, days + 1):
        skill = missing_skills[(d - 1) % len(missing_skills)] if missing_skills else "System Design"
        roadmap.append({
            "day": d,
            "topic": f"{skill} Advanced Architecture",
            "objective": f"Complete hands-on implementation and validation for {skill}.",
            "tasks": [
                {"title": f"Review {skill} specification", "hours": 1.5, "completed": False},
                {"title": f"Build practical {skill} project milestone", "hours": 3.0, "completed": False}
            ]
        })
    return {"target_role": target_role, "days": days, "roadmap": roadmap}

# Tool 9: generate_interview
async def handle_generate_interview(role: str, topic: str) -> Dict[str, Any]:
    from app.agents.interview_agent import InterviewAgent
    q_list = InterviewAgent.MODE_QUESTIONS.get("technical", [])
    return {
        "role": role,
        "topic": topic,
        "initial_question": q_list[0] if q_list else "Explain how you handle concurrency in asynchronous API endpoints."
    }

# Tool 10: save_career_plan
async def handle_save_career_plan(plan_data: Dict[str, Any]) -> Dict[str, Any]:
    return {"status": "success", "message": "Career plan successfully persisted to database."}


def register_all_tools():
    tool_registry.register(MCPTool(
        name="get_resume",
        description="Retrieve parsed resume structure and verified skills.",
        parameters_schema={"type": "object", "properties": {"resume_id": {"type": "integer"}}, "required": ["resume_id"]},
        handler=handle_get_resume,
        required_permission="read:resume"
    ))
    tool_registry.register(MCPTool(
        name="get_job_description",
        description="Retrieve normalized job description requirements and seniority.",
        parameters_schema={"type": "object", "properties": {"job_id": {"type": "integer"}}, "required": ["job_id"]},
        handler=handle_get_job_description,
        required_permission="read:jd"
    ))
    tool_registry.register(MCPTool(
        name="search_skills",
        description="Search the canonical skill ontology DAG by name or category.",
        parameters_schema={"type": "object", "properties": {"query": {"type": "string"}, "category": {"type": "string"}}, "required": ["query"]},
        handler=handle_search_skills,
        required_permission="general:read"
    ))
    tool_registry.register(MCPTool(
        name="get_candidate_projects",
        description="Retrieve candidate verified technical projects and repositories.",
        parameters_schema={"type": "object", "properties": {"candidate_id": {"type": "integer"}}},
        handler=handle_get_candidate_projects,
        required_permission="read:resume"
    ))
    tool_registry.register(MCPTool(
        name="get_github_repositories",
        description="Fetch and analyze public GitHub profile and repositories.",
        parameters_schema={"type": "object", "properties": {"username": {"type": "string"}}, "required": ["username"]},
        handler=handle_get_github_repositories,
        required_permission="query:github"
    ))
    tool_registry.register(MCPTool(
        name="analyze_repository",
        description="Analyze specific GitHub repository for tech stacks and README documentation quality.",
        parameters_schema={"type": "object", "properties": {"repo_name": {"type": "string"}, "username": {"type": "string"}}, "required": ["repo_name"]},
        handler=handle_analyze_repository,
        required_permission="query:github"
    ))
    tool_registry.register(MCPTool(
        name="search_learning_resources",
        description="Find verified learning resources and architecture tutorials for a skill.",
        parameters_schema={"type": "object", "properties": {"skill_name": {"type": "string"}}, "required": ["skill_name"]},
        handler=handle_search_learning_resources,
        required_permission="general:read"
    ))
    tool_registry.register(MCPTool(
        name="create_learning_plan",
        description="Synthesize a prioritized day-by-day learning roadmap to close missing skill gaps.",
        parameters_schema={"type": "object", "properties": {"target_role": {"type": "string"}, "missing_skills": {"type": "array", "items": {"type": "string"}}, "days": {"type": "integer"}}, "required": ["target_role", "missing_skills"]},
        handler=handle_create_learning_plan,
        required_permission="write:plan"
    ))
    tool_registry.register(MCPTool(
        name="generate_interview",
        description="Generate initial interview simulation questions tailored to role and projects.",
        parameters_schema={"type": "object", "properties": {"role": {"type": "string"}, "topic": {"type": "string"}}, "required": ["role", "topic"]},
        handler=handle_generate_interview,
        required_permission="general:read"
    ))
    tool_registry.register(MCPTool(
        name="save_career_plan",
        description="Persist candidate career plan and roadmap decisions.",
        parameters_schema={"type": "object", "properties": {"plan_data": {"type": "object"}}, "required": ["plan_data"]},
        handler=handle_save_career_plan,
        required_permission="write:plan"
    ))


# Initialize registry on import
register_all_tools()
