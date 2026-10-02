"""
Learning Roadmap API Router
Provides structured learning plans to close verified skill gaps.
"""
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/learning", tags=["Learning Roadmap"])

ROADMAP_STORE: List[Dict[str, Any]] = [
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


class TaskToggleRequest(BaseModel):
    task_id: str
    completed: bool


@router.get("/plan")
def get_learning_plan():
    return {
        "target_role": "Staff AI Systems Engineer",
        "total_days": len(ROADMAP_STORE),
        "roadmap": ROADMAP_STORE
    }


@router.post("/task/toggle")
def toggle_task(req: TaskToggleRequest):
    for day in ROADMAP_STORE:
        for t in day["tasks"]:
            if t["id"] == req.task_id:
                t["completed"] = req.completed
                return {"status": "success", "task_id": req.task_id, "completed": req.completed}
    raise HTTPException(status_code=404, detail="Task ID not found.")
