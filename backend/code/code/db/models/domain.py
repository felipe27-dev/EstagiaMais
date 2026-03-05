from sqlalchemy import Integer, String, Float, ForeignKey, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, mapped_column, Mapped
from code.db.base import Base # Puxando a configuração base do seu template

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class Resume(Base):
    __tablename__ = "resumes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name_candidate: Mapped[str] = mapped_column(String(200), nullable=False)
    email_candidate: Mapped[str] = mapped_column(String(200), nullable=False)
    phone_candidate: Mapped[str] = mapped_column(String(20)) 
    degree_candidate: Mapped[str] = mapped_column(String(200))
    profile_candidate: Mapped[str] = mapped_column(Text)
    resume_archive: Mapped[str] = mapped_column(String) 
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    analysis_results = relationship("AnalysisResult", back_populates="resume", cascade="all, delete-orphan")

class Analysis(Base):
    __tablename__ = "analysis"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    text_input: Mapped[str] = mapped_column(Text, nullable=False) 
    tags_input: Mapped[str] = mapped_column(String(500))
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    results = relationship("AnalysisResult", back_populates="analysis", cascade="all, delete-orphan")

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    analysis_id: Mapped[int] = mapped_column(Integer, ForeignKey("analysis.id"), nullable=False)
    resume_id: Mapped[int] = mapped_column(Integer, ForeignKey("resumes.id"), nullable=False)
    score_resume: Mapped[float] = mapped_column(Float) 
    feedback_resume: Mapped[str] = mapped_column(Text)

    analysis = relationship("Analysis", back_populates="results")
    resume = relationship("Resume", back_populates="analysis_results")