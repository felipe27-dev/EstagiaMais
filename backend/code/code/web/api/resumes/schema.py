from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class ResumeBase(BaseModel):
    name_candidate: str
    email_candidate: str
    phone_candidate: Optional[str] = None
    degree_candidate: Optional[str] = None
    profile_candidate: Optional[str] = None
    resume_archive: Optional[str] = None

class AnalysisResult(BaseModel):
    analysis_id: int
    resume_id: int
    score_resume: Optional[float] = None
    feedback_resume: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class AnalyzeRequest(BaseModel):
    text_request: str
    tags_request: list[str]

class ResumeRead(ResumeBase):
    id: int
    created_at: datetime

    # Esta configuração permite que o Pydantic leia diretamente dos modelos SQLAlchemy
    model_config = ConfigDict(from_attributes=True)
    
class ResumeCreate(ResumeBase):
    
    model_config = ConfigDict(from_attributes=True)