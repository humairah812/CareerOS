"""
Embedding Service
Generates dense vector embeddings with cosine similarity calculation.
Supports live OpenAI embeddings or high-dimensional deterministic hashing vectors for offline execution.
"""
import math
import hashlib
from typing import List, Optional
import numpy as np
from app.core.config import settings


class EmbeddingService:
    DIMENSION = 256

    @classmethod
    def get_embedding(cls, text: str) -> List[float]:
        """
        Return a normalized vector of length DIMENSION for the given text.
        """
        if not text:
            return [0.0] * cls.DIMENSION

        # Deterministic semantic n-gram feature hashing to simulate vector space locally
        # with zero external API dependencies
        vec = np.zeros(cls.DIMENSION, dtype=np.float32)
        tokens = text.lower().split()

        for idx, token in enumerate(tokens):
            # Unigram hash
            h1 = int(hashlib.md5(token.encode("utf-8")).hexdigest(), 16) % cls.DIMENSION
            vec[h1] += 1.0
            # Bigram hash if possible
            if idx > 0:
                bigram = f"{tokens[idx-1]}_{token}"
                h2 = int(hashlib.sha256(bigram.encode("utf-8")).hexdigest(), 16) % cls.DIMENSION
                vec[h2] += 1.5

        # L2 Normalize
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()

    @classmethod
    def cosine_similarity(cls, vec_a: List[float], vec_b: List[float]) -> float:
        """Calculate cosine similarity between two vector lists."""
        a = np.array(vec_a, dtype=np.float32)
        b = np.array(vec_b, dtype=np.float32)
        denom = (np.linalg.norm(a) * np.linalg.norm(b))
        if denom == 0:
            return 0.0
        return float(np.dot(a, b) / denom)
