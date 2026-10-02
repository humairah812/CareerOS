"""
AI Evaluation Metrics Calculator
Computes exact mathematical scores for RAG retrieval, groundedness, citations,
tool execution validity, and token cost economics.
"""
from typing import List, Set, Dict, Any


class EvaluationMetrics:
    @staticmethod
    def calculate_precision_recall(retrieved: List[str], ground_truth: List[str]) -> Dict[str, float]:
        """
        Calculate mathematical precision, recall, and F1 score for skill retrieval.
        """
        ret_set = {r.strip().lower() for r in retrieved}
        gt_set = {g.strip().lower() for g in ground_truth}

        if not gt_set:
            return {"precision": 1.0, "recall": 1.0, "f1": 1.0}

        true_positives = len(ret_set.intersection(gt_set))
        false_positives = len(ret_set - gt_set)
        false_negatives = len(gt_set - ret_set)

        precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) > 0 else 0.0
        recall = true_positives / (true_positives + false_negatives) if (true_positives + false_negatives) > 0 else 0.0
        f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

        return {
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1": round(f1, 4),
            "tp": true_positives,
            "fp": false_positives,
            "fn": false_negatives
        }

    @staticmethod
    def calculate_groundedness(total_claims: int, unsupported_claims_detected: int) -> float:
        """
        Groundedness score: percentage of claims verified with concrete citations.
        Formula: (total_claims - unsupported_claims) / total_claims
        """
        if total_claims == 0:
            return 1.0
        grounded = max(0, total_claims - unsupported_claims_detected)
        return round(grounded / total_claims, 4)

    @staticmethod
    def calculate_citation_accuracy(extracted_citations: List[str], expected_citations: List[str]) -> float:
        """
        Percentage of expected citations accurately recovered.
        """
        if not expected_citations:
            return 1.0
        found = 0
        ext_lower = [c.lower() for c in extracted_citations]
        for exp in expected_citations:
            if any(exp.lower() in e for e in ext_lower):
                found += 1
        return round(found / len(expected_citations), 4)

    @staticmethod
    def estimate_cost(prompt_tokens: int, completion_tokens: int, model: str = "gpt-4o-mini") -> float:
        """
        Estimated cost in USD based on standard token pricing.
        gpt-4o-mini: $0.15 / 1M input, $0.60 / 1M output.
        """
        input_cost = (prompt_tokens / 1_000_000.0) * 0.15
        output_cost = (completion_tokens / 1_000_000.0) * 0.60
        return round(input_cost + output_cost, 6)
