from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from code.settings import settings
from datetime import timedelta
 
from code.web.api.security import verify_password, create_access_token, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES
from code.db.dependencies import get_db_session
from code.db.models.domain import User
from code.web.api.login.schema import UserLoginRequest, Token, UserCreateRequest, UserResponse

router = APIRouter()

@router.post("/login",response_model=Token, status_code=status.HTTP_200_OK)
async def login(
    payload: UserLoginRequest,
    db_session: AsyncSession = Depends(get_db_session),
):
    """
    Faz o login do usuário
    """
    query = select(User).where(User.email == payload.email)
    result = await db_session.execute(query)
    user = result.scalars().first()
    
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Email ou senha incorretos.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role
    }
    
    
@router.post("/register")
async def register_user(payload: UserCreateRequest, db_session: AsyncSession = Depends(get_db_session)):

    senha_criptografada = get_password_hash(payload.password)
    
    novo_usuario = User(
        name=payload.name,
        email=payload.email, 
        hashed_password=senha_criptografada, 
        role=payload.role
    )
    
    db_session.add(novo_usuario)
    await db_session.commit()
    return {"message": "Usuário criado com sucesso!"}

@router.put("/update-login", response_model=UserResponse)
async def update_user_login(
    payload: UserCreateRequest,
    db_session: AsyncSession = Depends(get_db_session)
):
    query = select(User).where(User.email == payload.email)
    result = await db_session.execute(query)
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuário nao encontrado.")
    
    user.name = payload.name 
    user.email = payload.email 
    user.hashed_password =  get_password_hash(payload.password)
    
    await db_session.commit()
    await db_session.refresh(user) 
    
    return user

@router.get("/user/{id}", response_model=UserResponse)
async def get_user( 
    id: int, 
    db_session: AsyncSession = Depends(get_db_session)
):
    query = select(User).where(User.id == id)
    result = await db_session.execute(query)
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuário nao encontrado.")
    
    return user