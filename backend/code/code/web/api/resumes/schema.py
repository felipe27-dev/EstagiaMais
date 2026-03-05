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

class ResumeRead(ResumeBase):
    id: int
    created_at: datetime

    # Esta configuração permite que o Pydantic leia diretamente dos modelos SQLAlchemy
    model_config = ConfigDict(from_attributes=True)
    
class ResumeCreate(ResumeBase):
    
    
    model_config = ConfigDict(from_attributes=True)