from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import Candidate, Experience
from app.services.openai_client import generate_embedding
from app.schemas import (
    CandidateCreate,
    CandidateUpdate,
    CandidateResponse,
    CandidateWithExperiencesCreate,
    ExperienceCreate,
    ExperienceUpdate,
    ExperienceResponse,
)

router = APIRouter(prefix="/api/candidates", tags=["candidates"])
logger = logging.getLogger(__name__)


def _candidate_embedding_text(payload: dict) -> str:
    parts = [
        str(payload.get("title", "")).strip(),
        str(payload.get("summary", "")).strip(),
        str(payload.get("location", "")).strip(),
    ]
    return " | ".join([p for p in parts if p])


@router.post("/", response_model=CandidateResponse)
def create_candidate(
    candidate_create: CandidateCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new candidate profile"""
    candidate_data = candidate_create.model_dump()
    candidate = Candidate(user_id=current_user["user_id"], **candidate_data)

    embedding_text = _candidate_embedding_text(candidate_data)
    if embedding_text:
        try:
            embedding_data = generate_embedding(embedding_text)
            candidate.embedding = embedding_data.get("embedding")
        except Exception as exc:
            logger.warning("Candidate embedding generation failed on create: %s", exc)

    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate


@router.get("/", response_model=List[CandidateResponse])
def list_candidates(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all candidates for current user"""
    candidates = (
        db.query(Candidate)
        .filter(Candidate.user_id == current_user["user_id"])
        .all()
    )
    return candidates


@router.get("/{candidate_id}", response_model=CandidateResponse)
def get_candidate(
    candidate_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get candidate by ID"""
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    if candidate.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return candidate


@router.put("/{candidate_id}", response_model=CandidateResponse)
def update_candidate(
    candidate_id: int,
    candidate_update: CandidateUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update candidate profile"""
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    if candidate.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = candidate_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(candidate, key, value)

    # Refresh embedding if any text source fields changed.
    if any(field in update_data for field in ("title", "summary", "location")):
        embedding_text = _candidate_embedding_text(
            {
                "title": candidate.title,
                "summary": candidate.summary,
                "location": candidate.location,
            }
        )
        if embedding_text:
            try:
                embedding_data = generate_embedding(embedding_text)
                candidate.embedding = embedding_data.get("embedding")
            except Exception as exc:
                logger.warning("Candidate embedding generation failed on update: %s", exc)

    db.commit()
    db.refresh(candidate)
    return candidate


@router.delete("/{candidate_id}")
def delete_candidate(
    candidate_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete candidate profile"""
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    if candidate.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(candidate)
    db.commit()
    return {"message": "Candidate deleted"}


# Experience endpoints
@router.post("/{candidate_id}/experiences", response_model=ExperienceResponse)
def create_experience(
    candidate_id: int,
    experience_create: ExperienceCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add experience to candidate"""
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    if candidate.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    experience = Experience(candidate_id=candidate_id, **experience_create.model_dump())
    db.add(experience)
    db.commit()
    db.refresh(experience)
    return experience


@router.get("/{candidate_id}/experiences", response_model=List[ExperienceResponse])
def list_experiences(
    candidate_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all experiences for a candidate"""
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    if candidate.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    experiences = (
        db.query(Experience)
        .filter(Experience.candidate_id == candidate_id)
        .all()
    )
    return experiences


@router.put("/experiences/{experience_id}", response_model=ExperienceResponse)
def update_experience(
    experience_id: int,
    experience_update: ExperienceUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update experience"""
    experience = db.query(Experience).filter(Experience.id == experience_id).first()
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")

    candidate = db.query(Candidate).filter(
        Candidate.id == experience.candidate_id
    ).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    if candidate.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = experience_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(experience, key, value)

    db.commit()
    db.refresh(experience)
    return experience


@router.delete("/experiences/{experience_id}")
def delete_experience(
    experience_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete experience"""
    experience = db.query(Experience).filter(Experience.id == experience_id).first()
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")

    candidate = db.query(Candidate).filter(
        Candidate.id == experience.candidate_id
    ).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    if candidate.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(experience)
    db.commit()
    return {"message": "Experience deleted"}


# Add this new schema to app/schemas/__init__.py first:
# class CandidateWithExperiencesCreate(BaseModel):
#     name: str
#     location: str
#     years_experience: int
#     desired_role: str
#     experiences: List[ExperienceCreate]

# Then add this endpoint to candidates.py

@router.post("/create", response_model=dict)
def create_candidate_with_experiences(
    data: CandidateWithExperiencesCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create candidate with experiences in one request"""
    try:
        # Extract experiences from request
        experiences_data = data.experiences
        candidate_data = {
            "name": data.name,
            "location": data.location,
            "years_experience": data.years_experience,
            "desired_role": data.desired_role,
        }
        
        # Create candidate
        candidate = Candidate(
            user_id=current_user["user_id"],
            **candidate_data
        )
        db.add(candidate)
        db.flush()  # Get the candidate ID without committing
        
        # Create experiences
        for exp_data in experiences_data:
            experience = Experience(
                candidate_id=candidate.id,
                **exp_data.model_dump()
            )
            db.add(experience)
        
        db.commit()
        db.refresh(candidate)
        
        return {
            "id": candidate.id,
            "message": "Candidate and experiences created successfully",
            "candidate": CandidateResponse.model_validate(candidate)
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Failed to create candidate: {str(e)}"
        )
