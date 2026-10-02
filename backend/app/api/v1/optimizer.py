"""
Resume Optimizer API Router
Enables human-in-the-loop review of suggested bullet improvements.
"""
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.schemas.analysis import ResumeOptimizationBullet

router = APIRouter(prefix="/optimizer", tags=["Resume Optimizer"])

# In-memory store for bullet state management
OPTIMIZER_STORE: Dict[str, Dict[str, Any]] = {
    "opt_1": {
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
    "opt_2": {
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
}


class BulletActionRequest(BaseModel):
    bullet_id: str
    action: str  # "accept", "reject", "edit"
    edited_text: Optional[str] = None


@router.get("/bullets", response_model=List[ResumeOptimizationBullet])
def get_bullets():
    return [ResumeOptimizationBullet(**b) for b in OPTIMIZER_STORE.values()]


@router.post("/action", response_model=ResumeOptimizationBullet)
def update_bullet_action(req: BulletActionRequest):
    if req.bullet_id not in OPTIMIZER_STORE:
        raise HTTPException(status_code=404, detail="Bullet ID not found.")

    bullet = OPTIMIZER_STORE[req.bullet_id]
    if req.action == "accept":
        bullet["status"] = "accepted"
    elif req.action == "reject":
        bullet["status"] = "rejected"
    elif req.action == "edit":
        bullet["status"] = "edited"
        bullet["edited_text"] = req.edited_text or bullet["suggested_rewrite"]

    return ResumeOptimizationBullet(**bullet)
