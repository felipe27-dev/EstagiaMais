from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from code.db.dependencies import get_db_session
from code.db.models.domain import Resume
from code.web.api.resumes.schema import ResumeRead, ResumeCreate

router = APIRouter()

@router.get("/", response_model=List[ResumeRead])
async def get_all_resumes(
    limit: int = 10,
    offset: int = 0,
    db_session: AsyncSession = Depends(get_db_session),
):
    """Lista todos os currículos cadastrados na base de dados."""
    query = select(Resume).limit(limit).offset(offset)
    result = await db_session.execute(query)
    return result.scalars().all()

@router.get("/{resume_id}", response_model=ResumeRead)
async def get_resume_by_id(
    resume_id: int,
    db_session: AsyncSession = Depends(get_db_session),
):
    """Busca um currículo específico pelo seu ID."""
    query = select(Resume).where(Resume.id == resume_id)
    result = await db_session.execute(query)
    resume = result.scalars().first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Currículo não encontrado.")
    
    return resume

@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: int,
    db_session: AsyncSession = Depends(get_db_session),
):
    """Deleta um currículo específico pelo seu ID."""
    query = select(Resume).where(Resume.id == resume_id)
    result = await db_session.execute(query)
    resume = result.scalars().first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Currículo não encontrado.")
    
    await db_session.delete(resume)
    await db_session.commit()
    
    return {"message": "Currículo deletado com sucesso."}

@router.post("/", response_model=ResumeRead, status_code=status.HTTP_201_CREATED)
async def add_resume(
    resume: ResumeCreate,
    db_session: AsyncSession = Depends(get_db_session),
):
    """Adiciona um novo currículo à base de dados."""
    new_resume = Resume(**resume.model_dump())

    db_session.add(new_resume)
    await db_session.commit()
    await db_session.refresh(new_resume) 
    
    return new_resume

@router.put("/{resume_id}", response_model=ResumeRead)
async def edit_resume(
    resume_id: int,
    resume: ResumeCreate,
    db_session: AsyncSession = Depends(get_db_session),
):
    """Editar o currículo da base de dados."""
    query = select(Resume).where(Resume.id == resume_id)
    result = await db_session.execute(query)
    old_resume = result.scalars().first()
    
    if not old_resume:
        raise HTTPException(status_code=404, detail="Currículo não encontrado.")
    
    for key, value in resume.model_dump().items():
        setattr(old_resume, key, value)
    
    await db_session.commit()
    await db_session.refresh(old_resume) 
    
    
    return old_resume