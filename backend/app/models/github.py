"""
GitHub Model
Stores public repository metadata, detected languages/frameworks, README quality,
and cross-verification checks.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class GitHubProfile(Base):
    __tablename__ = "github_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    username = Column(String(100), nullable=False, index=True)
    avatar_url = Column(String(255), nullable=True)
    public_repos_count = Column(Integer, default=0)
    top_languages = Column(JSON, default=list)  # [{"language": "Python", "bytes": 120000}, ...]
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="github_profiles")
    repositories = relationship("GitHubRepository", back_populates="profile", cascade="all, delete-orphan")


class GitHubRepository(Base):
    __tablename__ = "github_repositories"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("github_profiles.id"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    html_url = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    primary_language = Column(String(100), nullable=True)
    detected_frameworks = Column(JSON, default=list)  # ["FastAPI", "Docker", "PyTorch"]
    stars_count = Column(Integer, default=0)
    forks_count = Column(Integer, default=0)
    readme_quality_score = Column(Float, default=0.0)  # 0.0 - 100.0 based on architecture docs, setup instructions
    has_tests = Column(String(50), default="unknown")
    verification_notes = Column(Text, nullable=True)

    profile = relationship("GitHubProfile", back_populates="repositories")
