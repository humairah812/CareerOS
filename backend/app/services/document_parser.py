"""
Document Parser Service
Extracts text from PDF/TXT documents, detects logical sections (Experience, Education,
Projects, Skills), and sanitizes against prompt injection attempts.
"""
import io
import re
from typing import Dict, List, Any, Tuple
from pypdf import PdfReader
from app.core.security import sanitize_untrusted_text, detect_prompt_injection


class DocumentParser:
    SECTION_HEADERS = {
        "summary": [r"summary", r"professional summary", r"profile", r"about me", r"objective"],
        "experience": [r"experience", r"work experience", r"employment", r"professional experience", r"work history"],
        "education": [r"education", r"academic background", r"qualifications", r"degrees"],
        "skills": [r"skills", r"technical skills", r"technologies", r"core competencies", r"tools & technologies"],
        "projects": [r"projects", r"personal projects", r"key projects", r"technical projects"],
        "certifications": [r"certifications", r"licenses", r"courses", r"credentials"],
        "achievements": [r"achievements", r"honors", r"awards", r"publications"],
    }

    @classmethod
    def extract_text_from_pdf(cls, pdf_bytes: bytes) -> Tuple[str, List[Dict[str, Any]]]:
        """
        Extract text from raw PDF bytes page by page.
        Returns:
            (full_text, pages_list)
        """
        reader = PdfReader(io.BytesIO(pdf_bytes))
        pages_data = []
        full_text_parts = []

        for idx, page in enumerate(reader.pages):
            page_num = idx + 1
            text = page.extract_text() or ""
            # Sanitize untrusted content to prevent delimiter hijacking
            clean_text = sanitize_untrusted_text(text)
            full_text_parts.append(clean_text)
            pages_data.append({
                "page_number": page_num,
                "text": clean_text,
                "char_count": len(clean_text)
            })

        return "\n\n".join(full_text_parts), pages_data

    @classmethod
    def segment_sections(cls, full_text: str) -> Dict[str, str]:
        """
        Segment plain resume text into logical sections based on common headings.
        """
        lines = full_text.splitlines()
        sections: Dict[str, List[str]] = {k: [] for k in cls.SECTION_HEADERS}
        sections["header"] = []

        current_section = "header"

        for line in lines:
            trimmed = line.strip()
            if not trimmed:
                continue

            # Check if this line looks like a header (short, standalone, matches keyword)
            is_header_match = False
            if len(trimmed) < 45 and not trimmed.endswith("."):
                lower_line = trimmed.lower()
                for sec_key, patterns in cls.SECTION_HEADERS.items():
                    for pat in patterns:
                        if re.fullmatch(rf"(?:[0-9\.\-\s]*)(?:{pat})(?:\s*[:\-]*)", lower_line):
                            current_section = sec_key
                            is_header_match = True
                            break
                    if is_header_match:
                        break

            if not is_header_match:
                sections[current_section].append(trimmed)

        # Convert line lists to consolidated section text
        return {k: "\n".join(v).strip() for k, v in sections.items() if v}

    @classmethod
    def detect_injections(cls, text: str) -> List[str]:
        return detect_prompt_injection(text)
