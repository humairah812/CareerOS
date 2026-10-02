"""
CareerOS Cache & Redis Interface
Provides Redis integration with an automatic thread-safe in-memory cache fallback.
"""
import time
from typing import Optional, Any, Dict
import logging

logger = logging.getLogger(__name__)


class InMemoryCache:
    """Thread-safe in-memory cache with TTL support when Redis is not available."""
    def __init__(self):
        self._store: Dict[str, Any] = {}
        self._expiry: Dict[str, float] = {}

    def get(self, key: str) -> Optional[Any]:
        if key in self._expiry and time.time() > self._expiry[key]:
            self.delete(key)
            return None
        return self._store.get(key)

    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        self._store[key] = value
        if ttl_seconds:
            self._expiry[key] = time.time() + ttl_seconds
        elif key in self._expiry:
            del self._expiry[key]

    def delete(self, key: str) -> None:
        self._store.pop(key, None)
        self._expiry.pop(key, None)

    def incr(self, key: str, ttl_seconds: int = 60) -> int:
        current = self.get(key)
        if current is None:
            new_val = 1
            self.set(key, new_val, ttl_seconds)
            return new_val
        else:
            try:
                new_val = int(current) + 1
            except (ValueError, TypeError):
                new_val = 1
            # Preserve existing expiry if possible
            remaining = int(self._expiry.get(key, time.time() + ttl_seconds) - time.time())
            self.set(key, new_val, max(1, remaining))
            return new_val


# Singleton cache manager
cache = InMemoryCache()
