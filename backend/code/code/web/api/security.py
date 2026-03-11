from datetime import datetime, timedelta, timezone
import jwt
from passlib.context import CryptContext
from code.settings import settings

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from code.db.dependencies import get_db_session
from code.db.models.domain import User
from code.settings import settings


# Configurações do JWT (Em produção, coloque o SECRET_KEY em um arquivo .env!)
SECRET_KEY = settings.secret_key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Configuração do Passlib para usar o algoritmo bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Compara a senha em texto plano digitada pelo usuário com o hash do banco.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Gera o hash de uma senha (use isso na sua rota de CADASTRO de usuário).
    """
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Gera o Token JWT com as informações do usuário (payload) e tempo de expiração.
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt   

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db_session: AsyncSession = Depends(get_db_session)
):
    """
    O "Segurança" da API. Ele intercepta a requisição, lê o token, 
    valida a assinatura e busca quem é o dono no banco de dados.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais inválidas ou token expirado.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
            
    except jwt.PyJWTError:
        raise credentials_exception

    query = select(User).where(User.id == int(user_id))
    result = await db_session.execute(query)
    user = result.scalars().first()

    if user is None:
        raise credentials_exception

    return user