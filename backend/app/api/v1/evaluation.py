"""
AI Evaluation API Router
Runs live benchmarks on the golden dataset and returns mathematically calculated metrics.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.evaluation.runner import BenchmarkRunner

router = APIRouter(prefix="/evaluation", tags=["AI Evaluation"])

LATEST_EVAL_CACHE = {}


@router.post("/run")
async def run_evaluation(db: Session = Depends(get_db)):
    result = await BenchmarkRunner.run_benchmark(db)
    global LATEST_EVAL_CACHE
    LATEST_EVAL_CACHE = result
    return result


@router.get("/latest")
async def get_latest_evaluation(db: Session = Depends(get_db)):
    global LATEST_EVAL_CACHE
    if not LATEST_EVAL_CACHE:
        LATEST_EVAL_CACHE = await BenchmarkRunner.run_benchmark(db)
    return LATEST_EVAL_CACHE
