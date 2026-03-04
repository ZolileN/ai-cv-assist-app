from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.core.security import get_current_user
from app.services.candidate_matching import match_candidates

router = APIRouter(prefix="/api", tags=["matching"])


class MatchRequest(BaseModel):
    job_description_text: str = Field(..., min_length=1)


class MatchItem(BaseModel):
    rank: int
    candidate_id: int
    title: str
    location: str | None = None
    cosine_similarity: float


@router.post("/match", response_model=List[MatchItem])
def match_job_to_candidates(
    payload: MatchRequest,
    current_user: dict = Depends(get_current_user),
):
    """Match candidates against a job description and return top results."""
    _ = current_user  # enforce auth dependency
    return match_candidates(payload.job_description_text)
