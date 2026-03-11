from code.web.api import echo, monitoring 
from code.web.api.resumes import views as resumes_views
from code.web.api.login import views as login_view
from fastapi import APIRouter,Depends
from code.web.api.security import get_current_user

api_router = APIRouter()
api_router.include_router(monitoring.router, prefix="/monitoring", tags=["monitoring"], dependencies=[Depends(get_current_user)])
api_router.include_router(echo.router, prefix="/echo", tags=["echo"], dependencies=[Depends(get_current_user)])

api_router.include_router(resumes_views.router, prefix="/resumes", tags=["resumes"], dependencies=[Depends(get_current_user)])
api_router.include_router(login_view.router, prefix="/auth", tags=["auth"])