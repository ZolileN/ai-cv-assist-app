from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.core.security import get_current_user
from app.services.jd_analyzer import analyze_jd

router = APIRouter(prefix="/api", tags=["jd-analyzer"])


class AnalyzeJDRequest(BaseModel):
    text: str = Field(..., min_length=1)


class AnalyzeJDResponse(BaseModel):
    hard_skills: List[str] = Field(default_factory=list)
    soft_skills: List[str] = Field(default_factory=list)
    tools: List[str] = Field(default_factory=list)
    seniority: str = ""


@router.post("/analyze-jd", response_model=AnalyzeJDResponse)
def analyze_job_description(
    payload: AnalyzeJDRequest,
    current_user: dict = Depends(get_current_user),
):
    """Analyze a job description and extract structured skill/seniority data."""
    _ = current_user  # enforce auth dependency
    return analyze_jd(payload.text)
