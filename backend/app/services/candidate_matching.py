from typing import Any, Dict, List

from app.core.database import SessionLocal
from app.models import Candidate
from app.services.openai_client import generate_embedding


def match_candidates(job_description_text: str) -> List[Dict[str, Any]]:
    """
    Match candidates to a job description using embedding cosine similarity.

    Steps:
    1) Generate embedding for the job description text.
    2) Compare with stored candidate embeddings in PostgreSQL/pgvector.
    3) Return top 10 ranked by cosine similarity.
    """
    if not job_description_text or not job_description_text.strip():
        return []

    embedding_payload = generate_embedding(job_description_text)
    query_embedding = embedding_payload.get("embedding")
    if not query_embedding:
        return []

    db = SessionLocal()
    try:
        distance_expr = Candidate.embedding.cosine_distance(query_embedding).label("distance")

        rows = (
            db.query(Candidate, distance_expr)
            .filter(Candidate.embedding.is_not(None))
            .order_by(distance_expr.asc())
            .limit(10)
            .all()
        )

        matches: List[Dict[str, Any]] = []
        for rank, (candidate, distance) in enumerate(rows, start=1):
            distance_value = float(distance) if distance is not None else 1.0
            similarity = max(0.0, min(1.0, 1.0 - distance_value))
            matches.append(
                {
                    "rank": rank,
                    "candidate_id": candidate.id,
                    "title": candidate.title,
                    "location": candidate.location,
                    "cosine_similarity": round(similarity, 6),
                }
            )
        return matches
    finally:
        db.close()
