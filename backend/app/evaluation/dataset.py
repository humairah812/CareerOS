"""
Golden Evaluation Benchmark Dataset
Contains 10 curated test cases with ground-truth skills, expected citations,
and intentional ungrounded test claims for real AI evaluation.
"""
from typing import List, Dict, Any

GOLDEN_BENCHMARK_CASES: List[Dict[str, Any]] = [
    {
        "id": "case_01",
        "scenario": "Staff AI Systems Engineer - Python, FastAPI, RAG, pgvector",
        "resume_snippet": "Architected asynchronous RAG retrieval pipeline using FastAPI, pgvector, and hybrid BM25 search serving 450k daily queries. Built scalable AI systems.",
        "jd_snippet": "Role: Staff AI Engineer. Mandatory skills: Python, FastAPI, RAG, pgvector, Docker, PostgreSQL. Preferred: Kubernetes.",
        "ground_truth_skills": ["Python", "FastAPI", "RAG", "pgvector", "PostgreSQL", "Docker"],
        "expected_citations": ["FastAPI", "pgvector", "RAG"],
        "unsupported_claim": "Built scalable AI systems",
        "expected_tool": "get_resume"
    },
    {
        "id": "case_02",
        "scenario": "MLOps & Infrastructure Engineer - Docker, Kubernetes, CI/CD",
        "resume_snippet": "Deployed 25+ microservices on Kubernetes clusters using Docker and GitHub Actions CI/CD pipelines with Prometheus monitoring.",
        "jd_snippet": "Looking for MLOps Engineer. Requirements: Docker, Kubernetes, CI/CD, Python. Preferred: Terraform.",
        "ground_truth_skills": ["Docker", "Kubernetes", "CI/CD", "Python"],
        "expected_citations": ["Kubernetes", "Docker", "CI/CD"],
        "unsupported_claim": "Industry-leading deployment speed",
        "expected_tool": "search_skills"
    },
    {
        "id": "case_03",
        "scenario": "Senior Agentic AI Engineer - LangGraph, MCP, Tool Calling",
        "resume_snippet": "Developed multi-agent workflows using LangGraph and Model Context Protocol (MCP) tool-calling server with SQLite persistence.",
        "jd_snippet": "Seeking Agentic AI Specialist experienced with LangGraph, MCP, Python, and Tool Calling.",
        "ground_truth_skills": ["LangGraph", "MCP", "Tool Calling", "Python"],
        "expected_citations": ["LangGraph", "MCP"],
        "unsupported_claim": "Achieved unprecedented agent autonomy",
        "expected_tool": "analyze_repository"
    },
    {
        "id": "case_04",
        "scenario": "High-Throughput Backend Engineer - FastAPI, Redis, AsyncIO",
        "resume_snippet": "Implemented high-throughput REST APIs and microservices in Python and FastAPI with Redis caching and sub-15ms p99 latency.",
        "jd_snippet": "Backend Lead: FastAPI, Redis, AsyncIO, PostgreSQL, Microservices.",
        "ground_truth_skills": ["FastAPI", "Redis", "AsyncIO", "PostgreSQL", "Python"],
        "expected_citations": ["FastAPI", "Redis"],
        "unsupported_claim": "Supercharged database throughput",
        "expected_tool": "get_job_description"
    },
    {
        "id": "case_05",
        "scenario": "Deep Learning Researcher - PyTorch, Transformers, CNN",
        "resume_snippet": "Trained transformer-based multimodal models using PyTorch on distributed GPU clusters with FP16 mixed precision.",
        "jd_snippet": "AI Researcher: PyTorch, Transformers, Deep Learning, Model Evaluation.",
        "ground_truth_skills": ["PyTorch", "Transformers", "Deep Learning", "Machine Learning"],
        "expected_citations": ["PyTorch", "Transformers"],
        "unsupported_claim": "Pioneered world-class foundation models",
        "expected_tool": "search_skills"
    },
    {
        "id": "case_06",
        "scenario": "Distributed Data Engineer - Kafka, PostgreSQL, Data Pipelines",
        "resume_snippet": "Engineered real-time streaming data pipelines consuming 2M events/hour using Apache Kafka and PostgreSQL sinks.",
        "jd_snippet": "Data Engineer: Kafka, PostgreSQL, Data Pipelines, Python.",
        "ground_truth_skills": ["Kafka", "PostgreSQL", "Data Pipelines", "Python"],
        "expected_citations": ["Kafka", "PostgreSQL"],
        "unsupported_claim": "Processed unlimited big data streams",
        "expected_tool": "create_learning_plan"
    },
    {
        "id": "case_07",
        "scenario": "Full-Stack AI Engineer - React, TypeScript, FastAPI",
        "resume_snippet": "Built full-stack AI dashboards using React 18, TypeScript, Tailwind CSS, and FastAPI backend with WebSockets.",
        "jd_snippet": "Full-Stack Engineer: React, TypeScript, Tailwind CSS, FastAPI, REST APIs.",
        "ground_truth_skills": ["React", "TypeScript", "Tailwind CSS", "FastAPI", "REST APIs"],
        "expected_citations": ["React", "TypeScript", "FastAPI"],
        "unsupported_claim": "Created magical user interfaces",
        "expected_tool": "get_candidate_projects"
    },
    {
        "id": "case_08",
        "scenario": "AI Evaluation & Observability Engineer - AI Evaluation, Tracing",
        "resume_snippet": "Implemented end-to-end RAG evaluation harness computing groundedness, citation precision, and OpenTelemetry trace spans.",
        "jd_snippet": "Observability Lead: AI Evaluation, LLM metrics, tracing, Python.",
        "ground_truth_skills": ["AI Evaluation", "Python", "RAG", "LLM"],
        "expected_citations": ["AI Evaluation", "RAG"],
        "unsupported_claim": "Zero bugs ever reported in production",
        "expected_tool": "generate_interview"
    },
    {
        "id": "case_09",
        "scenario": "Cloud Solutions Architect - AWS, Docker, Microservices",
        "resume_snippet": "Architected highly available AWS multi-region infrastructure running Dockerized microservices behind Application Load Balancers.",
        "jd_snippet": "Cloud Architect: AWS, Docker, Microservices, CI/CD.",
        "ground_truth_skills": ["AWS", "Docker", "CI/CD"],
        "expected_citations": ["AWS", "Docker"],
        "unsupported_claim": "100% uptime guaranteed forever",
        "expected_tool": "search_learning_resources"
    },
    {
        "id": "case_10",
        "scenario": "Vector Search Specialist - Vector Databases, Embeddings, Reranking",
        "resume_snippet": "Engineered multi-stage vector search architecture utilizing Cohere reranking, OpenAI text embeddings, and pgvector HNSW indexing.",
        "jd_snippet": "Search Engineer: Vector Databases, Embeddings, Reranking, Python, PostgreSQL.",
        "ground_truth_skills": ["Vector Databases", "Embeddings", "Reranking", "Python", "PostgreSQL"],
        "expected_citations": ["Vector Databases", "Embeddings", "Reranking"],
        "unsupported_claim": "Invented revolutionary search algorithms",
        "expected_tool": "get_resume"
    }
]
