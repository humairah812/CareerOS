"""
Canonical Skill Ontology & Directed Graph Service
Provides a standardized taxonomy across AI/ML, Backend, Cloud, Data, and Frontend.
Enforces that skills are never implicitly hallucinated (e.g. React != Next.js).
"""
from typing import Dict, List, Optional, Set, Any


class CanonicalSkill:
    def __init__(
        self,
        name: str,
        category: str,
        subcategory: str,
        parent: Optional[str] = None,
        aliases: Optional[List[str]] = None,
        description: str = ""
    ):
        self.name = name
        self.category = category
        self.subcategory = subcategory
        self.parent = parent
        self.aliases = [a.lower() for a in (aliases or [])]
        self.description = description


# Curated 2026 Skill Ontology Taxonomy
ONTOLOGY_REGISTRY: Dict[str, CanonicalSkill] = {
    # --- Generative AI & Agentic Systems ---
    "Generative AI": CanonicalSkill("Generative AI", "Generative AI", "Foundations", None, ["genai", "gen-ai"]),
    "LLM": CanonicalSkill("LLM", "Generative AI", "Modeling", "Generative AI", ["large language models", "llms"]),
    "RAG": CanonicalSkill("RAG", "Generative AI", "Retrieval", "Generative AI", ["retrieval augmented generation", "retrieval-augmented generation"]),
    "Agents": CanonicalSkill("Agents", "Generative AI", "Orchestration", "Generative AI", ["ai agents", "agentic ai", "agentic workflows"]),
    "LangGraph": CanonicalSkill("LangGraph", "Generative AI", "Orchestration", "Agents", ["lang-graph"]),
    "MCP": CanonicalSkill("MCP", "Generative AI", "Tooling", "Agents", ["model context protocol"]),
    "Tool Calling": CanonicalSkill("Tool Calling", "Generative AI", "Tooling", "Agents", ["function calling", "tool use"]),
    "AI Evaluation": CanonicalSkill("AI Evaluation", "Generative AI", "Evaluation", "Generative AI", ["ragas", "llm evaluation", "evals"]),
    "Vector Databases": CanonicalSkill("Vector Databases", "Generative AI", "Retrieval", "RAG", ["vector db", "vector search", "pgvector", "pinecone", "weaviate", "chroma", "qdrant"]),
    "Embeddings": CanonicalSkill("Embeddings", "Generative AI", "Retrieval", "RAG", ["dense embeddings", "semantic embeddings"]),
    "Reranking": CanonicalSkill("Reranking", "Generative AI", "Retrieval", "RAG", ["cohere rerank", "cross-encoders"]),

    # --- Machine Learning & Deep Learning ---
    "Machine Learning": CanonicalSkill("Machine Learning", "Machine Learning", "Foundations", None, ["ml", "scikit-learn"]),
    "Deep Learning": CanonicalSkill("Deep Learning", "Machine Learning", "Neural Networks", "Machine Learning", ["dl"]),
    "PyTorch": CanonicalSkill("PyTorch", "Machine Learning", "Frameworks", "Deep Learning", ["torch"]),
    "Transformers": CanonicalSkill("Transformers", "Machine Learning", "Architectures", "Deep Learning", ["huggingface", "bert", "gpt"]),
    "Model Evaluation": CanonicalSkill("Model Evaluation", "Machine Learning", "Evaluation", "Machine Learning", ["auc-roc", "f1-score"]),

    # --- Backend & Systems ---
    "Python": CanonicalSkill("Python", "Backend", "Languages", None, ["python3", "py"]),
    "FastAPI": CanonicalSkill("FastAPI", "Backend", "Frameworks", "Python", ["fast-api"]),
    "AsyncIO": CanonicalSkill("AsyncIO", "Backend", "Concurrency", "Python", ["async/await", "asynchronous python"]),
    "SQLAlchemy": CanonicalSkill("SQLAlchemy", "Backend", "ORM", "Python", ["sqlalchemy 2.0"]),
    "PostgreSQL": CanonicalSkill("PostgreSQL", "Backend", "Databases", None, ["postgres", "psql"]),
    "Redis": CanonicalSkill("Redis", "Backend", "Caching", None, ["redis cache"]),
    "Go": CanonicalSkill("Go", "Backend", "Languages", None, ["golang"]),
    "REST APIs": CanonicalSkill("REST APIs", "Backend", "Architecture", None, ["restful", "rest api"]),
    "GraphQL": CanonicalSkill("GraphQL", "Backend", "Architecture", None, ["graphql api"]),

    # --- Cloud & Infrastructure ---
    "Docker": CanonicalSkill("Docker", "Cloud", "Containers", None, ["containerization", "dockerfiles"]),
    "Kubernetes": CanonicalSkill("Kubernetes", "Cloud", "Orchestration", "Docker", ["k8s"]),
    "AWS": CanonicalSkill("AWS", "Cloud", "Platforms", None, ["amazon web services"]),
    "CI/CD": CanonicalSkill("CI/CD", "Cloud", "DevOps", None, ["continuous integration", "github actions"]),

    # --- Frontend Architecture ---
    "TypeScript": CanonicalSkill("TypeScript", "Frontend", "Languages", None, ["ts"]),
    "JavaScript": CanonicalSkill("JavaScript", "Frontend", "Languages", None, ["js", "es6"]),
    "React": CanonicalSkill("React", "Frontend", "Frameworks", "JavaScript", ["react.js", "reactjs"]),
    "Next.js": CanonicalSkill("Next.js", "Frontend", "Frameworks", "React", ["nextjs", "next"]),
    "Tailwind CSS": CanonicalSkill("Tailwind CSS", "Frontend", "Styling", None, ["tailwind", "tailwindcss"]),

    # --- Data Engineering ---
    "Data Pipelines": CanonicalSkill("Data Pipelines", "Data", "Pipelines", None, ["etl", "elt", "airflow"]),
    "Kafka": CanonicalSkill("Kafka", "Data", "Streaming", None, ["apache kafka", "event streams"]),
}


