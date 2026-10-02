"""
CareerOS Security & Authentication Module
Handles JWT generation/verification, password hashing, file upload validation,
and prompt injection detection & defense.
"""
import re
import hmac
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Union, Dict, List
from jose import jwt, JWTError
from app.core.config import settings


# --- Password Hashing (using HMAC-SHA256 with salt for guaranteed cross-platform reliability on Python 3.12) ---

def hash_password(password: str) -> str:
    """Hash a password using PBKDF2-HMAC-SHA256 with a secure random salt."""
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        iterations=100_000
    ).hex()
    return f"{salt}${pwd_hash}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against the stored PBKDF2 hash."""
    try:
        salt, expected_hash = hashed_password.split("$", 1)
        actual_hash = hashlib.pbkdf2_hmac(
            "sha256",
            plain_password.encode("utf-8"),
            salt.encode("utf-8"),
            iterations=100_000
        ).hex()
        return hmac.compare_digest(expected_hash, actual_hash)
    except Exception:
        return False


# --- JWT Token Management ---

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


# --- AI Security: Prompt Injection & Adversarial Content Sanitizer ---

PROMPT_INJECTION_PATTERNS = [
    r"ignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions",
    r"disregard\s+(?:all\s+)?(?:previous|prior|above)\s+instructions",
    r"you\s+are\s+now\s+(?:an?\s+)?unrestricted",
    r"system:\s*you\s+are",
    r"<\s*\|?\s*im_start\s*\|?>",
    r"<\s*\|?\s*im_end\s*\|?>",
    r"\[\s*INST\s*\]",
    r"\[\s*/\s*INST\s*\]",
    r"new\s+system\s+prompt\s*:",
    r"override\s+system\s+prompt",
    r"print\s+(?:the\s+)?system\s+prompt",
    r"reveal\s+your\s+(?:initial\s+)?instructions",
    r"act\s+as\s+(?:a\s+)?jailbroken",
]

COMPILED_INJECTION_RE = [re.compile(p, re.IGNORECASE) for p in PROMPT_INJECTION_PATTERNS]


def detect_prompt_injection(text: str) -> List[str]:
    """
    Detect potential prompt injection patterns in candidate or JD text.
    Returns list of matched patterns.
    """
    detected = []
    for regex in COMPILED_INJECTION_RE:
        matches = regex.findall(text)
        if matches:
            detected.append(matches[0])
    return detected


def sanitize_untrusted_text(text: str) -> str:
    """
    Sanitize text ingested from user-uploaded PDFs or JDs to ensure it acts purely as data
    and cannot hijack LLM delimiter framing.
    """
    if not text:
        return ""
    
    # Neutralize markdown-based role simulation delimiters
    sanitized = text.replace("```system", "```data-system")
    sanitized = sanitized.replace("```assistant", "```data-assistant")
    sanitized = sanitized.replace("```user", "```data-user")
    
    # Strip dangerous tokens
    for pattern in COMPILED_INJECTION_RE:
        sanitized = pattern.sub("[FILTERED_INJECTION_ATTEMPT]", sanitized)
        
    return sanitized.strip()


# --- File Validation Security ---

def validate_file_upload(filename: str, file_bytes: bytes, max_size: int = settings.MAX_UPLOAD_SIZE_BYTES) -> Dict[str, Any]:
    """
    Validate uploaded file for allowed extension, size, and valid PDF/text header.
    """
    if len(file_bytes) > max_size:
        return {"valid": False, "error": f"File size exceeds maximum allowed limit ({max_size // (1024*1024)}MB)"}

    extension = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if extension not in settings.ALLOWED_EXTENSIONS:
        return {"valid": False, "error": f"Unsupported file extension '{extension}'. Allowed: {settings.ALLOWED_EXTENSIONS}"}

    # PDF Magic Bytes check: %PDF- (hex 25 50 44 46 2d)
    if extension == ".pdf":
        if not file_bytes.startswith(b"%PDF-"):
            return {"valid": False, "error": "Invalid PDF header. File is corrupt or not a true PDF document."}

    return {"valid": True, "error": None, "extension": extension, "size": len(file_bytes)}
