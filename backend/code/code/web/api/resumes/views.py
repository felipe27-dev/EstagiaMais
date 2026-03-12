from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

import os
import uuid
import json
import fitz 
from supabase import create_client, Client

from google import genai
from google.genai import types
from code.settings import settings

from code.db.dependencies import get_db_session
from code.db.models.domain import Resume, Analysis, AnalysisResult
from code.web.api.resumes.schema import ResumeRead, ResumeCreate, AnalyzeRequest
 
# ==========================================
# CONFIGURAÇÃO DO SUPABASE
# ==========================================
# Lê as variáveis do ambiente (Koyeb ou seu .env local se você configurou)
supabase_url = os.environ.get("CODE_SUPABASE_URL")
supabase_key = os.environ.get("CODE_SUPABASE_KEY")

if supabase_url and supabase_key:
    supabase: Client = create_client(supabase_url, supabase_key)
else:
    supabase = None

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

@router.post("/", response_model=ResumeRead, status_code=status.HTTP_201_CREATED)
async def upload_and_process_resume(
    extracted_data: ResumeCreate,
    db_session: AsyncSession = Depends(get_db_session),
):
    """
    Faz o processo de salvar o curriculo
    """
    new_resume = Resume(**extracted_data.model_dump())
 
    db_session.add(new_resume)
    await db_session.commit()
    await db_session.refresh(new_resume) 
 
    return new_resume

@router.post("/upload/analyze", status_code=status.HTTP_200_OK) 
async def analyze_resume_upload(
    file: UploadFile = File(...)
):
    """
    Recebe o PDF, extrai texto da memória RAM, faz upload para o Supabase e analisa com a IA.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Apenas arquivos PDF são permitidos.")

    # 1. Lê o arquivo inteiramente para a memória RAM
    file_bytes = await file.read()
    
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"

    # 2. Extrai o texto diretamente dos bytes em memória (sem salvar no HD)
    extracted_text = ""
    try:
        # Abre o PDF usando a stream de bytes
        pdf_document = fitz.open(stream=file_bytes, filetype="pdf")
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            extracted_text += page.get_text()
        pdf_document.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao ler os dados do PDF: {str(e)}")

    # 3. Envia os bytes diretamente para o Supabase
    pdf_public_url = ""
    if supabase:
        try:
            supabase.storage.from_("resumes").upload(
                path=unique_filename,
                file=file_bytes,
                file_options={"content-type": file.content_type}
            )
            # Pega a URL pública gerada
            pdf_public_url = supabase.storage.from_("resumes").get_public_url(unique_filename)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao salvar arquivo no Supabase: {str(e)}")
    else:
        # Fallback de aviso caso as variáveis de ambiente não estejam configuradas
        pdf_public_url = f"URL_SUPABASE_NAO_CONFIGURADA/{unique_filename}"

    # ==========================================
    # PASSO 4: Inteligência Artificial
    # ==========================================
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
        "degree_candidate": (string) The highest or most relevant academic degree, including the institution if mentioned, also include the person's semester; if it's not available, write "Semestre Não Especificado". (e.g., "Bacharelado em Ciência da Computação - USP - 3º Semestre").
        "profile_candidate": (string) A professional summary that highlights all the candidate's important skills, experiences, and professional focus, regardless of its length; just focus on detailing everything important in the resume, written in Portuguese.
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
        # Adicionamos a URL real e segura que vai ficar guardada para sempre
        ai_extracted_data["resume_archive"] = pdf_public_url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na análise da IA: {str(e)}")   

    return ai_extracted_data

@router.post("/analyze", status_code=status.HTTP_200_OK) 
async def analyze_resume_batch(
    payload: AnalyzeRequest,
    db_session: AsyncSession = Depends(get_db_session),
):
    """
    Analisa a requisição do tipo de curriculo do usuário e seleciona e mostra os melhores
    """
    result = await db_session.execute(select(Resume))
    resumes = result.scalars().all()
    
    clean_resumes_list = [{"id": r.id, "profile": r.profile_candidate} for r in resumes]
    resumes_json_string = json.dumps(clean_resumes_list, ensure_ascii=False)  
    
    client = genai.Client(api_key=settings.gemini_api_key)
    
    prompt = f"""
    You are an expert IT Recruiter and HR Data Analyst. Your task is to evaluate a batch of candidate resumes against a specific job description and a list of required tags.
    
    CRITICAL INSTRUCTIONS:
    1. Return ONLY a valid, parseable JSON ARRAY containing an evaluation object for each candidate.
    2. Do NOT wrap the JSON in markdown code blocks (e.g., do not use ```json or ```).
    3. Do NOT include any conversational text before or after the JSON array.
    4. Be critical and realistic in your evaluation. Do not assign maximum scores (100.0) unless the candidate is absolutely perfect for both the job description and the required qualifications. However, there will also be a second evaluator, so if you believe the resume is close to the cutoff score, you can include it.
    5. Write the 'feedback_resume' in professional Portuguese (pt-BR).
    6. The cutoff score is 60.0; resumes significantly below this should not be included. Resumes close to this score should be considered, and you should add a note to the feedback_resume. Resumes above this score should be included. They should be returned in order of score, from highest to lowest.

    JSON SCHEMA TO STRICTLY FOLLOW (Return an array of these objects):
    [
        {{
            "resume_id": (integer) The exact ID of the candidate provided in the 'BATCH OF RESUMES' input. Do not invent IDs. 
            "score_resume": (float) A score from 0.0 to 100.0 representing how well the candidate's profile matches the job description and tags.
            "feedback_resume": (string) Professional feedback, it can be long or short, but gather precise and specific information from the resume, nothing generic. In Portuguese (pt-BR) explaining the score. Highlight which tags matched, which are missing, and the overall fit for the role.
        }}
    ]

    JOB DESCRIPTION TO MATCH AGAINST:
    {payload.text_request}
    
    REQUIRED TAGS:
    {payload.tags_request}

    BATCH OF RESUMES TO EVALUATE:
    {resumes_json_string}
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
        raise HTTPException(status_code=500, detail=f"Erro na análise da IA: {str(e)}")   

    new_analysis = Analysis(
        text_input=payload.text_request, 
        tags_input=",".join(payload.tags_request)
    )
    
    db_session.add(new_analysis)
    await db_session.flush() 

    final_response = []
    resumes_dict = {r.id: r for r in resumes}
    
    for item in ai_extracted_data:
        result_record = AnalysisResult(
            analysis_id=new_analysis.id, 
            resume_id=item["resume_id"],
            score_resume=item["score_resume"],
            feedback_resume=item["feedback_resume"]
        )
        db_session.add(result_record)
        
        original_resume = resumes_dict.get(item["resume_id"])
        if original_resume:
            resume_dict = ResumeRead.model_validate(original_resume).model_dump()
            final_response.append({
                **resume_dict,
                "score": item["score_resume"],
                "feedback": item["feedback_resume"]
            })

    await db_session.commit()
    final_response.sort(key=lambda x: x["score"], reverse=True)
    
    return final_response