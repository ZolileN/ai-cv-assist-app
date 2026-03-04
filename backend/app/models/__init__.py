from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class User(Base):
    """User model for authentication"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    candidates = relationship("Candidate", back_populates="user")
    recruiters = relationship("Recruiter", back_populates="user")


class Candidate(Base):
    """Candidate model"""
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    summary = Column(Text)
    phone = Column(String)
    location = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="candidates")
    experiences = relationship("Experience", back_populates="candidate", cascade="all, delete-orphan")


class Experience(Base):
    """Work experience model"""
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    company = Column(String, nullable=False)
    position = Column(String, nullable=False)
    description = Column(Text)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    is_current = Column(String, default="false")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    candidate = relationship("Candidate", back_populates="experiences")


class JobDescription(Base):
    """Job description model"""
    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("recruiters.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    required_skills = Column(Text)  # JSON stored as string
    experience_required = Column(Integer)  # Years of experience
    salary_min = Column(Float)
    salary_max = Column(Float)
    location = Column(String)
    is_active = Column(String, default="true")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    recruiter = relationship("Recruiter", back_populates="job_descriptions")


class Recruiter(Base):
    """Recruiter model"""
    __tablename__ = "recruiters"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_name = Column(String, nullable=False)
    phone = Column(String)
    website = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="recruiters")
    job_descriptions = relationship("JobDescription", back_populates="recruiter", cascade="all, delete-orphan")
