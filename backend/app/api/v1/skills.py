"""
Skills & Ontology API Router
Provides canonical skill taxonomy and interactive graph data.
"""
from typing import Dict, Any, List
from fastapi import APIRouter, Query
from app.services.skill_ontology import SkillOntologyService

router = APIRouter(prefix="/skills", tags=["Skills & Ontology"])


@router.get("/graph")
def get_skill_graph(role: str = Query("Staff AI Systems Engineer")):
    # Default candidate status map for visual highlights
    status_map = {
        "Python": "strong",
        "FastAPI": "strong",
        "RAG": "strong",
        "Docker": "strong",
        "PostgreSQL": "strong",
        "Vector Databases": "strong",
        "Embeddings": "strong",
        "LangGraph": "partial",
        "MCP": "partial",
        "Tool Calling": "partial",
        "Kubernetes": "missing",
        "Kafka": "missing",
        "PyTorch": "missing",
        "CI/CD": "strong",
        "Redis": "strong",
        "AsyncIO": "strong",
        "REST APIs": "strong",
        "AI Evaluation": "partial"
    }
    return SkillOntologyService.get_graph_data(candidate_status_map=status_map)


@router.get("/all")
def get_all_canonical_skills():
    return SkillOntologyService.get_all_skills()