class SkillOntologyService:
    @classmethod
    def normalize_skill(cls, raw_skill: str) -> Optional[str]:
        """
        Map any raw string alias to the canonical skill name.
        Example: 'fast-api' -> 'FastAPI', 'lang-graph' -> 'LangGraph'.
        """
        cleaned = raw_skill.strip().lower()
        # Direct match
        for canonical, obj in ONTOLOGY_REGISTRY.items():
            if canonical.lower() == cleaned:
                return canonical
            if cleaned in obj.aliases:
                return canonical
        return None

    @classmethod
    def get_all_skills(cls) -> List[Dict[str, Any]]:
        """Return all canonical skills in the ontology."""
        return [
            {
                "name": s.name,
                "category": s.category,
                "subcategory": s.subcategory,
                "parent": s.parent,
                "aliases": s.aliases,
                "description": s.description
            }
            for s in ONTOLOGY_REGISTRY.values()
        ]

    @classmethod
    def get_graph_data(cls, candidate_status_map: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Export complete graph structure formatted for UI visualization (nodes and edges).
        candidate_status_map: {"FastAPI": "strong", "MCP": "missing", ...}
        """
        nodes = []
        edges = []
        status_map = candidate_status_map or {}

        for skill_name, item in ONTOLOGY_REGISTRY.items():
            status = status_map.get(skill_name, "unclear")
            nodes.append({
                "id": skill_name.lower().replace(" ", "-"),
                "label": skill_name,
                "category": item.category,
                "subcategory": item.subcategory,
                "status": status,
                "parent": item.parent
            })

            if item.parent and item.parent in ONTOLOGY_REGISTRY:
                edges.append({
                    "id": f"{item.parent.lower().replace(' ', '-')}_to_{skill_name.lower().replace(' ', '-')}",
                    "source": item.parent.lower().replace(" ", "-"),
                    "target": skill_name.lower().replace(" ", "-"),
                    "relation": "subskill_of"
                })

        return {"nodes": nodes, "edges": edges}
