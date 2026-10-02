"""
Advanced RAG Engine
Implements document chunking with metadata, dense + lexical hybrid retrieval,
reranking, citation construction, and groundedness verification.
"""
import re
import time
from typing import List, Dict, Any, Optional
from app.services.embedding_service import EmbeddingService


class DocumentChunk:
    def __init__(
        self,
        chunk_id: str,
        text: str,
        metadata: Dict[str, Any],
        embedding: Optional[List[float]] = None
    ):
        self.chunk_id = chunk_id
        self.text = text
        self.metadata = metadata  # {"source": "resume_1", "section": "Experience", "page": 1, "skills": [...]}
        self.embedding = embedding or EmbeddingService.get_embedding(text)


class RAGEngine:
    def __init__(self):
        self._chunks: List[DocumentChunk] = []

    def chunk_and_index(
        self,
        document_id: str,
        text: str,
        section_name: str,
        page_number: int = 1,
        chunk_size: int = 250,
        overlap: int = 40
    ) -> List[DocumentChunk]:
        """
        Split section text into overlapping chunks with rich metadata.
        """
        words = text.split()
        if not words:
            return []

        created_chunks = []
        start_idx = 0
        counter = 1

        while start_idx < len(words):
            end_idx = min(start_idx + chunk_size, len(words))
            chunk_text = " ".join(words[start_idx:end_idx])

            # Extract recognized technical keywords in this chunk
            from app.services.skill_ontology import ONTOLOGY_REGISTRY
            found_skills = [
                s for s in ONTOLOGY_REGISTRY.keys()
                if re.search(rf"\b{re.escape(s)}\b", chunk_text, re.IGNORECASE)
            ]

            chunk_id = f"{document_id}_{section_name}_{counter}"
            chunk = DocumentChunk(
                chunk_id=chunk_id,
                text=chunk_text,
                metadata={
                    "document_id": document_id,
                    "section": section_name,
                    "page_number": page_number,
                    "skills": found_skills,
                    "timestamp": time.time()
                }
            )
            self._chunks.append(chunk)
            created_chunks.append(chunk)

            if end_idx == len(words):
                break
            start_idx += (chunk_size - overlap)
            counter += 1

        return created_chunks

    def hybrid_search(
        self,
        query: str,
        top_k: int = 4,
        section_filter: Optional[str] = None,
        skill_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Perform dense semantic + lexical hybrid search over indexed chunks.
        Combines cosine similarity (65%) and keyword BM25-style overlap (35%).
        """
        query_emb = EmbeddingService.get_embedding(query)
        query_tokens = set(query.lower().split())

        scored_results = []

        for chunk in self._chunks:
            # Apply metadata filters
            if section_filter and chunk.metadata.get("section", "").lower() != section_filter.lower():
                continue
            if skill_filter and skill_filter.lower() not in [s.lower() for s in chunk.metadata.get("skills", [])]:
                continue

            # Semantic score (0.0 - 1.0)
            semantic_score = max(0.0, EmbeddingService.cosine_similarity(query_emb, chunk.embedding))

            # Lexical keyword score
            chunk_tokens = set(chunk.text.lower().split())
            overlap_count = len(query_tokens.intersection(chunk_tokens))
            lexical_score = overlap_count / max(1, len(query_tokens))

            # Hybrid weighted combination
            hybrid_score = (0.65 * semantic_score) + (0.35 * lexical_score)

            scored_results.append({
                "chunk_id": chunk.chunk_id,
                "text": chunk.text,
                "metadata": chunk.metadata,
                "semantic_score": round(semantic_score, 4),
                "lexical_score": round(lexical_score, 4),
                "score": round(hybrid_score, 4)
            })

        # Rerank and sort descending
        scored_results.sort(key=lambda x: x["score"], reverse=True)
        return scored_results[:top_k]

    def verify_claim_groundedness(self, claim: str, retrieved_chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Verify whether a claim has concrete grounding in retrieved citations.
        Detects ungrounded buzzwords ("built scalable AI systems" without numbers/tools).
        """
        combined_text = " ".join([c["text"] for c in retrieved_chunks]).lower()
        claim_lower = claim.lower()

        # Check for vague claims without evidence
        vague_buzzwords = ["scalable ai systems", "world-class", "industry-leading", "best practices", "deep expertise"]
        is_vague = any(bw in claim_lower for bw in vague_buzzwords)
        has_metrics = bool(re.search(r"\d+[%kM\+]|\d+\s*(?:ms|users|queries|rps|events)", claim))

        if is_vague and not has_metrics:
            return {
                "grounded": False,
                "confidence": 0.25,
                "reason": "Claim uses generic high-level buzzwords without verifiable metrics, architectural tools, or repo evidence.",
                "best_citation": retrieved_chunks[0] if retrieved_chunks else None
            }

        # Check semantic alignment
        best_score = retrieved_chunks[0]["score"] if retrieved_chunks else 0.0
        grounded = best_score > 0.35

        return {
            "grounded": grounded,
            "confidence": min(1.0, round(best_score + (0.2 if has_metrics else 0.0), 2)),
            "reason": "Direct textual and contextual match in candidate resume/projects." if grounded else "Insufficient evidence found in document citations.",
            "best_citation": retrieved_chunks[0] if retrieved_chunks else None
        }


# Global singleton RAG instance
rag_engine = RAGEngine()
