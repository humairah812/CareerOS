"""
CareerOS Main Application Entrypoint
Production FastAPI server with centralized error handling, CORS, and modular routers.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.core.config import settings
from app.core.database import init_db
from app.api.v1 import (
    auth,
    resumes,
    jobs,
    analysis,
    skills,
    evidence,
    optimizer,
    interviews,
    learning,
    github,
    traces,
    evaluation,
    mcp_api,
    demo
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("careeros")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables
    logger.info("Initializing CareerOS database schemas...")
    init_db()
    logger.info("CareerOS backend initialized successfully.")
    yield
    # Shutdown
    logger.info("CareerOS backend shutting down.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="CareerOS: Production-Grade Agentic AI Career Intelligence & Interview Platform",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handler (Never expose raw stack traces to normal users)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred while processing your request.",
            "path": request.url.path
        }
    )


# Mount API v1 Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(resumes.router, prefix=settings.API_V1_STR)
app.include_router(jobs.router, prefix=settings.API_V1_STR)
app.include_router(analysis.router, prefix=settings.API_V1_STR)
app.include_router(skills.router, prefix=settings.API_V1_STR)
app.include_router(evidence.router, prefix=settings.API_V1_STR)
app.include_router(optimizer.router, prefix=settings.API_V1_STR)
app.include_router(interviews.router, prefix=settings.API_V1_STR)
app.include_router(learning.router, prefix=settings.API_V1_STR)
app.include_router(github.router, prefix=settings.API_V1_STR)
app.include_router(traces.router, prefix=settings.API_V1_STR)
app.include_router(evaluation.router, prefix=settings.API_V1_STR)
app.include_router(mcp_api.router, prefix=settings.API_V1_STR)
app.include_router(demo.router, prefix=settings.API_V1_STR)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }


@app.get("/")
def root():
    return {
        "name": "CareerOS API Gateway",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "mcp_endpoint": f"{settings.API_V1_STR}/mcp"
    }
