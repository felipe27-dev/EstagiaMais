from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

import os
import uuid
import shutil
import fitz 
import json
 
from google import genai
from google.genai import types
from code.settings import settings
 
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
    
    for key, value in resume.model_dump(exclude_unset=True).items():
        setattr(old_resume, key, value)
    
    await db_session.commit()
    await db_session.refresh(old_resume) 
    
    
    return old_resume

@router.post("/upload", response_model=ResumeRead, status_code=status.HTTP_201_CREATED)
async def upload_and_process_resume(
    file: UploadFile = File(...),
    db_session: AsyncSession = Depends(get_db_session),
):
    """
    Faz o processo de salvar o curriculo
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Apenas arquivos PDF são permitidos.")


    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join("uploads", unique_filename)


    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extrair o texto do PDF
    extracted_text = ""
    try:
        pdf_document = fitz.open(file_path)
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            extracted_text += page.get_text()
        pdf_document.close()
    except Exception as e:
        # Se der erro na leitura, apaga o arquivo quebrado para não poluir o servidor
        os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Erro ao ler o PDF: {str(e)}")

    pdf_public_url = f"{settings.url_backend}/uploads/{unique_filename}"
    # ==========================================
    # PASSO 3: Passar o texto para a Inteligência Artificial (Próxima Etapa!)
    # ==========================================
    # Aqui nós vamos chamar o Gemini/OpenAI mandando o `extracted_text`.
    # A IA vai nos devolver um dicionário prontinho. 
    # Por enquanto, vamos simular os dados que a IA devolveria:
    client = genai.Client(api_key=settings.gemini_api_key)
    
    prompt = f"""
    You are an expert HR Data Extraction AI. Your task is to analyze the provided raw text from a resume and extract specific entities.
    
    CRITICAL INSTRUCTIONS:
    1. Return ONLY a valid, parseable JSON object.
    2. Do NOT wrap the JSON in markdown code blocks (e.g., do not use ```json or ```).
    3. Do NOT include any conversational text before or after the JSON.
    4. If a specific piece of information cannot be explicitly found or confidently inferred from the text, set its value to null. Do NOT invent or hallucinate information.
    5. Translate the synthesized 'profile_candidate' to Portuguese (pt-BR), even if the prompt instructions are in English.

    JSON SCHEMA TO STRICTLY FOLLOW:
    {{
        "name_candidate": (string) The full name of the candidate. Format in Title Case.
        "email_candidate": (string) The candidate's primary email address.
        "phone_candidate": (string) The candidate's phone number, keeping formatting if possible.
        "degree_candidate": (string) The highest or most relevant academic degree, including the institution if mentioned (e.g., "Bacharelado em Ciência da Computação - USP").
        "profile_candidate": (string) A concise, professional summary (maximum 3 sentences) highlighting the candidate's core skills, main experiences, and professional focus, written in Portuguese.
    }}

    RAW RESUME TEXT TO ANALYZE:
    {extracted_text}
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
        ai_extracted_data = json.loads(response.text)
        
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Erro na análise da IA: {str(e)}")             
 
    ai_extracted_data["resume_archive"] = pdf_public_url

    new_resume = Resume(**ai_extracted_data)
 
    db_session.add(new_resume)
    await db_session.commit()
    await db_session.refresh(new_resume) 
 
    return new_resume
