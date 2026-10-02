"""
Learning Roadmap Schemas
"""
from typing import List, Optional
from pydantic import BaseModel, Field


class LearningTask(BaseModel):
    id: str
    title: str
    description: str
    resource_type: str  # "hands_on_project", "documentation", "architecture_reading"
    estimated_hours: float
    completed: bool = False


class LearningDay(BaseModel):
    day: int
    topic: str
    objective: str
    tasks: List[LearningTask] = Field(default_factory=list)


class LearningPlanCreateRequest(BaseModel):
    target_role: str
    missing_skills: List[str]
    days_available: int = 7


class LearningPlanResponse(BaseModel):
    id: int
    target_role: str
    total_days: int
    roadmap: List[LearningDay]
    created_at: str
