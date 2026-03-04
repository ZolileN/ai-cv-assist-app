from datetime import datetime
from typing import Any, Dict, List, Set

from app.core.database import SessionLocal
from app.models import Candidate
from app.services.openai_client import generate_embedding


def _estimate_years_experience(candidate: Candidate) -> float:
    experiences = getattr(candidate, "experiences", []) or []
    if not experiences:
        return 0.0

    start_dates = [exp.start_date for exp in experiences if exp.start_date]
    if not start_dates:
        return 0.0

    earliest_start = min(start_dates)
    latest_end = max(
        [(exp.end_date or datetime.utcnow()) for exp in experiences if exp.start_date],
        default=datetime.utcnow(),
    )
    delta_days = max(0, (latest_end - earliest_start).days)
    return round(delta_days / 365.25, 1)


def _extract_candidate_skills(candidate: Candidate) -> List[str]:
    skills: Set[str] = set()
    if candidate.title:
        skills.add(candidate.title.strip())

    experiences = getattr(candidate, "experiences", []) or []
    for exp in experiences:
        if exp.position:
            skills.add(exp.position.strip())

    return sorted(s for s in skills if s)[:8]


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
            user = getattr(candidate, "user", None)
            candidate_name = (
                getattr(user, "full_name", None)
                or candidate.title
                or f"Candidate {candidate.id}"
            )
            matches.append(
                {
                    "rank": rank,
                    "candidate_id": candidate.id,
                    "candidate_name": candidate_name,
                    "match_percentage": round(similarity * 100, 2),
                    "years_experience": _estimate_years_experience(candidate),
                    "skills": _extract_candidate_skills(candidate),
                    "title": candidate.title,
                    "location": candidate.location,
                    "cosine_similarity": round(similarity, 6),
                }
            )
        return matches
    finally:
        db.close()
