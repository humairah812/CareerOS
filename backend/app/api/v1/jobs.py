"""
Job Descriptions API Router
Handles JD ingestion, normalization, and structured requirement extraction.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.job import JobDescription
from app.models.user import User
from app.schemas.job import JobCreate, JobResponse, JobStructuredData
from app.services.llm_factory import LLMFactory

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/", response_model=JobResponse)
async def create_job(job_in: JobCreate, db: Session = Depends(get_db)):
    prompt = f"Analyze the following job description and extract requirements into structured JSON:\n\n{job_in.raw_text}"
    structured_jd, _ = await LLMFactory.generate_structured(prompt, JobStructuredData)

    user = db.query(User).first()
    user_id = user.id if user else 1

    db_job = JobDescription(
        user_id=user_id,
        title=job_in.title or structured_jd.role_title,
        company=job_in.company or structured_jd.company,
        seniority=structured_jd.seniority,
        raw_text=job_in.raw_text,
        parsed_json=structured_jd.model_dump()
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    return JobResponse(
        id=db_job.id,
        title=db_job.title,
        company=db_job.company,
        seniority=db_job.seniority,
        structured_data=structured_jd
    )


@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(JobDescription).filter(JobDescription.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job description not found.")
    return JobResponse(
        id=job.id,
        title=job.title,
        company=job.company,
        seniority=job.seniority,
        structured_data=JobStructuredData.model_validate(job.parsed_json)
    )


@router.get("/")
def list_jobs(db: Session = Depends(get_db)):
    jobs = db.query(JobDescription).order_by(JobDescription.created_at.desc()).all()
    return [
        {
            "id": j.id,
            "title": j.title,
            "company": j.company,
            "seniority": j.seniority,
            "created_at": j.created_at
        }
        for j in jobs
    ]
