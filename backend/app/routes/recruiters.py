from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import Recruiter, JobDescription, User
from app.schemas import (
    RecruiterCreate,
    RecruiterUpdate,
    RecruiterResponse,
    JobDescriptionCreate,
    JobDescriptionUpdate,
    JobDescriptionResponse,
)

router = APIRouter(prefix="/api/recruiters", tags=["recruiters"])


@router.post("/", response_model=RecruiterResponse)
def create_recruiter(
    recruiter_create: RecruiterCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new recruiter profile"""
    recruiter = Recruiter(
        user_id=current_user["user_id"], **recruiter_create.model_dump()
    )
    db.add(recruiter)
    db.commit()
    db.refresh(recruiter)
    return recruiter


@router.get("/", response_model=List[RecruiterResponse])
def list_recruiters(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all recruiters for current user"""
    recruiters = (
        db.query(Recruiter)
        .filter(Recruiter.user_id == current_user["user_id"])
        .all()
    )
    return recruiters


@router.get("/{recruiter_id}", response_model=RecruiterResponse)
def get_recruiter(
    recruiter_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get recruiter by ID"""
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    if recruiter.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return recruiter


@router.put("/{recruiter_id}", response_model=RecruiterResponse)
def update_recruiter(
    recruiter_id: int,
    recruiter_update: RecruiterUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update recruiter profile"""
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    if recruiter.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = recruiter_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(recruiter, key, value)

    db.commit()
    db.refresh(recruiter)
    return recruiter


@router.delete("/{recruiter_id}")
def delete_recruiter(
    recruiter_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete recruiter profile"""
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    if recruiter.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(recruiter)
    db.commit()
    return {"message": "Recruiter deleted"}


# Job Description endpoints
@router.post("/{recruiter_id}/jobs", response_model=JobDescriptionResponse)
def create_job_description(
    recruiter_id: int,
    job_create: JobDescriptionCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new job description"""
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    if recruiter.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    job = JobDescription(recruiter_id=recruiter_id, **job_create.model_dump())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.get("/{recruiter_id}/jobs", response_model=List[JobDescriptionResponse])
def list_job_descriptions(
    recruiter_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all job descriptions for a recruiter"""
    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    if recruiter.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    jobs = (
        db.query(JobDescription)
        .filter(JobDescription.recruiter_id == recruiter_id)
        .all()
    )
    return jobs


@router.put("/jobs/{job_id}", response_model=JobDescriptionResponse)
def update_job_description(
    job_id: int,
    job_update: JobDescriptionUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update job description"""
    job = db.query(JobDescription).filter(JobDescription.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    recruiter = db.query(Recruiter).filter(Recruiter.id == job.recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    if recruiter.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = job_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(job, key, value)

    db.commit()
    db.refresh(job)
    return job


@router.delete("/jobs/{job_id}")
def delete_job_description(
    job_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete job description"""
    job = db.query(JobDescription).filter(JobDescription.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    recruiter = db.query(Recruiter).filter(Recruiter.id == job.recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    if recruiter.user_id != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(job)
    db.commit()
    return {"message": "Job deleted"}
