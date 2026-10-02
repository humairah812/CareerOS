"""
CareerOS Multi-Agent Orchestrator
Builds and executes the LangGraph state machine coordinating all specialized agents.
"""
from typing import Dict, Any, Optional
from langgraph.graph import StateGraph, START, END
from app.agents.state import CareerOSAgentState
from app.agents.resume_agent import resume_agent_node
from app.agents.jd_agent import jd_agent_node
from app.agents.skill_agent import skill_agent_node
from app.agents.evidence_agent import evidence_agent_node
from app.agents.strategy_agent import strategy_agent_node
from app.services.tracer import tracer


def build_career_graph():
    """Build the compiled LangGraph state workflow."""
    workflow = StateGraph(CareerOSAgentState)

    # Register agent nodes
    workflow.add_node("resume_node", resume_agent_node)
    workflow.add_node("jd_node", jd_agent_node)
    workflow.add_node("skill_node", skill_agent_node)
    workflow.add_node("evidence_node", evidence_agent_node)
    workflow.add_node("strategy_node", strategy_agent_node)

    # Define deterministic DAG execution flow
    workflow.add_edge(START, "resume_node")
    workflow.add_edge("resume_node", "jd_node")
    workflow.add_edge("jd_node", "skill_node")
    workflow.add_edge("skill_node", "evidence_node")
    workflow.add_edge("evidence_node", "strategy_node")
    workflow.add_edge("strategy_node", END)

    return workflow.compile()


# Compiled singleton graph
career_graph = build_career_graph()


async def run_career_intelligence_pipeline(
    resume_text: str,
    jd_text: str,
    github_username: Optional[str] = None,
    trace_id: Optional[str] = None
) -> CareerOSAgentState:
    """
    Execute the end-to-end multi-agent workflow with state tracking and tracing.
    """
    tid = trace_id or tracer.new_trace_id()

    initial_state: CareerOSAgentState = {
        "trace_id": tid,
        "resume_raw_text": resume_text,
        "jd_raw_text": jd_text,
        "github_username": github_username,
        "parsed_resume": None,
        "parsed_jd": None,
        "candidate_skills": [],
        "evidence_items": [],
        "unsupported_claims": [],
        "github_intelligence": None,
        "skill_coverage": {},
        "recruiter_review": {},
        "resume_improvements": [],
        "learning_roadmap": [],
        "status": "queued",
        "errors": []
    }

    try:
        final_state = await career_graph.ainvoke(initial_state)
        return final_state
    except Exception as e:
        initial_state["status"] = "error"
        initial_state["errors"].append(str(e))
        return initial_state
