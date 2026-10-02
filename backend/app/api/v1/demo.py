"""
Demo Seed API Router
Provides 1-click turnkey demo dataset so the platform can be evaluated immediately.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.job import JobDescription
from app.api.v1.analysis import trigger_analysis, AnalysisRunRequest

router = APIRouter(prefix="/demo", tags=["Demo Mode"])


@router.post("/seed")
async def seed_demo_data(db: Session = Depends(get_db)):
    """Seed sample resume, JD, and run multi-agent analysis."""
    # 1. Ensure user
    user = db.query(User).filter(User.email == "alex.mercer@example.com").first()
    if not user:
        from app.core.security import hash_password
        user = User(
            email="alex.mercer@example.com",
            hashed_password=hash_password("DemoPassword123!"),
            full_name="Alex Mercer"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # 2. Seed Resume
    resume_text = (
        "Alex Mercer\nEmail: alex.mercer@example.com | GitHub: github.com/alexmercer-ai\n"
        "Education: B.S. in Computer Science, Carnegie Mellon University (2021), GPA: 3.85\n\n"
        "Professional Experience:\n"
        "Senior AI Platform Engineer | Cognitive Scale AI (2023 - Present)\n"
        "- Architected asynchronous RAG retrieval pipeline using FastAPI, pgvector, and hybrid BM25 search serving 450k daily queries.\n"
        "- Built multi-agent orchestration service using LangGraph and MCP tools to automate code review workflows.\n"
        "- Built scalable AI systems across cloud infrastructure.\n\n"
        "Backend Software Engineer | Nexus Systems (2021 - 2023)\n"
        "- Implemented high-throughput REST APIs and microservices in Python and FastAPI with Redis caching.\n"
        "- Managed relational database schemas and automated Alembic migrations on PostgreSQL.\n\n"
        "Projects:\n"
        "CampusMind Agentic Gateway\n"
        "- Enterprise agent orchestration platform implementing Model Context Protocol (MCP) and tool-calling validation.\n\n"
        "Technical Skills:\n"
        "Python, FastAPI, LangGraph, RAG, Docker, PostgreSQL, pgvector, Redis, REST APIs, MCP\n"
    )

    resume = db.query(Resume).filter(Resume.user_id == user.id).first()
    if not resume:
        resume = Resume(
            user_id=user.id,
            filename="Alex_Mercer_AI_Engineer_2026.pdf",
            file_size_bytes=104520,
            raw_text=resume_text,
            sections_json={"experience": "...", "education": "...", "skills": "...", "projects": "..."},
            structured_json={"candidate_name": "Alex Mercer", "email": "alex.mercer@example.com"}
        )
        db.add(resume)
        db.commit()
        db.refresh(resume)

    # 3. Seed Job Description
    jd_text = (
        "Staff AI Systems Engineer\nCompany: Vanguard Autonomous AI\nSeniority: Staff / Lead\n\n"
        "We are looking for a Staff AI Systems Engineer to design, build, and deploy production multi-agent architectures.\n\n"
        "Mandatory Requirements:\n"
        "- Deep production experience with Python, FastAPI, and asynchronous backend services.\n"
        "- Hands-on expertise building Agentic workflows with LangGraph or equivalent frameworks.\n"
        "- Experience designing RAG retrieval pipelines using pgvector, dense embeddings, and hybrid search.\n"
        "- Containerization and deployment with Docker and PostgreSQL.\n\n"
        "Preferred Requirements:\n"
        "- Kubernetes container orchestration and Helm charts.\n"
        "- Model Context Protocol (MCP) tool integration.\n"
        "- Experience with Kafka event streaming and PyTorch model fine-tuning."
    )

    job = db.query(JobDescription).filter(JobDescription.user_id == user.id).first()
    if not job:
        job = JobDescription(
            user_id=user.id,
            title="Staff AI Systems Engineer",
            company="Vanguard Autonomous AI",
            seniority="Staff / Lead",
            raw_text=jd_text,
            parsed_json={"role_title": "Staff AI Systems Engineer", "company": "Vanguard Autonomous AI"}
        )
        db.add(job)
        db.commit()
        db.refresh(job)

    # 4. Trigger LangGraph analysis pipeline
    analysis = await trigger_analysis(AnalysisRunRequest(resume_id=resume.id, job_id=job.id, github_username="alexmercer-ai"), db)

    return {
        "status": "seeded",
        "user_id": user.id,
        "resume_id": resume.id,
        "job_id": job.id,
        "analysis_id": analysis.analysis_id
    }
