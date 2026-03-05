from code.web.api import echo, monitoring
from code.web.api.resumes import views as resumes_views  
from fastapi.routing import APIRouter

api_router = APIRouter()
api_router.include_router(monitoring.router, prefix="/monitoring", tags=["monitoring"])
api_router.include_router(echo.router, prefix="/echo", tags=["echo"])

# <-- 2. Adicione esta linha para registar a rota de currículos
api_router.include_router(resumes_views.router, prefix="/resumes", tags=["resumes"])