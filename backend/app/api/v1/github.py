"""
GitHub Intelligence API Router
Analyzes public repositories and cross-verifies resume claims.
"""
from fastapi import APIRouter, Query
from app.services.github_service import GitHubService

router = APIRouter(prefix="/github", tags=["GitHub Intelligence"])


@router.get("/profile")
async def get_github_profile(username: str = Query("alexmercer-ai")):
    intel = await GitHubService.get_user_intelligence(username)
    return intel
