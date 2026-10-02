"""
Interview Lab Schemas
"""
from typing import List, Optional, Dict
from pydantic import BaseModel, Field


class InterviewStartRequest(BaseModel):
    role_title: str
    mode: str = "technical"  # technical, project, aiml, behavioral, system_design
    resume_id: Optional[int] = None
    job_id: Optional[int] = None


class RubricBreakdown(BaseModel):
    correctness: float  # 0 - 100
    relevance: float    # 0 - 100
    completeness: float # 0 - 100
    clarity: float      # 0 - 100


class InterviewAnswerRequest(BaseModel):
    session_id: int
    turn_number: int
    answer_text: str
    is_voice: bool = False


class InterviewTurnResponse(BaseModel):
    session_id: int
    turn_number: int
    current_question: str
    question_topic: Optional[str] = None
    evaluation: Optional[Dict] = None  # Rubric scores, feedback, missing concepts, suggested model answer
    next_question: Optional[str] = None
    is_finished: bool = False
