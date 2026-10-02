"""
Resumes API Router
Handles PDF and text resume uploads, section segmentation, and structured parsing.
"""
from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import validate_file_upload
from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import ResumeUploadResponse, ResumeStructuredData
from app.services.document_parser import DocumentParser
from app.services.llm_factory import LLMFactory

router = APIRouter(prefix="/resumes", tags=["Resumes"])


@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    contents = await file.read()
    val = validate_file_upload(file.filename, contents)
    if not val["valid"]:
        raise HTTPException(status_code=400, detail=val["error"])

    # Extract text
    if val["extension"] == ".pdf":
        raw_text, pages = DocumentParser.extract_text_from_pdf(contents)
    else:
        raw_text = contents.decode("utf-8", errors="replace")

    # Segment sections
    sections = DocumentParser.segment_sections(raw_text)

    # Structured parsing
    prompt = f"Parse the following candidate resume into structured JSON:\n\n{raw_text}"
    structured_data, _ = await LLMFactory.generate_structured(prompt, ResumeStructuredData)

    # Ensure user exists for association
    user = db.query(User).first()
    user_id = user.id if user else 1

    db_resume = Resume(
        user_id=user_id,
        filename=file.filename,
        file_size_bytes=len(contents),
        raw_text=raw_text,
        sections_json=sections,
        structured_json=structured_data.model_dump()
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)

    return ResumeUploadResponse(
        resume_id=db_resume.id,
        filename=db_resume.filename,
        file_size_bytes=db_resume.file_size_bytes,
        extracted_sections=list(sections.keys()),
        structured_data=structured_data
    )


@router.get("/{resume_id}")
def get_resume(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")
    return {
        "id": resume.id,
        "filename": resume.filename,
        "raw_text": resume.raw_text,
        "sections": resume.sections_json,
        "structured_data": resume.structured_json,
        "created_at": resume.created_at
    }


@router.get("/")
def list_resumes(db: Session = Depends(get_db)):
    resumes = db.query(Resume).order_by(Resume.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "filename": r.filename,
            "file_size_bytes": r.file_size_bytes,
            "created_at": r.created_at
        }
        for r in resumes
    ]
