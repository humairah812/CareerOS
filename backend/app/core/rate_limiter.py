"""
CareerOS Rate Limiter
Prevents API flooding and brute-force attacks using sliding-window / token count per IP or user.
"""
from fastapi import Request, HTTPException, status
from app.core.config import settings
from app.core.redis import cache


async def check_rate_limit(request: Request, limit: int = settings.RATE_LIMIT_PER_MINUTE) -> None:
    """FastAPI dependency to enforce rate limits per client IP."""
    client_ip = request.client.host if request.client else "unknown"
    path = request.url.path
    key = f"rl:{client_ip}:{path}"

    count = cache.incr(key, ttl_seconds=60)
    if count > limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "error": "Rate limit exceeded",
                "message": f"Maximum of {limit} requests per minute allowed. Please wait before retrying.",
                "retry_after_seconds": 60
            }
        )
