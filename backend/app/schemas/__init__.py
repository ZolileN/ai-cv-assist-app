from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Experience Schemas
class ExperienceBase(BaseModel):
    company: str
    position: str
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_current: str = "false"


class ExperienceCreate(BaseModel):
    job_title: str
    company: str
    duration: str
    responsibilities: str
    achievements: str
    tools: str


class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    position: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_current: Optional[str] = None


class ExperienceResponse(ExperienceBase):
    id: int
    candidate_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Candidate Schemas
class CandidateBase(BaseModel):
    title: str
    summary: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None


class CandidateCreate(CandidateBase):
    pass


class CandidateUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None


class CandidateResponse(CandidateBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    experiences: List[ExperienceResponse] = []

    class Config:
        from_attributes = True


# Job Description Schemas
class JobDescriptionBase(BaseModel):
    title: str
    description: str
    required_skills: Optional[str] = None
    experience_required: Optional[int] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    location: Optional[str] = None
    is_active: str = "true"


class JobDescriptionCreate(JobDescriptionBase):
    pass


class JobDescriptionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[str] = None
    experience_required: Optional[int] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    location: Optional[str] = None
    is_active: Optional[str] = None


class JobDescriptionResponse(JobDescriptionBase):
    id: int
    recruiter_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Recruiter Schemas
class RecruiterBase(BaseModel):
    company_name: str
    phone: Optional[str] = None
    website: Optional[str] = None


class RecruiterCreate(RecruiterBase):
    pass


class RecruiterUpdate(BaseModel):
    company_name: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None


class RecruiterResponse(RecruiterBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    job_descriptions: List[JobDescriptionResponse] = []

    class Config:
        from_attributes = True


class CandidateWithExperiencesCreate(BaseModel):
    name: str
    location: str
    years_experience: int
    desired_role: str
    experiences: List[ExperienceCreate]

    class Config:
        from_attributes = True
