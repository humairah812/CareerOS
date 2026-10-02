"""
Interview Lab API Router
Supports simulated technical, project, AI/ML, behavioral, and system design interviews with voice mode.
"""
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.interview import InterviewSession, InterviewTurn
from app.models.user import User
from app.schemas.interview import InterviewStartRequest, InterviewAnswerRequest, InterviewTurnResponse
from app.agents.interview_agent import InterviewAgent
from app.services.tracer import tracer

router = APIRouter(prefix="/interviews", tags=["Interview Lab"])

# In-memory session tracker for interactive state
ACTIVE_SESSIONS: Dict[int, Dict[str, Any]] = {}
SESSION_COUNTER = 1


@router.post("/start", response_model=InterviewTurnResponse)
async def start_interview(req: InterviewStartRequest, db: Session = Depends(get_db)):
    global SESSION_COUNTER
    session_id = SESSION_COUNTER
    SESSION_COUNTER += 1

    questions = InterviewAgent.MODE_QUESTIONS.get(req.mode, InterviewAgent.MODE_QUESTIONS["technical"])
    first_q = questions[0]

    ACTIVE_SESSIONS[session_id] = {
        "id": session_id,
        "role_title": req.role_title,
        "mode": req.mode,
        "turn_number": 1,
        "history": [],
        "trace_id": tracer.new_trace_id()
    }

    return InterviewTurnResponse(
        session_id=session_id,
        turn_number=1,
        current_question=first_q,
        question_topic=req.mode.capitalize(),
        evaluation=None,
        next_question=None,
        is_finished=False
    )


@router.post("/answer", response_model=InterviewTurnResponse)
async def submit_answer(req: InterviewAnswerRequest, db: Session = Depends(get_db)):
    session = ACTIVE_SESSIONS.get(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    questions = InterviewAgent.MODE_QUESTIONS.get(session["mode"], InterviewAgent.MODE_QUESTIONS["technical"])
    current_q_idx = req.turn_number - 1
    current_q = questions[current_q_idx] if current_q_idx < len(questions) else questions[-1]

    # Evaluate answer using InterviewAgent
    eval_result = await InterviewAgent.evaluate_answer(
        session_id=session["id"],
        turn_number=req.turn_number,
        mode=session["mode"],
        question=current_q,
        answer=req.answer_text,
        trace_id=session["trace_id"]
    )

    session["turn_number"] += 1
    session["history"].append({
        "turn": req.turn_number,
        "question": current_q,
        "answer": req.answer_text,
        "evaluation": eval_result
    })

    return InterviewTurnResponse(
        session_id=session["id"],
        turn_number=req.turn_number,
        current_question=current_q,
        question_topic=session["mode"].capitalize(),
        evaluation=eval_result,
        next_question=eval_result.get("next_question"),
        is_finished=eval_result.get("is_finished", False)
    )
